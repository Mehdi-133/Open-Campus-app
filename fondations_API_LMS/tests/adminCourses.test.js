const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const Course = require("../models/Course");
const User = require("../models/User");
const { listCourses } = require("../controllers/adminCourseController");

describe("Admin course catalogue serialization", () => {
    afterEach(() => jest.restoreAllMocks());

    // The shared lms_test database already holds courses from other suites, so an
    // empty *database* state is checked at the serializer boundary instead of by
    // deleting or reseeding shared data. The browser harness covers the UI empty state.
    test("maps an empty query result to count 0 and an empty data array", async () => {
        const lean = jest.fn().mockResolvedValue([]);
        const sort = jest.fn(() => ({ lean }));
        const select = jest.fn(() => ({ sort }));
        jest.spyOn(Course, "find").mockReturnValue({ select });

        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn();
        const next = jest.fn();

        await listCourses({}, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Course.find).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ count: 0, data: [] });
    });
});

describe("Admin course catalogue", () => {
    const password = "Password123";
    const domain = `${randomUUID()}.example.test`;
    const titlePrefix = `ocf17-${randomUUID()}`;
    const fixtures = [
        { suffix: "archived", category: "Data", level: "advanced", status: "archived" },
        { suffix: "draft", category: "Development", level: "beginner", status: "draft" },
        { suffix: "published", category: "Design", level: "intermediate", status: "published" },
    ];
    let admin;
    let trainer;
    let learner;
    let adminToken;
    let trainerToken;
    let learnerToken;
    const courseIds = [];
    const titles = fixtures.map((fixture) => `${titlePrefix}-${fixture.suffix}`);

    beforeAll(async () => {
        if (mongoose.connection.name !== "lms_test") {
            throw new Error("Admin course tests require the lms_test database");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        [admin, trainer, learner] = await User.create([
            { name: "Admin Course Test", email: `admin@${domain}`, password: hashedPassword, role: "admin", status: "active" },
            { name: "Trainer Course Test", email: `trainer@${domain}`, password: hashedPassword, role: "trainer", status: "active" },
            { name: "Learner Course Test", email: `learner@${domain}`, password: hashedPassword, role: "learner", status: "active" },
        ]);

        for (const [email, setToken] of [
            [admin.email, (token) => { adminToken = token; }],
            [trainer.email, (token) => { trainerToken = token; }],
            [learner.email, (token) => { learnerToken = token; }],
        ]) {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({ email, password });

            expect(loginResponse.statusCode).toBe(200);
            setToken(loginResponse.body.data.token);
        }

        const courses = await Course.create(fixtures.map((fixture, index) => ({
            trainer: trainer._id,
            title: titles[index],
            description: `OCF-17 catalogue fixture: ${fixture.suffix}`,
            level: fixture.level,
            category: fixture.category,
            estimatedDuration: 30,
            status: fixture.status,
        })));
        courseIds.push(...courses.map((course) => course._id));
    });

    afterAll(async () => {
        if (courseIds.length > 0) {
            await Course.deleteMany({ _id: { $in: courseIds } });
        }
        if (admin || trainer || learner) {
            await User.deleteMany({
                email: { $in: [admin, trainer, learner].filter(Boolean).map((user) => user.email) },
            });
        }
    });

    test("returns 401 without a token", async () => {
        const response = await request(app).get("/api/admin/courses");

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            status: 401,
            message: "Authorization header missing",
        });
    });

    test("returns 403 for trainer and learner without querying or exposing courses", async () => {
        const findSpy = jest.spyOn(Course, "find");

        try {
            for (const token of [trainerToken, learnerToken]) {
                const response = await request(app)
                    .get("/api/admin/courses")
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(403);
                expect(response.body.message).toBe("Forbidden");
                expect(response.body.data).toBeUndefined();
            }

            expect(findSpy).not.toHaveBeenCalled();
        } finally {
            findSpy.mockRestore();
        }
    });

    test("returns every course summary with only the five public columns for an admin", async () => {
        const response = await request(app)
            .get("/api/admin/courses")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(response.body.data.length);

        for (const [index, title] of titles.entries()) {
            const entry = response.body.data.find((course) => course.title === title);
            const fixture = fixtures[index];

            expect(entry).toBeDefined();
            expect(Object.keys(entry).sort()).toEqual(["category", "id", "level", "status", "title"]);
            expect(entry.id).toMatch(/^[a-fA-F0-9]{24}$/);
            expect(entry.category).toBe(fixture.category);
            expect(entry.level).toBe(fixture.level);
            expect(entry.status).toBe(fixture.status);
            expect(entry).not.toHaveProperty("trainer");
            expect(entry).not.toHaveProperty("description");
            expect(entry).not.toHaveProperty("objectives");
            expect(entry).not.toHaveProperty("estimatedDuration");
            expect(entry).not.toHaveProperty("publishedAt");
            expect(entry).not.toHaveProperty("_id");
        }
    });

    test("includes all three publication states in the admin inventory", async () => {
        const response = await request(app)
            .get("/api/admin/courses")
            .set("Authorization", `Bearer ${adminToken}`);

        const mine = response.body.data.filter((course) => titles.includes(course.title));
        const statuses = mine.map((course) => course.status).sort();

        expect(mine).toHaveLength(3);
        expect(statuses).toEqual(["archived", "draft", "published"]);
    });

    test("returns the inventory in a stable title order", async () => {
        const response = await request(app)
            .get("/api/admin/courses")
            .set("Authorization", `Bearer ${adminToken}`);

        const positions = titles.map((title) => response.body.data.findIndex((course) => course.title === title));
        const sortedTitles = [...titles].sort();

        expect(positions.every((position) => position >= 0)).toBe(true);
        for (let index = 0; index < titles.length; index += 1) {
            const title = titles[index];
            for (let other = index + 1; other < titles.length; other += 1) {
                expect(positions[index]).toBeLessThan(positions[other]);
            }
        }
        expect(sortedTitles).toEqual(titles);
    });
});

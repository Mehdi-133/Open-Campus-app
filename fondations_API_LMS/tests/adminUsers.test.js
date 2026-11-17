const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const User = require("../models/User");

describe("Admin users", () => {
    const password = "Password123";
    const domain = `${randomUUID()}.example.test`;
    const createdEmails = [];
    let admin;
    let learner;
    let suspended;
    let adminToken;
    let learnerToken;

    beforeAll(async () => {
        if (mongoose.connection.name !== "lms_test") {
            throw new Error("Admin user tests require the lms_test database");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        [admin, learner, suspended] = await User.create([
            { name: "Admin List Test", email: `admin@${domain}`, password: hashedPassword, role: "admin", status: "active" },
            { name: "Learner List Test", email: `learner@${domain}`, password: hashedPassword, role: "learner", status: "active" },
            { name: "Suspended List Test", email: `suspended@${domain}`, password: hashedPassword, role: "learner", status: "suspended" },
        ]);

        for (const [email, setToken] of [
            [admin.email, (token) => { adminToken = token; }],
            [learner.email, (token) => { learnerToken = token; }],
        ]) {
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({ email, password });

            expect(loginResponse.statusCode).toBe(200);
            setToken(loginResponse.body.data.token);
        }
    });

    afterAll(async () => {
        if (!admin || !learner || !suspended) return;

        await User.deleteMany({
            email: {
                $in: [admin.email, learner.email, suspended.email, ...createdEmails],
            },
        });
    });

    test("returns 401 without a token", async () => {
        const response = await request(app).get("/api/admin/users");

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            status: 401,
            message: "Authorization header missing",
        });
    });

    test("returns 403 for a learner without exposing account data", async () => {
        const response = await request(app)
            .get("/api/admin/users")
            .set("Authorization", `Bearer ${learnerToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.data).toBeUndefined();
    });

    test("returns every account summary without password for an admin", async () => {
        const response = await request(app)
            .get("/api/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.count).toBe(response.body.data.length);
        expect(response.body.data.length).toBeGreaterThanOrEqual(3);

        for (const email of [admin.email, learner.email, suspended.email]) {
            const entry = response.body.data.find((user) => user.email === email);

            expect(entry).toBeDefined();
            expect(Object.keys(entry).sort()).toEqual(["email", "id", "name", "role", "status"]);
            expect(entry.id).toMatch(/^[a-fA-F0-9]{24}$/);
            expect(entry).not.toHaveProperty("password");
            expect(entry).not.toHaveProperty("_id");
        }

        const suspendedEntry = response.body.data.find((user) => user.email === suspended.email);
        expect(suspendedEntry.status).toBe("suspended");
    });

    describe("creation", () => {
        const newEmail = (label) => {
            const email = `${label}-${randomUUID()}@${domain}`;
            createdEmails.push(email);
            return email;
        };

        test("returns 401 without a token", async () => {
            const response = await request(app)
                .post("/api/admin/users")
                .send({ name: "No Token", email: newEmail("no-token"), password });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Authorization header missing");
        });

        test("returns 403 for a learner without creating anything", async () => {
            const email = newEmail("forbidden");

            const response = await request(app)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${learnerToken}`)
                .send({ name: "Forbidden User", email, password });

            expect(response.statusCode).toBe(403);
            expect(response.body).not.toHaveProperty("data");
            expect(await User.findOne({ email })).toBeNull();
        });

        test("returns 400 with field details for invalid input", async () => {
            const email = newEmail("invalid");

            const response = await request(app)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "A",
                    email: "not-an-email",
                    password: "short",
                    role: "superuser",
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Validation error");
            const fields = response.body.errors.map((issue) => issue.field);
            expect(fields).toEqual(expect.arrayContaining(["name", "email", "password", "role"]));
            expect(await User.findOne({ email: "not-an-email" })).toBeNull();
        });

        test("returns 409 for an existing e-mail without creating a duplicate", async () => {
            const countBefore = await User.countDocuments({ email: learner.email });

            const response = await request(app)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Duplicate Learner", email: learner.email, password });

            expect(response.statusCode).toBe(409);
            expect(response.body).toEqual({ status: 409, message: "Email already registered" });
            expect(await User.countDocuments({ email: learner.email })).toBe(countBefore);
        });

        test("creates a learner with hashed password and returns a public summary", async () => {
            const email = newEmail("created");

            const response = await request(app)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Sofia Laaroussi", email, password });

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe(201);
            expect(Object.keys(response.body.data).sort()).toEqual([
                "email", "id", "name", "role", "status",
            ]);
            // The User model lowercases `name` on write; the summary reflects stored data.
            expect(response.body.data).toEqual({
                id: expect.stringMatching(/^[a-fA-F0-9]{24}$/),
                name: "sofia laaroussi",
                email,
                role: "learner",
                status: "active",
            });
            expect(response.body.data).not.toHaveProperty("password");

            const stored = await User.findOne({ email }).select("+password");
            expect(stored).not.toBeNull();
            expect(stored.password).not.toBe(password);
            expect(await bcrypt.compare(password, stored.password)).toBe(true);

            const login = await request(app)
                .post("/api/auth/login")
                .send({ email, password });
            expect(login.statusCode).toBe(200);
            expect(login.body.data.user.role).toBe("learner");
        });

        test("accepts explicit role and status supplied by an admin", async () => {
            const email = newEmail("trainer");

            const response = await request(app)
                .post("/api/admin/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Nouveau Formateur", email, password, role: "trainer", status: "suspended" });

            expect(response.statusCode).toBe(201);
            expect(response.body.data.role).toBe("trainer");
            expect(response.body.data.status).toBe("suspended");

            const stored = await User.findOne({ email });
            expect(stored.role).toBe("trainer");
            expect(stored.status).toBe("suspended");
        });
    });
});

const { randomUUID } = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const User = require("../models/User");

describe("Admin user list", () => {
    const password = "Password123";
    const domain = `${randomUUID()}.example.test`;
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
            email: { $in: [admin.email, learner.email, suspended.email] },
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
});

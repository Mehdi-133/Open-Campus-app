const { z } = require("zod");

const registerSchema = z
    .object({
        name: z
            .string({ error: "Name is required" })
            .trim()
            .min(2, "Name must contain at least 2 characters"),
        email: z
            .string({ error: "Email is required" })
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
        password: z
            .string({ error: "Password is required" })
            .min(8, "Password must contain at least 8 characters")
    })
    .strict();

const loginSchema = z
    .object({
        email: z
            .string({ error: "Email is required" })
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
        password: z
            .string({ error: "Password is required" })
            .min(1, "Password is required")
    })
    .strict();

// Admin-only account creation. Same field rules as register, with optional
// role/status so an admin can create staff accounts; both default to the
// learner/active values used by the controlled React form.
const adminCreateUserSchema = z
    .object({
        name: z
            .string({ error: "Name is required" })
            .trim()
            .min(2, "Name must contain at least 2 characters"),
        email: z
            .string({ error: "Email is required" })
            .trim()
            .toLowerCase()
            .email("Invalid email address"),
        password: z
            .string({ error: "Password is required" })
            .min(8, "Password must contain at least 8 characters"),
        role: z
            .enum(["learner", "trainer", "admin"])
            .default("learner"),
        status: z
            .enum(["active", "suspended"])
            .default("active")
    })
    .strict();

module.exports = {
    registerSchema,
    loginSchema,
    adminCreateUserSchema
};

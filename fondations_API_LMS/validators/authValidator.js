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

// Admin-only account update. Every field is optional, but at least one must be
// supplied so a PATCH never resolves into a no-op. Unknown keys (including
// `password`) are rejected: password changes are intentionally out of scope.
const adminUpdateUserSchema = z
    .object({
        name: z
            .string({ error: "Name is required" })
            .trim()
            .min(2, "Name must contain at least 2 characters")
            .optional(),
        email: z
            .string({ error: "Email is required" })
            .trim()
            .toLowerCase()
            .email("Invalid email address")
            .optional(),
        role: z
            .enum(["learner", "trainer", "admin"])
            .optional(),
        status: z
            .enum(["active", "suspended"])
            .optional()
    })
    .strict()
    .refine(
        (values) => Object.keys(values).length > 0,
        { message: "At least one field is required", path: ["body"] }
    );

module.exports = {
    registerSchema,
    loginSchema,
    adminCreateUserSchema,
    adminUpdateUserSchema
};

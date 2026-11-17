const express = require("express");

const authenticate = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { roles } = require("../consts/roles");
const validate = require("../middlewares/validate");
const { adminCreateUserSchema } = require("../validators/authValidator");
const {
  listUsers,
  createUser,
} = require("../controllers/adminUserController");

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List platform accounts
 *     description: >-
 *       Admin only. Returns every account with its name, email, role and status, newest first.
 *       The password field is never selected or returned. There is no server-side pagination or
 *       filtering; the client applies local filters to the returned list.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns count and an array of account summaries in data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminUser'
 *               required:
 *                 - count
 *                 - data
 *             example:
 *               count: 1
 *               data:
 *                 - id: 507f1f77bcf86cd799439012
 *                   name: Learner Demo
 *                   email: learner.demo@lms.local
 *                   role: learner
 *                   status: active
 *       '401':
 *         description: Missing, invalid, or expired Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 401
 *               message: Authorization header missing
 *       '403':
 *         description: Admin role required. An established session is not cleared by this refusal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 403
 *               message: Forbidden
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/", authenticate, authorize(roles.ADMIN), listUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a platform account (Admin)
 *     description: >-
 *       Admin only. Creates an account from a strict name/email/password body and
 *       returns its public account summary. `role` defaults to `learner` and
 *       `status` defaults to `active`; both may be supplied by an admin. The
 *       password is hashed before storage and is never returned. A duplicate
 *       e-mail returns 409 with the shared error-envelope shape.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Sofia Laaroussi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sofia.laaroussi@example.test
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [learner, trainer, admin]
 *                 default: learner
 *               status:
 *                 type: string
 *                 enum: [active, suspended]
 *                 default: active
 *           example:
 *             name: Sofia Laaroussi
 *             email: sofia.laaroussi@example.test
 *             password: password123
 *     responses:
 *       '201':
 *         description: Account created. Returns a public account summary in data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AdminUser'
 *               required:
 *                 - status
 *                 - message
 *                 - data
 *             example:
 *               status: 201
 *               message: Account created successfully
 *               data:
 *                 id: 507f1f77bcf86cd799439012
 *                 name: Sofia Laaroussi
 *                 email: sofia.laaroussi@example.test
 *                 role: learner
 *                 status: active
 *       '400':
 *         description: Validation error with field/message details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 400
 *               message: Validation error
 *               errors:
 *                 - field: email
 *                   message: Invalid email address
 *       '401':
 *         description: Missing, invalid, or expired Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 401
 *               message: Authorization header missing
 *       '403':
 *         description: Admin role required. An established session is not cleared by this refusal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 403
 *               message: Forbidden
 *       '409':
 *         description: An account with that e-mail already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               status: 409
 *               message: Email already registered
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  "/",
  authenticate,
  authorize(roles.ADMIN),
  validate(adminCreateUserSchema),
  createUser,
);

module.exports = router;

const express = require("express");

const authenticate = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { roles } = require("../consts/roles");
const { listUsers } = require("../controllers/adminUserController");

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

module.exports = router;

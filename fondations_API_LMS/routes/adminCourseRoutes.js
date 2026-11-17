const express = require("express");

const authenticate = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const { roles } = require("../consts/roles");
const { listCourses } = require("../controllers/adminCourseController");

const router = express.Router();

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: List every course stored in the platform (Admin)
 *     description: >-
 *       Admin only. Returns a summary of every course in MongoDB across all
 *       publication states (draft, published and archived), sorted by title then
 *       id for a stable order. Only id, title, category, level and status are
 *       returned. There is no server-side pagination or filtering; the client
 *       derives its own view from the complete list.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns count and an array of course summaries in data.
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
 *                     $ref: '#/components/schemas/AdminCourse'
 *               required:
 *                 - count
 *                 - data
 *             example:
 *               count: 2
 *               data:
 *                 - id: 507f1f77bcf86cd799439013
 *                   title: Node.js foundations
 *                   category: Development
 *                   level: beginner
 *                   status: published
 *                 - id: 507f1f77bcf86cd799439014
 *                   title: API design essentials
 *                   category: Development
 *                   level: intermediate
 *                   status: draft
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
router.get("/", authenticate, authorize(roles.ADMIN), listCourses);

module.exports = router;

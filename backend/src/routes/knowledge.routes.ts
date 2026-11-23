
import { Router } from "express";

import { KnowledgeController } from "../controllers/knowledge.controller";

import {
  authenticate,
  authorize
} from "../middlewares/auth.middleware";

import { UserRole } from "../models";


/**
 * @swagger
 * tags:
 *   name: Knowledge Base
 *   description: Manage and search support articles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     KnowledgeArticleInput:
 *       type: object
 *       required: [title, content, category]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           example: How to reset your password
 *         content:
 *           type: string
 *           minLength: 20
 *           example: Open the login page, click Forgot Password, enter your registered email, and follow the reset instructions.
 *         category:
 *           type: string
 *           example: Account
 */

/**
 * @swagger
 * /api/knowledge:
 *   post:
 *     summary: Create a knowledge article (Admin or Agent)
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KnowledgeArticleInput'
 *     responses:
 *       201:
 *         description: Article created
 *       403:
 *         description: Access denied
 *   get:
 *     summary: Get all knowledge articles
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Articles retrieved
 */

/**
 * @swagger
 * /api/knowledge/search:
 *   get:
 *     summary: Search knowledge articles
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: password
 *     responses:
 *       200:
 *         description: Search results
 */

/**
 * @swagger
 * /api/knowledge/{id}:
 *   get:
 *     summary: Get a knowledge article by ID
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article retrieved
 *       404:
 *         description: Article not found
 *   put:
 *     summary: Update a knowledge article (Admin or Agent)
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KnowledgeArticleInput'
 *     responses:
 *       200:
 *         description: Article updated
 *       403:
 *         description: Access denied
 *   delete:
 *     summary: Delete a knowledge article (Admin only)
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article deleted
 *       403:
 *         description: Access denied
 */


const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(UserRole.ADMIN, UserRole.AGENT),
  KnowledgeController.create
);

router.get("/", KnowledgeController.getAll);

// Important: /search must come before /:id
router.get("/search", KnowledgeController.search);

router.get("/:id", KnowledgeController.getById);

router.put(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.AGENT),
  KnowledgeController.update
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  KnowledgeController.delete
);

export default router;

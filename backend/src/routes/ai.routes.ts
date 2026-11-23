
import { Router } from "express";
import { AiController } from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI Support
 *   description: AI-powered support using RAG
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Ask the ResolveAI support assistant
 *     tags: [AI Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:
 *                 type: string
 *                 example: How can I reset my password?
 *     responses:
 *       200:
 *         description: AI answer or human escalation recommendation
 *       400:
 *         description: Invalid question
 *       401:
 *         description: Authentication required
 *       503:
 *         description: AI service temporarily unavailable
 */

router.post("/chat", authenticate, AiController.chat);

export default router;

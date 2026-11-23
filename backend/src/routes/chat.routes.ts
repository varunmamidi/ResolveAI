
import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Human Chat
 *   description: Human support conversation history
 */

/**
 * @swagger
 * /api/chat/{escalationId}/messages:
 *   get:
 *     summary: Get escalation chat history
 *     tags: [Human Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: escalationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat history retrieved
 *       403:
 *         description: Access denied
 */

router.get(
  "/:escalationId/messages",
  authenticate,
  ChatController.getHistory
);

export default router;

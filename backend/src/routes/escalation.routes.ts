
import { Router } from "express";
import { EscalationController } from "../controllers/escalation.controller";
import {
  authenticate,
  authorize
} from "../middlewares/auth.middleware";
import { UserRole } from "../models";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Escalations
 *   description: AI-to-human support handoff
 */

/**
 * @swagger
 * /api/escalations:
 *   post:
 *     summary: Request human support
 *     tags: [Escalations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason, conversationSummary]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: AI could not resolve my payment issue
 *               conversationSummary:
 *                 type: string
 *                 example: Customer reports a failed payment and needs a human agent to investigate the transaction.
 *     responses:
 *       201:
 *         description: Escalation created
 *   get:
 *     summary: List visible escalations
 *     tags: [Escalations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Escalations retrieved
 */

/**
 * @swagger
 * /api/escalations/{id}:
 *   get:
 *     summary: Get escalation details
 *     tags: [Escalations]
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
 *         description: Escalation retrieved
 */

/**
 * @swagger
 * /api/escalations/{id}/assign:
 *   patch:
 *     summary: Assign escalation to agent (Admin only)
 *     tags: [Escalations]
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
 *             type: object
 *             required: [agentId]
 *             properties:
 *               agentId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Escalation assigned
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/escalations/{id}/status:
 *   patch:
 *     summary: Update escalation status (Agent or Admin)
 *     tags: [Escalations]
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, IN_PROGRESS, RESOLVED]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Access denied
 */

router.use(authenticate);

router.post("/", EscalationController.create);
router.get("/", EscalationController.getAll);
router.get("/:id", EscalationController.getById);

router.patch(
  "/:id/assign",
  authorize(UserRole.ADMIN),
  EscalationController.assign
);

router.patch(
  "/:id/status",
  authorize(UserRole.ADMIN, UserRole.AGENT),
  EscalationController.updateStatus
);

export default router;

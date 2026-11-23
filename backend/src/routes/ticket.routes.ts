
import { Router } from "express";

import { TicketController } from "../controllers/ticket.controller";

import {
  authenticate,
  authorize
} from "../middlewares/auth.middleware";

import { UserRole } from "../models";


/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Customer support ticket management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketCreate:
 *       type: object
 *       required: [title, description]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           example: Unable to reset my password
 *         description:
 *           type: string
 *           minLength: 10
 *           example: I am not receiving the password reset email.
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a support ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketCreate'
 *     responses:
 *       201:
 *         description: Ticket created
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get tickets visible to the logged-in user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
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
 *         description: Ticket retrieved
 *       403:
 *         description: Access denied
 *       404:
 *         description: Ticket not found
 */

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Update ticket status (Agent or Admin)
 *     tags: [Tickets]
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
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/tickets/{id}/priority:
 *   patch:
 *     summary: Update ticket priority (Agent or Admin)
 *     tags: [Tickets]
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
 *             required: [priority]
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *     responses:
 *       200:
 *         description: Priority updated
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     summary: Assign a ticket to an agent (Admin only)
 *     tags: [Tickets]
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
 *         description: Agent assigned successfully
 *       400:
 *         description: Invalid agent
 *       403:
 *         description: Access denied
 */


const router = Router();

// All ticket routes require JWT authentication
router.use(authenticate);

router.post("/", TicketController.create);

router.get("/", TicketController.getAll);

router.get("/:id", TicketController.getById);

router.patch(
  "/:id/status",
  authorize(UserRole.ADMIN, UserRole.AGENT),
  TicketController.updateStatus
);

router.patch(
  "/:id/priority",
  authorize(UserRole.ADMIN, UserRole.AGENT),
  TicketController.updatePriority
);

router.patch(
  "/:id/assign",
  authorize(UserRole.ADMIN),
  TicketController.assign
);

export default router;

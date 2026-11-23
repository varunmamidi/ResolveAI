
import {
  Response,
  NextFunction
} from "express";

import { z } from "zod";

import { AuthRequest } from "../middlewares/auth.middleware";
import { TicketService } from "../services/ticket.service";

import {
  TicketStatus,
  TicketPriority
} from "../models/Ticket";

const createTicketSchema = z.object({
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10)
});

const statusSchema = z.object({
  status: z.nativeEnum(TicketStatus)
});

const prioritySchema = z.object({
  priority: z.nativeEnum(TicketPriority)
});

const assignSchema = z.object({
  agentId: z.number().int().positive()
});

const parseTicketId = (value: string) => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(
      new Error("Invalid ticket ID"),
      { statusCode: 400 }
    );
  }

  return id;
};

export class TicketController {

  static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createTicketSchema.parse(req.body);

      const ticket = await TicketService.createTicket(
        req.user!,
        data
      );

      res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tickets =
        await TicketService.getTickets(req.user!);

      res.json({
        success: true,
        count: tickets.length,
        data: tickets
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseTicketId(
        String(req.params.id)
      );

      const ticket = await TicketService.getTicketById(
        req.user!,
        id
      );

      res.json({
        success: true,
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseTicketId(
        String(req.params.id)
      );

      const { status } = statusSchema.parse(req.body);

      const ticket = await TicketService.updateStatus(
        req.user!,
        id,
        status
      );

      res.json({
        success: true,
        message: "Ticket status updated",
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePriority(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseTicketId(
        String(req.params.id)
      );

      const { priority } =
        prioritySchema.parse(req.body);

      const ticket = await TicketService.updatePriority(
        req.user!,
        id,
        priority
      );

      res.json({
        success: true,
        message: "Ticket priority updated",
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async assign(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseTicketId(
        String(req.params.id)
      );

      const { agentId } = assignSchema.parse(req.body);

      const ticket = await TicketService.assignAgent(
        req.user!,
        id,
        agentId
      );

      res.json({
        success: true,
        message: "Agent assigned successfully",
        data: ticket
      });
    } catch (error) {
      next(error);
    }
  }
}

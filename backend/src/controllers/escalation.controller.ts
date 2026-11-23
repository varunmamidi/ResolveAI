
import { Response, NextFunction } from "express";
import { z } from "zod";

import { AuthRequest } from "../middlewares/auth.middleware";
import { EscalationService } from "../services/escalation.service";
import { EscalationStatus } from "../models/Escalation";

const createSchema = z.object({
  reason: z.string().trim().min(5).max(500),
  conversationSummary: z.string().trim().min(10).max(5000)
}).strict();

const assignSchema = z.object({
  agentId: z.number().int().positive()
});

const statusSchema = z.object({
  status: z.enum(EscalationStatus)
});

function parseId(value: string): number {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(
      new Error("Invalid escalation ID"),
      { statusCode: 400 }
    );
  }

  return id;
}

export class EscalationController {
  static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createSchema.parse(req.body);

      const escalation = await EscalationService.create(
        req.user!,
        data
      );

      res.status(201).json({
        success: true,
        message: "Human support requested",
        data: escalation
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
      const escalations =
        await EscalationService.getAll(req.user!);

      res.json({
        success: true,
        count: escalations.length,
        data: escalations
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
      const id = parseId(String(req.params.id));

      const escalation =
        await EscalationService.getById(req.user!, id);

      res.json({
        success: true,
        data: escalation
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
      const id = parseId(String(req.params.id));
      const { agentId } = assignSchema.parse(req.body);

      const escalation = await EscalationService.assign(
        req.user!,
        id,
        agentId
      );

      res.json({
        success: true,
        message: "Escalation assigned",
        data: escalation
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
      const id = parseId(String(req.params.id));
      const { status } = statusSchema.parse(req.body);

      const escalation =
        await EscalationService.updateStatus(
          req.user!,
          id,
          status
        );

      res.json({
        success: true,
        message: "Escalation status updated",
        data: escalation
      });
    } catch (error) {
      next(error);
    }
  }
}

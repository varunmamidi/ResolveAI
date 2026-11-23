
import { Response, NextFunction } from "express";

import { AuthRequest } from "../middlewares/auth.middleware";
import { ChatService } from "../services/chat.service";

export class ChatController {
  static async getHistory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const escalationId = Number(req.params.escalationId);

      if (
        !Number.isSafeInteger(escalationId) ||
        escalationId <= 0
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid escalation ID"
        });
        return;
      }

      const messages = await ChatService.getHistory(
        req.user!,
        escalationId
      );

      res.json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      next(error);
    }
  }
}

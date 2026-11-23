
import { Response, NextFunction } from "express";
import { z } from "zod";

import { AuthRequest } from "../middlewares/auth.middleware";
import { RagService } from "../services/rag.service";

const chatSchema = z.object({
  question: z.string().trim().min(3).max(2000)
});

export class AiController {
  static async chat(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { question } = chatSchema.parse(req.body);

      const result = await RagService.ask(question);

      res.json({
        success: true,
        data: result
      });
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;

      if (
  typeof status === "number" &&
  [429, 502, 503, 504].includes(status)
) {
        res.status(503).json({
          success: false,
          message:
            "AI service is temporarily unavailable. Please try again later or contact a support agent.",
          needsHuman: true
        });
        return;
      }

      next(error);
    }
  }
}

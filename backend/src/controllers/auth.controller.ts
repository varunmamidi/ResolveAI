
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { AuthService } from "../services/auth.service";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(72)
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const user = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

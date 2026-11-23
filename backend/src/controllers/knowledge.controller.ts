
import { Response, NextFunction } from "express";
import { z } from "zod";

import { AuthRequest } from "../middlewares/auth.middleware";
import { KnowledgeService } from "../services/knowledge.service";

const articleSchema = z.object({
  title: z.string().trim().min(5).max(200),
  content: z.string().trim().min(20),
  category: z.string().trim().min(2).max(100)
}).strict();

const searchSchema = z.object({
  q: z.string().trim().min(1).max(200)
});

const parseId = (value: string): number => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(
      new Error("Invalid article ID"),
      { statusCode: 400 }
    );
  }

  return id;
};

export class KnowledgeController {
  static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = articleSchema.parse(req.body);
      const article = await KnowledgeService.create(data);

      res.status(201).json({
        success: true,
        message: "Knowledge article created",
        data: article
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
      const articles = await KnowledgeService.getAll();

      res.json({
        success: true,
        count: articles.length,
        data: articles
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
      const article = await KnowledgeService.getById(id);

      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  static async search(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q } = searchSchema.parse(req.query);
      const articles = await KnowledgeService.search(q);

      res.json({
        success: true,
        count: articles.length,
        data: articles
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseId(String(req.params.id));
      const data = articleSchema.parse(req.body);

      const article = await KnowledgeService.update(id, data);

      res.json({
        success: true,
        message: "Knowledge article updated",
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseId(String(req.params.id));

      await KnowledgeService.delete(id);

      res.json({
        success: true,
        message: "Knowledge article deleted"
      });
    } catch (error) {
      next(error);
    }
  }
}


import {
  Request,
  Response,
  NextFunction
} from "express";

import { ZodError } from "zod";
import { UniqueConstraintError } from "sequelize";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: "Resource already exists"
    });
    return;
  }

  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message
  });
};

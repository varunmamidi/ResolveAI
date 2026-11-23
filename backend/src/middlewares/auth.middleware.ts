
import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import { User, UserRole } from "../models";

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token required"
      });
      return;
    }

    const token = authorization.slice(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(
      token,
      secret,
      { algorithms: ["HS256"] }
    ) as JwtPayload;

    if (!decoded.sub) {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      });
      return;
    }

    const user = await User.findByPk(
      Number(decoded.sub)
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
      return;
    }

    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied"
      });
      return;
    }

    next();
  };
};

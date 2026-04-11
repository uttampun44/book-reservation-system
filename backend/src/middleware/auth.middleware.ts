import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configEnv } from "@config/env";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email?: string;
      role?: string;
    };
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = jwt.verify(token, configEnv.jwtSecret) as {
      id: string;
      email?: string;
      role?: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
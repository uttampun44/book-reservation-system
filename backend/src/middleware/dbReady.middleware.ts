import { type Request, type Response, type NextFunction } from "express";
import mongoose, { type ConnectionStates } from "mongoose";
import connectDB from "@config/database";

/**
 * Middleware to ensure database is connected before processing requests
 * This prevents "Cannot call users.findOne() before" errors
 * 
 * Connection states:
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
export const dbReadyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if already connected (readyState 1 = connected)
    if (mongoose.connection.readyState as number === 1) {
      return next();
    }

    // Try to connect
    console.log("🔗 Database not connected, attempting connection for request:", req.path);
    await connectDB();

    // Verify connection after attempt
    if ((mongoose.connection.readyState as number) === 1) {
      console.log("✅ Database ready, proceeding with request");
      return next();
    }

    // If still not connected, continue anyway (will error at DB operation)
    console.warn("⚠️ Database still not connected, but proceeding with request");
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    // Continue anyway - let the route handle the error
    next();
  }
};

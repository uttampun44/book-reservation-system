import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";
import BooksRouter from "./books/books";
import reserveBooksRouter from "./reservebooks/reservebook";
import unreservedBooksRouter from "./reservebooks/unreservebooks";
import ReserveBooksList from "./reservebooks/reservebookslist";
import { type Request, type Response, type NextFunction } from "express";
import mongoose from "mongoose";

const router = Router();

// Health check endpoint for debugging
router.get("/health", (req: Request, res: Response) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const nodeEnv = process.env.NODE_ENV || "development";
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] Health check - DB: ${dbConnected ? "✅" : "❌"}, Env: ${nodeEnv}`);
  
  res.status(200).json({
    success: true,
    message: "Server is running",
    status: {
      database: dbConnected ? "connected" : "disconnected",
      environment: nodeEnv,
      timestamp: timestamp,
      mongooseState: mongoose.connection.readyState,
    }
  });
});

router.use("/auth", AuthRouter);
router.use("/books", BooksRouter);
router.use("/reserve-books", reserveBooksRouter)
router.use("/unreserve-books", unreservedBooksRouter);
router.use("/reserve-books-list", ReserveBooksList);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Route error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default router;
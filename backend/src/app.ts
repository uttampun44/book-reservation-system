
import express, { type Express, type Request, type Response, type NextFunction } from "express";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import chalk from "chalk";
import Routes from "@routes/Routes";
import { corsOptions } from "@config/cors";
import Cors from "cors";
import connectDB from "@config/database";
import { dbReadyMiddleware } from "@/middleware/dbReady.middleware";

export const app: Express = express();

const Port = process.env.PORT || 8080;

app.use(Cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start database connection immediately (but don't wait)
console.log(chalk.blue("📡 Starting database connection..."));
connectDB().catch((error) => {
  console.error(chalk.red("⚠️ Initial DB connection failed:"), error);
});

// Middleware to ensure DB is ready before processing database queries
app.use(dbReadyMiddleware);

// Set up routes
app.use("/api/v1/", Routes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(chalk.red("❌ Unhandled error:"), err);
  const isDev = process.env.NODE_ENV === "development";
  
  res.status(500).json({
    success: false,
    message: isDev ? err.message : "Internal server error",
    stack: isDev ? err.stack : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  console.warn(`❌ Not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Only start the server if not in production (Vercel will handle it)
if (process.env.NODE_ENV !== "production") {
  const Port = process.env.PORT || 8080;
  app.listen(Port, () => {
    console.log(chalk.green(`Server is running at http://localhost:${Port}`));
  });
}

export default app;

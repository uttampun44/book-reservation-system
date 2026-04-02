import "dotenv/config";
import express, { type Express } from "express";
import chalk from "chalk";
import Routes from "@routes/Routes";
import { corsOptions } from "@config/cors";
import Cors from "cors";
import connectDB from "@config/database";

export const app: Express = express();

const Port = process.env.PORT || 8080;

app.use(Cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", Routes);

async function startServer() {
  await connectDB();
  app.listen(Port, () => {
    console.log(chalk.green(`Server is running at http://localhost:${Port}`));
  });
}

// Only start server if this file is run directly (not imported by tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(err => {
    console.error(chalk.red("Failed to start server:"), err);
    process.exit(1);
  });
}

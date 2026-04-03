
import express, { type Express } from "express";

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

console.log("MONGO URI:", process.env.VERCEL_MONGO_URI);
export const app: Express = express();

const Port = process.env.PORT || 8080;

app.use(Cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", Routes);

connectDB();
app.listen(Port, () => {
  console.log(chalk.green(`Server is running at http://localhost:${Port}`));
});

export default app;

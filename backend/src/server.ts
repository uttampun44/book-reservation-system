import chalk from "chalk";
import { startServer } from "./app";

startServer().catch(err => {
  console.error(chalk.red("Failed to start server:"), err);
  process.exit(1);
});

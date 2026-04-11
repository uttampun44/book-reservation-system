import mongoose from "mongoose";
import { configEnv } from "@config/env";
import Chalk from 'chalk'

const connectDB = async () => {
  try {
    await mongoose.connect(configEnv.mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(Chalk.yellow("Database connected successfully"));
  } catch (error) {
    console.error(Chalk.red("Database connection error:", error));
    // Don't exit - allow the app to serve requests even if DB fails
    console.log(Chalk.yellow("App will continue running without database connection"));
  }
};

export default connectDB;
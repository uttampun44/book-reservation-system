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
    process.exit(1);
  }
};

export default connectDB;
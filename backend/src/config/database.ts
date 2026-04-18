import mongoose from "mongoose";
import { configEnv } from "@config/env";
import chalk from 'chalk';

let isConnected = false; // 👈 cache connection

const connectDB = async () => {
  if (isConnected) return; // 👈 reuse existing connection

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(configEnv.mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
    isConnected = true;
    console.log(chalk.yellow("Database connected successfully"));
  } catch (error) {
    isConnected = false;
    console.error(chalk.red("Database connection error:"), error);
    throw error; // 👈 let dbMiddleware catch it
  }
};

export default connectDB;
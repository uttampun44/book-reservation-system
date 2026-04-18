import mongoose from "mongoose";
import { configEnv } from "@config/env";
import chalk from 'chalk';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log(chalk.blue("✅ Using existing database connection"));
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log(chalk.blue("✅ Database already in ready state"));
    return;
  }

  try {
    console.log(chalk.blue("🔄 Attempting to connect to MongoDB..."));
    console.log(chalk.gray(`URI: ${configEnv.mongoURI.substring(0, 50)}...`));
    
    await mongoose.connect(configEnv.mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      bufferCommands: false,
      retryWrites: true,
    });
    
    isConnected = true;
    console.log(chalk.green("✅ Database connected successfully"));
    console.log(chalk.blue(`Connection state: ${mongoose.connection.readyState}`));
  } catch (error) {
    isConnected = false;
    console.error(chalk.red("❌ Database connection error:"), error);
    console.log(chalk.yellow("⚠️  App will continue running without database connection"));
  }
};

export default connectDB;
import dotenv from "dotenv";

// Environment variables configuration
if (process.env.NODE_ENV !== "production") {
   dotenv.config();
}
export const configEnv = {
  port: process.env.PORT || 8000,
  mongoURI: process.env.VERCEL_MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/book",
  jwtSecret: process.env.VERCEL_JWT_SECRET_KEY || process.env.JWT_SECRET || "your_jwt_secret_key",
  nodeEnv: process.env.NODE_ENV || "development",
};

// Validate required environment variables
if (!process.env.VERCEL_MONGO_URI && !process.env.MONGODB_URI) {
  console.warn("WARNING: MongoDB URI not configured. Using default localhost connection.");
}
if (!process.env.VERCEL_JWT_SECRET_KEY && !process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not configured. Using default value.");
}


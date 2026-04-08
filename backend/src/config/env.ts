import dotenv from "dotenv";

// Environment variables configuration
if (process.env.VERCEL_NODE_ENV !== "production") {
   dotenv.config();
}
export const configEnv = {
  port: process.env.PORT || 8000,
  mongoURI: process.env.VERCEL_MONGO_URI || "mongodb://localhost:27017/book",
  jwtSecret: process.env.VERCEL_JWT_SECRET_KEY || "your_jwt_secret_key",
  nodeEnv: process.env.VERCEL_NODE_ENV || "development",
};


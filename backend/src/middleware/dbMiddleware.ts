// middleware/dbMiddleware.ts
import connectDB from '@config/database';
import { type Request, type Response, type NextFunction } from 'express';

export const dbMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Database connection failed. Please try again.' 
    });
  }
};
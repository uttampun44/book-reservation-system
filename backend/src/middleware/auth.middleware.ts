
import { configEnv } from '@/config/env';
import {type Request, type Response, type NextFunction } from 'express';
import jwt, {type JwtPayload } from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {

    // extracting token from headers example: "Bearer <token>"
  const token = req.headers.authorization?.split(' ')[1] ?? null;

    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    try {
       

        // Fall back to JWT verification
        const decoded = jwt.verify(token, configEnv.jwtSecret || 'your_jwt_secret') as JwtPayload;
        req.user = {
          ...(typeof decoded === 'object' ? decoded : {}),
          isClerk: false
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuthmiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] ?? null;

    if (token) {
        try {
           

            // Fall back to JWT
            const decoded = jwt.verify(token, configEnv.jwtSecret || 'your_jwt_secret') as JwtPayload;
            req.user = {
              ...(typeof decoded === 'object' ? decoded : {}),
              isClerk: false
            };
        } catch (error) {
            // Token invalid but don't block - allow public access
            console.log('Invalid token, allowing public access');
        }
    }
    next();
};
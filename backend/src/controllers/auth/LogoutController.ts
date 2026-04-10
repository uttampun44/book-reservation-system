import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export const LogoutController = async (req: Request, res: Response, next: Function) => {
    try {


        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
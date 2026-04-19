import { User } from "@/models/User";
import { userTypes } from "@schema/types/User.type";
import {type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { configEnv } from "@/config/env";

export const LoginController = async (req: Request, res: Response) => {
  try {
    console.log("🔐 Login attempt initiated");

    const validationData = userTypes.pick({ email: true, password: true }).parse(req.body);
    const { email, password } = validationData;
    console.log(`📧 Attempting login for email: ${email}`);

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json(
        { success: false, 
        message: "Invalid email or password" 
        }
       );
    }

    console.log(`✅ User found: ${email}`);

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordValid) {
      console.log(`❌ Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    console.log(`✅ Password valid for user: ${email}`);
    
    // token generation
    const token = jwt.sign(
      {
        id: checkUser._id,  
        email: checkUser.email
      },
      configEnv.jwtSecret as string,
      { expiresIn: "1h" }
    );

    console.log(`✅ Token generated for user: ${email}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: checkUser._id,
        email: checkUser.email,
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);

    if (error instanceof ZodError) {
      console.error("Validation error details:", error.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.message
      });
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined
    });
  }
}
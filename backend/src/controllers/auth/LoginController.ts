import { User } from "@/models/User";
import { userTypes } from "@schema/types/User.type";
import {type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { configEnv } from "@/config/env";

export const LoginController = async (req: Request, res: Response) => {
  try {

    const validationData = userTypes.pick({ email: true, password: true }).parse(req.body);
    // Login logic will be here
    const { email, password } = validationData;

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(401).json(
        { success: false, 
        message: "Invalid email or password" 
        }
       );
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    // token generation
    const token = jwt.sign(
      {
        id: checkUser._id,  
        email: checkUser.email
      },
      configEnv.jwtSecret as string,
      { expiresIn: "1h" }
    );


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

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
}
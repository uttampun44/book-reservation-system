import exporess, { type Request, type Response } from "express";
import { userTypes } from "@/schema/types/User.type";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { User } from "@/models/User";


export const RegisterController = async (req: Request, res: Response) => {
  try {
    console.log("📝 Registration attempt initiated");
      
    const validationData = userTypes.parse(req.body);
    
    const { fullname, email, password } = validationData;
    console.log(`📧 Registering new user: ${email}`);

    // Registration logic will be here
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`);
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    console.log(`✅ No existing user found for ${email}, proceeding with registration`);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ fullname, email, password: passwordHash });
     
    if(!newUser) {
      console.log(`❌ Failed to create user in database: ${email}`);
      return res.status(500).json({ success: false, message: "Failed to register user" });
    }

    console.log(`✅ User registered successfully: ${email}`);
   
    return res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      users: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      }
    });

  } catch (error) {
    console.error("❌ Registration error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      console.error("Validation error details:", error.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.message
      });
    }

    if (error instanceof Error && error.name === 'MongoError') {
      console.error("MongoDB error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Database error occurred"
      });
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);

    // Handle all other errors
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "development" ? errorMessage : "Internal server error"
    });

  }
}
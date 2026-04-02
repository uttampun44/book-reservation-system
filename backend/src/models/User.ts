import type { userTypes } from "@/schema/types/User.type";
import mongoose, { Schema, Document } from "mongoose";
import z from "zod";

type UserType = z.infer<typeof userTypes>;

export interface IUser extends Document, UserType {
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  
  fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
}, { timestamps: true });

export const User = mongoose.model<IUser>("users", UserSchema);
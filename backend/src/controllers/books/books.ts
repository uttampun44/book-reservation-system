
import { type Request, type Response } from "express";
import { books } from "@/data/book.data";

export const getAllbooks = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "An error occurred while retrieving books"
    });
  }
};
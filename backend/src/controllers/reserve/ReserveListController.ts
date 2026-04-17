import {type Request, type Response } from "express";
import { ReserveModel } from "@models/ReserveBooks";
import { getBookById } from "@data/book.data";

export const ReserveListController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    
    // Ensure user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get only the logged-in user's reserved books
    const reserves = await ReserveModel.find({ userId });

    console.log("Reserves retrieved for user:", userId, reserves);

    // Map reserves with full book details
    const reservesWithBooks = reserves.map((reserve) => {
      const book = getBookById(reserve.bookId);
      const { userId, bookId, ...rest } = reserve.toObject();
      return {
        ...rest,
        book,
      };
    });

    return res.status(200).json({
        success: true,
        message: "Reserved books retrieved successfully",
        data: reservesWithBooks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "An error occurred while retrieving reserved books",
    });
    }   
};
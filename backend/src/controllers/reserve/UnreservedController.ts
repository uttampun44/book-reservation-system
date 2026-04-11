import { type Request, type Response } from "express";
import { ReserveModel } from "@models/ReserveBooks";
import type { DeleteResult } from "mongodb";

export const UnreservedController = async (req: Request, res: Response) => {
  try {
      
     const userId = req.user?.id as string;
    const bookId = req.params.bookId as string;
    
    const result: DeleteResult = await ReserveModel.deleteOne({ userId, bookId });

     if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book unreserved successfully",
      data: {
        bookId,
        userId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the unreservation",
    });
  }
};

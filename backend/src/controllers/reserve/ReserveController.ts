import { type Request, type Response } from "express";
import { ZodError } from "zod";
import { reserveTypes } from "@schema/types/Reserve.type";
import { ReserveModel } from "@models/ReserveBooks";

export const ReserveController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;

    const validationData = reserveTypes.parse(req.body);

    const booksToReserve = Array.isArray(validationData)
      ? validationData
      : [validationData];

    // Check duplicates using userId from token
    const bookIds = booksToReserve.map((book) => book.bookId);
    const alreadyReserved = await ReserveModel.find({
      userId, // filter by userId from token
      bookId: { $in: bookIds },
    });

    if (alreadyReserved.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some book(s) are already reserved",
        duplicates: alreadyReserved.map((r) => r.bookId),
      });
    }

    // insertMany with userId from token
    const result = await ReserveModel.insertMany(
      booksToReserve.map((book) => ({
        ...book,
        userId,
      }))
    );

    if (!result || result.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to reserve book(s)",
      });
    }

    return res.status(201).json({
      success: true,
      message: `${result.length} book(s) reserved successfully`,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the reservation",
    });
  }
};
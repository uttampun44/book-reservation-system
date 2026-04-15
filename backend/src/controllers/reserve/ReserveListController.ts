import {type Request, type Response } from "express";
import { ReserveModel } from "@models/ReserveBooks";

export const ReserveListController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const reserves = await ReserveModel.find({ userId });

    console.log("Reserves retrieved:", reserves);

    return res.status(200).json({
        success: true,
        message: "Reserved books retrieved successfully",
        data: reserves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "An error occurred while retrieving reserved books",
    });
    }   
};
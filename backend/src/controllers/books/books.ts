
import { type Request, type Response } from "express";
import { type Book, books } from "@/data/book.data";
import { paginate, parsePage, parsePerPage } from "@/utils/pagination.helper";
import { sortBooks, type SortOption } from "@/utils/sorted";

export const BooksController = async (req: Request, res: Response) => {
  try {
    
     const page    = parsePage(req.query.page);
    const perPage = parsePerPage(req.query.perPage);
    const sortBy  = (req.query.sortBy as SortOption) ?? null;
 
    const sorted = sortBy ? sortBooks(sortBy) : [...books];
    const result = paginate(sorted, page, perPage);

    return res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: result.data,
      pagination: result.pagination,
      sortBy:     sortBy ?? "default",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
        message: "An error occurred while retrieving books"
    });
  }
};
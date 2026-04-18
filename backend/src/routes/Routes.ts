import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";
import BooksRouter from "./books/books";
import reserveBooksRouter from "./reservebooks/reservebook";
import unreservedBooksRouter from "./reservebooks/unreservebooks";
import ReserveBooksList from "./reservebooks/reservebookslist";
import { type Request, type Response, type NextFunction } from "express";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/books", BooksRouter);
router.use("/reserve-books", reserveBooksRouter)
router.use("/unreserve-books", unreservedBooksRouter);
router.use("/reserve-books-list", ReserveBooksList);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Route error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default router;
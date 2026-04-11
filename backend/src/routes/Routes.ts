import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";
import BooksRouter from "./books/books";
import reserveBooksRouter from "./reservebooks/reservebook";
import unreservedBooksRouter from "./reservebooks/unreservebooks";


const router = Router();

router.use("/auth", AuthRouter);
router.use("/books", BooksRouter);
router.use("/reserve-books", reserveBooksRouter)
router.use("/unreserve-books", unreservedBooksRouter);

export default router;
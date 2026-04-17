import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";
import BooksRouter from "./books/books";
import reserveBooksRouter from "./reservebooks/reservebook";
import unreservedBooksRouter from "./reservebooks/unreservebooks";
import ReserveBooksList from "./reservebooks/reservebookslist";


const router = Router();

router.use("/auth", AuthRouter);
router.use("/books", BooksRouter);
router.use("/reserve-books", reserveBooksRouter)
router.use("/unreserve-books", unreservedBooksRouter);
router.use("/reserve-books-list", ReserveBooksList);

export default router;
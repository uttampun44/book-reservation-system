import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";
import BooksRouter from "./books/books";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/books", BooksRouter);

export default router;
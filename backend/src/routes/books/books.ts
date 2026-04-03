import { Router } from "express";
import { BooksController } from "@/controllers/books/books";

const router = Router();

router.get("/", BooksController);

export default router;
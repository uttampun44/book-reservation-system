import { Router } from "express";
import { getAllbooks } from "@/controllers/books/books";

const router = Router();

router.get("/", getAllbooks);

export default router;
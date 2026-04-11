import { UnreservedController } from "@/controllers/reserve/UnreservedController";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const unreservedBooksRouter = Router();

unreservedBooksRouter.delete("/:bookId", authMiddleware, UnreservedController);

export default unreservedBooksRouter;
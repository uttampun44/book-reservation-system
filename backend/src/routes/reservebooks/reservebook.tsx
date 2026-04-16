import { ReserveController } from "@/controllers/reserve/ReserveController";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";

const ReserveBooksRouter = Router();

ReserveBooksRouter.post("/", authMiddleware, ReserveController);

export default ReserveBooksRouter;
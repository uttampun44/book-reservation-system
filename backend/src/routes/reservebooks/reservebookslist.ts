import { Router } from "express";
import { ReserveListController } from "@/controllers/reserve/ReserveListController";
import { authMiddleware } from "@/middleware/auth.middleware";

const ReserveBooksList = Router();
ReserveBooksList.get("/", authMiddleware, ReserveListController);

export default ReserveBooksList;

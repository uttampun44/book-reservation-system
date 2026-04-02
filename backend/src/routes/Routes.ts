import { Router } from "express";
import AuthRouter from "./auth/AuthRoutes";

const router = Router();

router.use("/auth", AuthRouter);

export default router;
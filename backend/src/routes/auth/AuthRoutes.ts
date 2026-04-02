import { Router } from "express";
import { RegisterController } from "@controllers/auth/RegisterController";

const AuthRouter = Router();

AuthRouter.post('/register', RegisterController)

export default AuthRouter
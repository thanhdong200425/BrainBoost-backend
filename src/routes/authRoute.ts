import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);

export default authRouter;

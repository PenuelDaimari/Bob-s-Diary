import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/verify-registration", authController.verifyEmailOtp);

authRouter.post("/login", authController.login);
authRouter.get("/get-me", authController.getMe);
authRouter.get("/refresh-token", authController.refreshToken);
authRouter.get("/logout", authController.logout);
authRouter.get("/logout-all", authController.logoutAllDevices);

authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
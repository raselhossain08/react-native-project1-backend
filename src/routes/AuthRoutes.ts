import { Router } from "express";
import {
  GetProfile,
  Login,
  Register,
  VerifyEmail,
  generateVerificationLink,
} from "../controllers/auth";
import { Validate, verifyTokenSchema } from "../middleware/validators";
import { newUserSchema } from "../utils/validationSchema";
import { isAuth } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/register", Validate(newUserSchema), Register);
authRouter.post("/verify", Validate(verifyTokenSchema), VerifyEmail);
authRouter.get("/verify-token", isAuth, generateVerificationLink);
authRouter.post("/login", Login);
authRouter.post("/refresh-token");
authRouter.post("/logout");
authRouter.get("/profile", isAuth, GetProfile);
authRouter.get("/profile/:id");
authRouter.post("/update-avatar");
authRouter.post("/update-profile");
authRouter.post("/forget-password");
authRouter.post("/verify-password-reset-token");
authRouter.post("/reset-password");

export default authRouter;

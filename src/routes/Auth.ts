import { Router } from "express";
const router = Router();

import {
  userSignupValidator,
  userSigninValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
} from "../validators/auth";
import { runValidation } from "../validators";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} from "../controller/authentication/authController";

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

export default router;

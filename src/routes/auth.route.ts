import { Router } from "express";
const router = Router();

import {
  userSignupValidator,
  userSigninValidator,
} from "../validators/auth.validator";

import { runValidation } from "../validators/index.validator";
import { signup, signin } from "../controller/auth.controller";

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);

export default router;

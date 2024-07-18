"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = require("../validators/auth");
const validators_1 = require("../validators");
const authController_1 = require("../controller/authentication/authController");
router.post("/signup", auth_1.userSignupValidator, validators_1.runValidation, authController_1.signup);
router.post("/signin", auth_1.userSigninValidator, validators_1.runValidation, authController_1.signin);
router.post("/forgot-password", auth_1.forgotPasswordValidator, validators_1.runValidation, authController_1.forgotPassword);
router.post("/reset-password", auth_1.resetPasswordValidator, validators_1.runValidation, authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=Auth.js.map
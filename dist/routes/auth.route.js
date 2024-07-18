"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_validator_1 = require("../validators/auth.validator");
const index_validator_1 = require("../validators/index.validator");
const auth_controller_1 = require("../controller/auth.controller");
router.post("/signup", auth_validator_1.userSignupValidator, index_validator_1.runValidation, auth_controller_1.signup);
router.post("/signin", auth_validator_1.userSigninValidator, index_validator_1.runValidation, auth_controller_1.signin);
router.post("/forgot-password", auth_validator_1.forgotPasswordValidator, index_validator_1.runValidation, auth_controller_1.forgotPassword);
router.post("/reset-password", auth_validator_1.resetPasswordValidator, index_validator_1.runValidation, auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map
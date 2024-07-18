"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.userSigninValidator = exports.userSignupValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userSignupValidator = [
    (0, express_validator_1.check)("first_name").not().isEmpty().withMessage("First Name is required"),
    (0, express_validator_1.check)("last_name").not().isEmpty().withMessage("Last Name is required"),
    (0, express_validator_1.check)("gender").not().isEmpty().withMessage("Gender is required"),
    (0, express_validator_1.check)("emailId").isEmail().withMessage("Must be a valid email address"),
    (0, express_validator_1.check)("mobile_number").custom((mobile_number_1, _a) => __awaiter(void 0, [mobile_number_1, _a], void 0, function* (mobile_number, { req }) {
        if (mobile_number.toString().length !== 10) {
            throw new Error("Must be a valid Phone number");
        }
        return true;
    })),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least  6 characters long"),
    (0, express_validator_1.check)("confirm_password")
        .notEmpty()
        .withMessage("Confirm Password should not be empty")
        .custom((confirm_password_1, _a) => __awaiter(void 0, [confirm_password_1, _a], void 0, function* (confirm_password, { req }) {
        if (confirm_password !== req.body.password) {
            throw new Error("Password confirmation does not match with password");
        }
        return true;
    })),
];
exports.userSigninValidator = [
    (0, express_validator_1.check)("emailId").isEmail().withMessage("Must be a valid email address"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least  6 characters long"),
];
exports.forgotPasswordValidator = [
    (0, express_validator_1.check)("emailId").isEmail().withMessage("Must be a valid email address"),
];
exports.resetPasswordValidator = [
    (0, express_validator_1.check)("newPassword")
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage("Must be a at least 6 char long"),
    (0, express_validator_1.check)("resetPasswordLink")
        .not()
        .isEmpty()
        .withMessage("token Must be present"),
];
//# sourceMappingURL=auth.validator.js.map
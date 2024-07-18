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
exports.sendMailValidator = exports.updateUserValidator = exports.updateOrderValidator = void 0;
const express_validator_1 = require("express-validator");
exports.updateOrderValidator = [
    (0, express_validator_1.check)("first_name").not().isEmpty().withMessage("First Name is required"),
    (0, express_validator_1.check)("last_name").not().isEmpty().withMessage("Last Name is required"),
    (0, express_validator_1.check)("gender").not().isEmpty().withMessage("Gender is required"),
    (0, express_validator_1.check)("emailId").isEmail().withMessage("Must be a valid email address"),
    (0, express_validator_1.check)("mobile_number")
        .isMobilePhone("any")
        .withMessage("Must be a valid Phone number"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least  6 characters long"),
    (0, express_validator_1.check)("confirm_password")
        .notEmpty()
        .custom((confirm_password_1, _a) => __awaiter(void 0, [confirm_password_1, _a], void 0, function* (confirm_password, { req }) {
        if (confirm_password !== req.body.password) {
            throw new Error("Password confirmation does not match with password");
        }
        return true;
    }))
        .withMessage("Confirm Password should not be empty"),
];
exports.updateUserValidator = [
    (0, express_validator_1.check)("first_name").not().isEmpty().withMessage("First Name is required"),
    (0, express_validator_1.check)("last_name").not().isEmpty().withMessage("Last Name is required"),
    (0, express_validator_1.check)("gender").not().isEmpty().withMessage("Gender is required"),
    (0, express_validator_1.check)("emailId").isEmail().withMessage("Must be a valid email address"),
    (0, express_validator_1.check)("mobile_number")
        .isMobilePhone("any")
        .withMessage("Must be a valid Phone number"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least  6 characters long"),
    (0, express_validator_1.check)("confirm_password")
        .notEmpty()
        .custom((confirm_password_1, _a) => __awaiter(void 0, [confirm_password_1, _a], void 0, function* (confirm_password, { req }) {
        if (confirm_password !== req.body.password) {
            throw new Error("Password confirmation does not match with password");
        }
        return true;
    }))
        .withMessage("Confirm Password should not be empty"),
];
exports.sendMailValidator = [
    (0, express_validator_1.check)("email").not().isEmpty().withMessage("Email is required"),
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("Name is required"),
    (0, express_validator_1.check)("message").not().isEmpty().withMessage("Message is required"),
];
//# sourceMappingURL=other.js.map
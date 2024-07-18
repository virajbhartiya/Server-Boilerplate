"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new appError_1.default("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    if (!!req.originalUrl) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    throw err.message;
    // B) jsonED WEBSITE
};
exports.default = (err, req, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    sendErrorDev(err, req, res);
};
//# sourceMappingURL=globalErrorController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.restrictTo = exports.adminMiddleware = exports.requireSignin = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const express_jwt_1 = require("express-jwt");
const user_model_1 = __importDefault(require("../../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.requireSignin = (0, express_jwt_1.expressjwt)({
    secret: (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret",
    algorithms: ["HS256"],
});
const adminMiddleware = (req, res, next) => {
    user_model_1.default.findById({ _id: req.user._id })
        .then((user) => {
        if (!user) {
            return res.status(400).json({
                error: `User not found`,
            });
        }
        if (user.role !== "admin") {
            return res.status(400).json({
                error: "Access denied ",
            });
        }
        req.profile = user;
        next();
    })
        .catch((err) => {
        if (err) {
            return res.status(400).json({
                error: `User not found ${err}`,
            });
        }
    });
};
exports.adminMiddleware = adminMiddleware;
const restrictTo = (role) => {
    return (req, res, next) => {
        if (req.user) {
            if (role === req.user.role || req.user.role === "admin") {
                next();
            }
            else {
                return next(new appError_1.default("You do not have permission to perform this action", 403));
            }
        }
        else {
            return next(new appError_1.default("You are not logged in", 401));
        }
    };
};
exports.restrictTo = restrictTo;
const isOwner = (req, res, next) => {
    if (req.params.id === String(req.user._id) || req.user.role === "admin")
        return next();
    return next(new appError_1.default("You do not own this profile", 401));
};
exports.isOwner = isOwner;
//# sourceMappingURL=auth.middleware.js.map
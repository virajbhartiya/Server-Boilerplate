import AppError from "../../utils/appError";
import { NextFunction } from "express";
import { expressjwt } from "express-jwt";
import User from "../../models/user.model";
import dotenv from "dotenv";
dotenv.config();

export const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET ?? "secret",
  algorithms: ["HS256"],
});

export const adminMiddleware = (req: any, res: any, next: NextFunction) => {
  User.findById({ _id: req.user._id })
    .then((user: any) => {
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

export const restrictTo = (role: string) => {
  return (req: any, res: any, next: any) => {
    if (req.user) {
      if (role === req.user.role || req.user.role === "admin") {
        next();
      } else {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
    } else {
      return next(new AppError("You are not logged in", 401));
    }
  };
};

export const isOwner = (req: any, res: any, next: NextFunction) => {
  if (req.params.id === String(req.user._id) || req.user.role === "admin")
    return next();

  return next(new AppError("You do not own this profile", 401));
};

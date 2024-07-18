import AppError from "../utils/appError";
import { Request, Response, NextFunction } from "express";
import { IBaseRequest } from "../Interfaces/utils/utils.interfaces";
import { Document } from "mongoose";
import { catchAsync } from "../utils/utils";
import UserModel from "../models/user.model";

// TODO: update me
const updateHelper = (document: Document, req: IBaseRequest) => {
  console.log(req);
  return document;
};

export const updateUser = () =>
  catchAsync(async (req: IBaseRequest, res: Response, next: NextFunction) => {
    const doc = await UserModel.findById(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    let document: Document = updateHelper(doc, req);
    if (!document)
      return next(new AppError("could not udpate the database", 407));

    const finaldoc = await document.save();

    res.status(200).json({
      status: "success",
      data: finaldoc,
    });
  });

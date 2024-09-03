import { Request, Response, NextFunction } from "express";
import { IBaseRequest } from "../../Interfaces/utils/utils.interfaces";
import { Model, Document, FilterQuery } from "mongoose";
import AppError from "../../utils/appError";
import { catchAsync } from "../../utils/utils";
import APIFeatures from "../../utils/apiFeatures";

export const getOne = <T extends Document>(
  Model: Model<T>,
  popOptions?: string | null
) =>
  catchAsync(async (req: IBaseRequest, res: Response, next: NextFunction) => {
    const filter: FilterQuery<T> = { _id: req.params.id };
    let query = Model.findOne(filter);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query.exec();

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: IBaseRequest, res: Response, next: NextFunction) => {
    const filter: FilterQuery<T> = {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query.exec();

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

import AppError from "../../utils/appError";
import { Request, Response, NextFunction } from "express";
import { IBaseRequest } from "../../Interfaces/utils/utils.interfaces";
import { Model } from "mongoose";
import { catchAsync } from "../../utils/utils";
import APIFeatures from "../../utils/apiFeatures";

interface IFilter {
  _id?: string;
}

export const getOne = (Model: any, popOptions?: string | null) =>
  catchAsync(async (req: IBaseRequest, res: Response, next: NextFunction) => {
    let filter: IFilter = { _id: req.params.id };
    let query = Model.find(filter);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const getAll = (Model: Model<any>) =>
  catchAsync(async (req: IBaseRequest, res: Response, next: NextFunction) => {
    let filter: IFilter = {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

export const deleteOne = (Model: any) =>
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

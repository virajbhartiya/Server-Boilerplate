import { createHmac } from "crypto";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// model schema
export const setStringType = (maxLength: number) => ({
  type: String,
  maxlength: maxLength,
  trim: true,
});

// Global Error handling
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next?: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// helps you allow object
export const filterObj = (obj: any, ...allowFields: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const findDiff = (prev: [], update: []) => {
  let added: any[] = [];
  let removed: any[] = [];
  if (prev) {
    added = update
      .filter((item) => !prev.includes(item))
      .map((item) => String(item)); //Sanitize
    removed = prev
      .filter((item) => !update.includes(item))
      .map((item) => String(item)); //Sanitize
  } else added = update.map((item) => String(item)); //Sanitize
  return [added, removed];
};

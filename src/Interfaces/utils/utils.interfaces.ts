import { Query } from "mongoose";
import APIFeatures from "../../utils/apiFeatures";
import { Request } from "express";
import { IUser } from "../user.interface";

export interface ISendMail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IJwtPayload {
  name: string;
  email: string;
  password: string;
}

export interface IAPIFeatures {
  query: Query<any, any>;
  queryString: { [index: string]: string };
  filter(): APIFeatures;
}

export interface IBaseRequest extends Request {
  user: Partial<IUser>;
  baseUrl: string;
  query: { [index: string]: string };
}

export interface IError extends Error {
  statusCode: any;
  status: any;
  message: any;
  stack?: any;
  isOperational: boolean;
  name: string;
}

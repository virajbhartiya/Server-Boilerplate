import { Query } from "mongoose";
import APIFeatures from "../utils/apiFeatures";

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

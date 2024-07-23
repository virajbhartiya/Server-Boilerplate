import { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  createdAt: string;
  hashed_password: string;
  salt: string;
}

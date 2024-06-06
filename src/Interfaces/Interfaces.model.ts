import { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId;
  photo: string;
  first_name: string;
  last_name: string;
  emailId: string;
  gender: string;
  user_team: ObjectId;
  role: string;
  mobile_number: number;
  fav_club: string;
  profile_photo: string;
  dob: string;
  createdAt: string;
  resetPasswordLink: string;
  hashed_password: string;
  salt: string;
}

import { IUser } from "../Interfaces/Interfaces.model";
import mongoose from "mongoose";
import crypto from "crypto";
const UserSchema = new mongoose.Schema<IUser>(
  {
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    photo: String,
    mobile_number: String,
    fav_club: String,
    profile_photo: {
      type: String,
      default: "default.png",
    },
    dob: String,
    user_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    hashed_password: {
      type: String,
    },
    salt: {
      type: String,
    },
    resetPasswordLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
  }
);

UserSchema.virtual("password")
  .set(function (this: any, password: string) {
    this._password = password;
    this.salt = this.makesalt();
    this.hashed_password = this.encrptPassword(password);
  })
  .get(function (this: any) {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText: string) {
    return this.encrptPassword(plainText) === this.hashed_password;
  },

  encrptPassword: function (password: string) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makesalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.set("toJSON", { virtuals: true });

const UserModel = mongoose.model<IUser>("Users", UserSchema);

// UserModel.watch().on("delete", (data) => console.log(new Date(), data));

export default UserModel;

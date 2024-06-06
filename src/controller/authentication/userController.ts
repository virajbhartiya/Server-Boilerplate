import moment from "moment";
import { catchAsync } from "../../utils/utils";
import { IBaseRequest } from "../../Interfaces/core_interfaces";
import { NextFunction, Response } from "express";
import Users from "../../models/Users";
import { sendEmail } from "../../utils/helper";
const { ObjectId } = require("mongoose").Types;

export const getUser = catchAsync(async (req: IBaseRequest, res: Response) => {
  let data = "no data";

  const id = new ObjectId(req.user._id);
  data = (await Users.findById(id)) ?? "";

  res.status(200).send({ user: data });
});

export const deactivateUser = catchAsync(
  async (req: IBaseRequest, res: Response, next: NextFunction) => {
    await Users.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const createUser = catchAsync(
  async (req: IBaseRequest, res: Response, next: NextFunction) => {
    const {
      first_name,
      last_name,
      emailId,
      password,
      confirm_password,
      gender,
      mobile_number,
    } = req.body;

    Users.findOne({ emailId })
      .then((user: any) => {
        if (user) {
          return res.status(400).json({
            error: "Email is taken",
          });
        }

        const newUser = new Users({
          first_name,
          last_name,
          emailId,
          password,
          transaction_id: `COD-${first_name}-${moment().format(
            "DDMMYYYYHHmmss"
          )}`,
          transaction_date: moment().format("DD/MM/YYYY"),
          dateOfExpiry: moment().add(1, "year").format("DD/MM/YYYY"),
          confirm_password,
          gender,
          personal_details: { mobile_number: mobile_number },
        });
        newUser
          .save()
          .then((user: any) => {
            sendEmail({
              to: emailId,
              subject: "Registration successful in VadhuVar Mahiti Kendra",
              text: `
    Dear ${first_name} ${last_name},
    
    your username for shubhamangalthane.org is ${emailId}
    and password for the same is ${password}
    
    Yours faithfully,
    
    TEAM VADHUVAR MAHITI KENDRA THANE ,
    
    As this is auto-generated mail Signature is not mandatory
              `,
            });
            return res.json({
              message: "success. Please signin.",
            });
          })
          .catch((err: any) => {
            if (err) {
              return res.status(401).json({
                error: "Error saving user in database. Try signup again",
              });
            }
          });
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({
            error: "Email is taken",
          });
        }
      });
  }
);

export const saveUser = catchAsync(
  async (req: IBaseRequest, res: Response, next: NextFunction) => {
    const { first_name, last_name, emailId, gender, mobile_number } = req.body;

    Users.findOne({ emailId })
      .then((user: any) => {
        if (!user) {
          return res.status(400).json({
            error: "No user found",
          });
        }
        const updatedUser = user;
        updatedUser.first_name = first_name;
        updatedUser.last_name = last_name;
        updatedUser.emailId = emailId;
        updatedUser.gender = gender;
        updatedUser.personal_details.mobile_number = mobile_number;
        updatedUser.save((err: any, user: any) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try updating again",
            });
          }
          sendEmail({
            to: emailId,
            subject:
              "User Details successful in Updated in VadhuVar Mahiti Kendra",
            text: `
    Dear ${first_name} ${last_name},
    
    Your user profile has been updated.
    
    Yours faithfully,
    
    TEAM VADHUVAR MAHITI KENDRA THANE ,
    
    As this is auto-generated mail Signature is not mandatory
              `,
          });
          return res.json({
            message: "User successfully updated.",
          });
        });
      })
      .catch((err) => {
        if (err) {
          return res.status(400).json({
            error: "No user found",
            err,
          });
        }
      });
  }
);

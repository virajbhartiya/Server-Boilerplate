import { check } from "express-validator";

export const userSignupValidator = [
  check("first_name").not().isEmpty().withMessage("First Name is required"),
  check("last_name").not().isEmpty().withMessage("Last Name is required"),
  check("gender").not().isEmpty().withMessage("Gender is required"),
  check("emailId").isEmail().withMessage("Must be a valid email address"),
  check("mobile_number").custom(async (mobile_number, { req }) => {
    if (mobile_number.toString().length !== 10) {
      throw new Error("Must be a valid Phone number");
    }
    return true;
  }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
  check("confirm_password")
    .notEmpty()
    .withMessage("Confirm Password should not be empty")
    .custom(async (confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error("Password confirmation does not match with password");
      }
      return true;
    }),
];

export const userSigninValidator = [
  check("emailId").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
];

export const forgotPasswordValidator = [
  check("emailId").isEmail().withMessage("Must be a valid email address"),
];
export const resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Must be a at least 6 char long"),
  check("resetPasswordLink")
    .not()
    .isEmpty()
    .withMessage("token Must be present"),
];

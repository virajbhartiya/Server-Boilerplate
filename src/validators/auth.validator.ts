import { check } from "express-validator";

export const userSignupValidator = [
  check("firstName").not().isEmpty().withMessage("First Name is required"),
  check("lastName").not().isEmpty().withMessage("Last Name is required"),
  check("emailId").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password should not be empty")
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
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

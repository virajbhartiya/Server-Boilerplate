import { check } from "express-validator";

export const updateOrderValidator = [
  check("first_name").not().isEmpty().withMessage("First Name is required"),
  check("last_name").not().isEmpty().withMessage("Last Name is required"),
  check("gender").not().isEmpty().withMessage("Gender is required"),
  check("emailId").isEmail().withMessage("Must be a valid email address"),
  check("mobile_number")
    .isMobilePhone("any")
    .withMessage("Must be a valid Phone number"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
  check("confirm_password")
    .notEmpty()
    .custom(async (confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error("Password confirmation does not match with password");
      }
      return true;
    })
    .withMessage("Confirm Password should not be empty"),
];

export const updateUserValidator = [
  check("first_name").not().isEmpty().withMessage("First Name is required"),
  check("last_name").not().isEmpty().withMessage("Last Name is required"),
  check("gender").not().isEmpty().withMessage("Gender is required"),
  check("emailId").isEmail().withMessage("Must be a valid email address"),
  check("mobile_number")
    .isMobilePhone("any")
    .withMessage("Must be a valid Phone number"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
  check("confirm_password")
    .notEmpty()
    .custom(async (confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error("Password confirmation does not match with password");
      }
      return true;
    })
    .withMessage("Confirm Password should not be empty"),
];

export const sendMailValidator = [
  check("email").not().isEmpty().withMessage("Email is required"),
  check("name").not().isEmpty().withMessage("Name is required"),
  check("message").not().isEmpty().withMessage("Message is required"),
];

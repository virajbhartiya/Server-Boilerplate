"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUser = exports.createUser = exports.deactivateUser = exports.getUser = void 0;
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../utils/utils");
const user_model_1 = __importDefault(require("../../models/user.model"));
const helper_1 = require("../../utils/helper");
const { ObjectId } = require("mongoose").Types;
exports.getUser = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data = "no data";
    const id = new ObjectId(req.user._id);
    data = (_a = (yield user_model_1.default.findById(id))) !== null && _a !== void 0 ? _a : "";
    res.status(200).send({ user: data });
}));
exports.deactivateUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.createUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, emailId, password, confirm_password, gender, mobile_number, } = req.body;
    user_model_1.default.findOne({ emailId })
        .then((user) => {
        if (user) {
            return res.status(400).json({
                error: "Email is taken",
            });
        }
        const newUser = new user_model_1.default({
            first_name,
            last_name,
            emailId,
            password,
            transaction_id: `COD-${first_name}-${(0, moment_1.default)().format("DDMMYYYYHHmmss")}`,
            transaction_date: (0, moment_1.default)().format("DD/MM/YYYY"),
            dateOfExpiry: (0, moment_1.default)().add(1, "year").format("DD/MM/YYYY"),
            confirm_password,
            gender,
            personal_details: { mobile_number: mobile_number },
        });
        newUser
            .save()
            .then((user) => {
            (0, helper_1.sendEmail)({
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
            .catch((err) => {
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
}));
exports.saveUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, emailId, gender, mobile_number } = req.body;
    user_model_1.default.findOne({ emailId })
        .then((user) => {
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
        updatedUser.save((err, user) => {
            if (err) {
                return res.status(401).json({
                    error: "Error saving user in database. Try updating again",
                });
            }
            (0, helper_1.sendEmail)({
                to: emailId,
                subject: "User Details successful in Updated in VadhuVar Mahiti Kendra",
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
}));
//# sourceMappingURL=userController.js.map
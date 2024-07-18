"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportInit = exports.resetPassword = exports.forgotPassword = exports.signin = exports.signup = void 0;
const Users_1 = __importDefault(require("../../models/Users"));
const jsonwebtoken_1 = require("jsonwebtoken");
const lodash_1 = require("lodash");
const helper_1 = require("../../utils/helper");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const signup = (req, res) => {
    const { first_name, last_name, emailId, password, confirm_password, gender, mobile_number, } = req.body;
    Users_1.default.findOne({ emailId: emailId })
        .then((user) => {
        if (user) {
            return res.status(400).json({
                error: "Email is taken",
            });
        }
        const newUser = new Users_1.default({
            first_name,
            last_name,
            emailId,
            password,
            confirm_password,
            gender,
            personal_details: { mobile_number: mobile_number },
        });
        newUser
            .save()
            .then((savedUser) => {
            var _a;
            const jwtToken = (0, jsonwebtoken_1.sign)({ _id: savedUser._id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
                expiresIn: "100h",
            });
            return res.status(200).json({
                message: "success",
                jwtToken,
                user: savedUser,
            });
        })
            .catch((err) => {
            if (err) {
                return res.status(401).json({
                    error: err,
                });
            }
        });
    })
        .catch((err) => {
        if (err) {
            res.status(400).json({
                error: "Email is taken",
            });
        }
    });
};
exports.signup = signup;
const signin = (req, res) => {
    const { emailId, password } = req.body;
    Users_1.default.findOne({ emailId })
        .then((user) => {
        var _a;
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match",
            });
        }
        const jwtToken = (0, jsonwebtoken_1.sign)({ _id: user._id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "100h",
        });
        res.cookie("jwt", jwtToken, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        });
        return res.json({
            jwtToken,
            user: user,
        });
    })
        .catch((err) => {
        if (err) {
            return res.status(400).json({
                error: "User does not exist. Please signup",
                err,
            });
        }
    });
};
exports.signin = signin;
const forgotPassword = (req, res) => {
    const { emailId } = req.body;
    Users_1.default.findOne({ emailId })
        .then((user) => {
        var _a;
        if (!user) {
            return res.status(400).json({
                error: "User does not exist.",
            });
        }
        if (user.isMarried) {
            return res.status(400).json({
                error: "User is already married.",
            });
        }
        const token = (0, jsonwebtoken_1.sign)({
            _id: user._id,
            name: `${user.first_name} ${user.last_name}`,
        }, (_a = process.env.JWT_RESET_PASSWORD) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "10m",
        });
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: emailId,
            subject: `Password reset link`,
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
        };
        return user.updateOne({ resetPasswordLink: token }, (err, _success) => {
            if (err) {
                return res.status(400).json({
                    error: `datase Connection reset password error ${err}`,
                });
            }
            else {
                (0, helper_1.sendEmail)(emailData)
                    .then((_info) => {
                    return res.json({
                        message: `Email has been sent to ${emailData.to}. Follow the instruction to activate your account`,
                    });
                })
                    .catch((err) => {
                    return res.json({
                        message: err,
                    });
                });
            }
        });
    })
        .catch((err) => {
        if (err) {
            return res.status(400).json({
                error: "User does not exist.",
                err,
            });
        }
    });
};
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => {
    var _a;
    const { resetPasswordLink, newPassword } = req.body;
    if (resetPasswordLink) {
        (0, jsonwebtoken_1.verify)(resetPasswordLink, (_a = process.env.JWT_RESET_PASSWORD) !== null && _a !== void 0 ? _a : "", function (err, _decoded) {
            if (err) {
                return res.status(400).json({
                    error: `Expired reset password link error ${err}`,
                });
            }
            Users_1.default.findOne({ resetPasswordLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: `NO user Found ${err}`,
                    });
                }
                const updatePassword = {
                    password: newPassword,
                    resetPasswordLink: "",
                };
                user = (0, lodash_1.extend)(user, updatePassword);
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: `reset password saving ERROR ${err}`,
                        });
                    }
                    res.json({
                        message: `Great ,${result.name} now you can login with new password`,
                    });
                });
            });
        });
    }
};
exports.resetPassword = resetPassword;
const JwtStrategy = passport_jwt_1.default.Strategy;
const passportInit = (passport) => {
    const jwtExtractor = function (req) {
        let token = null;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        else if (req.cookies) {
            token = req.cookies["jwt"];
        }
        return token;
    };
    const options = {
        jwtFromRequest: jwtExtractor,
        secretOrKey: process.env.JWT_SECRET || "",
    };
    passport.use(new JwtStrategy(options, (jwtPayload, done) => {
        Users_1.default.findOne({ _id: jwtPayload._id }).then((currUser) => {
            if (currUser) {
                done(null, currUser);
            }
        });
    }));
};
exports.passportInit = passportInit;
//# sourceMappingURL=authController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = ({ to, subject, text, html }) => new Promise((resolve, reject) => {
    const mailer = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADMIN_EMAIL_ID,
            pass: process.env.ADMIN_EMAIL_PWD,
        },
    });
    const mailOptions = {
        from: process.env.ADMIN_EMAIL_ID,
        to,
        subject,
        text,
        html,
    };
    mailer.sendMail(mailOptions, (err, email) => {
        if (err) {
            console.log(err);
            reject(err);
        }
        else {
            resolve({ email });
        }
    });
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=helper.js.map
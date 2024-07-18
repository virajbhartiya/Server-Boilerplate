import { ISendMail } from "../Interfaces/utils/utils.interfaces";

import nodemailer from "nodemailer";

export const sendEmail = ({ to, subject, text, html }: ISendMail) =>
  new Promise((resolve, reject) => {
    const mailer = nodemailer.createTransport({
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
    mailer.sendMail(mailOptions, (err: any, email: { response: any }) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve({ email });
      }
    });
  });

import Users from "../../models/Users";
import { Response, Request } from "express";
import { sign, verify } from "jsonwebtoken";
import { extend } from "lodash";
import { sendEmail } from "../../utils/helper";
import passport_jwt from "passport-jwt";

export const signup = (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    emailId,
    password,
    confirm_password,
    gender,
    mobile_number,
  } = req.body;

  Users.findOne({ emailId: emailId })
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
        confirm_password,
        gender,
        personal_details: { mobile_number: mobile_number },
      });

      newUser
        .save()
        .then((savedUser: any) => {
          const jwtToken = sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET ?? "",
            {
              expiresIn: "100h",
            }
          );

          return res.status(200).json({
            message: "success",
            jwtToken,
            user: savedUser,
          });
        })
        .catch((err: any) => {
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

export const signin = (req: Request, res: Response) => {
  const { emailId, password } = req.body;
  Users.findOne({ emailId })
    .then((user: any) => {
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }

      const jwtToken = sign({ _id: user._id }, process.env.JWT_SECRET ?? "", {
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

export const forgotPassword = (req: Request, res: Response) => {
  const { emailId } = req.body;
  Users.findOne({ emailId })
    .then((user: any) => {
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

      const token = sign(
        {
          _id: user._id,
          name: `${user.first_name} ${user.last_name}`,
        },
        process.env.JWT_RESET_PASSWORD ?? "",
        {
          expiresIn: "10m",
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: emailId,
        subject: `Password reset link`,
        text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      };

      return user.updateOne(
        { resetPasswordLink: token },
        (err: any, _success: any) => {
          if (err) {
            return res.status(400).json({
              error: `datase Connection reset password error ${err}`,
            });
          } else {
            sendEmail(emailData)
              .then((_info: any) => {
                return res.json({
                  message: `Email has been sent to ${emailData.to}. Follow the instruction to activate your account`,
                });
              })
              .catch((err: any) => {
                return res.json({
                  message: err,
                });
              });
          }
        }
      );
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

export const resetPassword = (req: Request, res: Response) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD ?? "",
      function (err: any, _decoded: any) {
        if (err) {
          return res.status(400).json({
            error: `Expired reset password link error ${err}`,
          });
        }
        Users.findOne({ resetPasswordLink }, (err: any, user: any) => {
          if (err || !user) {
            return res.status(400).json({
              error: `NO user Found ${err}`,
            });
          }
          const updatePassword = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = extend(user, updatePassword);
          user.save((err: any, result: { name: any }) => {
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
      }
    );
  }
};

const JwtStrategy = passport_jwt.Strategy;

export const passportInit = (passport: any) => {
  const jwtExtractor = function (req: Request) {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.cookies) {
      token = req.cookies["jwt"];
    }
    return token;
  };

  const options = {
    jwtFromRequest: jwtExtractor,
    secretOrKey: process.env.JWT_SECRET || "",
  };

  passport.use(
    new JwtStrategy(
      options,
      (jwtPayload: { _id: any }, done: (arg0: null, arg1: any) => void) => {
        Users.findOne({ _id: jwtPayload._id }).then((currUser: any) => {
          if (currUser) {
            done(null, currUser);
          }
        });
      }
    )
  );
};

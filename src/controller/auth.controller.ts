import Users from "../models/user.model";
import { Response, Request } from "express";
import { sign } from "jsonwebtoken";
import passport_jwt from "passport-jwt";

export const signup = (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    confirmPassword,
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
        firstName,
        lastName,
        emailId,
        password,
        confirmPassword,
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

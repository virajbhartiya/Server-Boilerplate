import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import globalErrorHandler from "./controller/globalErrorController";
import { passportInit } from "./controller/authentication/authController";
import http from "http";
import dotenv from "dotenv";
import { routes } from "./routes";
import path from "path";

const app = express();
dotenv.config();

const protocol = http.createServer(app);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(() => console.log("connected"))
  .catch((err: any) => console.log("Couldn't connect to Mongodb", err));

mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.REACT_APP_BASE_URL
      ? [process.env.REACT_APP_BASE_URL]
      : true,
  })
);

app.use(cookieParser());

app.use(compression());

app.use(passport.initialize());
passportInit(passport);

routes(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/../client/build", "index.html"));
  });
}

app.use(globalErrorHandler);

const port = process.env.PORT;
protocol.listen(port, () => {
  console.log(`Api is running on port ${port} - ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("Unhandled Rejection!");
  console.log(err.name, err.message);
});

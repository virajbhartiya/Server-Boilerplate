import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import globalErrorHandler from "./controller/utils/globalErrorController";
import { passportInit } from "./controller/auth.controller";
import { routes } from "./routes/index.route";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI || "";
const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err: Error) => console.error("Couldn't connect to MongoDB", err));

// Set mongoose to use global promises
mongoose.Promise = global.Promise;

// Middleware setup
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: reactAppBaseUrl ? [reactAppBaseUrl] : true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(passport.initialize());
passportInit(passport);

// Routes
routes(app);

// Global error handler
app.use(
  globalErrorHandler as unknown as (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

// Start the server
server.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

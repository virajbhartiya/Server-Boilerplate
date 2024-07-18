"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const globalErrorController_1 = __importDefault(require("./controller/utils/globalErrorController"));
const auth_controller_1 = require("./controller/auth.controller");
const index_route_1 = require("./routes/index.route");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI || "";
const reactAppBaseUrl = process.env.REACT_APP_BASE_URL;
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});
// Connect to MongoDB
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("Couldn't connect to MongoDB", err));
// Set mongoose to use global promises
mongoose_1.default.Promise = global.Promise;
// Middleware setup
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: reactAppBaseUrl ? [reactAppBaseUrl] : true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(passport_1.default.initialize());
(0, auth_controller_1.passportInit)(passport_1.default);
// Routes
(0, index_route_1.routes)(app);
// Global error handler
app.use(globalErrorController_1.default);
// Start the server
server.listen(port, () => {
    console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=App.js.map
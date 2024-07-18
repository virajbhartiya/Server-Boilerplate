"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendErrorDev = (err, req, res) => {
    if (!!req.originalUrl) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    throw err.message;
};
exports.default = (err, req, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    sendErrorDev(err, req, res);
};
//# sourceMappingURL=globalErrorController.js.map
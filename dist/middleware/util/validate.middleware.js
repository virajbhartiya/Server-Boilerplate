"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidation = void 0;
const { validationResult } = require("express-validator");
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    next();
};
exports.runValidation = runValidation;
//# sourceMappingURL=validate.middleware.js.map
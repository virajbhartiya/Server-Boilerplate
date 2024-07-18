"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidation = void 0;
const express_validator_1 = require("express-validator");
const runValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }
    next();
};
exports.runValidation = runValidation;
//# sourceMappingURL=index.validator.js.map
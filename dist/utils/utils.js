"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDiff = exports.filterObj = exports.catchAsync = exports.setStringType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
// model schema
const setStringType = (maxLength) => ({
    type: String,
    maxlength: maxLength,
    trim: true,
});
exports.setStringType = setStringType;
// Global Error handling
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
// helps you allow object
const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
exports.filterObj = filterObj;
const findDiff = (prev, update) => {
    let added = [];
    let removed = [];
    if (prev) {
        added = update
            .filter((item) => !prev.includes(item))
            .map((item) => String(item)); //Sanitize
        removed = prev
            .filter((item) => !update.includes(item))
            .map((item) => String(item)); //Sanitize
    }
    else
        added = update.map((item) => String(item)); //Sanitize
    return [added, removed];
};
exports.findDiff = findDiff;
//# sourceMappingURL=utils.js.map
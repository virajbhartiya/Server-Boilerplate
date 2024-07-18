"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const utils_1 = require("../utils/utils");
const Users_1 = __importDefault(require("../models/Users"));
// TODO: update me
const updateHelper = (document, req) => {
    console.log(req);
    return document;
};
const updateUser = () => (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Users_1.default.findById(req.params.id);
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    let document = updateHelper(doc, req);
    if (!document)
        return next(new appError_1.default("could not udpate the database", 407));
    const finaldoc = yield document.save();
    res.status(200).json({
        status: "success",
        data: finaldoc,
    });
}));
exports.updateUser = updateUser;
//# sourceMappingURL=userController.js.map
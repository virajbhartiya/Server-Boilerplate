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
exports.deleteOne = exports.getAll = exports.getOne = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const utils_1 = require("../../utils/utils");
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const getOne = (Model, popOptions) => (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = { _id: req.params.id };
    let query = Model.find(filter);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = yield query;
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: doc,
    });
}));
exports.getOne = getOne;
const getAll = (Model) => (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    const features = new apiFeatures_1.default(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = yield features.query;
    res.status(200).json({
        status: "success",
        results: doc.length,
        data: doc,
    });
}));
exports.getAll = getAll;
const deleteOne = (Model) => (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.deleteOne = deleteOne;
//# sourceMappingURL=handlerFactory.js.map
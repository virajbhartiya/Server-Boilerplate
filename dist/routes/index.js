"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const Auth_1 = __importDefault(require("./Auth"));
const User_1 = __importDefault(require("./User"));
const passport_1 = __importDefault(require("passport"));
const routes = (app) => {
    app.use("/api/auth", Auth_1.default);
    app.use("/api/users", passport_1.default.authenticate("jwt", { session: false }), User_1.default);
};
exports.routes = routes;
//# sourceMappingURL=index.js.map
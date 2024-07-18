"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const passport_1 = __importDefault(require("passport"));
const routes = (app) => {
    app.use("/api/auth", auth_route_1.default);
    app.use("/api/users", passport_1.default.authenticate("jwt", { session: false }), user_route_1.default);
};
exports.routes = routes;
//# sourceMappingURL=index.route.js.map
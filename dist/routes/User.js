"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handlerFactory_1 = require("../controller/handlerFactory");
const userController_1 = require("../controller/authentication/userController");
const Users_1 = __importDefault(require("../models/Users"));
const userController_2 = require("../controller/userController");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const router = (0, express_1.Router)();
router.route("/").get((0, handlerFactory_1.getAll)(Users_1.default));
router.get("/me", userController_1.getUser);
router
    .route("/:id")
    .get((0, handlerFactory_1.getOne)(Users_1.default))
    .patch(authenticationMiddleware_1.isOwner, userController_2.updateUser)
    .delete(authenticationMiddleware_1.isOwner, (0, handlerFactory_1.deleteOne)(Users_1.default));
exports.default = router;
//# sourceMappingURL=User.js.map
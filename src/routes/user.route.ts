import { Router } from "express";
import { getAll, getOne, deleteOne } from "../controller/utils/handlerFactory";
import Users from "../models/user.model";
import { updateUser } from "../controller/user.controller";
import { isOwner, restrictTo } from "../middleware/util/auth.middleware";

const router = Router();

router.route("/").get(getAll(Users));

router
  .route("/:id")
  .get(getOne(Users))
  .patch(isOwner, updateUser)
  .delete(isOwner, deleteOne(Users));

export default router;

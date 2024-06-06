import { Router } from "express";
import { getAll, getOne, deleteOne } from "../controller/handlerFactory";
import { getUser } from "../controller/authentication/userController";
import Users from "../models/Users";
import { updateUser } from "../controller/userController";
import { isOwner, restrictTo } from "../middleware/authenticationMiddleware";

const router = Router();

router.route("/").get(getAll(Users));
router.get("/me", getUser);

router
  .route("/:id")
  .get(getOne(Users))
  .patch(isOwner, updateUser)
  .delete(isOwner, deleteOne(Users));

export default router;

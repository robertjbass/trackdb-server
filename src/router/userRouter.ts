import { Router } from "express";
import {
  createUser,
  getUsers,
  userLogin,
  userLogout,
} from "../repository/user";
import { isAuthenticated } from "../middleware/auth";
import { Role } from "../db/schema";

const userRouter = Router();

userRouter.get("/all", isAuthenticated([Role.Admin]), getUsers);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout);
userRouter.post(
  "/",
  isAuthenticated([
    // todo - uncomment after creating client
    // Role.Admin
  ]),
  createUser
);

export default userRouter;

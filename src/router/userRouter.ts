import express from "express";
import {
  createUser,
  getUsers,
  userLogin,
  userLogout,
} from "../repository/user";
import { isAuthenticated } from "../middleware/auth";
import { Role } from "../db/schema";

const userRouter = express.Router();

userRouter.get("/all", isAuthenticated([Role.Admin]), getUsers);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout);
userRouter.post(
  "/",
  isAuthenticated([
    /* Role.Admin // uncomment after building client */
  ]),
  createUser
);

export default userRouter;

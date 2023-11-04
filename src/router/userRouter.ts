import { Router } from 'express';
import { createUser, getUsers, userLogin, userLogout } from '@/repository/user';
import { isAuthenticated } from '@/middleware/auth';
import { Role } from '@/db/schema';

const userRouter = Router();

enum UserRoutes {
  LOGIN = '/login',
  LOGOUT = '/logout',
  ALL = '/all',
  ROOT = '/',
}

userRouter.get(UserRoutes.ALL, isAuthenticated([Role.Admin]), getUsers);
userRouter.post(UserRoutes.LOGIN, userLogin);
userRouter.post(UserRoutes.LOGOUT, userLogout);
userRouter.post(
  UserRoutes.ROOT,
  isAuthenticated([
    // TODO - uncomment after creating client
    // Role.Admin
  ]),
  createUser,
);

export default userRouter;

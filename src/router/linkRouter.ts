import { Router } from 'express';
import { createLink, getLinks } from '@/repository/link';
import { isAuthenticated } from '@/middleware/auth';
import { Role } from '@/db/schema';

const linkRouter = Router();

enum LinkRoutes {
  ALL = '/all',
  ROOT = '/',
}

linkRouter.get(
  LinkRoutes.ALL,
  isAuthenticated([Role.Admin, Role.User]),
  getLinks,
);

linkRouter.post(
  LinkRoutes.ROOT,
  isAuthenticated([Role.Admin, Role.User]),
  createLink,
);

export default linkRouter;

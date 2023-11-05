import { Router } from 'express';
import { createItem, getItems } from '@/repository/item';
import { isAuthenticated } from '@/middleware/auth';
import { Role } from '@/db/schema';

const itemRouter = Router();

enum ItemRoutes {
  ALL = '/all',
  ROOT = '/',
}

itemRouter.get(
  ItemRoutes.ALL,
  isAuthenticated([Role.Admin, Role.User]),
  getItems,
);

itemRouter.post(
  ItemRoutes.ROOT,
  isAuthenticated([Role.Admin, Role.User]),
  createItem,
);

export default itemRouter;

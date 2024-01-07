import { Router } from 'express';
import { createCategory, getCategories } from '@/repository/category';
import { isAuthenticated } from '@/middleware/auth';
import { Role } from '@/db/schema';

const categoryRouter = Router();

enum ItemRoutes {
  ALL = '/all',
  ROOT = '/',
}

categoryRouter.get(
  ItemRoutes.ALL,
  isAuthenticated([Role.Admin, Role.User]),
  getCategories,
);

categoryRouter.post(
  ItemRoutes.ROOT,
  isAuthenticated([Role.Admin, Role.User]),
  createCategory,
);

export default categoryRouter;

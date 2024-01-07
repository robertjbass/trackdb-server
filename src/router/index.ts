import { Express } from 'express';
import rootRouter from '@/router/rootRouter';
import userRouter from '@/router/userRouter';
import categoryRouter from '@/router/categoryRouter';
import linkRouter from '@/router/linkRouter';

enum Routes {
  USER = '/user',
  CATEGORY = '/category',
  LINK = '/link',
  ROOT = '/',
}

export const initRoutes = (app: Express) => {
  app.use(Routes.USER, userRouter);
  app.use(Routes.CATEGORY, categoryRouter);
  app.use(Routes.LINK, linkRouter);
  app.use(Routes.ROOT, rootRouter);
};

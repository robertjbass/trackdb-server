import { Express } from 'express';
import rootRouter from '@/router/rootRouter';
import userRouter from '@/router/userRouter';
import itemRouter from '@/router/itemRouter';
import logRouter from '@/router/logRouter';

enum Routes {
  USER = '/user',
  ITEM = '/item',
  LOG = '/log',
  ROOT = '/',
}

export const initRoutes = (app: Express) => {
  app.use(Routes.USER, userRouter);
  app.use(Routes.ITEM, itemRouter);
  app.use(Routes.LOG, logRouter);
  app.use(Routes.ROOT, rootRouter);
};

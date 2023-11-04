import { Express } from 'express';
import userRouter from '@/router/userRouter';
import rootRouter from '@/router/rootRouter';

enum Routes {
  USER = '/user',
  ROOT = '/',
}

export const initRoutes = (app: Express) => {
  app.use(Routes.USER, userRouter);
  app.get(Routes.ROOT, rootRouter);
};

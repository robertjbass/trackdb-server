import { Router } from 'express';

const userRouter = Router();

enum RootRoutes {
  ROOT = '/',
}

userRouter.get(RootRoutes.ROOT, async (_req, res) => res.send('Root Handler'));

export default userRouter;

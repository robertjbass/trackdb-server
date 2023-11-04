import { HttpStatus } from '@/types/httpStatus.enum';
import { Request, Response, Router } from 'express';

const userRouter = Router();

enum RootRoutes {
  ROOT = '/',
}

const handleRoot = async (_req: Request, res: Response) => {
  const html = `<h1>Root Handler</h1>`;
  res.status(HttpStatus.OK).send(html);
};

userRouter.get(RootRoutes.ROOT, handleRoot);

export default userRouter;

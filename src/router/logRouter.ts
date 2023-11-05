import { Router } from 'express';
import { createLog, getLogs } from '@/repository/log';
import { isAuthenticated } from '@/middleware/auth';
import { Role } from '@/db/schema';

const logRouter = Router();

enum LogRoutes {
  ALL = '/all',
  ROOT = '/',
}

logRouter.get(LogRoutes.ALL, isAuthenticated([Role.Admin, Role.User]), getLogs);

logRouter.post(
  LogRoutes.ROOT,
  isAuthenticated([Role.Admin, Role.User]),
  createLog,
);

export default logRouter;

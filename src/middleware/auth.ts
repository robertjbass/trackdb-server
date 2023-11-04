import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { Role } from '../db/schema';
import { HttpStatus } from '../types/httpStatus.enum';

export const expressSession = session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
});

export const isAuthenticated =
  (roles: Role[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = req.session.user;
    const roleIsRequired = roles.length > 0;
    const isValidRole = roles.includes(sessionUser?.role);

    const userSessionIsValid = sessionUser?.id;
    const userRoleIsValid = roleIsRequired ? isValidRole : true;

    if (userSessionIsValid && userRoleIsValid) {
      next();
      return;
    }

    res.status(HttpStatus.UNAUTHORIZED).send();
  };

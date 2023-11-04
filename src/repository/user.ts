import { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { user } from '../db/schema';
import { HttpStatus } from '../types/httpStatus.enum';
import bcrypt from 'bcrypt';

const getUserByEmail = async (email: string) => {
  const result = await db
    .select({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(eq(user.email, email));

  return result;
};

export const getUsers = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user);

  if (!users) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  res.status(HttpStatus.OK).json(users);
};

export const userLogin = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { email, password } = req.body;

  const result = await db
    .select({
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    .from(user)
    .where(eq(user.email, email));

  if (result.length !== 1) {
    throw new Error('User not found');
  }

  const dbUser = result[0];
  if (!dbUser.password || !dbUser?.id) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

  if (!isPasswordCorrect) {
    res.status(HttpStatus.UNAUTHORIZED).send();
    return;
  }

  const { password: _password, ...userWithoutPassword } = dbUser;
  req.session.user = userWithoutPassword;

  const fetchedUsers = await getUserByEmail(email);
  if (fetchedUsers.length !== 1) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  res.status(HttpStatus.OK).json({ message: 'Success', user: fetchedUsers[0] });
};

export const userLogout = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }
    res.status(HttpStatus.OK).send('Logged out');
  });
};

export const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.body.password) {
    throw new Error('Password is required');
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  try {
    await db.insert(user).values({ ...req.body, password: hashedPassword });

    const createdUser = await getUserByEmail(req.body.email);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Success', user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};

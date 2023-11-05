import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { User, user } from '@/db/schema';
import { HttpStatus } from '@/types/httpStatus.enum';
import bcrypt from 'bcrypt';

const userWithoutPasswordSchema = {
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
};

const userWithPasswordSchema = {
  ...userWithoutPasswordSchema,
  password: user.password,
};

const getUserByEmail = async (
  email: string,
): Promise<Partial<User>[] | void> => {
  try {
    const result = await db
      .select(userWithoutPasswordSchema)
      .from(user)
      .where(eq(user.email, email));

    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.select(userWithoutPasswordSchema).from(user);

    if (!users) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).json(users);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await db
    .select(userWithPasswordSchema)
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
  if (!fetchedUsers || fetchedUsers.length !== 1) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const fetchedUser = fetchedUsers[0];

  res.status(HttpStatus.OK).json({ user: fetchedUser });
};

export const userLogout = async (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      return;
    }
    res.status(HttpStatus.OK).send('Logged out');
  });
};

export const createUser = async (req: Request, res: Response) => {
  if (!req.body.password) {
    throw new Error('Password is required');
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  try {
    // todo
    // await db.insert(users).values({ name: 'Dan' }).returning();
    // partial return
    // await db.insert(users).values({ name: 'Partial Dan' }).returning({ insertedId: users.id });

    await db.insert(user).values({ ...req.body, password: hashedPassword });

    const createdUsers = await getUserByEmail(req.body.email);

    if (!createdUsers || createdUsers.length !== 1) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    const createdUser = createdUsers[0];

    res.status(HttpStatus.CREATED).json({ user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

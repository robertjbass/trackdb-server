import { eq } from "drizzle-orm";
import { db } from "../";
import { user } from "../schema";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

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
  _next: NextFunction
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
    res.status(404).send("Users not found");
    return;
  }

  res.status(200).json(users);
};

export const logUserIn = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  const result = await db
    .select({
      id: user.id,
      email: user.email,
      password: user.password,
    })
    .from(user)
    .where(eq(user.email, email));

  if (result.length !== 1) {
    throw new Error("User not found");
  }

  const hashedPassword = result[0].password;

  if (!hashedPassword) {
    res.status(404).send("User password hash not found");
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    res.status(401).send("Unauthorized");
    return;
  }

  const fetchedUser = await getUserByEmail(email);
  if (fetchedUser.length !== 1) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).json({ message: "Success", user: fetchedUser[0] });
};

export const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.body.password) {
    throw new Error("Password is required");
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  try {
    await db.insert(user).values({ ...req.body, password: hashedPassword });

    const createdUser = await getUserByEmail(req.body.email);
    res.status(201).json({ message: "Success", user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

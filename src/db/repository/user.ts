import { db } from "../";
import { NewUser, user } from "../schema";

export const createUser = async (newUser: NewUser) => {
  const result = await db.insert(user).values(newUser);
  console.log(result);
};

export const getUsers = async () => {
  const result = await db.query.user.findMany();
  return result;
};

import { db } from '@/db';
import { NewCategory, category } from '@/db/schema';
import { HttpStatus } from '@/types/httpStatus.enum';
import { asc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';

const categorySchema = {
  id: category.id,
  name: category.name,
};

export const createCategory = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;

  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const name = req.body.name.toLowerCase().trim();

  if (!name) {
    res.status(HttpStatus.BAD_REQUEST).send();
    return;
  }

  try {
    const newCagtegory: NewCategory = { name, userId };
    await db.insert(category).values(newCagtegory);
    res.status(HttpStatus.CREATED).send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;

  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  try {
    const categories = await db
      .select(categorySchema)
      .from(category)
      .where(eq(category.userId, userId))
      .orderBy(asc(category.weight))
      .execute();

    if (!categories) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).json(categories);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

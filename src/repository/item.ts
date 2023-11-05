import { db } from '@/db';
import { NewItem, item } from '@/db/schema';
import { HttpStatus } from '@/types/httpStatus.enum';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

const itemSchema = {
  id: item.id,
  name: item.name,
  unit: item.unit,
};

export const createItem = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;

  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const name = req.body.name.toLowerCase().trim();
  const unit = req.body.unit.toLowerCase().trim();

  if (!name || !unit) {
    res.status(HttpStatus.BAD_REQUEST).send();
    return;
  }

  try {
    const newItem: NewItem = { name, unit, userId };
    await db.insert(item).values(newItem);
    res.status(HttpStatus.CREATED).send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getItems = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;

  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  try {
    const items = await db
      .select(itemSchema)
      .from(item)
      .where(eq(item.userId, userId))
      .execute();

    if (!items) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).json(items);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

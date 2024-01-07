import { db } from '@/db';
import { NewLink, category, link } from '@/db/schema';
import { HttpStatus } from '@/types/httpStatus.enum';
import { eq, asc } from 'drizzle-orm';
import { Request, Response } from 'express';

const linkSchema = {
  linkId: link.id,
  categoryId: category.id,
  url: link.url,
  itemName: category.name,
};

export const createLink = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const url = req.body.url;
  const categoryId = Number(req.body.categoryId);

  if (!url || !categoryId || isNaN(categoryId)) {
    res.status(HttpStatus.BAD_REQUEST).send();
    return;
  }

  try {
    const newLink: NewLink = { url, userId, categoryId };
    await db.insert(link).values(newLink);
    res.status(HttpStatus.CREATED).send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getLinks = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  try {
    const links = await db
      .select(linkSchema)
      .from(link)
      .leftJoin(category, eq(link.categoryId, category.id))
      .where(eq(link.userId, userId))
      .orderBy(asc(link.weight))
      .execute();

    if (!links) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).json(links);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

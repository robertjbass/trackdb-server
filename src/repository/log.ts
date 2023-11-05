import { db } from '@/db';
import { NewLog, item, log } from '@/db/schema';
import { HttpStatus } from '@/types/httpStatus.enum';
import { eq, asc } from 'drizzle-orm';
import { Request, Response } from 'express';

const itemLogSchema = {
  logId: log.id,
  itemId: item.id,
  quantity: log.quantity,
  logTime: log.logTime,
  itemName: item.name,
  itemUnit: item.unit,
};

export const createLog = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  const quantity = Number(req.body.quantity);
  const itemId = Number(req.body.itemId);

  if (!quantity || !itemId || isNaN(quantity) || isNaN(itemId)) {
    res.status(HttpStatus.BAD_REQUEST).send();
    return;
  }

  try {
    const newLog: NewLog = { quantity, userId, itemId };
    await db.insert(log).values(newLog);
    res.status(HttpStatus.CREATED).send();
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getLogs = async (req: Request, res: Response) => {
  const userId = req.session.user?.id;
  if (!userId) {
    res.status(HttpStatus.NOT_FOUND).send();
    return;
  }

  try {
    const logs = await db
      .select(itemLogSchema)
      .from(log)
      .leftJoin(item, eq(log.itemId, item.id))
      .where(eq(log.userId, userId))
      .orderBy(asc(log.logTime))
      .execute();

    if (!logs) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).json(logs);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

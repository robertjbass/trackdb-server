import { relations } from 'drizzle-orm';
import { serial, text, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';

//* USER
export enum Role {
  Admin = 'admin',
  User = 'user',
}

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  role: text('role')
    .$type<Role.Admin | Role.User>()
    .notNull()
    .default(Role.User),
  createdAt: timestamp('created_at').$default(() => new Date()),
  updatedAt: timestamp('updated_at').$default(() => new Date()),
});

export const usersRelations = relations(user, ({ many }) => ({
  items: many(item),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

//* ITEM
export const item = pgTable('item', {
  id: serial('id').primaryKey(),
  name: text('name'),
  unit: text('unit'),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
});

export const itemsRelations = relations(item, ({ one }) => ({
  user: one(user, {
    fields: [item.userId],
    references: [user.id],
  }),
}));

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

//* LOG
export const log = pgTable('log', {
  id: serial('id').primaryKey(),
  quantity: integer('quantity'),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  itemId: integer('item_id')
    .references(() => item.id)
    .notNull(),
  logTime: timestamp('log_time').defaultNow(),
});

export const logRelations = relations(log, ({ one }) => ({
  user: one(user, {
    fields: [log.userId],
    references: [user.id],
  }),
  item: one(item, {
    fields: [log.itemId],
    references: [item.id],
  }),
}));

export type Log = typeof log.$inferSelect;
export type NewLog = typeof log.$inferInsert;

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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
  categories: many(category),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

//* CATEGORY
export const category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: text('name'),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  weight: integer('weight').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoryRelations = relations(category, ({ one }) => ({
  user: one(user, {
    fields: [category.userId],
    references: [user.id],
  }),
}));

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

//* LINK
export const link = pgTable('link', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  categoryId: integer('category_id')
    .references(() => category.id)
    .notNull(),
  weight: integer('weight').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const linkRelations = relations(link, ({ one }) => ({
  user: one(user, {
    fields: [link.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [link.categoryId],
    references: [category.id],
  }),
}));

export type Link = typeof link.$inferSelect;
export type NewLink = typeof link.$inferInsert;

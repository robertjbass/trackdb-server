import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export enum Role {
  Admin = "admin",
  User = "user",
}

export const user = pgTable("user", {
  id: serial("id"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: text("role")
    .$type<Role.Admin | Role.User>()
    .notNull()
    .default(Role.User),
  createdAt: timestamp("created_at").$default(() => new Date()),
  updatedAt: timestamp("updated_at").$default(() => new Date()),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";

export const userRoles = ["admin", "user", "superAdmin"] as const;
export type UserRoles = (typeof userRoles)[number];
export const UserRoleEnum = pgEnum("role", userRoles);

export const UserTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull(),
  imageUrl: text().notNull(),
  role: UserRoleEnum().notNull().default("user"),
  clerkId: text().notNull().unique(),

  createdAt,
  updatedAt,
});

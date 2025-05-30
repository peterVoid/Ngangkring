import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().defaultRandom().primaryKey();
export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

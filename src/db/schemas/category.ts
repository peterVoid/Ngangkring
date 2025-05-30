import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { ProductTable } from "./product";

export const CategoryTable = pgTable("categories", {
  id,
  name: text().notNull(),
  createdAt,
  updatedAt,
});

export const CategoryRelations = relations(CategoryTable, ({ many }) => ({
  product: many(ProductTable),
}));

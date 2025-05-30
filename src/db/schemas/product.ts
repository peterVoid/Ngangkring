import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CategoryTable } from "./category";
import { relations } from "drizzle-orm";
import { OrderItemTable } from "./orderItem";

export const ProductTable = pgTable("products", {
  id,
  name: text().notNull(),
  price: integer().notNull(),
  stock: integer().default(0),
  imageUrl: text().notNull(),
  categoryId: uuid()
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const ProductRelations = relations(ProductTable, ({ one, many }) => ({
  category: one(CategoryTable, {
    fields: [ProductTable.categoryId],
    references: [CategoryTable.id],
  }),
  orderItem: many(OrderItemTable),
}));

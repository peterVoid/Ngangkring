import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrderTable } from "./order";
import { ProductTable } from "./product";
import { relations } from "drizzle-orm";

export const OrderItemTable = pgTable("order_items", {
  id,
  orderId: uuid()
    .notNull()
    .references(() => OrderTable.id, { onDelete: "cascade" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "cascade" }),
  quantity: integer().notNull(),
  createdAt,
  updatedAt,
});

export const OrderItemRelations = relations(OrderItemTable, ({ one }) => ({
  order: one(OrderTable, {
    fields: [OrderItemTable.orderId],
    references: [OrderTable.id],
  }),
  product: one(ProductTable, {
    fields: [OrderItemTable.productId],
    references: [ProductTable.id],
  }),
}));

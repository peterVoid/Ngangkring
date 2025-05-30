import { integer, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { OrderItemTable } from "./orderItem";

export const OrderStatues = [
  "pending",
  "diterima",
  "diproses",
  "selesai",
] as const;
export type orderStatus = (typeof OrderStatues)[number];
export const orderStatusEnum = pgEnum("order_status", OrderStatues);

export const OrderTable = pgTable("orders", {
  id,
  noTable: integer().notNull(),
  status: orderStatusEnum().notNull().default("pending"),
  createdAt,
  updatedAt,
});

export const OrderRelations = relations(OrderTable, ({ many }) => ({
  orderItem: many(OrderItemTable),
}));

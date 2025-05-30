import { db } from "@/db";
import {
  OrderItemTable,
  orderStatus,
  OrderTable,
  ProductTable,
} from "@/db/schema";
import { revalidateProductTagCache } from "@/features/products/db/cache";
import { supabase } from "@/lib/supabaseClient";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { revalidateOrderTagCache } from "./cache";

export async function insertOrder(
  noTable: number,
  data: { productId: string; quantity: number }[],
) {
  const [newOrder] = await db
    .insert(OrderTable)
    .values({ noTable })
    .returning();

  if (newOrder == null) throw new Error("Something went wrong");

  const orderItems = await Promise.all(
    data.map(async (d) => {
      const [product] = await db
        .select({ stock: ProductTable.stock })
        .from(ProductTable)
        .where(eq(ProductTable.id, d.productId));

      if (!product) throw new Error(`Product ${d.productId} not found`);

      const newStock = product.stock! - d.quantity;
      if (newStock < 0)
        throw new Error(`Insufficient stock for product ${d.productId}`);

      await db
        .update(ProductTable)
        .set({ stock: newStock })
        .where(eq(ProductTable.id, d.productId));

      const [orderItem] = await db
        .insert(OrderItemTable)
        .values({
          orderId: newOrder.id,
          productId: d.productId,
          quantity: d.quantity,
        })
        .returning({
          orderId: OrderItemTable.orderId,
          productId: OrderItemTable.productId,
          quantity: OrderItemTable.quantity,
        });

      const [getProduct] = await db
        .select({
          name: ProductTable.name,
          price: ProductTable.price,
        })
        .from(ProductTable)
        .where(eq(ProductTable.id, orderItem.productId));

      return {
        ...orderItem,
        product: {
          ...getProduct,
        },
      };
    }),
  );

  await supabase.channel("orders-channel").send({
    type: "broadcast",
    event: "new-order",
    payload: {
      order: {
        id: newOrder.id,
        noTable: newOrder.noTable,
        status: newOrder.status,
        orderItem: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          product: {
            name: i.product.name,
            price: i.product.price,
          },
        })),
      },
    },
  });

  orderItems.flat().forEach(({ orderId, productId }) => {
    revalidateOrderTagCache({ id: orderId });
    revalidateProductTagCache({ id: productId });
  });

  return newOrder;
}

export async function updateStatusOrder(id: string, newStatus: string) {
  const [updatedStatusOrder] = await db
    .update(OrderTable)
    .set({ status: newStatus as orderStatus })
    .where(eq(OrderTable.id, id))
    .returning();

  if (updatedStatusOrder == null) throw new Error("Something went wrong");

  await supabase.channel("orders-status-channel").send({
    type: "broadcast",
    event: "new-status",
    payload: updatedStatusOrder,
  });

  revalidateOrderTagCache({ id: updatedStatusOrder.id });
  revalidateTag("customer_orders");

  return updatedStatusOrder;
}

export async function deleteOrder(id: string) {
  const [getOrder] = await db
    .select()
    .from(OrderTable)
    .where(and(eq(OrderTable.id, id), eq(OrderTable.status, "selesai")));

  if (getOrder == null) throw new Error("Something went wrong");

  const [deletedOrder] = await db
    .delete(OrderTable)
    .where(eq(OrderTable.id, id))
    .returning();

  return deletedOrder;
}

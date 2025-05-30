"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  insertOrder as insertOrderDB,
  updateStatusOrder as updateStatusOrderDB,
  deleteOrder as deleteOrderDB,
} from "../db/orders";
import { canDeleteOrder, canUpdateStatusOrder } from "../permissions/orders";

export async function insertOrder(
  noTable: number,
  data: { productId: string; quantity: number }[],
) {
  if (!noTable || data.length === 0) {
    return { error: true, message: "Something went wrong" };
  }

  const newOrder = await insertOrderDB(noTable, data);

  return { error: false, message: "Order Placed", orderId: newOrder.id };
}

export async function updateStatusOrder(id: string, newStatus: string) {
  const { role } = await getCurrentUser();

  if (!canUpdateStatusOrder({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await updateStatusOrderDB(id, newStatus);

  return { error: false, message: "Successfully updated order status" };
}

export async function deleteOrder(id: string) {
  const { role } = await getCurrentUser();

  if (!canDeleteOrder({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await deleteOrderDB(id);

  return { error: false, message: "Successfully deleted order" };
}

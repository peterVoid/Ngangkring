import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalOrderTag() {
  return getGlobalTag("ORDERS");
}

export function getOrderIdTag(id: string) {
  return getIdTag(id, "ORDERS");
}

export function revalidateOrderTagCache({ id }: { id: string }) {
  revalidateTag(getGlobalOrderTag());
  revalidateTag(getOrderIdTag(id));
}

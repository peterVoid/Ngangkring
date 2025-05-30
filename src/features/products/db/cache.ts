import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalProductTag() {
  return getGlobalTag("PRODUCTS");
}

export function getProductIdTag(id: string) {
  return getIdTag(id, "PRODUCTS");
}

export function revalidateProductTagCache({ id }: { id: string }) {
  revalidateTag(getGlobalProductTag());
  revalidateTag(getProductIdTag(id));
}

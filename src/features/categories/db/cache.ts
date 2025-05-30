import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalCategoryTag() {
  return getGlobalTag("CATEGORIES");
}

export function getCategoryIdTag(id: string) {
  return getIdTag(id, "CATEGORIES");
}

export function revalidateCategoriesTagCache(id: string) {
  revalidateTag(getGlobalCategoryTag());
  revalidateTag(getCategoryIdTag(id));
}

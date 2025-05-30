import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getGlobalUserTag() {
  return getGlobalTag("USERS");
}

export function getUserIdTag(id: string) {
  return getIdTag(id, "USERS");
}

export function revalidateUserTagCache(id: string) {
  revalidateTag(getGlobalUserTag());
  revalidateTag(getUserIdTag(id));
}

"use server";

import { getCurrentUser } from "@/services/clerk";
import { canPromoteUserAsAdmin } from "../permissions/admin-request";
import { promoteUserAsAdmin as promoteUserAsAdminDB } from "../db/admin-request";
import { env } from "@/env/server";

export async function promoteUserAsAdmin({
  id,
  clerkId,
}: {
  id: string;
  clerkId: string;
}) {
  const { userId, role } = await getCurrentUser();

  if (userId == null || !canPromoteUserAsAdmin({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await promoteUserAsAdminDB({ id, clerkId });

  return { error: false, message: "Successfully promote user" };
}

export async function keyIsCorrect(key: string) {
  if (key !== env.ADMIN_KEY) {
    return { error: true, message: "Key is wrong" };
  }

  return { error: false, message: "Yes i did" };
}

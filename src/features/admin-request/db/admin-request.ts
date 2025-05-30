import { db } from "@/db";
import { UserTable } from "@/db/schema";
import { revalidateUserTagCache } from "@/features/users/db/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const client = await clerkClient();

export async function promoteUserAsAdmin({
  id,
  clerkId,
}: {
  id: string;
  clerkId: string;
}) {
  const [updatedUser] = await db
    .update(UserTable)
    .set({ role: "admin" })
    .where(eq(UserTable.id, id))
    .returning();

  client.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      role: "admin",
      userId: id,
    },
  });

  revalidateUserTagCache(updatedUser.id);

  return updatedUser;
}

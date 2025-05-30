import { UserTable } from "@/db/schema";
import { revalidateUserTagCache } from "./cache";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function insertUser(userData: typeof UserTable.$inferInsert) {
  const [insertedUser] = await db
    .insert(UserTable)
    .values(userData)
    .onConflictDoNothing()
    .returning();

  if (insertedUser == null) throw new Error("Something went wrong");

  revalidateUserTagCache(insertedUser.id);

  return insertedUser;
}

export async function updateUser(
  userData: Partial<typeof UserTable.$inferInsert>,
  userId: string,
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(userData)
    .where(eq(UserTable.id, userId))
    .returning();

  if (updatedUser == null) throw new Error("Something went wrong");

  revalidateUserTagCache(updatedUser.id);

  return updatedUser;
}

export async function deleteUser(clerkId: string) {
  const [deletedUser] = await db
    .delete(UserTable)
    .where(eq(UserTable.clerkId, clerkId))
    .returning();

  if (deletedUser == null) throw new Error("Something went wrong");

  revalidateUserTagCache(deletedUser.id);

  return deletedUser;
}

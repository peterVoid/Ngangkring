import { db } from "@/db";
import { UserRoles, UserTable } from "@/db/schema";
import { getUserIdTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId: clerkId, redirectToSignIn, sessionClaims } = await auth();

  return {
    userId: sessionClaims?.userId,
    role: sessionClaims?.role as UserRoles,
    clerkId,
    redirectToSignIn,
    user:
      allData && sessionClaims?.userId
        ? await getUser(sessionClaims.userId)
        : undefined,
  };
}

async function getUser(userId: string) {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
}

export async function syncClerkMetadata({
  userId,
  clerkId,
  role,
}: {
  userId: string;
  clerkId: string;
  role: UserRoles;
}) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      userId,
      role,
    },
  });

  return;
}

import { PageHeader } from "@/components/PageHeader";
import { limit } from "@/constans";
import { db } from "@/db";
import { UserTable } from "@/db/schema";
import { AdminRequestsTable } from "@/features/admin-request/components/AdminRequestsTable";
import { getGlobalUserTag } from "@/features/users/db/cache";
import { desc, eq } from "drizzle-orm";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const metadata: Metadata = {
  title: "Request",
};

export default async function Page() {
  const users = await getAllUsers();

  return (
    <div className="neo-brutalist-page-container">
      <PageHeader
        title="Admin Requests"
        className="border-b-4 border-black pb-3 text-3xl font-black uppercase tracking-tighter"
      />
      <AdminRequestsTable users={users} />
    </div>
  );
}

async function getAllUsers(page?: string) {
  "use cache";
  cacheTag(getGlobalUserTag());

  const offset = (Number(page ?? "1") - 1) * limit;

  const users = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      role: UserTable.role,
      email: UserTable.email,
      clerkId: UserTable.clerkId,
    })
    .from(UserTable)
    .where(eq(UserTable.role, "user"))
    .orderBy(desc(UserTable.name))
    .limit(limit)
    .offset(offset);

  return users;
}

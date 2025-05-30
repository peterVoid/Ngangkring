import { UserRoles } from "@/db/schema";

export function canPromoteUserAsAdmin({ role }: { role: UserRoles }) {
  return role === "superAdmin";
}

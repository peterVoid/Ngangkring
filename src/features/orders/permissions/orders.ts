import { UserRoles } from "@/db/schema";

export function canUpdateStatusOrder({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

export function canDeleteOrder({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

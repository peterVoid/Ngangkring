import { UserRoles } from "@/db/schema";

export function canCreateCategory({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

export function canUpdateCategory({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

export function canDeleteCategory({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

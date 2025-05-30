import { UserRoles } from "@/db/schema";

export function canCreateProduct({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

export function canUpdateProduct({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

export function canDeleteProduct({ role }: { role: UserRoles }) {
  return role === "admin" || role === "superAdmin";
}

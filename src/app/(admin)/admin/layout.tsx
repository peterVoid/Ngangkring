import { getCurrentUser } from "@/services/clerk";
import { ReactNode } from "react";
import LayoutClient from "./layoutClient";

export default async function Layout({ children }: { children: ReactNode }) {
  const { role } = await getCurrentUser();

  return <LayoutClient role={role}>{children}</LayoutClient>;
}

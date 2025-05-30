"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRoles } from "@/db/schema";
import { UserButton } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";

const queryClient = new QueryClient();

export default function LayoutClient({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRoles;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar role={role} />
        {children}
      </div>
    </QueryClientProvider>
  );
}

function Navbar({ role }: { role: UserRoles }) {
  const pathname = usePathname();

  return (
    <header className="z-50 flex items-center justify-between gap-5 border-b-2 border-black bg-white px-8 py-4">
      <div className="flex items-center gap-2">
        <Link href="/">
          <ChevronLeftIcon />
        </Link>
        <Link href="/admin/dashboard">
          <h1 className="text-2xl font-bold tracking-tighter hover:underline md:text-3xl">
            Syukur Kedai
          </h1>
        </Link>
        <Badge>Admin</Badge>
      </div>
      <div className="flex items-center gap-x-3">
        <Button
          variant={pathname === "/admin/dashboard" ? "noShadow" : "default"}
          asChild
          className="bg-white"
        >
          <Link href="/admin/dashboard">Dashboard</Link>
        </Button>
        <Button
          variant={pathname === "/admin/categories" ? "noShadow" : "default"}
          asChild
          className="bg-white"
        >
          <Link href="/admin/categories">Categories</Link>
        </Button>
        <Button
          variant={pathname === "/admin/products" ? "noShadow" : "default"}
          asChild
          className="bg-white"
        >
          <Link href="/admin/products">Products</Link>
        </Button>
        <Button
          variant={pathname === "/admin/orders" ? "noShadow" : "default"}
          asChild
          className="bg-white"
        >
          <Link href="/admin/orders">Orders</Link>
        </Button>
        {role === "superAdmin" && (
          <Button
            variant={pathname === "/admin/request" ? "noShadow" : "default"}
            asChild
            className="bg-white"
          >
            <Link href="/admin/request">Admin request</Link>
          </Button>
        )}
        <Suspense>
          <UserButton />
        </Suspense>
      </div>
    </header>
  );
}

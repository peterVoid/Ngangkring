import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { LayoutCartButtonClient } from "./LayoutCardButtonClient";
import { getCurrentUser } from "@/services/clerk";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <Navbar />
      {children}
    </Suspense>
  );
}

async function Navbar() {
  const { role } = await getCurrentUser();

  return (
    <header className="z-50 flex items-center justify-between gap-5 border-b-2 border-black bg-white px-8 py-4">
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-tighter hover:underline md:text-4xl">
          Syukur Kedai
        </h1>
      </Link>
      <div className="flex items-center gap-x-3">
        {role === "superAdmin" || role === "admin" ? (
          <Button variant="default" asChild className="md: h-9 bg-white px-3">
            <Link href="/admin/dashboard">Admin</Link>
          </Button>
        ) : null}
        <Button variant="default" asChild className="h-9 bg-white px-3">
          <Link href="/history">Riwayat Pembelian</Link>
        </Button>
        <LayoutCartButtonClient />
      </div>
    </header>
  );
}

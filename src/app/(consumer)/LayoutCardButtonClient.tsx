"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

export function LayoutCartButtonClient() {
  const { state } = useCart();

  return (
    <Button variant="default" className="relative h-9 bg-white px-3">
      <Link href="/my-cart">
        <p className="absolute -right-1 -top-2 rounded-full bg-black px-1 text-xs text-white">
          {state.items.length}
        </p>
        <ShoppingCartIcon />
      </Link>
    </Button>
  );
}

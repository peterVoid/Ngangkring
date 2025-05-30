"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { ShoppingCartIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

export function CartButton({
  product,
  ...props
}: ComponentPropsWithoutRef<typeof Button> & {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number | null;
    category: string;
    imageUrl: string;
  };
}) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart({
      id: product.id,
      image: product.imageUrl,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    toast({
      title: "Success",
      description: "Product added to cart",
    });
  };

  return (
    <Button
      {...props}
      variant="default"
      size="icon"
      title="Add to cart"
      onClick={handleClick}
    >
      <ShoppingCartIcon />
    </Button>
  );
}

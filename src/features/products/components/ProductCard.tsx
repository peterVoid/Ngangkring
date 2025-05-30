import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { CartButton } from "./CartButton";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number | null;
    category: string;
    imageUrl: string;
  };
}) {
  const isAvailable = (product.stock || 0) > 0;

  return (
    <Card
      className={cn(
        "neo-brutalist-hard bg-white transition-all duration-150",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        "active:translate-x-[4px] active:translate-y-[4px]",
        !isAvailable && "opacity-90 grayscale-[60%]",
      )}
    >
      {/* Image with brutalist border */}
      <div className="relative h-40 w-full border-b-4 border-black bg-amber-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-4"
          style={{
            objectPosition: "center",
            mixBlendMode: "multiply", // Gives that punk poster vibe
          }}
        />
      </div>

      {/* Content with aggressive typography */}
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between">
          <h3 className="line-clamp-2 text-sm font-black uppercase tracking-tight">
            {product.name}
          </h3>
          <span
            className={cn(
              "inline-block border-2 border-black px-2 py-1 text-xs font-extrabold",
              isAvailable ? "bg-lime-300" : "bg-red-300",
            )}
          >
            {isAvailable ? "READY" : "SOLD"}
          </span>
        </div>

        <p className="inline-block bg-black px-1 py-0.5 font-mono text-xs text-white">
          {product.category}
        </p>
      </CardContent>

      {/* Footer with price that looks like a price tag */}
      <CardFooter className="border-t-4 border-black bg-amber-100 p-3">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-black">{formatCurrency(product.price)}</p>
          <CartButton
            product={product}
            disabled={!isAvailable}
            className={cn(
              "h-8 w-8 border-2 border-black bg-white p-1",
              "hover:bg-black hover:text-white",
              "active:scale-90 active:bg-black active:text-white",
              !isAvailable && "cursor-not-allowed bg-gray-300",
            )}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

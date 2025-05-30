"use client";

import { DeleteActionButton } from "@/components/DeleteActionButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "../actions/products";
import { limit } from "@/constans";

export function ProductsTable({
  products,
  currentPage,
}: {
  products: {
    id: string;
    name: string;
    price: number;
    stock: number | null;
    category: string;
    imageUrl: string;
  }[];
  currentPage: number;
}) {
  return (
    <div className="neo-brutalist-table-container border-4 border-black p-1">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b-4 border-black">
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              No
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Image & Name
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Stock
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Price
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Category
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.id}
              className="border-b-2 border-black transition-colors hover:bg-amber-50"
            >
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                <div className="flex items-center gap-x-2">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={30}
                    height={30}
                    className="size-10 rounded object-cover"
                  />
                  <p className="line-clamp-1 text-sm">{product.name}</p>
                </div>
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {product.stock}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {product.category}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="icon"
                    className="neo-brutalist-btn-edit border-2 border-black"
                  >
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Edit2Icon />
                    </Link>
                  </Button>
                  <DeleteActionButton
                    action={() => deleteProduct(product.id)}
                    confirmPopup
                    size="icon"
                    className="neo-brutalist-btn-delete border-2 border-black"
                  >
                    <Trash2Icon />
                  </DeleteActionButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

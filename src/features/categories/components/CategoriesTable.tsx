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
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { deleteCategory } from "../actions/categories";
import { limit } from "@/constans";

export function CategoriesTable({
  categories,
  currentPage,
}: {
  categories: {
    id: string;
    name: string;
    productsCount: number;
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
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              Name
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Products
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow
              key={category.id}
              className="border-b-2 border-black transition-colors hover:bg-amber-50"
            >
              <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                {(currentPage - 1) * limit + index + 1}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 font-bold">
                {category.name[0].toUpperCase() + category.name.slice(1)}
              </TableCell>
              <TableCell className="border-r-2 border-black p-3 text-center font-mono">
                {category.productsCount}
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    asChild
                    size="icon"
                    className="neo-brutalist-btn-edit border-2 border-black"
                  >
                    <Link href={`/admin/categories/edit/${category.id}`}>
                      <Edit2Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteActionButton
                    action={() => deleteCategory(category.id)}
                    confirmPopup
                    size="icon"
                    className="neo-brutalist-btn-delete border-2 border-black"
                  >
                    <Trash2Icon className="h-4 w-4" />
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

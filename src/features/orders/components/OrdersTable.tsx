"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { limit } from "@/constans";
import { orderStatus } from "@/db/schema";
import { formatCurrency } from "@/lib/formatters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { deleteOrder } from "../actions/orders";
import { StatusTableCell } from "./StatusTableCell";
import Link from "next/link";
import { format } from "date-fns";

export function OrdersTable({
  orders,
  currentPage,
}: {
  orders: {
    id: string;
    noTable: number;
    status: orderStatus;
    createdAt: Date;
    orderItem: {
      productId: string;
      quantity: number;
      product: {
        name: string;
        price: number;
      };
    }[];
  }[];
  currentPage: number;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <div className="neo-brutalist-table-container">
      <Table>
        <TableHeader>
          <TableRow className="border-b-4 border-black">
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              NO
            </TableHead>
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              TABLE
            </TableHead>
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              ITEMS
            </TableHead>
            <TableHead className="bg-black p-3 text-right font-black uppercase text-white">
              TOTAL
            </TableHead>
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              Dibuat
            </TableHead>
            <TableHead className="bg-black p-3 font-black uppercase text-white">
              STATUS
            </TableHead>
            <TableHead className="bg-black p-3 text-center font-black uppercase text-white">
              ACTION
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            const total = order.orderItem.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0,
            );

            const itemNames = order.orderItem
              .map((item) => `${item.quantity}x ${item.product.name}`)
              .join(", ");

            return (
              <TableRow
                key={order.id}
                className="border-b-2 border-black hover:bg-amber-50"
              >
                <TableCell className="border-r-2 border-black p-3 text-center font-bold">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell className="border-r-2 border-black p-3 font-bold">
                  {order.noTable}
                </TableCell>
                <TableCell className="max-w-[300px] truncate border-r-2 border-black p-3">
                  {itemNames}
                </TableCell>
                <TableCell className="border-r-2 border-black p-3 text-right font-mono">
                  {formatCurrency(total)}
                </TableCell>
                <TableCell className="border-r-2 border-black p-3 text-right font-mono">
                  {format(new Date(order.createdAt), "dd MMM yyyy HH:mm")}
                </TableCell>
                <StatusTableCell order={order} />
                <TableCell className="flex items-center gap-x-2">
                  <Button asChild size="sm" className="bg-white text-black">
                    <Link href={`/admin/orders/${order.id}`}>
                      <InfoIcon />
                    </Link>
                  </Button>
                  {order.status === "selesai" && (
                    <div className="flex items-center justify-center">
                      <AlertDialog open={isPending ? true : undefined}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="neo-brutalist-delete-btn"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="neo-brutalist-dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-black uppercase">
                              DELETE ORDER?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-bold">
                              THIS ACTION CANNOT BE UNDONE!
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="neo-brutalist-cancel-btn">
                              CANCEL
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => mutate(order.id)}
                              disabled={isPending}
                              className="neo-brutalist-confirm-btn"
                            >
                              {isPending ? "DELETING..." : "DELETE"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

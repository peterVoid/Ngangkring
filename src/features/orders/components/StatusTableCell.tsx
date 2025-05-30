import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { OrderStatues, orderStatus } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusOrder } from "../actions/orders";

export function StatusTableCell({
  order,
}: {
  order: {
    id: string;
    noTable: number;
    status: orderStatus;
    orderItem: {
      productId: string;
      quantity: number;
      product: {
        name: string;
        price: number;
      };
    }[];
  };
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (newValue: string) => updateStatusOrder(order.id, newValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <TableCell>
      <Select
        defaultValue={order.status}
        disabled={order.status === OrderStatues[OrderStatues.length - 1]}
        onValueChange={(newValue) => {
          mutate(newValue);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={order.status} />
        </SelectTrigger>
        <SelectContent>
          {OrderStatues.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}

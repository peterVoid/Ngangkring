import { orderStatus } from "@/db/schema";

export type OrderType = {
  status: orderStatus;
  id: string;
  noTable: number;
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

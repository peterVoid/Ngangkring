import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Required"),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().default(0).optional(),
  imageUrl: z.string().url("Required"),
  categoryId: z.string().uuid("Id kategori tidak valid"),
});

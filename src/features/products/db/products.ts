import { db } from "@/db";
import { ProductTable } from "@/db/schema";
import { revalidateProductTagCache } from "./cache";
import { eq } from "drizzle-orm";

export async function insertProduct(data: typeof ProductTable.$inferInsert) {
  const [insertedProduct] = await db
    .insert(ProductTable)
    .values(data)
    .returning();

  if (insertedProduct == null) throw new Error("Something went wrong");

  revalidateProductTagCache({ id: insertedProduct.id });

  return insertedProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<typeof ProductTable.$inferInsert>,
) {
  const [updatedProduct] = await db
    .update(ProductTable)
    .set(data)
    .where(eq(ProductTable.id, id))
    .returning();

  if (updatedProduct == null) throw new Error("Something went wrong");

  revalidateProductTagCache({ id: updatedProduct.id });

  return updatedProduct;
}

export async function deleteProduct(id: string) {
  const [deletedProduct] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();

  if (deletedProduct == null) throw new Error("Something went wrong");

  revalidateProductTagCache({ id: deletedProduct.id });

  return deletedProduct;
}

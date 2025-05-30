"use server";

import { getCurrentUser } from "@/services/clerk";
import { FORM_PRODUCT_TYPE } from "../components/ProductsForm";
import { productSchema } from "../schemas/products";
import {
  canCreateProduct,
  canDeleteProduct,
  canUpdateProduct,
} from "../permissions/products";
import {
  insertProduct as insertProductDB,
  deleteProduct as deleteProductDB,
  updateProduct as updateProductDB,
} from "../db/products";

export async function insertProduct(unsafeData: FORM_PRODUCT_TYPE) {
  const { role } = await getCurrentUser();

  const { error, data } = productSchema.safeParse(unsafeData);

  if (error || !canCreateProduct({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await insertProductDB(data);

  return { error: false, message: "Successfully created product" };
}

export async function updateProduct(id: string, unsafeData: FORM_PRODUCT_TYPE) {
  const { role } = await getCurrentUser();

  const { error, data } = productSchema.safeParse(unsafeData);

  if (error || !canUpdateProduct({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await updateProductDB(id, data);

  return { error: false, message: "Successfully updated product" };
}

export async function deleteProduct(id: string) {
  const { role } = await getCurrentUser();

  if (!canDeleteProduct({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await deleteProductDB(id);

  return { error: false, message: "Successfully deleted product" };
}

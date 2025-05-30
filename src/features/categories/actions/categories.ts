"use server";

import { FORM_CATEGORY_TYPE } from "../components/CategoriesForm";
import { getCurrentUser } from "@/services/clerk";
import { categorySchema } from "../schemas/categories";
import {
  canCreateCategory,
  canDeleteCategory,
  canUpdateCategory,
} from "../permissions/categories";
import {
  insertCategory as insertCategoryDB,
  updateCategory as updateCategoryDB,
  deleteCategory as deleteCategoryDB,
} from "../db/categories";

export async function insertCategory(unsafeData: FORM_CATEGORY_TYPE) {
  const { role } = await getCurrentUser();

  const { error, data } = categorySchema.safeParse(unsafeData);

  if (!canCreateCategory({ role }) || error) {
    return { error: true, message: "Something went wrong" };
  }

  const response = await insertCategoryDB(data);

  return { error: response.error, message: response.message };
}

export async function updateCategory(
  id: string,
  unsafeData: FORM_CATEGORY_TYPE,
) {
  const { role } = await getCurrentUser();

  if (!canUpdateCategory({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  const { error, data } = categorySchema.safeParse(unsafeData);

  if (error) {
    return { error: true, message: "Something went wrong" };
  }

  const { error: dbError, message } = await updateCategoryDB(id, data);

  return { error: dbError, message };
}

export async function deleteCategory(id: string) {
  const { role } = await getCurrentUser();

  if (!canDeleteCategory({ role })) {
    return { error: true, message: "Something went wrong" };
  }

  await deleteCategoryDB(id);

  return { error: false, message: "Successfully deleted category" };
}

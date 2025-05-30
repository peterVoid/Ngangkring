import { db } from "@/db";
import { CategoryTable } from "@/db/schema";
import { getGlobalCategoryTag, revalidateCategoriesTagCache } from "./cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function insertCategory(data: typeof CategoryTable.$inferInsert) {
  const categories = await db.select().from(CategoryTable);

  const existingCategory = categories.find(
    (category) =>
      category.name.trim().toLowerCase() == data.name.trim().toLowerCase(),
  );

  if (existingCategory) {
    return { error: true, message: "Category already exists" };
  }

  const [insertedCategory] = await db
    .insert(CategoryTable)
    .values(data)
    .returning();

  revalidateCategoriesTagCache(insertedCategory.id);

  return { error: false, message: "Successfully created category" };
}

export async function updateCategory(
  id: string,
  data: typeof CategoryTable.$inferInsert,
) {
  const categories = await db.select().from(CategoryTable);

  const existingCategory = categories.find(
    (category) =>
      category.name.trim().toLowerCase() == data.name.trim().toLowerCase() &&
      category.id !== id,
  );

  if (existingCategory) {
    return { error: true, message: "Category already exists" };
  }

  const [insertedCategory] = await db
    .update(CategoryTable)
    .set(data)
    .where(eq(CategoryTable.id, id))
    .returning();

  revalidateCategoriesTagCache(insertedCategory.id);

  return { error: false, message: "Successfully updated category" };
}

export async function deleteCategory(id: string) {
  const [deletedCategory] = await db
    .delete(CategoryTable)
    .where(eq(CategoryTable.id, id))
    .returning();

  if (deletedCategory == null) throw new Error("Something went wrong");

  revalidateCategoriesTagCache(deletedCategory.id);

  return deletedCategory;
}

export async function getCategories() {
  "use cache";
  cacheTag(getGlobalCategoryTag());

  const categories = await db
    .select({
      id: CategoryTable.id,
      name: CategoryTable.name,
    })
    .from(CategoryTable);

  return categories;
}

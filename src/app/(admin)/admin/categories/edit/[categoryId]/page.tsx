import { db } from "@/db";
import { CategoryTable } from "@/db/schema";
import { CategoriesForm } from "@/features/categories/components/CategoriesForm";
import { getCategoryIdTag } from "@/features/categories/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  try {
    console.log(
      "[generateStaticParams - categoryId] Attempting to fetch sample order IDs...",
    );

    const sampleCategories = await db.query.CategoryTable.findMany({
      columns: { id: true },
      limit: 5,
    });

    if (!sampleCategories || sampleCategories.length === 0) {
      console.warn(
        "[generateStaticParams - categoryId] No sample categories found to generate static params. This might lead to issues is fallback behavior is not 'blocking' or if pages are expected to be pre-rendered",
      );

      return [];
    }

    const params = sampleCategories
      .map((category) => {
        if (!category.id || typeof category.id !== "string") {
          console.error(
            `[generateStaticParams - categoryId] Invalid category ID found: ${category.id}. Skipping.`,
          );
          return null;
        }

        return { categoryId: category.id };
      })
      .filter((c) => c !== null);

    console.log(
      "[generateStaticParams - categoryId] Generated params:",
      params,
    );

    return params;
  } catch (error) {
    console.error(
      "[generateStaticParams - categoryId] Error generating static params:",
      error,
    );

    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  return (
    <div className="container my-6">
      <Suspense fallback={null}>
        <CategoryEditResolverAndFetcher paramsPromise={params} />
      </Suspense>
    </div>
  );
}

async function CategoryEditResolverAndFetcher({
  paramsPromise,
}: {
  paramsPromise: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await paramsPromise;

  if (
    !categoryId ||
    typeof categoryId !== "string" ||
    categoryId.startsWith("[")
  ) {
    console.error(
      `[CategoryEditResolverAndFetcher] Invalid categoryId: ${categoryId}`,
    );
    notFound();
  }

  const category = await getCategory(categoryId);

  if (category == null) return notFound();

  return <CategoriesForm category={category} />;
}

async function getCategory(id: string) {
  "use cache";
  cacheTag(getCategoryIdTag(id));

  return db.query.CategoryTable.findFirst({
    columns: { id: true, name: true },
    where: eq(CategoryTable.id, id),
  });
}

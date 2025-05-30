import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getGlobalCategoryTag } from "@/features/categories/db/cache";
import { db } from "@/db";
import { CategoryTable, ProductTable } from "@/db/schema";
import { asc, count, eq } from "drizzle-orm";
import { PaginationControls } from "@/components/PaginationControls";
import { limit } from "@/constans";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const { page } = await searchParams;

  const { categories, totalCount } = await getCategories(page);

  const pageLimit = Math.ceil(totalCount / limit);

  return (
    <div className="neo-brutalist-page-container">
      <PageHeader
        title="Categories"
        className="border-b-4 border-black pb-3 text-3xl font-black uppercase tracking-tighter"
      >
        <Button className="neo-brutalist-new-product-btn" asChild size="sm">
          <Link href="/admin/categories/new">
            <PlusIcon />
            New Category
          </Link>
        </Button>
      </PageHeader>

      <CategoriesTable
        categories={categories}
        currentPage={Number(page || "1")}
      />

      <PaginationControls pageLimit={pageLimit} />
    </div>
  );
}

async function getCategories(page?: string) {
  "use cache";
  cacheTag(getGlobalCategoryTag());

  const offset = (Number(page ?? "1") - 1) * limit;

  const [categories, categoriesCount] = await Promise.all([
    db
      .select({
        id: CategoryTable.id,
        name: CategoryTable.name,
        productsCount: count(eq(CategoryTable.id, ProductTable.categoryId)),
      })
      .from(CategoryTable)
      .leftJoin(ProductTable, eq(ProductTable.categoryId, CategoryTable.id))
      .groupBy((t) => t.id)
      .orderBy(asc(CategoryTable.name))
      .limit(limit)
      .offset(offset),

    db
      .select({
        count: count(),
      })
      .from(CategoryTable),
  ]);

  return {
    categories,
    totalCount: categoriesCount[0].count,
  };
}

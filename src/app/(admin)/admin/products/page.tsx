import { PageHeader } from "@/components/PageHeader";
import { PaginationControls } from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { limit } from "@/constans";
import { db } from "@/db";
import { CategoryTable, ProductTable } from "@/db/schema";
import { FilterByLetter } from "@/features/products/components/FilterByLetter";
import { ProductsTable } from "@/features/products/components/ProductsTable";
import { getGlobalProductTag } from "@/features/products/db/cache";
import { asc, count, desc, eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort, page } = await searchParams;
  const { products, totalCount } = await getProducts(sort, page);

  const pageLimit = Math.ceil(totalCount / limit);

  return (
    <div className="neo-brutalist-page-container">
      <PageHeader
        title="PRODUCTS"
        className="border-b-4 border-black pb-3 text-3xl font-black uppercase tracking-tighter"
      >
        <Button asChild size="sm" className="neo-brutalist-new-product-btn">
          <Link href="/admin/products/new">
            <PlusIcon className="h-4 w-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-5">
        <FilterByLetter />
      </div>

      <ProductsTable products={products} currentPage={Number(page || "1")} />

      <PaginationControls pageLimit={pageLimit} />
    </div>
  );
}

async function getProducts(sort?: string, page?: string) {
  "use cache";
  cacheTag(getGlobalProductTag());

  let orderBy = desc(ProductTable.createdAt);

  if (sort === "asc") {
    orderBy = asc(ProductTable.name);
  } else {
    orderBy = desc(ProductTable.name);
  }

  const offset = (Number(page || "1") - 1) * limit;

  const [products, productsCount] = await Promise.all([
    db
      .select({
        id: ProductTable.id,
        name: ProductTable.name,
        price: ProductTable.price,
        stock: ProductTable.stock,
        category: CategoryTable.name,
        imageUrl: ProductTable.imageUrl,
      })
      .from(ProductTable)
      .innerJoin(CategoryTable, eq(CategoryTable.id, ProductTable.categoryId))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    db
      .select({
        count: count(),
      })
      .from(ProductTable),
  ]);

  return {
    products,
    totalCount: productsCount[0].count,
  };
}

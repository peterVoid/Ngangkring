import { PageHeader } from "@/components/PageHeader";
import { db } from "@/db";
import { CategoryTable, ProductTable } from "@/db/schema";
import { getGlobalCategoryTag } from "@/features/categories/db/cache";
import { FilterPublicProductsByCategory } from "@/features/products/components/FilterPublicProductsByCategory";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getGlobalProductTag } from "@/features/products/db/cache";
import { asc, eq } from "drizzle-orm";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const metadata: Metadata = {
  title: "Beranda",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;

  const products = await getPublicProducts(sort);
  const categories = await getPublicCategories();

  return (
    <div className="container my-6">
      <PageHeader
        title="Beranda"
        className="text-3xl font-bold tracking-tighter xl:text-5xl"
      />
      <div className="mb-5 max-w-fit">
        <FilterPublicProductsByCategory categories={categories} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

async function getPublicCategories() {
  "use cache";
  cacheTag(getGlobalCategoryTag());

  return db.query.CategoryTable.findMany({
    columns: { id: true, name: true },
  });
}

async function getPublicProducts(sort?: string) {
  "use cache";
  cacheTag(getGlobalProductTag());

  const products = await db
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
    .where(sort ? eq(CategoryTable.name, sort) : undefined)
    .orderBy(asc(ProductTable.name));

  return products;
}

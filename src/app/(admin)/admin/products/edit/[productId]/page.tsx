import { db } from "@/db";
import { CategoryTable, ProductTable } from "@/db/schema";
import { ProductsForm } from "@/features/products/components/ProductsForm";
import { getProductIdTag } from "@/features/products/db/cache"; // Asumsi ada getCategoriesTag
import { asc, eq } from "drizzle-orm";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getGlobalCategoryTag } from "@/features/categories/db/cache";

export async function generateStaticParams(): Promise<{ productId: string }[]> {
  try {
    console.log(
      "[generateStaticParams - productId] Attempting to fetch sample product IDs...",
    );
    const sampleProducts = await db.query.ProductTable.findMany({
      columns: { id: true },
      limit: 5,
    });

    if (!sampleProducts || sampleProducts.length === 0) {
      console.warn(
        "[generateStaticParams - productId] No sample products found.",
      );
      return [];
    }

    const params = sampleProducts
      .map((product) => {
        if (!product.id || typeof product.id !== "string") {
          console.error(
            `[generateStaticParams - productId] Invalid product ID: ${product.id}. Skipping.`,
          );
          return null;
        }
        return { productId: product.id };
      })
      .filter((p) => p !== null) as { productId: string }[];

    console.log("[generateStaticParams - productId] Generated params:", params);
    return params;
  } catch (error) {
    console.error(
      "[generateStaticParams - productId] Error generating static params:",
      error,
    );
    return [];
  }
}

export default function Page({
  params: paramsPromise,
}: {
  params: Promise<{ productId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <div className="container my-6">
        <ProductResolverAndRenderer paramsPromise={paramsPromise} />
      </div>
    </Suspense>
  );
}

async function ProductResolverAndRenderer({
  paramsPromise,
}: {
  paramsPromise: Promise<{ productId: string }>;
}) {
  const { productId } = await paramsPromise;

  if (
    !productId ||
    typeof productId !== "string" ||
    productId.trim() === "" ||
    productId.startsWith("[")
  ) {
    return notFound();
  }

  const [product, categories] = await Promise.all([
    getProduct(productId),
    getCategories(),
  ]);

  if (product == null) {
    return notFound();
  }

  return <ProductsForm product={product} categories={categories || []} />;
}

async function getProduct(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));

  const result = await db
    .select({
      id: ProductTable.id,
      name: ProductTable.name,
      price: ProductTable.price,
      stock: ProductTable.stock,
      categoryId: ProductTable.categoryId,
      imageUrl: ProductTable.imageUrl,
    })
    .from(ProductTable)
    .where(eq(ProductTable.id, id))
    .limit(1);

  const productData = result[0];
  return productData;
}

async function getCategories() {
  "use cache";
  cacheTag(getGlobalCategoryTag());

  const categoriesData = await db.query.CategoryTable.findMany({
    columns: { id: true, name: true },
    orderBy: asc(CategoryTable.name),
  });
  return categoriesData;
}

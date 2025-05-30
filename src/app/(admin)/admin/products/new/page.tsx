import { getCategories } from "@/features/categories/db/categories";
import { ProductsForm } from "@/features/products/components/ProductsForm";

export default async function Page() {
  const categories = await getCategories();

  return (
    <div className="container my-6">
      <ProductsForm categories={categories} />
    </div>
  );
}

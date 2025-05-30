"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actionToast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertProduct, updateProduct } from "../actions/products";
import { productSchema } from "../schemas/products";

export type FORM_PRODUCT_TYPE = z.infer<typeof productSchema>;

export function ProductsForm({
  categories,
  product,
}: {
  categories: {
    id: string;
    name: string;
  }[];
  product?: {
    id: string;
    name: string;
    price: number;
    stock: number | null;
    categoryId: string;
    imageUrl: string;
  };
}) {
  const router = useRouter();

  const form = useForm<FORM_PRODUCT_TYPE>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      categoryId: product?.categoryId ?? "",
      imageUrl: product?.imageUrl ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
    },
  });

  async function onSubmit(values: FORM_PRODUCT_TYPE) {
    const action = !product
      ? insertProduct
      : updateProduct.bind(null, product.id);
    const responseAction = await action(values);
    actionToast({ responseAction });
    router.push("/admin/products");
  }

  const imageUrl = form.watch("imageUrl");

  return (
    <div className="neo-brutalist-form-container p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="neo-brutalist-input" />
                  </FormControl>
                  <FormMessage className="font-bold text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="neo-brutalist-select-trigger">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="neo-brutalist-select-content">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="neo-brutalist-select-item"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-bold text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="neo-brutalist-input"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          isNaN(e.target.valueAsNumber)
                            ? undefined
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase">Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="neo-brutalist-input"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          isNaN(e.target.valueAsNumber)
                            ? undefined
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel className="block font-black uppercase">
              Product Image
            </FormLabel>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="neo-brutalist-upload-container flex-1">
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const data = res[0];
                    form.setValue("imageUrl", data.serverData.imageUrl);
                  }}
                  onUploadError={(error: Error) => console.log(error)}
                  appearance={{
                    container: {
                      border: "3px dashed black",
                      background: "white",
                    },
                    label: {
                      color: "black",
                      fontWeight: "bold",
                    },
                    button: {
                      background: "black",
                      color: "white",
                      fontWeight: "bold",
                      border: "2px solid black",
                      boxShadow: "3px 3px 0px 0px black",
                    },
                  }}
                />
              </div>
              {imageUrl && (
                <div className="neo-brutalist-image-preview flex-1 border-4 border-black p-1">
                  <Image
                    src={imageUrl}
                    alt="Product Preview"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover"
                    style={{
                      aspectRatio: "1/1",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="neo-brutalist-submit-btn"
            >
              {form.formState.isSubmitting ? "SAVING..." : "SAVE PRODUCT"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

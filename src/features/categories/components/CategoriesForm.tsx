"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categorySchema } from "../schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategory, updateCategory } from "../actions/categories";
import { actionToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export type FORM_CATEGORY_TYPE = z.infer<typeof categorySchema>;

export function CategoriesForm({
  category,
}: {
  category?: {
    id: string;
    name: string;
  };
}) {
  const router = useRouter();

  const form = useForm<FORM_CATEGORY_TYPE>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ?? {
      name: "",
    },
  });

  async function onSubmit(values: FORM_CATEGORY_TYPE) {
    const action = category
      ? updateCategory.bind(null, category.id)
      : insertCategory;
    const responseAction = await action(values);
    actionToast({ responseAction });
    router.push("/admin/categories");
  }

  return (
    <div className="neo-brutalist-form-container p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-black uppercase">
                  CATEGORY NAME
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="neo-brutalist-input"
                    placeholder="ENTER CATEGORY NAME"
                  />
                </FormControl>
                <FormMessage className="font-bold text-red-600" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => router.push("/admin/categories")}
              className="neo-brutalist-cancel-btn"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              className="neo-brutalist-submit-btn"
            >
              {form.formState.isSubmitting ? "SAVING..." : "SAVE CATEGORY"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

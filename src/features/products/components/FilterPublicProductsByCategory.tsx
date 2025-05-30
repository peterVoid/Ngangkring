"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function FilterPublicProductsByCategory({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();

  const handleClick = (value: string) => {
    const query = new URLSearchParams({
      sort: value,
    }).toString();

    router.push(`?${query}`);
  };

  return (
    <Select onValueChange={handleClick}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Filter products" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {categories.map((category) => (
          <SelectItem
            key={category.id}
            value={category.name}
            className="text-sm font-bold capitalize"
          >
            {category.name[0].toUpperCase() +
              category.name.slice(1, category.name.length)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

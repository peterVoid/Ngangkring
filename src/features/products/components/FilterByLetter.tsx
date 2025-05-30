"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function FilterByLetter() {
  const router = useRouter();

  const handleFilter = (value: string) => {
    const query = new URLSearchParams({
      sort: value,
    }).toString();

    router.push(`/admin/products?${query}`);
  };

  return (
    <Select onValueChange={handleFilter}>
      <SelectTrigger className="neo-brutalist-select-trigger">
        <SelectValue placeholder="Filter by letter" />
      </SelectTrigger>
      <SelectContent className="neo-brutalist-select-content">
        <SelectItem value={"asc"} className="neo-brutalist-select-item">
          A-Z
        </SelectItem>
        <SelectItem value={"desc"} className="neo-brutalist-select-item">
          Z-A
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

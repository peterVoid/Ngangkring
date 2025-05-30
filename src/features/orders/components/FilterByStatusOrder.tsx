"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatues, orderStatus } from "@/db/schema";
import { useRouter, useSearchParams } from "next/navigation";

export function FilterByStatusOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (status: orderStatus) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("status", status);
    router.push(`/admin/orders?${newParams.toString()}`);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="neo-brutalist-select-trigger">
        <SelectValue placeholder="FILTER STATUS" />
      </SelectTrigger>
      <SelectContent className="neo-brutalist-select-content">
        <SelectGroup>
          <SelectLabel className="neo-brutalist-select-label">
            ORDER STATUS
          </SelectLabel>
          {OrderStatues.map((status) => (
            <SelectItem
              key={status}
              value={status}
              className="neo-brutalist-select-item"
            >
              {status.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

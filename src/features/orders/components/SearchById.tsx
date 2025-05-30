"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchById() {
  const [query, setQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (debouncedValue !== "") {
      const params = new URLSearchParams(searchParams);
      params.set("query", debouncedValue);

      router.push(`/admin/orders?${encodeURI(params.toString())}`);
    }
  }, [debouncedValue, router, searchParams]);

  return (
    <Input
      type="text"
      value={query}
      placeholder="Search by No Table"
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      className="w-full py-6"
    />
  );
}

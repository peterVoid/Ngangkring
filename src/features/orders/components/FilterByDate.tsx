"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FilterByDate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromDate, setFromDate] = useState(
    searchParams.get("from") ?? new Date().toString(),
  );
  const [toDate, setToDate] = useState(
    searchParams.get("to") ?? new Date().toString(),
  );

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (fromDate) params.set("from", fromDate);
    else params.delete("from");

    if (toDate) params.set("to", toDate);
    else params.delete("to");

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert("ERROR: GABISA KOCAK!");
      return;
    }

    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="neo-brutalist-date-filter">
      <div className="flex items-center gap-3">
        <label className="text-sm font-black uppercase">FROM:</label>
        <Input
          type="date"
          value={fromDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFromDate(e.target.value)}
          className="neo-brutalist-date-input"
        />

        <label className="text-sm font-black uppercase">TO:</label>
        <Input
          type="date"
          value={toDate}
          min={new Date(fromDate).toISOString().split("T")[0]}
          max={new Date().toISOString().split("T")[0]}
          disabled={!fromDate}
          onChange={(e) => setToDate(e.target.value)}
          className="neo-brutalist-date-input"
        />

        <Button
          type="button"
          onClick={handleFilter}
          disabled={new Date(fromDate) > new Date(toDate)}
          className={cn(
            "neo-brutalist-filter-btn",
            new Date(fromDate) > new Date(toDate) &&
              "neo-brutalist-disabled-btn",
          )}
        >
          FILTER
        </Button>

        <Button
          onClick={() => {
            setFromDate(new Date().toString());
            setToDate(new Date().toString());
            router.push("/admin/orders");
          }}
          className="neo-brutalist-reset-btn"
        >
          RESET
        </Button>
      </div>
    </div>
  );
}

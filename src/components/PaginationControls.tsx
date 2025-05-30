"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export function PaginationControls({ pageLimit }: { pageLimit: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? "1");

  const handleClick = (value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      <Button disabled={page === 1} onClick={() => handleClick(page - 1)}>
        Previous
      </Button>
      <Button
        disabled={page === pageLimit}
        onClick={() => handleClick(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

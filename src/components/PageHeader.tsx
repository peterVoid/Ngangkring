import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className={cn("text-2xl font-bold", className)}>{title}</h1>
      {children}
    </div>
  );
}

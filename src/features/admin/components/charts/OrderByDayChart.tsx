"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/formatters";
import { RANGE_OPTIONS } from "@/lib/rangeOptions";
import { subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrderByDayChartProps = {
  data: {
    date: string;
    totalSales: number;
  }[];
  queryKey: string;
  selectedRangeLabel: string;
};

export function OrderByDayChart({
  data,
  queryKey,
  selectedRangeLabel,
}: OrderByDayChartProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const setRange = (range: keyof typeof RANGE_OPTIONS | DateRange) => {
    const params = new URLSearchParams(searchParams);
    if (typeof range === "string") {
      params.delete(`${queryKey}From`);
      params.delete(`${queryKey}To`);
      params.set(queryKey, range);
    } else {
      if (range.from == null || range.to == null) return;
      params.delete(queryKey);
      params.set(`${queryKey}From`, range.from.toISOString());
      params.set(`${queryKey}To`, range.to.toISOString());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="neo-brutalist-chart-container">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="neo-brutalist-chart-title">DAILY ORDER TREND</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="neo-brutalist-range-btn">
              {selectedRangeLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="neo-brutalist-dropdown-content w-[280px]">
            {Object.entries(RANGE_OPTIONS).map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setRange(key as keyof typeof RANGE_OPTIONS)}
                className="neo-brutalist-dropdown-item"
              >
                {value.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="border-black" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="neo-brutalist-dropdown-item">
                CUSTOM DATE RANGE
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="neo-brutalist-dropdown-content border-0 p-0">
                <div className="border-4 border-black bg-white p-1">
                  <Calendar
                    mode="range"
                    disabled={{ after: new Date() }}
                    selected={dateRange}
                    defaultMonth={dateRange?.from}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="border-0"
                  />
                  <div className="border-t-4 border-black p-2">
                    <Button
                      onClick={() => {
                        if (dateRange == null) return;
                        setRange(dateRange);
                      }}
                      disabled={dateRange == null}
                      className="neo-brutalist-submit-btn w-full"
                    >
                      APPLY DATE RANGE
                    </Button>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="neo-brutalist-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              stroke="#000"
              strokeDasharray="5 5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{
                fill: "#000",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={{ stroke: "#000" }}
            />
            <YAxis
              tick={{
                fill: "#000",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={{ stroke: "#000" }}
              tickFormatter={(t) => formatCurrency(t)}
            />
            <Tooltip
              contentStyle={{
                border: "3px solid #000",
                background: "#fff",
                borderRadius: "0",
                boxShadow: "6px 6px 0px 0px #000",
                fontWeight: "bold",
              }}
              formatter={(value) => [formatCurrency(value as number), "Sales"]}
              labelFormatter={(label) => `DATE: ${label}`}
              cursor={{
                stroke: "#000",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />
            <Line
              dataKey="totalSales"
              type="monotone"
              stroke="#000"
              strokeWidth={4}
              dot={{
                fill: "#000",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                fill: "#fff",
                stroke: "#000",
                strokeWidth: 3,
                r: 8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

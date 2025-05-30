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
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type ProductByDayChartProps = {
  data: {
    name: string;
    revenue: number;
  }[];
  queryKey: string;
  selectedRangeLabel: string;
};

export function ProductByDayChart({
  data,
  queryKey,
  selectedRangeLabel,
}: ProductByDayChartProps) {
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

  const getBarColor = (index: number) => {
    const colors = ["#FF5F5F", "#5F9FFF", "#5FFF7F", "#FFBF5F", "#AF5FFF"];
    return colors[index % colors.length];
  };

  return (
    <div className="neo-brutalist-chart-container">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="neo-brutalist-chart-title">PRODUCT REVENUE ANALYSIS</h3>
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="vertical"
          >
            <CartesianGrid
              stroke="#000"
              strokeDasharray="5 5"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{
                fill: "#000",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={{ stroke: "#000" }}
              tickFormatter={(t) => formatCurrency(t)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{
                fill: "#000",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickLine={{ stroke: "#000" }}
            />
            <Tooltip
              contentStyle={{
                border: "3px solid #000",
                background: "#fff",
                borderRadius: "0",
                boxShadow: "6px 6px 0px 0px #000",
                fontWeight: "bold",
              }}
              cursor={{
                fill: "rgba(0, 0, 0, 0.1)",
                stroke: "#000",
                strokeWidth: 1,
              }}
              formatter={(value: number) => [
                `${formatCurrency(value)}`,
                "Revenue",
              ]}
              labelFormatter={(label) => `Product: ${label}`}
            />
            <Bar
              dataKey="revenue"
              stroke="#000"
              strokeWidth={2}
              barSize={30}
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(index)}
                  stroke="#000"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

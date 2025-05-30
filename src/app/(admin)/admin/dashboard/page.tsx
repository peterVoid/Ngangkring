import { db } from "@/db";
import { OrderItemTable, OrderTable } from "@/db/schema";
import { OrderByDayChart } from "@/features/admin/components/charts/OrderByDayChart";
import { ProductByDayChart } from "@/features/admin/components/charts/ProductByDayChart";
import { getGlobalOrderTag } from "@/features/orders/db/cache";
import { getGlobalProductTag } from "@/features/products/db/cache";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getRangeOptions, RANGE_OPTIONS } from "@/lib/rangeOptions";
import { cn } from "@/lib/utils";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfWeek,
  interval,
  max,
  min,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { and, asc, gt, lt } from "drizzle-orm";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{
    revenueByProductRange?: string;
    revenueByProductRangeFrom?: string;
    revenueByProductRangeTo?: string;
    totalSalesRange?: string;
    totalSalesRangeFrom?: string;
    totalSalesRangeTo?: string;
  }>;
}) {
  return (
    <div className="neo-brutalist-dashboard">
      <h1 className="neo-brutalist-dashboard-title">DASHBOARD</h1>
      <div className="neo-brutalist-dashboard-grid">
        <DashboardGrid searchParams={searchParams} />
      </div>
    </div>
  );
}

async function DashboardGrid({
  searchParams,
}: {
  searchParams: Promise<{
    revenueByProductRange?: string;
    revenueByProductRangeFrom?: string;
    revenueByProductRangeTo?: string;
    totalSalesRange?: string;
    totalSalesRangeFrom?: string;
    totalSalesRangeTo?: string;
  }>;
}) {
  const {
    totalSalesRange,
    revenueByProductRange,
    revenueByProductRangeFrom,
    revenueByProductRangeTo,
    totalSalesRangeFrom,
    totalSalesRangeTo,
  } = await searchParams;

  const totalSalesRangeOptions =
    getRangeOptions(totalSalesRange, totalSalesRangeFrom, totalSalesRangeTo) ??
    RANGE_OPTIONS["last_7_days"];

  const reveneuProductsRangeOptions =
    getRangeOptions(
      revenueByProductRange,
      revenueByProductRangeFrom,
      revenueByProductRangeTo,
    ) ?? RANGE_OPTIONS["last_7_days"];

  const { chartData, orders } = await getTotalOrders(
    totalSalesRangeOptions.startDate,
    totalSalesRangeOptions.endDate,
  );

  const { countProductInStock, countProductOutofStock, revenue } =
    await statusProducts(
      reveneuProductsRangeOptions.startDate,
      reveneuProductsRangeOptions.endDate,
    );

  return (
    <>
      <div className="neo-brutalist-dashboard-section">
        <Suspense fallback={<DashboardCardSkeleton />}>
          <DashboardTopRows
            orders={orders}
            countProductInStock={countProductInStock}
            countProductOutofStock={countProductOutofStock}
          />
        </Suspense>
      </div>

      <div className="neo-brutalist-dashboard-section">
        <Suspense>
          <div className="neo-brutalist-placeholder grid grid-cols-1 gap-4 lg:grid-cols-2">
            <OrderByDayChart
              data={chartData}
              queryKey="totalSalesRange"
              selectedRangeLabel={totalSalesRangeOptions.label}
            />
            <ProductByDayChart
              data={revenue}
              queryKey="revenueByProductRange"
              selectedRangeLabel={reveneuProductsRangeOptions.label}
            />
          </div>
        </Suspense>
      </div>
    </>
  );
}

async function DashboardTopRows({
  orders,
  countProductInStock,
  countProductOutofStock,
}: {
  orders: {
    id: string;
    createdAt: Date;
    orderItem: {
      quantity: number;
      product: {
        price: number;
      };
    }[];
  }[];
  countProductInStock: number;
  countProductOutofStock: number;
}) {
  const rows: {
    title: string;
    description: string;
    content: string | number;
    variant?: "sales" | "stock" | "default";
  }[] = [];

  if (orders && orders.length > 0) {
    const totalOrders = orders
      .map((order) =>
        order.orderItem.reduce(
          (acc, item) => acc + item.quantity * item.product.price,
          0,
        ),
      )
      .reduce((acc, item) => acc + item, 0);

    rows.push({
      title: "TOTAL PENJUALAN",
      description: `${orders.length} ORDERS`,
      content: formatCurrency(totalOrders),
      variant: "sales",
    });
  }

  rows.push({
    title: "PRODUK",
    description: `${countProductOutofStock} HABIS`,
    content: `${countProductInStock} TERSEDIA`,
    variant: "stock",
  });

  return (
    <div className="neo-brutalist-cards-grid">
      {rows.map((row, index) => (
        <DashboardCard
          key={index}
          title={row.title}
          description={row.description}
          content={row.content}
          variant={row.variant}
        />
      ))}
    </div>
  );
}

function DashboardCard({
  title,
  description,
  content,
  variant = "default",
}: {
  title: string;
  description: string;
  content: string | number;
  variant?: "sales" | "stock" | "default";
}) {
  return (
    <div
      className={cn(
        "neo-brutalist-card",
        variant === "sales" && "neo-brutalist-card-sales",
        variant === "stock" && "neo-brutalist-card-stock",
      )}
    >
      <h3 className="neo-brutalist-card-title">{title}</h3>
      <p className="neo-brutalist-card-description">{description}</p>
      <div className="neo-brutalist-card-content">{content}</div>
    </div>
  );
}

function DashboardCardSkeleton() {
  return (
    <div className="neo-brutalist-card-skeleton">
      <div className="mb-2 h-6 w-3/4 bg-gray-300"></div>
      <div className="mb-4 h-4 w-1/2 bg-gray-300"></div>
      <div className="h-8 w-full bg-gray-300"></div>
    </div>
  );
}

async function getTotalOrders(
  createdAfter: Date | null,
  createdBefore: Date | null,
) {
  "use cache";
  cacheTag(getGlobalOrderTag());

  const orders = await db.query.OrderTable.findMany({
    columns: { id: true, createdAt: true },
    where: and(
      createdAfter ? gt(OrderTable.createdAt, createdAfter) : undefined,
      createdBefore ? lt(OrderTable.createdAt, createdBefore) : undefined,
    ),
    orderBy: asc(OrderTable.createdAt),
    with: {
      orderItem: {
        columns: { quantity: true },
        with: {
          product: {
            columns: { price: true },
          },
        },
      },
    },
  });

  const { array, format } = getChartDateArray(
    createdAfter ?? startOfDay(orders[0].createdAt),
    createdBefore ?? new Date(),
  );

  const dayArray = array.map((date) => {
    return {
      date: format(date),
      totalSales: 0,
    };
  });

  return {
    chartData: orders.reduce((data, order) => {
      const formattedDate = formatDate(order.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalSales += order.orderItem.reduce(
        (acc, n) => acc + n.quantity * n.product.price,
        0,
      );
      return data;
    }, dayArray),
    orders,
  };
}

async function statusProducts(
  createdAfter: Date | null,
  createdBefore: Date | null,
) {
  "use cache";
  cacheTag(getGlobalProductTag());

  const products = await db.query.ProductTable.findMany({
    columns: { name: true, stock: true, price: true },
    with: {
      orderItem: {
        columns: { quantity: true },
        where: and(
          createdAfter ? gt(OrderItemTable.createdAt, createdAfter) : undefined,
          createdBefore
            ? lt(OrderItemTable.createdAt, createdBefore)
            : undefined,
        ),
        with: {
          order: {
            columns: { createdAt: true },
          },
        },
      },
    },
  });

  const countProductInStock = products.filter((p) => p.stock !== 0).length;
  const countProductOutofStock = products.filter((p) => p.stock === 0).length;

  return {
    countProductInStock,
    countProductOutofStock,
    revenue: products
      .map((p) => {
        return {
          name: p.name,
          revenue: p.orderItem.reduce(
            (acc, item) => acc + item.quantity * p.price,
            0,
          ),
        };
      })
      .filter((p) => p.revenue > 0),
  };
}

function getChartDateArray(startDate: Date, endDate: Date = new Date()) {
  const days = differenceInDays(startDate, endDate);
  if (days < 30) {
    return {
      array: eachDayOfInterval(interval(startDate, endDate)),
      format: formatDate,
    };
  }

  const weeks = differenceInWeeks(startDate, endDate);
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval(interval(startDate, endDate)),
      format: (date: Date) => {
        const start = max([startOfWeek(date), startDate]);
        const end = min([endOfWeek(date), endDate]);

        return `${formatDate(start)} - ${formatDate(end)}`;
      },
    };
  }

  const months = differenceInMonths(startDate, endDate);
  if (months < 30) {
    return {
      array: eachMonthOfInterval(interval(startDate, endDate)),
      format: new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format,
    };
  }

  return {
    array: eachYearOfInterval(interval(startDate, endDate)),
    format: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format,
  };
}

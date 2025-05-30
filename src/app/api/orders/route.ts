import { limit } from "@/constans";
import { db } from "@/db";
import { orderStatus, OrderTable } from "@/db/schema";
import { and, count, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page") || 1);

  const offset = (page - 1) * limit;

  try {
    const [orders, totalOrders, ordersCount] = await Promise.all([
      db.query.OrderTable.findMany({
        columns: { id: true, noTable: true, status: true, createdAt: true },
        where: (orders, { and }) =>
          and(
            from
              ? gte(
                  orders.createdAt,
                  new Date(new Date(from).setHours(0, 0, 0, 0)),
                )
              : undefined,
            to
              ? lte(
                  orders.createdAt,
                  new Date(new Date(to).setHours(23, 59, 59, 999)),
                )
              : undefined,
            status ? eq(orders.status, status as orderStatus) : undefined,
            query
              ? like(sql`${OrderTable.noTable}::text`, `%${query}%`)
              : undefined,
          ),
        orderBy: desc(OrderTable.createdAt),
        with: {
          orderItem: {
            columns: { productId: true, quantity: true },
            with: {
              product: {
                columns: { name: true, price: true },
              },
            },
          },
        },
        limit,
        offset,
      }),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(OrderTable)
        .where(
          and(
            from ? gte(OrderTable.createdAt, new Date(from)) : undefined,
            to ? lte(OrderTable.createdAt, new Date(to)) : undefined,
            status ? eq(OrderTable.status, status as orderStatus) : undefined,
          ),
        ),

      db
        .select({
          count: count(),
        })
        .from(OrderTable),
    ]);

    return NextResponse.json({
      orders,
      totalOrders,
      ordersCount: ordersCount[0].count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

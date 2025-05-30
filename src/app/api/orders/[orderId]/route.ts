import { db } from "@/db";
import { OrderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  if (orderId == null)
    return new Response("OrderId not found", { status: 404 });

  const [getOrder] = await db
    .select()
    .from(OrderTable)
    .where(eq(OrderTable.id, orderId));

  return Response.json({ data: getOrder }, { status: 200 });
}

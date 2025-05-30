import { db } from "@/db";
import { OrderTable } from "@/db/schema";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams(): Promise<{ orderId: string }[]> {
  try {
    console.log(
      "[generateStaticParams - orderId] Attempting to fetch sample order IDs...",
    );
    // Ambil beberapa ID order yang valid dari database Anda
    // PENTING: Query langsung ke DB, jangan panggil fungsi lain yang mungkin punya cache sendiri di sini
    const sampleOrders = await db.query.OrderTable.findMany({
      columns: { id: true },
      limit: 5, // Batasi jumlah untuk build time. Untuk produksi mungkin lebih banyak atau berdasarkan kriteria.
      // Jika tidak ada order, build mungkin masih mencoba merender dengan ID placeholder jika fallback "blocking"
    });

    if (!sampleOrders || sampleOrders.length === 0) {
      console.warn(
        "[generateStaticParams - orderId] No sample orders found to generate static params. This might lead to issues if fallback behavior is not 'blocking' or if pages are expected to be pre-rendered.",
      );
      // Mengembalikan array kosong berarti tidak ada halaman yang akan di-pre-render berdasarkan ini.
      // Next.js mungkin masih mencoba merender dengan slug placeholder jika tidak ada fallback atau fallback: 'blocking'
      // Untuk dynamicIO, perilaku pastinya perlu diobservasi.
      return [];
    }

    const params = sampleOrders
      .map((order) => {
        if (!order.id || typeof order.id !== "string") {
          console.error(
            `[generateStaticParams - orderId] Invalid order ID found: ${order.id}. Skipping.`,
          );
          return null; // Atau throw error
        }
        return { orderId: order.id };
      })
      .filter((p) => p !== null) as { orderId: string }[]; // Filter null dan pastikan tipe

    console.log("[generateStaticParams - orderId] Generated params:", params);
    return params;
  } catch (error) {
    console.error(
      "[generateStaticParams - orderId] Error generating static params:",
      error,
    );
    return []; // Kembalikan array kosong jika terjadi error agar build tidak gagal total di sini
  }
}

export default function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetails params={params} />
    </Suspense>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="neo-brutalist-order-details animate-pulse">
      {/* ... tambahkan skeleton UI ... */}
    </div>
  );
}

async function OrderDetails({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await getOrderDetails(orderId);

  if (order == null) return notFound();

  const total = order.orderItem.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="neo-brutalist-order-details">
      <div className="neo-brutalist-order-header">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          ORDER DETAILS
        </h1>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase">ORDER ID:</p>
            <p className="mt-1 inline-block bg-black px-2 py-1 font-mono text-white">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase">STATUS:</p>
            <span
              className={cn(
                "mt-1 inline-block px-3 py-1 font-black text-white",
                order.status === "selesai"
                  ? "bg-green-600"
                  : order.status === "diproses"
                    ? "bg-yellow-600"
                    : "bg-red-600",
              )}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="neo-brutalist-order-info">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-bold uppercase">TABLE NUMBER:</p>
            <p className="text-xl font-black">{order.noTable}</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase">ORDER DATE:</p>
            <p className="text-xl font-black">
              {format(new Date(order.createdAt), "dd MMM yyyy HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="neo-brutalist-order-items">
        <h2 className="border-b-4 border-black pb-2 text-xl font-black uppercase">
          ORDER ITEMS
        </h2>
        <div className="mt-4 space-y-4">
          {order.orderItem.map((item) => (
            <div key={item.productId} className="neo-brutalist-order-item">
              <div className="flex gap-4">
                <div className="neo-brutalist-item-image">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-black uppercase">{item.product.name}</h3>
                  <div className="mt-2 flex justify-between">
                    <p className="bg-black px-2 py-1 font-mono text-white">
                      {item.quantity}x
                    </p>
                    <p className="font-mono font-bold">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="neo-brutalist-order-summary">
        <div className="flex items-center justify-between border-t-4 border-black pt-4">
          <p className="text-xl font-black uppercase">TOTAL:</p>
          <p className="text-2xl font-black">{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}

async function getOrderDetails(id: string) {
  const orders = await db.query.OrderTable.findFirst({
    where: eq(OrderTable.id, id),
    columns: { noTable: true, createdAt: true, id: true, status: true },
    with: {
      orderItem: {
        columns: { quantity: true, productId: true },
        with: {
          product: {
            columns: { imageUrl: true, name: true, price: true },
          },
        },
      },
    },
  });
  return orders;
}

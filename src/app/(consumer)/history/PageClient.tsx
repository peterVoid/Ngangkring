"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

type Order = {
  id: string;
  noTable: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function PageClient() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("orderId") || "";
    setOrderId(id);

    if (id) {
      const getOrderData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/orders/${id}`, {
            next: { tags: ["customer_orders"] },
          });

          if (response.ok) {
            const data = await response.json();
            setOrderData(data.data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      getOrderData();
    }
  }, [orderId]);

  useEffect(() => {
    const id = localStorage.getItem("orderId") || "";
    if (id && orderData == null && !isLoading) {
      setOrderId("");
      localStorage.removeItem("orderId");
    }
  }, [orderData, isLoading]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-status-channel")
      .on("broadcast", { event: "new-status" }, (payload) => {
        setOrderData(payload.payload as Order);
      })
      .subscribe((status, err) => {
        if (err) console.error("error", err);
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (orderId.trim() === "" && !orderData) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h1 className="text-2xl font-bold lg:text-5xl">
          Riwayat Pembelian Masih Kosong 🤗
        </h1>
      </div>
    );
  }

  if (!orderData)
    return (
      <div className="neo-brutalist-loading mx-auto mt-10 max-w-md bg-white p-6 text-center">
        <p className="text-xl font-black uppercase tracking-tighter">
          LOADING ORDER...
        </p>
        <div className="mt-4 h-2 w-full bg-black">
          <div
            className="h-full animate-pulse bg-yellow-400"
            style={{ width: "70%" }}
          ></div>
        </div>
      </div>
    );

  return (
    <div className="mx-auto mt-10 max-w-md">
      <Card className="neo-brutalist-card">
        <CardContent className="p-6">
          <h2 className="border-b-4 border-black pb-3 text-center text-2xl font-black uppercase tracking-tighter">
            ORDER INFO
          </h2>

          <div className="mt-4 space-y-4 font-mono">
            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="font-bold">ORDER ID:</span>
              <span className="bg-black px-2 py-1 text-white">
                {orderData.id}
              </span>
            </div>

            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="font-bold">NO MEJA:</span>
              <span className="bg-black px-2 py-1 text-white">
                {orderData.noTable}
              </span>
            </div>

            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="font-bold">STATUS:</span>
              <span
                className={cn(
                  "px-2 py-1 font-black text-white",
                  orderData.status === "selesai"
                    ? "bg-green-600"
                    : orderData.status === "diproses"
                      ? "bg-yellow-600"
                      : "bg-red-600",
                )}
              >
                {orderData.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="font-bold">DIBUAT:</span>
              <span className="bg-black px-2 py-1 text-white">
                {formatDate(new Date(orderData.createdAt), true)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold">DIPERBARUI:</span>
              <span className="bg-black px-2 py-1 text-white">
                {formatDate(new Date(orderData.updatedAt), true)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/PageHeader";
import { PaginationControls } from "@/components/PaginationControls";
import { limit } from "@/constans";
import { FilterByDate } from "@/features/orders/components/FilterByDate";
import { FilterByStatusOrder } from "@/features/orders/components/FilterByStatusOrder";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { SearchById } from "@/features/orders/components/SearchById";
import { supabase } from "@/lib/supabaseClient";
import { OrderType } from "@/types/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export function PageClient({
  status,
  from,
  to,
  page = "1",
  query,
}: {
  status?: string;
  from?: string;
  to?: string;
  page?: string;
  query?: string;
}) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ["orders", { status, from, to, page, query }],
    [from, to, page, status, query],
  );

  const fetchOrders = async (): Promise<{
    orders: OrderType;
    totalOrders: number;
    ordersCount: number;
  }> => {
    const params = new URLSearchParams({
      status: status ?? "",
      from: from ?? "",
      to: to ?? "",
      page: page ?? "",
      query: query ?? "",
    }).toString();

    const res = await fetch(`/api/orders?${params}`);
    if (!res.ok) throw new Error("Something went wrong");

    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchOrders,
  });

  useEffect(() => {
    const audio = new Audio("/notipi.mp3");

    const channel = supabase
      .channel("orders-channel")
      .on("broadcast", { event: "new-order" }, () => {
        audio.play();
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe((status, err) => {
        if (err) console.error("error", err);
        console.log(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey]);

  const pageLimit = Math.ceil((data?.ordersCount ?? 0) / limit);

  return (
    <div className="neo-brutalist-page-container">
      <PageHeader
        title="ORDERS"
        className="border-b-4 border-black pb-3 text-3xl font-black uppercase tracking-tighter"
      />
      <div className="neo-brutalist-filter-container my-6 flex flex-wrap gap-3">
        <FilterByStatusOrder />
        <FilterByDate />
        <SearchById />
      </div>
      {isLoading ? (
        <div className="neo-brutalist-loading p-6 text-center">
          <p className="text-xl font-black uppercase">LOADING ORDERS...</p>
          <div className="mt-4 h-2 w-full bg-black">
            <div
              className="h-full animate-pulse bg-yellow-400"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      ) : error ? (
        <div className="neo-brutalist-error border-4 border-black bg-red-100 p-6 text-center">
          <p className="text-xl font-black uppercase text-red-800">
            ERROR LOADING ORDERS!
          </p>
        </div>
      ) : (
        <>
          <OrdersTable
            orders={data?.orders || []}
            currentPage={Number(page) || 1}
          />
          <PaginationControls pageLimit={pageLimit} />
        </>
      )}
    </div>
  );
}

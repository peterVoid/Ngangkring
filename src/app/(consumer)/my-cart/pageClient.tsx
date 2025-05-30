"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { actionToast } from "@/hooks/use-toast";
import { insertOrder } from "@/features/orders/actions/orders";
import { Trash2Icon, PlusIcon, MinusIcon } from "lucide-react";

export function PageClientCart() {
  const { state, removeFromCart, clearCart, increaseQty, decreaseQty } =
    useCart();
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleClick = async () => {
    try {
      setLoading(true);
      const orderData = state.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const { error, message, orderId } = await insertOrder(
        tableNumber,
        orderData,
      );

      actionToast({ responseAction: { error, message } });

      if (!error && orderId) {
        localStorage.setItem("orderId", orderId);
        clearCart();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neo-brutalist-cart mx-auto mt-10 max-w-2xl bg-white p-6">
      <h1 className="mb-6 border-b-4 border-black pb-2 text-3xl font-black uppercase tracking-tighter">
        Keranjang Belanja
      </h1>

      <div className="mb-8">
        <label
          className="mb-2 block text-sm font-black uppercase"
          htmlFor="tableNumber"
        >
          Nomor Meja
        </label>
        <input
          type="number"
          className="neo-brutalist-input w-full bg-amber-50 px-4 py-3"
          placeholder="CONTOH: 12"
          min={0}
          value={tableNumber}
          required
          onChange={(e) =>
            isNaN(e.target.valueAsNumber)
              ? undefined
              : setTableNumber(e.target.valueAsNumber)
          }
        />
      </div>

      {state.items.length === 0 ? (
        <p className="inline-block border-2 border-black bg-black p-3 font-mono text-xl text-white">
          KERANJANG KOSONG 😢
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li
                key={item.id}
                className="neo-brutalist-item flex items-center justify-between border-b-4 border-black pb-4"
              >
                <div>
                  <p className="font-extrabold uppercase">{item.name}</p>
                  <p className="mt-1 inline-block bg-black px-2 py-1 font-mono text-sm text-white">
                    {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <Button
                    size="sm"
                    onClick={() => increaseQty(item.id)}
                    className="neo-brutalist-btn h-8 w-8 p-0 font-black"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => decreaseQty(item.id)}
                    className="neo-brutalist-btn h-8 w-8 p-0 font-black"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => removeFromCart(item.id)}
                    className="neo-brutalist-btn-destructive h-8 w-8 p-0"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t-4 border-black pt-4">
            <p className="text-2xl font-black">
              TOTAL: Rp {totalPrice.toLocaleString("id-ID")}
            </p>
            <div className="flex items-center gap-x-2">
              <Button
                variant="default"
                onClick={clearCart}
                className="neo-brutalist-btn-outline text-sm font-black uppercase"
              >
                Kosongkan
              </Button>
              <Button
                type="button"
                disabled={!tableNumber || loading}
                onClick={handleClick}
                className="neo-brutalist-btn-primary px-6 py-3 font-black uppercase"
              >
                {loading ? "MEMPROSES..." : "PESAN SEKARANG"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

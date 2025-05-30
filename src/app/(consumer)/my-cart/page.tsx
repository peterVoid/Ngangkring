import { Metadata } from "next";
import { PageClientCart } from "./pageClient";

export const metadata: Metadata = { title: "Keranjang Saya" };

export default function Page() {
  return (
    <div className="container my-6">
      <PageClientCart />
    </div>
  );
}

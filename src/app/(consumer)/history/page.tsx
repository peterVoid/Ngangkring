import { Metadata } from "next";
import { PageClient } from "./PageClient";

export const metadata: Metadata = { title: "History" };

export default function Page() {
  return (
    <div className="container my-6">
      <PageClient />
    </div>
  );
}

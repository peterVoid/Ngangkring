import { Metadata } from "next";
import { PageClient } from "./pageClient";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    from?: string;
    to?: string;
    page?: string;
    query?: string;
  }>;
}) {
  const { status, from, to, page, query } = await searchParams;

  return (
    <PageClient status={status} from={from} to={to} page={page} query={query} />
  );
}

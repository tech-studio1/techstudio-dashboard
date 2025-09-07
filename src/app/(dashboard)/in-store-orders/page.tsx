import React, { Suspense } from "react";
import TableLoader from "@/components/common/loader/table-loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InStoreOrderFilters from "@/modules/in-store-orders/in-store-order-filters";
import InStoreOrdersListModule from "@/modules/in-store-orders";

export default async function InStoreOrdersPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
    outlet?: string;
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const query = searchParams?.query || "";
  const outlet = searchParams?.outlet || "";
  const status = searchParams?.status || "";
  const payment_status = searchParams?.payment_status || "";
  const date_from = searchParams?.date_from || "";
  const date_to = searchParams?.date_to || "";
  const sort = searchParams?.sort || "";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">In-Store Orders</h1>
          <p className="text-muted-foreground">
            Manage walk-in customer orders from your physical store locations
          </p>
        </div>
        <Button variant="default" asChild>
          <Link href="/in-store-orders/create">New Order</Link>
        </Button>
      </div>

      <InStoreOrderFilters />

      <Suspense
        key={
          query +
          limit +
          page +
          outlet +
          status +
          payment_status +
          date_from +
          date_to
        }
        fallback={<TableLoader />}
      >
        <InStoreOrdersListModule
          page={page}
          limit={limit}
          query={query}
          outlet={outlet}
          status={status}
          payment_status={payment_status}
          date_from={date_from}
          date_to={date_to}
          sort={sort}
        />
      </Suspense>
    </div>
  );
}

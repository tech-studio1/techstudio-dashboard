import React, { Suspense } from "react";
import TableLoader from "@/components/common/loader/table-loader";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import InventoryFilters from "@/modules/inventory/inventory-filters";
import InventoryListModule from "@/modules/inventory";

export default async function InventoryListPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
    brand?: string;
    category?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams?.query || "";

  const status = searchParams?.status || "";
  const sort = searchParams?.sort || "";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        <Button variant="default" asChild>
          <Link href="inventory/new">Add Inventory</Link>
        </Button>
      </div>
      <InventoryFilters />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <InventoryListModule
          page={page}
          limit={limit}
          search={search}
          status={status}
          sort={sort}
        />
      </Suspense>
    </div>
  );
}

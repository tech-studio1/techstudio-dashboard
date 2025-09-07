import TableLoader from "@/components/common/loader/table-loader";
import BrandsListModule from "@/modules/brands";
import { AddBrandModule } from "@/modules/brands/add-brand";
import BrandFilters from "@/modules/brands/brand-filters";

import React, { Suspense } from "react";

async function BrandsPage(props: {
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
        <h2 className="text-2xl font-bold tracking-tight">Brands</h2>

        <AddBrandModule />
      </div>
      <BrandFilters />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <BrandsListModule
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

export default BrandsPage;

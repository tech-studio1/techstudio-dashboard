import React from "react";

import { handleGetBrands } from "@/app/actions/brands";
import { brandColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

async function BrandsListModule({
  page,
  limit,
  search,
  status,
  sort,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}) {
  const brands = await handleGetBrands({
    page: page,
    limit: limit,
    search: search,
    status: status,
    sort: sort,
  });

  return (
    <DataTable
      data={brands?.data || []}
      columns={brandColumns}
      pageCount={brands?.meta?.pages || 0}
      currentPage={brands?.meta?.page || 1}
      pageSize={brands?.meta?.limit || 10}
      totalItems={brands?.meta?.total || 0}
    />
  );
}

export default BrandsListModule;

import React from "react";

import { discountColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetDiscounts } from "@/app/actions/discount";

async function DiscountsListModule({
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
  const discounts = await handleGetDiscounts({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={discounts?.data || []}
      columns={discountColumns}
      pageCount={discounts?.meta?.pages || 0}
      currentPage={discounts?.meta?.page || 1}
      pageSize={discounts?.meta?.limit || 10}
      totalItems={discounts?.meta?.total || 0}
    />
  );
}

export default DiscountsListModule;

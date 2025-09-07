import React from "react";

import { orderColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetOrders } from "@/app/actions/orders";

async function OrdersListModule({
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
  const orders = await handleGetOrders({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={orders?.data || []}
      columns={orderColumns}
      pageCount={orders?.meta?.pages || 0}
      currentPage={orders?.meta?.page || 1}
      pageSize={orders?.meta?.limit || 10}
      totalItems={orders?.meta?.total || 0}
    />
  );
}

export default OrdersListModule;

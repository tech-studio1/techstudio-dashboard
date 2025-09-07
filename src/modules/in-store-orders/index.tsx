import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { getInStoreOrders } from "@/app/actions/in-store-orders";
import { inStoreOrderColumns } from "./columns";

async function InStoreOrdersListModule({
  page = 1,
  limit = 20,
  query,
}: {
  page?: number;
  limit?: number;
  query?: string;
  outlet?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
}) {
  const orders = await getInStoreOrders({
    page,
    limit,
    search: query,
  });

  return (
    <DataTable
      data={orders?.data || []}
      columns={inStoreOrderColumns}
      pageCount={orders?.total ? Math.ceil(orders.total / (limit || 10)) : 0}
      currentPage={page || 1}
      pageSize={limit || 10}
      totalItems={orders?.total || 0}
    />
  );
}

export default InStoreOrdersListModule;

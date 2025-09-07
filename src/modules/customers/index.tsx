import React from "react";
import { customersColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetCustomers } from "@/app/actions/customers";

async function CustomerListModule({
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
  const customers = await handleGetCustomers({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={customers?.data || []}
      columns={customersColumns}
      pageCount={customers?.meta?.pages || 0}
      currentPage={customers?.meta?.page || 1}
      pageSize={customers?.meta?.limit || 10}
      totalItems={customers?.meta?.total || 0}
    />
  );
}

export default CustomerListModule;

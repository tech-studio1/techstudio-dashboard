import React from "react";
import { inventoriesColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetInventories } from "@/app/actions/inventory";

async function InventoryListModule({
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
  const inventories = await handleGetInventories({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={inventories?.data || []}
      columns={inventoriesColumns}
      pageCount={inventories?.meta?.pages || 0}
      currentPage={inventories?.meta?.page || 1}
      pageSize={inventories?.meta?.limit || 10}
      totalItems={inventories?.meta?.total || 0}
    />
  );
}

export default InventoryListModule;

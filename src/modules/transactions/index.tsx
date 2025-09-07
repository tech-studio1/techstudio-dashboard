import React from "react";
import { transactionsColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetTransactions } from "@/app/actions/transactions";

async function TransactionListModule({
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
  const transactions = await handleGetTransactions({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={transactions?.data || []}
      columns={transactionsColumns}
      pageCount={transactions?.meta?.pages || 0}
      currentPage={transactions?.meta?.page || 1}
      pageSize={transactions?.meta?.limit || 10}
      totalItems={transactions?.meta?.total || 0}
    />
  );
}

export default TransactionListModule;

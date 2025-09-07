import React, { Suspense } from "react";
import TableLoader from "@/components/common/loader/table-loader";
import CustomerListModule from "@/modules/customers";
import CustomerFilters from "@/modules/customers/customer-filters";
import { AddCustomerModule } from "@/modules/customers/add-customer";

export default async function CustomersListPage(props: {
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
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <AddCustomerModule />
      </div>
      <CustomerFilters />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <CustomerListModule
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

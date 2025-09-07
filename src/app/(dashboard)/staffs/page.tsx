import React, { Suspense } from "react";
import TableLoader from "@/components/common/loader/table-loader";
import { Button } from "@/components/ui/button";
import StaffListModule from "@/modules/staffs";
import Link from "next/link";
import StaffFilters from "@/modules/staffs/staff-filters";

export default async function StaffListPage(props: {
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
        <h1 className="text-2xl font-bold mb-4">Staffs</h1>
        <Button variant="default" asChild>
          <Link href="staffs/new">Add Staff</Link>
        </Button>
      </div>
      <StaffFilters />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <StaffListModule
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

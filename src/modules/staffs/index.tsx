import React from "react";
import { staffsColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { handleGetStaffs } from "@/app/actions/staffs";

async function StaffListModule({
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
  const staffs = await handleGetStaffs({
    page: page,
    limit: limit,
    search: search,
    // status: status,
    // sort: sort,
  });

  return (
    <DataTable
      data={staffs?.data || []}
      columns={staffsColumns}
      pageCount={staffs?.meta?.pages || 0}
      currentPage={staffs?.meta?.page || 1}
      pageSize={staffs?.meta?.limit || 10}
      totalItems={staffs?.meta?.total || 0}
    />
  );
}

export default StaffListModule;

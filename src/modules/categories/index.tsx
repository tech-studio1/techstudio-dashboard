import React from "react";
import { handleGetCategories } from "@/app/actions/categories";
import { categoryColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

async function CategoryListModule({
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
  const categories = await handleGetCategories({
    page: page,
    limit: limit,
    search: search,
    status: status,
    sort: sort,
  });

  return (
    <DataTable
      data={categories?.data || []}
      columns={categoryColumns}
      pageCount={categories?.meta?.pages || 0}
      currentPage={categories?.meta?.page || 1}
      pageSize={categories?.meta?.limit || 10}
      totalItems={categories?.meta?.total || 0}
    />
  );
}

export default CategoryListModule;

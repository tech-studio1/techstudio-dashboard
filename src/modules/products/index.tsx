import { handleGetProducts } from "@/app/actions/products";
import React from "react";
import { productsColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

async function ProductListModule({
  page,
  limit,
  search,
  brand,
  category,
  status,
  sort,
}: {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  category?: string;
  status?: string;
  sort?: string;
}) {
  const products = await handleGetProducts({
    page: page,
    limit: limit,
    search: search,
    category: category,
    // brand: brand,
    // status: status,
    sort: sort,
  });
  console.log(products?.data?.[0]?.variants?.[0]?.status);

  return (
    <DataTable
      data={products?.data || []}
      columns={productsColumns}
      pageCount={products?.meta?.pages || 0}
      currentPage={products?.meta?.page || 1}
      pageSize={products?.meta?.limit || 10}
      totalItems={products?.meta?.total || 0}
    />
  );
}

export default ProductListModule;

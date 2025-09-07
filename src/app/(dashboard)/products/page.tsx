import React, { Suspense } from "react";
import { handleGetBrands } from "@/app/actions/brands";
import { handleGetCategories } from "@/app/actions/categories";
import TableLoader from "@/components/common/loader/table-loader";
import { Button } from "@/components/ui/button";
import ProductListModule from "@/modules/products";
import ProductFilters from "@/modules/products/product-filters";
import Link from "next/link";

export default async function ProductsListPage(props: {
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
  const categories = await handleGetCategories({
    page: 1,
    limit: 100,
  });

  const brands = await handleGetBrands({ page: 1, limit: 100 });

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams?.query || "";
  const brand = searchParams?.brand || "";
  const category = searchParams?.category || "";
  const status = searchParams?.status || "";
  const sort = searchParams?.sort || "";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <Button variant="default" asChild>
          <Link href="products/new">Add Product</Link>
        </Button>
      </div>
      <ProductFilters categories={categories?.data} brands={brands?.data} />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <ProductListModule
          page={page}
          limit={limit}
          search={search}
          brand={brand}
          category={category}
          status={status}
          sort={sort}
        />
      </Suspense>
    </div>
  );
}

import TableLoader from "@/components/common/loader/table-loader";
import CategoryListModule from "@/modules/categories";
import { AddCategoryModule } from "@/modules/categories/add-category";
import CategoryFilters from "@/modules/categories/category-filters";

import React, { Suspense } from "react";

async function CategoriesPage(props: {
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
  const sort = searchParams?.sort || "created_at-desc";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>

        <AddCategoryModule />
      </div>
      <CategoryFilters />
      <Suspense key={search + limit + page} fallback={<TableLoader />}>
        <CategoryListModule
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

export default CategoriesPage;

import { handleGetBrands } from "@/app/actions/brands";
import { handleGetCategories } from "@/app/actions/categories";
import ProductDetailsModule from "@/modules/product-details";
import React from "react";

async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const categories = await handleGetCategories({
    page: 1,
    limit: 100,
  });
  const brands = await handleGetBrands({
    page: 1,
    limit: 100,
  });

  return (
    <div className="container py-10">
      <ProductDetailsModule
        id={id}
        categories={categories?.data}
        brands={brands?.data}
      />
    </div>
  );
}

export default ProductEditPage;

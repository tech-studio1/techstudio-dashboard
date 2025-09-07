"use client";
import { handleGetSingleProduct, Product } from "@/app/actions/products";
import React, { useEffect, useState } from "react";
import { UpdateProductForm } from "./update-form";
import Fullloader from "@/components/common/loader/fullloader";
import { Brand } from "@/app/actions/brands";
import { Category } from "@/app/actions/categories";

function ProductDetailsModule({
  id,
  categories,
  brands,
}: {
  id: string;
  categories: Category[];
  brands: Brand[];
}) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch product data from your API endpoint
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await handleGetSingleProduct(id);
      // console.log("RES", res);

      // console.log("JSON", json);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch data when pagination, search, or sorting changes
  useEffect(() => {
    fetchData();
  }, [id]);
  return (
    <div>
      {data !== null && !loading ? (
        <UpdateProductForm
          data={data}
          categories={categories}
          brands={brands}
        />
      ) : (
        <Fullloader />
      )}
    </div>
  );
}

export default ProductDetailsModule;

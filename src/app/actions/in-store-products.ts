"use server";

import { auth } from "@/services/auth";
import type { Product } from "@/lib/types/order";
import { handleGetProducts, type Product as ApiProduct } from "./products";

interface GetProductsParams {
  search?: string;
  limit?: number;
  page?: number;
}

// Transform the API product format to our order product format
function transformProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    slug: apiProduct.slug,
    description: apiProduct.description,
    images: apiProduct.medias || [],
    status: apiProduct.status === "ACTIVE" ? "active" : "draft",
    price: apiProduct.pricing.price,
    compare_at_price: apiProduct.pricing.compareAtPrice,
    cost_per_item: apiProduct.pricing.costPerItem,
    sku: "", // Not directly available in API response
    barcode: "", // Not directly available in API response
    track_quantity: false, // Default
    continue_selling_when_out_of_stock: true, // Default for in-store
    inventory_quantity: 0, // Default
    variants:
      apiProduct.variants?.map((variant) => ({
        id: `${apiProduct.id}_${variant.color_code}`, // Generate variant ID
        title: variant.color_name || "Default",
        price: variant.price,
        compare_at_price: variant.compareAtPrice,
        cost_per_item: variant.costPerItem,
        sku: variant.sku,
        barcode: "",
        inventory_quantity: variant.quantity,
        color_name: variant.color_name,
        color_code: variant.color_code,
        size: "", // Not available in API
        weight: 0, // Not available in API
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) || [],
    tags: [], // Not available in API
    vendor: apiProduct.brand_details?.title || "",
    product_type: apiProduct.category_details?.title || "",
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at,
  };
}

export async function getProducts(params: GetProductsParams = {}): Promise<{
  data: Product[];
  total: number;
  error?: string;
}> {
  try {
    const result = await handleGetProducts({
      search: params.search,
      limit: params.limit || 20,
      page: params.page || 1,
    });

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch products");
    }

    const transformedProducts = result.data.map(transformProduct);

    return {
      data: transformedProducts,
      total: result.meta.total,
    };
  } catch (error) {
    console.error("Error fetching products for in-store:", error);
    return {
      data: [],
      total: 0,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

export async function getProduct(id: string): Promise<{
  data: Product | null;
  error?: string;
}> {
  try {
    const { handleGetSingleProduct } = await import("./products");
    const result = await handleGetSingleProduct(id);

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch product");
    }

    const transformedProduct = transformProduct(result.data);

    return {
      data: transformedProduct,
    };
  } catch (error) {
    console.error("Error fetching single product for in-store:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

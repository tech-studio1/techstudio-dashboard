"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  sort_by_price?: string;
  filter_lte?: string;
  filter_gte?: string;
}

export interface BrandDetails {
  id: string;
  title: string;
  slug: string;
  status: string;
  medias: string[];
  created_at: string;
  updated_at: string;
}

export interface CategoryDetails {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string;
  medias: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductPricing {
  compareAtPrice: number;
  costPerItem: number;
  price: number;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductVariant {
  color_code: string;
  color_name: string;
  compareAtPrice: number;
  costPerItem: number;
  price: number;
  quantity: number;
  sku: string;
  status?: "ACTIVE" | "DEACTIVE" | "STOCK_OUT";
  medias: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  medias: string[];
  pricing: ProductPricing;
  specs: ProductSpec[];
  status: string;
  brand: string;
  brand_details: BrandDetails;
  category: string;
  category_details: CategoryDetails;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
}

export interface Meta {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: Meta;
  status: number;
}

export const handleGetProducts = async ({
  page,
  limit,
  search,
  category,
  sort_by_price,
  sort = "name-asc",
  filter_lte,
  filter_gte,
}: GetProductsParams): Promise<ProductsApiResponse> => {
  // Construct the URL dynamically using the environment variable BASE_URL
  const baseUrl = `${process.env.BASE_URL}/v1/products/products`;
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (page !== undefined) params.append("page", page.toString());
  if (search !== undefined) params.append("search", search);
  if (category !== undefined) params.append("category", category);
  if (sort === "name-asc") {
    params.append("sort_by_field", "title");
    params.append("sort_by_dir", "asc");
  }
  if (sort_by_price !== undefined) {
    params.append("sort_by_field", "price");
    params.append("sort_by_dir", sort_by_price);
  }
  if (filter_lte !== undefined) params.append("price_lte", filter_lte);
  if (filter_gte !== undefined) params.append("price_gte", filter_gte);

  const url = `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
  // console.log("Fetching products from:", url);

  try {
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json",
      },
    });
    const result: ProductsApiResponse = await response.json();
    // console.log(result);

    if (result?.success) {
      return result;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const handleGetSingleProduct = async (id: string) => {
  // console.log("order", id);
  const session = await auth();
  // console.log("called with id", id);
  // console.log(session);
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/v1/products/products/${id}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const result = await response.json();
    // console.log(result);
    if (result?.success) {
      return result;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch product data");
  }
};

export const handleEditProduct = async ({
  body,
  id,
}: {
  body: any;
  id: string;
}) => {
  const uri = `${process.env.BASE_URL}/v1/products/products/${id}
`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleCreateProduct = async ({ body }: { body: any }) => {
  const uri = `${process.env.BASE_URL}/v1/products/products`;
  const session = await auth();
  // console.log({ uri, t: session?.token });
  // console.log(JSON.stringify(body));
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleDeleteProduct = async (id: string) => {
  const uri = `${process.env.BASE_URL}/v1/products/products/${id}`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    const result = await response.json();
    // console.log(result);
    if (!result?.success) {
      throw new Error(result?.message);
    }
    revalidatePath("/products");
    return result;
  } catch (error) {
    throw error;
  }
};

"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface Brand {
  created_at: string;
  id: string;
  medias: string[];
  sequence?: number;
  slug: string;
  status: string; // You might want to use an enum here if status has specific values
  title: string;
  description?: string;
  updated_at: string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Brand[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleBrandApiResponse {
  data: Brand;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetBrands = async ({
  page,
  limit,
  search,
  sort,
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/brand/brands`;
  const session = await auth();
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (page !== undefined) params.append("page", page.toString());
  if (search !== undefined) params.append("search", search);
  if (status !== undefined && status !== "") params.append("status", status);
  if (sort !== undefined) {
    params.append("sort_by_field", sort?.split("-")[0]);
    params.append("sort_by_dir", sort?.split("-")[1]);
  }

  const url = `${base_uri}${params.toString() ? `?${params.toString()}` : ""}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

interface BrandBody {
  title: string;
  description?: string;
  details?: string;
  medias?: string[];
  parent?: string;
  status: string;
}

export const handlePostBrand = async (body: BrandBody) => {
  const uri = `${process.env.BASE_URL}/v1/brand/brands`;
  const session = await auth();
  // console.log(body);
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    // console.log(response);
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    revalidatePath("/brands");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleEditBrand = async ({
  body,
  id,
}: {
  body: BrandBody;
  id: string;
}) => {
  const uri = `${process.env.BASE_URL}/v1/brand/brands/${id}`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    revalidatePath("/brands");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleDeleteBrand = async (id: string) => {
  const uri = `${process.env.BASE_URL}/v1/brand/brands/${id}`;
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
    revalidatePath("/brands");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleGetSingleBrand = async (
  id: string
): Promise<SingleBrandApiResponse> => {
  const uri = `${process.env.BASE_URL}/v1/brand/brands/${id}`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    // console.log(result);

    return result;
  } catch (error) {
    throw error;
  }
};

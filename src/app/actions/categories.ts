"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface SubcategoriesCount {
  count: number;
}

export interface Category {
  created_at: string;
  description: string;
  id: string;
  medias: string[];
  slug: string;
  featured?: boolean;
  featured_sequence?: number;
  sequence?: number;
  status: string; // You might want to use an enum here if status has specific values
  sub_categories?: Category[];
  parent?: Category;
  title: string;
  updated_at: string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Category[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleCategoryApiResponse {
  data: Category;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetCategories = async ({
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
  const base_uri = `${process.env.BASE_URL}/v1/category/categories`;
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

interface CategoryBody {
  title: string;
  description?: string;
  details?: string;
  medias?: string[];
  parent?: string;
  status: string;
}

export const handlePostCategory = async (body: CategoryBody) => {
  const uri = `${process.env.BASE_URL}/v1/category/categories`;
  const session = await auth();
  // console.log("token", session?.token);
  // console.log(body);
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify({ ...body, parent: "", details: "" }),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    console.log("Create Response", response);
    const result = await response.json();
    // console.log(result);
    if (!result.success) {
      throw new Error("Bad Request");
    }
    revalidatePath("/categories");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleEditCategory = async ({
  body,
  id,
}: {
  body: CategoryBody;
  id: string;
}) => {
  const uri = `${process.env.BASE_URL}/v1/category/categories/${id}`;
  const session = await auth();
  // console.log("token", session?.token);
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
    console.log("Edit Response", response);
    const result = await response.json();
    // console.log(result);
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    revalidatePath("/categories");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleDeleteCategory = async (id: string) => {
  const uri = `${process.env.BASE_URL}/v1/category/categories/${id}`;
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
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleGetSingleCategory = async (
  id: string
): Promise<SingleCategoryApiResponse> => {
  const uri = `${process.env.BASE_URL}/v1/category/categories/${id}`;
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

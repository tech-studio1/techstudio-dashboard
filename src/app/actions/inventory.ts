"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import {
  BrandDetails,
  CategoryDetails,
  ProductPricing,
  ProductSpec,
  ProductVariant,
} from "./products";

export interface Inventory {
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
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Inventory[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleInventoryApiResponse {
  data: Inventory;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetInventories = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/inventory/inventories`;
  const session = await auth();
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (page !== undefined) params.append("page", page.toString());
  if (search !== undefined) params.append("search", search);

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

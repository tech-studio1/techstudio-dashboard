"use server";

import { auth } from "@/services/auth";

export interface Discount {
  created_at: string;
  id: string;
  updated_at: string;
  code: string;
  title: string;
  description: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  start_date: string;
  end_date: string;
  min_purchase_amount: number;
  max_discount_amount: number;
  max_uses: number;
  is_active: boolean;
  applicable_to: {
    scope: "ALL";
    // scope: "ALL" | "PRODUCTS" | "CATEGORIES" | "BRANDS";
    products: string[];
    categories: string[];
    brands: string[];
  };
  rules: {
    customer_type: ("NEW" | "RETURNING" | "VIP")[];
    first_purchase_only: boolean;
    one_use_per_customer: boolean;
  };
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Discount[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetDiscounts = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/discount/discounts`;
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

export const handleCreateDiscount = async ({ body }: { body: any }) => {
  const uri = `${process.env.BASE_URL}/v1/discount/discounts`;
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

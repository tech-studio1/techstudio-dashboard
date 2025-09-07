"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface Transaction {
  created_at: string;
  id: string;
  status: string; // You might want to use an enum here if status has specific values
  updated_at: string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Transaction[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleTransactionApiResponse {
  data: Transaction;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetTransactions = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/transaction/transactions`;
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

"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  status: "ACTIVE" | "INACTIVE";
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  area: string;
  city: string;
  district: string;
  mobile: string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Customer[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleCustomerApiResponse {
  data: Customer;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export interface CreateCustomerData {
  first_name: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  status?: "ACTIVE" | "INACTIVE";
  address?: string;
  area?: string;
  city?: string;
  district?: string;
  mobile: string;
}

export interface UpdateCustomerData extends CreateCustomerData {
  id: string;
}

export const handleGetCustomers = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/customer/customers`;
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
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleGetSingleCustomer = async (
  id: string
): Promise<SingleCustomerApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/customer/customers/${id}`;
  const session = await auth();

  try {
    const response = await fetch(base_uri, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleCreateCustomer = async (
  data: CreateCustomerData
): Promise<SingleCustomerApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/customer/customers`;
  const session = await auth();

  try {
    const response = await fetch(base_uri, {
      method: "POST",
      body: JSON.stringify(data),
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
    revalidatePath("/customers");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleUpdateCustomer = async (
  id: string,
  data: CreateCustomerData
): Promise<SingleCustomerApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/customer/customers/${id}`;
  const session = await auth();

  try {
    const response = await fetch(base_uri, {
      method: "PUT",
      body: JSON.stringify(data),
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
    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    return result;
  } catch (error) {
    throw error;
  }
};

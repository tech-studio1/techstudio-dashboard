"use server";

import { Order as OrderUpdated } from "@/lib/types/order";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export interface Address {
  address: string;
  area: string;
  city: string;
  district: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

export interface ClientInfo {
  billingAddress: Address;
  paymentMethod: string;
  sameAsBilling: boolean;
  shippingAddress: Address;
}

export interface CostPerItem {
  compareAtPrice: number;
  costPerItem: number;
  price: number;
}

export interface VariantInfo extends CostPerItem {
  color_code: string;
  color_name: string;
  quantity: number;
  sku: string;
}

export interface OrderItem {
  costPerItem: CostPerItem;
  id: string;
  quantity: number;
  variantInfo: VariantInfo;
  title?: string;
  image?: string;
}

export interface Pricing {
  items_cost: number;
  shipping: number;
  total_cost: number;
}

export interface Order {
  client_info: ClientInfo;
  id: string;
  order_items: OrderItem[];
  // pricing: Pricing;
  created_at: string; // ISO timestamp
  discount_amount: number;
  order_number: string;
  payment_status: "PENDING" | "PAID" | "FAILED" | string;
  pricing: {
    discount: number;
    items_cost: number;
    shipping: number;
    tax: number;
    total_cost: number;
  };
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  updated_at: string; // ISO timestamp
  notes?: string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: OrderUpdated[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export interface SingleApiResponse {
  data: OrderUpdated;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetOrders = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/order/orders`;
  const session = await auth();
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (page !== undefined) params.append("page", page.toString());
  if (search !== undefined) params.append("search", search);
  params.append("order_type", "ONLINE");

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
export const handleGetSingleOrder = async (
  id: string
): Promise<SingleApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/order/orders/${id}`;
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
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleChangeOrderStatus = async ({
  id,
  body,
}: {
  id: string;
  body: { status: string };
}) => {
  const base_uri = `${process.env.BASE_URL}/v1/order/orders/${id}/status`;
  const session = await auth();
  try {
    const response = await fetch(base_uri, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    const result = await response.json();
    // console.log(result);
    revalidatePath("/orders");
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleCancelOrder = async ({
  id,
  body,
}: {
  id: string;
  body: { reason: string };
}) => {
  const base_uri = `${process.env.BASE_URL}/v1/order/orders/${id}/cancel`;
  const session = await auth();

  try {
    const response = await fetch(base_uri, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

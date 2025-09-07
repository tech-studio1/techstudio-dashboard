"use server";

import { auth } from "@/services/auth";
import type { Order, OrderFilters } from "@/lib/types/order";
import type { CreateOrderData, OrderFiltersData } from "@/lib/schemas/order";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.BASE_URL;

export async function getInStoreOrders(
  filters: OrderFiltersData
): Promise<{ data: Order[]; total: number; error?: string }> {
  try {
    const session = await auth();

    if (!session?.token) {
      return { data: [], total: 0, error: "Unauthorized" };
    }

    // Build query parameters
    const params = new URLSearchParams({
      order_type: "IN_STORE",
      page: filters.page?.toString() || "1",
      limit: filters.limit?.toString() || "20",
    });

    // if (filters.outlet) {
    //   params.set("filter[outlet]", filters.outlet);
    // }
    // if (filters.status) {
    //   params.set("filter[status]", filters.status);
    // }
    // if (filters.payment_status) {
    //   params.set("filter[payment_status]", filters.payment_status);
    // }
    // if (filters.date_from) {
    //   params.set("filter[date_from]", filters.date_from);
    // }
    // if (filters.date_to) {
    //   params.set("filter[date_to]", filters.date_to);
    // }
    if (filters.search) {
      params.set("search", filters.search);
    }

    const response = await fetch(
      `${BASE_URL}/v1/order/orders?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "content-type": "application/json",
          "x-shop-ns": "techstudio",
          "x-shop-db": "techstudio",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result.data || result.orders || [],
      total: result.total || result.data?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching in-store orders:", error);
    return { data: [], total: 0, error: "Failed to fetch orders" };
  }
}

export async function getInStoreOrder(
  id: string
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();
    if (!session?.token) {
      return { data: null, error: "Unauthorized" };
    }

    const response = await fetch(`${BASE_URL}/v1/order/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        "content-type": "application/json",
        "x-shop-ns": "techstudio",
        "x-shop-db": "techstudio",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const result = await response.json();
    return { data: result.data || result };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { data: null, error: "Failed to fetch order" };
  }
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();
    if (!session?.token) {
      return { data: null, error: "Unauthorized" };
    }

    const response = await fetch(
      `${BASE_URL}/v1/order/orders/by-number/${orderNumber}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "content-type": "application/json",
          "x-shop-ns": "techstudio",
          "x-shop-db": "techstudio",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    const result = await response.json();
    return { data: result.data || result };
  } catch (error) {
    console.error("Error fetching order by number:", error);
    return { data: null, error: "Failed to fetch order" };
  }
}

export async function createInStoreOrder(
  orderData: any
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();

    if (!session?.token) {
      return { data: null, error: "Unauthorized - Please sign in again" };
    }

    // Calculate pricing
    const items_cost = orderData.order_items.reduce(
      (total: number, item: any) => {
        const itemPrice = item.costPerItem.price; // Use the price from costPerItem (already updated if customPrice was set)
        return total + itemPrice * item.quantity;
      },
      0
    );

    const discount = orderData.discount || 0;
    const shipping = 0; // No shipping for in-store
    const total_cost = Math.max(0, items_cost - discount + shipping);

    const payload = {
      customer: orderData.customer || null,
      order_items: orderData.order_items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        title: item.title,
        image: item.image,
        ...(item.serial_number && { serial_number: item.serial_number }),
        costPerItem: {
          compareAtPrice: item.costPerItem.compareAtPrice,
          costPerItem: item.costPerItem.costPerItem,
          price: item.costPerItem.price, // Use the updated price from costPerItem
        },
        ...(item.variantInfo && { variantInfo: item.variantInfo }),
      })),
      pricing: {
        items_cost,
        shipping,
        discount,
        total_cost,
      },
      payment_info: orderData.payment_info,
      notes: orderData.notes || "",
    };

    const response = await fetch(`${BASE_URL}/v1/order/orders/in-store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Order creation failed:", error);
      throw new Error(`Failed to create order (${response.status}): ${error}`);
    }

    const result = await response.json();

    // Revalidate the orders page
    revalidatePath("/orders/in-store");

    return { data: result.data || result };
  } catch (error) {
    console.error("Error creating in-store order:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();
    if (!session?.token) {
      return { data: null, error: "Unauthorized" };
    }

    const response = await fetch(
      `${BASE_URL}/v1/order/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "content-type": "application/json",
          "x-shop-ns": "techstudio",
          "x-shop-db": "techstudio",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }

    const result = await response.json();

    // Revalidate the orders page
    revalidatePath("/orders/in-store");

    return { data: result.data || result };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { data: null, error: "Failed to update order status" };
  }
}

export async function updateOrderPayment(
  orderId: string,
  paymentData: { payment_status: Order["payment_status"]; payment_info?: any }
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();
    if (!session?.token) {
      return { data: null, error: "Unauthorized" };
    }

    const response = await fetch(
      `${BASE_URL}/v1/order/orders/${orderId}/payment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "content-type": "application/json",
          "x-shop-ns": "techstudio",
          "x-shop-db": "techstudio",
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update payment: ${response.statusText}`);
    }

    const result = await response.json();

    // Revalidate the orders page
    revalidatePath("/orders/in-store");

    return { data: result.data || result };
  } catch (error) {
    console.error("Error updating order payment:", error);
    return { data: null, error: "Failed to update payment" };
  }
}

export async function cancelOrder(
  orderId: string
): Promise<{ data: Order | null; error?: string }> {
  try {
    const session = await auth();
    if (!session?.token) {
      return { data: null, error: "Unauthorized" };
    }

    const response = await fetch(
      `${BASE_URL}/v1/order/orders/${orderId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "content-type": "application/json",
          "x-shop-ns": "techstudio",
          "x-shop-db": "techstudio",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`);
    }

    const result = await response.json();

    // Revalidate the orders page
    revalidatePath("/orders/in-store");

    return { data: result.data || result };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return { data: null, error: "Failed to cancel order" };
  }
}

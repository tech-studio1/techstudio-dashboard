export interface Order {
  id: string;
  order_number: string; // Auto-generated: ORD-{uuid-8chars}-{timestamp}
  order_type: "IN_STORE"; // Fixed for this module
  outlet: {
    id: string;
    name: string;
    code: string;
    address?: string;
    district?: string;
    contactPerson?: string;
    contactPhone?: string;
  };
  customer?: CustomerInfo;
  // Order Items (no inventory validation required)
  order_items: OrderItem[];

  // Pricing
  pricing: {
    items_cost: number;
    shipping: number; // Usually 0 for in-store
    tax?: number;
    discount?: number;
    total_cost: number;
  };

  // Customer Info (Optional for walk-ins)
  account?: {
    id: string;
    email?: string;
    // ... other account fields
  };
  client_info?: {
    billingAddress?: CustomerAddress;
    sameAsBilling: boolean;
    shippingAddress?: CustomerAddress;
    paymentMethod: "CASH" | "POS_CARD" | "BKASH" | "NAGAD"; // Manual entry only
  };

  // Discount (if applicable)
  applied_discount?: DiscountRecord;
  discount_amount?: number;

  // Payment (Manual processing)
  payment_status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  payment_info?: {
    bkashNumber?: string;
    bkashTransactionId?: string;
    cardLastFourDigits?: string;
    paymentNote?: string;
    paymentMethod?: string;
    mobileNumber?: string;
    transactionId?: string;
    cardNumber?: string;
    note?: string;
  };

  // Status & Metadata
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED" | "RETURNED";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string; // Product ID
  title?: string;
  image?: string;
  quantity: number; // No stock validation needed
  serial_number?: string;
  costPerItem: {
    price: number;
    compareAtPrice: number;
    costPerItem: number;
  };
  variantInfo?: {
    sku?: string;
    color_name?: string;
    color_code?: string;
    price?: number;
    compareAtPrice?: number;
    costPerItem?: number;
    quantity?: number;
  };
}

export interface CustomerAddress {
  firstName: string;
  lastName?: string;
  mobile: string;
  address: string;
  area?: string;
  city: string;
  district: string;
}

export interface Outlet {
  id: string;
  name: string;
  code: string; // Unique identifier
  address?: string;
  district?: string;
  contactPerson?: string;
  contactPhone?: string;
  open_hours?: string;
  close_days?: string[];
  type?: string;
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  status: "active" | "draft" | "archived";
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  sku?: string;
  barcode?: string;
  track_quantity: boolean;
  continue_selling_when_out_of_stock: boolean;
  inventory_quantity?: number;
  variants?: ProductVariant[];
  tags?: string[];
  vendor?: string;
  product_type?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  sku?: string;
  barcode?: string;
  inventory_quantity?: number;
  color_name?: string;
  color_code?: string;
  size?: string;
  weight?: number;
  created_at: string;
  updated_at: string;
}

export interface DiscountRecord {
  id: string;
  title: string;
  code?: string;
  discount_type: "percentage" | "fixed_amount";
  value: number;
  minimum_requirements?: {
    type: "minimum_purchase_amount" | "minimum_quantity_of_items";
    value: number;
  };
}

export interface PaymentInfo {
  bkashNumber?: string;
  bkashTransactionId?: string;
  cardLastFourDigits?: string;
  paymentNote?: string;
  paymentMethod?: string;
}

export interface CustomerInfo {
  first_name: string;
  last_name?: string;
  mobile: string;
  email?: string;
  address?: string;
  area?: string;
  city?: string;
  district?: string;
}

export interface OrderFilters {
  outlet?: string;
  status?: Order["status"];
  payment_status?: Order["payment_status"];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const ORDER_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-gray-100 text-gray-800",
} as const;

export const PAYMENT_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
} as const;

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash Payment", requiresDetails: false },
  {
    value: "POS_CARD",
    label: "POS Machine (Card)",
    requiresDetails: true,
    fields: ["cardLastFourDigits", "paymentNote"],
  },
  {
    value: "BKASH",
    label: "bKash",
    requiresDetails: true,
    fields: ["bkashNumber", "bkashTransactionId"],
  },
  {
    value: "NAGAD",
    label: "Nagad",
    requiresDetails: true,
    fields: ["nagadNumber", "nagadTransactionId"],
  },
] as const;

import { z } from "zod";

// Helper type for the coupon form
export type CouponFormType = {
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
};

// Define item types with title and id
export type SelectableItem = {
  id: string;
  title: string;
};

// Mock data for selectable items
export const mockProducts: SelectableItem[] = [
  { id: "prod_1", title: "Premium Headphones" },
  { id: "prod_2", title: "Wireless Keyboard" },
  { id: "prod_3", title: "Ergonomic Mouse" },
  { id: "prod_4", title: "4K Monitor" },
  { id: "prod_5", title: "Laptop Stand" },
];

export const mockCategories: SelectableItem[] = [
  { id: "cat_1", title: "Electronics" },
  { id: "cat_2", title: "Home Office" },
  { id: "cat_3", title: "Audio" },
  { id: "cat_4", title: "Computer Accessories" },
  { id: "cat_5", title: "Smartphones" },
];

export const mockBrands: SelectableItem[] = [
  { id: "brand_1", title: "TechPro" },
  { id: "brand_2", title: "HomeStyle" },
  { id: "brand_3", title: "AudioMax" },
  { id: "brand_4", title: "ComputeX" },
  { id: "brand_5", title: "MobileWave" },
];

// Default form values
export const defaultCouponValues: CouponFormType = {
  code: "",
  title: "",
  description: "",
  discount_type: "PERCENTAGE",
  discount_value: 1,
  start_date: "",
  end_date: "",
  min_purchase_amount: 1,
  max_discount_amount: 1,
  max_uses: 1,
  is_active: true,
  applicable_to: {
    scope: "ALL",
    products: [],
    categories: [],
    brands: [],
  },
  rules: {
    customer_type: ["NEW"],
    first_purchase_only: true,
    one_use_per_customer: true,
  },
};

// Zod schema for validation
export const couponFormSchema = z.object({
  code: z
    .string()
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code can only contain uppercase letters, numbers, underscores, and hyphens"
    )
    .min(3, "Code must be at least 3 characters"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discount_value: z.number().positive("Must be a positive number"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  min_purchase_amount: z.number().nonnegative("Cannot be negative"),
  max_discount_amount: z.number().positive("Must be a positive number"),
  max_uses: z.number().int().positive("Must be a positive integer"),
  is_active: z.boolean(),
  applicable_to: z.object({
    scope: z.enum(["ALL", "PRODUCTS", "CATEGORIES", "BRANDS"]),
    products: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    brands: z.array(z.string()).optional(),
  }),
  rules: z.object({
    customer_type: z.array(z.enum(["NEW", "RETURNING", "VIP"])),
    first_purchase_only: z.boolean(),
    one_use_per_customer: z.boolean(),
  }),
});

// Format date to ISO string
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Format date for display
export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Generate a random coupon code
export const generateCouponCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

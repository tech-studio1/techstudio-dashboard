import { z } from "zod";

export const customerAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number is required"),
  address: z.string().min(5, "Address is required"),
  area: z.string().optional(),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
});

export const customerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

export const paymentInfoSchema = z.object({
  bkashNumber: z.string().optional(),
  bkashTransactionId: z.string().optional(),
  cardLastFourDigits: z.string().optional(),
  paymentNote: z.string().optional(),
});

export const orderItemSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  title: z.string().optional(),
  image: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  costPerItem: z.object({
    price: z.number().min(0, "Price must be non-negative"),
    compareAtPrice: z.number().min(0),
    costPerItem: z.number().min(0),
  }),
  variantInfo: z
    .object({
      sku: z.string().optional(),
      color_name: z.string().optional(),
      color_code: z.string().optional(),
      price: z.number().optional(),
      compareAtPrice: z.number().optional(),
      costPerItem: z.number().optional(),
      quantity: z.number().optional(),
    })
    .optional(),
});

export const createOrderSchema = z
  .object({
    outlet: z.string().min(1, "Outlet is required"),
    order_items: z
      .array(orderItemSchema)
      .min(1, "At least one item is required"),
    paymentMethod: z.enum(["CASH", "POS_CARD", "BKASH", "NAGAD"], {
      required_error: "Payment method is required",
    }),
    paymentInfo: paymentInfoSchema.optional(),
    customer: customerInfoSchema.optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate payment info based on payment method
    if (data.paymentMethod === "BKASH") {
      if (!data.paymentInfo?.bkashNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "bKash number is required for bKash payment",
          path: ["paymentInfo", "bkashNumber"],
        });
      }
      if (!data.paymentInfo?.bkashTransactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "bKash transaction ID is required for bKash payment",
          path: ["paymentInfo", "bkashTransactionId"],
        });
      }
    }

    if (data.paymentMethod === "NAGAD") {
      if (!data.paymentInfo?.bkashNumber) {
        // Using same field for Nagad number
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nagad number is required for Nagad payment",
          path: ["paymentInfo", "bkashNumber"],
        });
      }
      if (!data.paymentInfo?.bkashTransactionId) {
        // Using same field for Nagad transaction ID
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nagad transaction ID is required for Nagad payment",
          path: ["paymentInfo", "bkashTransactionId"],
        });
      }
    }
  });

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type OrderFiltersData = z.infer<typeof orderFiltersSchema>;

import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  title: z.string().optional(),
  image: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  serial_number: z.string().optional(),
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

export const customerInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number is required"),
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

export const paymentInfoSchema = z.object({
  paymentMethod: z.enum(["CASH", "BKASH", "NAGAD", "CARD"], {
    required_error: "Payment method is required",
  }),
  cardNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  transactionId: z.string().optional(),
  note: z.string().optional(),
});

export const createInStoreOrderSchema = z
  .object({
    order_items: z
      .array(orderItemSchema)
      .min(1, "At least one product is required"),
    discount: z.number().min(0, "Discount must be non-negative").optional(),
    payment_info: paymentInfoSchema,
    customer: customerInfoSchema,
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate payment info based on payment method
    if (data.payment_info?.paymentMethod === "BKASH") {
      if (!data.payment_info?.mobileNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "bKash number is required for bKash payment",
          path: ["payment_info", "mobileNumber"],
        });
      }
      if (!data.payment_info?.transactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "bKash transaction ID is required for bKash payment",
          path: ["payment_info", "transactionId"],
        });
      }
    }

    if (data.payment_info?.paymentMethod === "NAGAD") {
      if (!data.payment_info?.mobileNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nagad number is required for Nagad payment",
          path: ["payment_info", "mobileNumber"],
        });
      }
      if (!data.payment_info?.transactionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nagad transaction ID is required for Nagad payment",
          path: ["payment_info", "transactionId"],
        });
      }
    }

    if (data.payment_info?.paymentMethod === "CARD") {
      if (!data.payment_info?.cardNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number is required for card payment",
          path: ["payment_info", "cardNumber"],
        });
      }
    }
  });

export type CreateInStoreOrderData = z.infer<typeof createInStoreOrderSchema>;
export type OrderItemData = z.infer<typeof orderItemSchema>;
export type CustomerInfoData = z.infer<typeof customerInfoSchema>;
export type PaymentInfoData = z.infer<typeof paymentInfoSchema>;

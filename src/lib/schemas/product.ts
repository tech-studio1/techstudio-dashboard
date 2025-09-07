import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  medias: z.array(z.string()).optional(),
  features: z.array(z.string().optional()).optional(),
  pricing: z.object({
    price: z.coerce.number().min(1, "Price is required"),
    compareAtPrice: z.coerce.number().min(1, "Price is required"),
    costPerItem: z.coerce.number().min(1, "Cost per item is required"),
  }),
  category: z.string().optional(),
  status: z.string().optional(),
  brand: z.string().optional(),
  inventory: z
    .object({
      sku: z.string().min(1, "SKU is required"),
      quantity: z.coerce.number().min(1, "Quantity is required"),
    })
    .optional(),
  variants: z
    .array(
      z.object({
        color_name: z.string().min(1, "Color name is required"),
        color_code: z.string().min(1, "Color code is required"),
        price: z.coerce.number().min(1, "Price is required"),
        compareAtPrice: z.coerce.number().min(1, "Price is required"),
        costPerItem: z.coerce.number().min(1, "Price is required"),
        sku: z.string().optional(),
        quantity: z.coerce.number().optional(),
        status: z.enum(["ACTIVE", "DEACTIVE", "STOCK_OUT"]).default("ACTIVE"),
        medias: z.array(z.string()).optional(),
      })
    )
    .min(1, "At least one variant is required"),
  specs: z.array(
    z
      .object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      })
      .optional()
  ),
  description: z.string().min(1, "Description is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

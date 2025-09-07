"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductFormValues, productSchema } from "@/lib/schemas/product";
import { TitleSection } from "@/modules/add-product/sections/title-section";
import { FeaturesSection } from "@/modules/add-product/sections/features-section";
import { PricingSection } from "@/modules/add-product/sections/pricing-section";
import { VariantsSection } from "@/modules/add-product/sections/variants-section";
import { SpecsSection } from "@/modules/add-product/sections/specs-section";
import { DescriptionSection } from "@/modules/add-product/sections/description-section";
import { toast } from "sonner";
import { handleEditProduct, Product } from "@/app/actions/products";
import { MediaSection } from "../add-product/sections/media-sections";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Circle } from "lucide-react";
import { Category } from "@/app/actions/categories";
import { Brand } from "@/app/actions/brands";
import { decode as htmlDecode } from "he";
import createDOMPurify from "dompurify";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BasicInfoSection from "../add-product/sections/basic-info-section";

const decodeSmart = (input: string | string[] | undefined | null): string => {
  if (!input) return "";

  const raw = Array.isArray(input) ? input[0] : input;

  try {
    const uriDecoded = decodeURIComponent(raw);
    return htmlDecode(uriDecoded);
  } catch (e) {
    return htmlDecode(raw);
  }
};

export function UpdateProductForm({
  data,
  categories,
  brands,
}: {
  data: Product;
  categories: Category[];
  brands: Brand[];
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: data?.title,
      category: data?.category,
      brand: data?.brand,
      features: data?.features,
      variants: data?.variants,
      specs: data?.specs ?? [{ key: "", value: "" }],
      pricing: data?.pricing,
      medias: data?.medias,
      status: data?.status,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      if (data?.id) {
        const result = await handleEditProduct({
          body: values,
          id: data?.id?.replace("product:", ""),
        });
        // console.log(result);
        toast.success("Product updated successfully");
      }
      form.reset();
      router.push("/products");
    } catch (error) {
      // console.log("product update Error", JSON.stringify(error));
      toast.error("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (typeof window !== "undefined") {
      const DOMPurify = createDOMPurify(window); // Initialize DOMPurify
      const decoded = decodeSmart(data?.description); // Decode the description
      const clean = DOMPurify.sanitize(decoded).toString(); // Sanitize the decoded description
      form.setValue("description", clean); // Set the sanitized description in the form
      setLoading(false);
    }
  }, [data?.description, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <h1 className="text-3xl font-bold mb-8 md:col-span-3">
            Update Product
          </h1>
        </div>
        <div className="grid gap-8">
          {!loading && (
            <BasicInfoSection categories={categories} brands={brands} />
          )}
          {/* <TitleSection categories={[]} brands={[]} /> */}
          <MediaSection />

          <PricingSection form={form} />
          {/* <InventorySection form={form} /> */}
          <VariantsSection />
          <FeaturesSection />
          <SpecsSection form={form} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <Circle className="animate-spin duration-300 ease-in-out transition-all" />
          ) : (
            <span>Update</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

const status = [
  { label: "Active", value: "ACTIVE" },
  { label: "Deactive", value: "DEACTIVE" },
  { label: "Pending", value: "PENDING" },
];

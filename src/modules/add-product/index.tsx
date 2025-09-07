"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProductFormValues, productSchema } from "@/lib/schemas/product";
import { TitleSection } from "@/modules/add-product/sections/title-section";
import { FeaturesSection } from "@/modules/add-product/sections/features-section";
import { PricingSection } from "@/modules/add-product/sections/pricing-section";
import { VariantsSection } from "@/modules/add-product/sections/variants-section";
import { SpecsSection } from "@/modules/add-product/sections/specs-section";
import { DescriptionSection } from "@/modules/add-product/sections/description-section";
import { toast } from "sonner";
import { handleCreateProduct } from "@/app/actions/products";
import { MediaSection } from "../add-product/sections/media-sections";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Circle } from "lucide-react";
import { Category } from "@/app/actions/categories";
import { Brand } from "@/app/actions/brands";
import BasicInfoSection from "./sections/basic-info-section";

export function AddProductModule({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      features: [""],
      variants: [],
      specs: [],
      status: "PENDING",
    },
  });

  // console.log(form.formState.errors);

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      // Escape HTML content in description
      const sanitizedValues = {
        ...values,
        description: values?.description
          ? encodeURIComponent(values?.description)
          : values?.description,
      };

      const result = await handleCreateProduct({
        body: sanitizedValues,
      });
      toast.success("Product created successfully");
      // Reset form with default values after successful submission
      form.reset({
        features: [""],
        variants: [],
        specs: [],
        status: "PENDING",
      });
      router.push("/products");
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <BasicInfoSection
            generateSlugFromTitle
            categories={categories}
            brands={brands}
          />
          <MediaSection />
          <PricingSection form={form} />
          <VariantsSection />
          <FeaturesSection />
          <SpecsSection form={form} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <Circle className="animate-spin duration-300 ease-in-out transition-all" />
          ) : (
            <span>Add</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

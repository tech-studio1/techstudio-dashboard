"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "@/lib/schemas/product";
import ProductMultiFileDropzone from "@/components/file-upload/product-file-drop-zone";
import FormSection from "@/components/ui/form-section";

export function MediaSection() {
  return (
    <FormSection
      title="Media"
      description="Upload product images. Drag to reorder."
    >
      <ProductMultiFileDropzone title="Medias" className="pb-6" />
    </FormSection>
  );
}

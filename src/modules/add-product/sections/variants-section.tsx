"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import VariantMultiFileDropzone from "./variant-media-drop";
import { ProductFormValues } from "@/lib/schemas/product";
import FormSection from "@/components/ui/form-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VariantsSection() {
  const form = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  return (
    <FormSection
      title="Variants"
      description="Add product variants for different colors, sizes, etc."
    >
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 p-4 border rounded-lg relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="grid gap-4 sm:grid-cols-5">
            <FormField
              control={form.control}
              name={`variants.${index}.color_name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter color name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.color_code`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Code</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        className="w-[100px] h-10 p-1"
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="#000000"
                      className="font-mono"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.compareAtPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.costPerItem`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Item</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.sku`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DEACTIVE">Deactive</SelectItem>
                      <SelectItem value="STOCK_OUT">Stock Out</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <VariantMultiFileDropzone
            name={`variants.${index}.medias`} // ✅ Uses form field name
            title="Medias"
            className="pb-6"
          />
        </div>
      ))}
      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              compareAtPrice: 0,
              costPerItem: 0,
              color_name: "",
              color_code: "#000000",
              price: 0,
              sku: "",
              quantity: 0,
              status: "ACTIVE",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      )}
      {form?.formState.errors.variants && (
        <p className="text-[0.8rem] font-medium text-destructive">
          {form.formState.errors.variants.message}
        </p>
      )}
    </FormSection>
  );
}

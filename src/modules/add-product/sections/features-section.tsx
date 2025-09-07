"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FormSection from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { ProductFormValues } from "@/lib/schemas/product";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { Form, useFieldArray, useFormContext } from "react-hook-form";

export function FeaturesSection() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  // useEffect(() => {
  //   append("");
  // }, []);

  return (
    <FormSection
      title="Product Features"
      description="Add key features of your product"
    >
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={form.control}
            name={`features.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter feature" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {index > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append("")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Feature
      </Button>
    </FormSection>
  );
}

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
import { Plus, X } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export function SpecsSection({ form }: any) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specs",
  });

  return (
    <FormSection
      title="Specifications"
      description="Add technical specifications for your product"
    >
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4">
          <FormField
            control={form.control}
            name={`specs.${index}.key`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Specification name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`specs.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Specification value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ key: "", value: "" })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Specification
      </Button>
    </FormSection>
  );
}

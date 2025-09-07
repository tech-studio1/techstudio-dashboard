"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarIcon, Sparkles, RefreshCw, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  couponFormSchema,
  CouponFormType,
  defaultCouponValues,
  generateCouponCode,
} from "@/modules/discount/add-discount/utils";
import ApplicableToSection from "./applicable-to-section";
import RulesSection from "./rules-section";
import { handleCreateDiscount } from "@/app/actions/discount";
import FormSection from "@/components/ui/form-section";

const CouponForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CouponFormType>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: defaultCouponValues,
  });

  // Watch for discount type changes to update the label
  const discountType = form.watch("discount_type");
  const isActive = form.watch("is_active");

  // Generate code button handler
  const handleGenerateCode = () => {
    const code = generateCouponCode();
    form.setValue("code", code);
  };

  // Submit handler
  const onSubmit = async (data: CouponFormType) => {
    const body = {
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
    };
    try {
      setIsSubmitting(true);

      const result = await handleCreateDiscount({
        body: body,
      });

      console.log("Form submitted:", body);

      toast.success("Coupon created successfully", {
        description: `Coupon code ${data.code} has been created.`,
      });

      // Reset form after successful submission
      form.reset(defaultCouponValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create coupon", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Enter the basic details of your coupon"
          delay={100}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="e.g. SUMMER25"
                          {...field}
                          className="input-transition"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleGenerateCode}
                        className="flex-shrink-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      The unique code customers will enter at checkout
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Summer Sale 25% Off"
                        {...field}
                        className="input-transition"
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this coupon
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter details about this coupon"
                      {...field}
                      className="min-h-[120px] resize-none input-transition"
                    />
                  </FormControl>
                  <FormDescription>
                    Additional information for internal reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Discount Details */}
        <FormSection
          title="Discount Details"
          description="Configure the discount value and type"
          delay={200}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="discount_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                        <RadioGroupItem value="PERCENTAGE" id="percentage" />
                        <FormLabel
                          htmlFor="percentage"
                          className="cursor-pointer flex-1"
                        >
                          Percentage Discount
                        </FormLabel>
                        <Badge variant="outline">%</Badge>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                        <RadioGroupItem
                          value="FIXED_AMOUNT"
                          id="fixed-amount"
                        />
                        <FormLabel
                          htmlFor="fixed-amount"
                          className="cursor-pointer flex-1"
                        >
                          Fixed Amount
                        </FormLabel>
                        <Badge variant="outline">৳</Badge>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="bg-muted p-2 border border-r-0 rounded-l-md text-muted-foreground">
                        {discountType === "PERCENTAGE" ? "%" : "৳"}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        placeholder={
                          discountType === "PERCENTAGE" ? "e.g. 25" : "e.g. 10"
                        }
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className="rounded-l-none input-transition"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {discountType === "PERCENTAGE"
                      ? "Percentage discount to apply"
                      : "Fixed amount to deduct"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <FormField
              control={form.control}
              name="min_purchase_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Purchase</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="bg-muted p-2 border border-r-0 rounded-l-md text-muted-foreground">
                        ৳
                      </span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 50"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className="rounded-l-none input-transition"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Minimum order amount required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_discount_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Discount</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="bg-muted p-2 border border-r-0 rounded-l-md text-muted-foreground">
                        ৳
                      </span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className="rounded-l-none input-transition"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Maximum discount amount allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_uses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g. 100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      className="input-transition"
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of redemptions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Validity Period */}
        <FormSection
          title="Validity Period"
          description="Set when this coupon becomes active and expires"
          delay={300}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal input-transition",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this coupon becomes available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal input-transition",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When this coupon expires</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Applicable Products */}
        <FormSection
          title="Applicable Products"
          description="Select which products this coupon can be applied to"
          delay={400}
        >
          <ApplicableToSection control={form.control} />
        </FormSection>

        {/* Usage Rules */}
        <FormSection
          title="Usage Rules"
          description="Define additional rules for this coupon"
          delay={500}
        >
          <RulesSection control={form.control} />
        </FormSection>

        {/* Active Status */}
        <FormSection
          title="Status"
          className={`bg-opacity-90 border-2 ${isActive ? "border-green-200" : "border-muted"}`}
          delay={600}
        >
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    {field.value
                      ? "This coupon is active and can be redeemed"
                      : "This coupon is inactive and cannot be redeemed"}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-2 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultCouponValues)}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px] relative overflow-hidden group"
          >
            <span
              className={cn(
                "flex items-center justify-center gap-1 transition-all duration-300",
                isSubmitting ? "opacity-0" : "opacity-100"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Create Coupon
            </span>
            {isSubmitting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;

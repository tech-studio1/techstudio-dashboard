"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import FormSection from "@/components/ui/form-section";
import { PhoneInput } from "@/components/ui/phone-input";
import { z } from "zod";
import {
  handleCreateStaff,
  handleUpdateStaff,
  Staff,
} from "@/app/actions/staffs";
import { PasswordInput } from "@/components/ui/password-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export type CreateStaffFormType = {
  firstName: string;
  lastName: string;
  permissions: string[];
  password: string;
  status?: string;
  confirmPassword?: string;
};

export const passwordSchema = z
  .string({
    required_error: "Password can not be empty.",
  })
  .regex(/^.{6,20}$/, {
    message: "Minimum 6 and maximum 20 characters.",
  })
  .regex(/(?=.*[A-Z])/, {
    message: "At least one uppercase character.",
  })
  .regex(/(?=.*[a-z])/, {
    message: "At least one lowercase character.",
  })
  .regex(/(?=.*\d)/, {
    message: "At least one digit.",
  });

const updateStaffSchema = z
  .object({
    firstName: z.string().min(3, "First Name is required"),
    lastName: z.string().min(3, "Last Name is required"),
    permissions: z.array(z.string()).optional(),
    status: z.string(),
    password: passwordSchema.optional(), // Make password optional
    confirmPassword: passwordSchema.optional(), // Make confirmPassword optional
  })
  .refine(
    ({ password, confirmPassword }) =>
      !password || password === confirmPassword, // Only validate if password is provided
    {
      path: ["confirmPassword"],
      message: "Password didn't match.",
    }
  );

const permissions = [
  { label: "Order", value: "ORDER" },
  { label: "In-Store Order", value: "IN_STORE_ORDER" },
  { label: "Transaction", value: "TRANSACTION" },
  { label: "Product", value: "PRODUCT" },
  { label: "Inventoey", value: "INVENTORY" },
  { label: "Brand", value: "BRAND" },
  { label: "Category", value: "CATEGORY" },
  { label: "Discount", value: "DISCOUNT" },
  { label: "Page Builder", value: "BUILDER" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Staff", value: "STAFF" },
];

const UpdateStaffForm = ({ staff }: { staff: Staff }) => {
  const router = useRouter();
  // console.log("STAFF", staff);
  const defaultStaffValues = {
    firstName: staff?.profile?.first_name || "",
    lastName: staff?.profile?.last_name || "",
    permissions: staff?.permissions || [],
    status: staff?.status || "ACTIVE",
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateStaffFormType>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: defaultStaffValues,
  });

  const handlePermissions = (
    checked: boolean | "indeterminate",
    value: "NEW" | "RETURNING" | "VIP"
  ) => {
    const currentTypes = form.watch("permissions") || [];

    if (checked) {
      form.setValue("permissions", [
        ...currentTypes.filter((type) => type !== value),
        value,
      ]);
    } else {
      form.setValue(
        "permissions",
        currentTypes.filter((type) => type !== value)
      );
    }
  };

  // Submit handler
  const onSubmit = async (data: CreateStaffFormType) => {
    console.log(data);
    try {
      setIsSubmitting(true);

      const result = await handleUpdateStaff({
        id: staff?.id?.split(":")[1],
        body: { ...data },
      });

      console.log("Form submitted:", data);

      toast.success("Staff updated successfully");
      form.reset(defaultStaffValues);
      router.push("/staffs");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update staff", {
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
          title="Staff Information"
          description="Enter the basic details of your staff"
          delay={100}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="mt-10 grid grid-cols-2 gap-2"> */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DEACTIVE">Inactive</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-base">Permissions</FormLabel>
              <FormDescription>
                Select which permissions this staff member will have
              </FormDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {permissions.map((type) => (
                  <div
                    key={type.value}
                    className="flex items-center space-x-2 rounded-md border p-3 card-hover"
                  >
                    <Checkbox
                      id={`customer-type-${type.value}`}
                      checked={form
                        .watch("permissions")
                        ?.includes(type.value as any)}
                      onCheckedChange={(checked) =>
                        handlePermissions(
                          checked,
                          type.value as "NEW" | "RETURNING" | "VIP"
                        )
                      }
                    />
                    <Label
                      htmlFor={`customer-type-${type.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Reset Password"
          description="Enter the new password for your staff"
          delay={100}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-2 pb-8">
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
              Update Staff
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

export default UpdateStaffForm;

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { handleCreateStaff } from "@/app/actions/staffs";
import { PasswordInput } from "@/components/ui/password-input";
import { parsePhoneNumber } from "react-phone-number-input";

export type CreateStaffFormType = {
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  confirmPassword: string;
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

const createStaffSchema = z
  .object({
    firstName: z.string().min(3, "First Name is required"),
    lastName: z.string().min(3, "Last Name is required"),
    mobile: z.string().min(6, { message: "Must Enter valid mobile no." }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Password didn't match.",
  });

const defaultStaffValues = {
  firstName: "",
  lastName: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const AddStaffForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateStaffFormType>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: defaultStaffValues,
  });

  // Submit handler
  const onSubmit = async (data: CreateStaffFormType) => {
    const parsedNumber = parsePhoneNumber(data?.mobile);
    const countryCode = parsedNumber ? parsedNumber.countryCallingCode : "";
    const nationalNumber = parsedNumber ? parsedNumber.nationalNumber : "";
    try {
      setIsSubmitting(true);

      const result = await handleCreateStaff({
        body: { ...data, mobile: nationalNumber, countryCode: countryCode },
      });

      console.log("Form submitted:", data);

      toast.success("Staff created successfully");

      // Reset form after successful submission
      form.reset(defaultStaffValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create staff", {
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
            {/* </div> */}
            {/* <div className="col-span-1 md:col-span-2"> */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Mobile</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="BD"
                      placeholder="1XXXXXXXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}
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
            type="button"
            variant="outline"
            onClick={() => form.reset(defaultStaffValues)}
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
              Add Staff
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

export default AddStaffForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Circle } from "lucide-react";
import {
  Customer,
  handleCreateCustomer,
  handleGetSingleCustomer,
  handleUpdateCustomer,
} from "@/app/actions/customers";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  // date_of_birth: z.string().optional(),
  // gender: z.enum(["MALE", "FEMALE", "OTHER"]).default("MALE"),
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  mobile: z.string().min(1, "Mobile number is required"),
});

export function CustomerForm({
  edit,
  id,
  setIsOpen,
}: {
  edit?: boolean;
  id?: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(!!edit);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      // date_of_birth: "",
      // gender: "MALE",
      address: "",
      area: "",
      city: "",
      district: "",
      mobile: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (edit && id) {
        try {
          setIsLoadingData(true);
          const result = await handleGetSingleCustomer(id);
          if (result?.data) {
            form.reset({
              first_name: result.data.first_name,
              last_name: result.data.last_name || "",
              // date_of_birth: result.data.date_of_birth || "",
              // gender: result.data.gender || "MALE",
              // status: result.data.status || "ACTIVE",
              address: result.data.address || "",
              area: result.data.area || "",
              city: result.data.city || "",
              district: result.data.district || "",
              mobile: result.data.mobile,
            });
            setCustomer(result.data);
          }
        } catch (error) {
          toast.error("Failed to load customer data");
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadData();
  }, [edit, id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      if (edit && id) {
        const result = await handleUpdateCustomer(id, values);
        if (result.success) {
          toast.success("Customer updated successfully");
        } else {
          toast.error(result.message || "Failed to update customer");
          return;
        }
      } else {
        const result = await handleCreateCustomer(values);
        console.log("create", result);
        if (result.success) {
          toast.success("Customer created successfully");
        } else {
          toast.error(result.message || "Failed to create customer");
          return;
        }
      }

      setIsOpen(false);
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="size-full flex items-center justify-center py-8">
        <Circle className="animate-spin duration-300 ease-in-out transition-all" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mobile Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter mobile number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        {/* Address Information */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <Input placeholder="Enter area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="Enter district" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <Circle className="animate-spin duration-300 ease-in-out transition-all" />
          ) : (
            <span>{edit ? "Update Customer" : "Create Customer"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

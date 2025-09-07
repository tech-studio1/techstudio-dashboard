"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, UserPlus, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import type { CreateInStoreOrderData } from "../schema";
import { handleGetCustomers, type Customer } from "@/app/actions/customers";

interface CustomerSectionProps {
  form: UseFormReturn<CreateInStoreOrderData>;
}

export default function CustomerSection({ form }: CustomerSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(true); // Start with manual entry since customer is required

  const watchedCustomer = form.watch("customer");

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await handleGetCustomers({ search: query, limit: 20 });
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCustomers(debouncedQuery);
  }, [debouncedQuery]);

  const selectCustomer = (customer: Customer) => {
    form.setValue("customer", {
      first_name: customer.first_name,
      last_name: customer.last_name || "",
      mobile: customer.mobile,
      address: customer.address || "",
      area: customer.area || "",
      city: customer.city || "",
      district: customer.district || "",
    });
    setSearchQuery("");
    setCustomers([]);
    setIsManualEntry(false);
  };

  const clearCustomer = () => {
    form.setValue("customer", {
      first_name: "",
      last_name: "",
      mobile: "",
      address: "",
      area: "",
      city: "",
      district: "",
    });
    setIsManualEntry(true);
    setSearchQuery("");
    setCustomers([]);
  };

  const enableManualEntry = () => {
    form.setValue("customer", {
      first_name: "",
      last_name: "",
      mobile: "",
      address: "",
      area: "",
      city: "",
      district: "",
    });
    setIsManualEntry(true);
    setSearchQuery("");
    setCustomers([]);
  };

  return (
    <div className="space-y-4">
      {/* Customer Search */}
      {!isManualEntry && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {customers.length > 0 && (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              <div className="space-y-1 p-2">
                {customers.map((customer) => (
                  <Card key={customer.id} className="p-3 hover:shadow-sm border-0 shadow-sm cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {customer.first_name} {customer.last_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{customer.mobile}</span>
                          <Badge variant="secondary" className="text-xs">
                            {customer.status}
                          </Badge>
                        </div>
                        {customer.address && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {customer.address}, {customer.area}, {customer.city}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => selectCustomer(customer)}
                      >
                        Select
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Manual Entry Option */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={enableManualEntry}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </div>
        </div>
      )}

      {/* Always Show Customer Form for Editing */}
      {(isManualEntry || (watchedCustomer && watchedCustomer.first_name)) && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Customer Information</h4>
            <div className="flex gap-2">
              {isManualEntry && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsManualEntry(false);
                    setSearchQuery("");
                    setCustomers([]);
                  }}
                >
                  Search Customers
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearCustomer}
              >
                Clear
              </Button>
            </div>
          </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer.first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer.last_name"
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
                name="customer.mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="House/Flat, Road, Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customer.area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Area/Locality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="District" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </div>
        </div>
      )}
    </div>
  );
}
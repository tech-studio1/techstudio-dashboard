"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import ProductSection from "./sections/product-section";
import CustomerSection from "./sections/customer-section";
import PaymentSection from "./sections/payment-section";
import OrderSummary from "./sections/order-summary";

import {
  createInStoreOrderSchema,
  type CreateInStoreOrderData,
} from "./schema";
import { createInStoreOrder } from "@/app/actions/in-store-orders";

export default function CreateInStoreOrderModule() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateInStoreOrderData>({
    resolver: zodResolver(createInStoreOrderSchema),
    defaultValues: {
      order_items: [],
      discount: 0,
      payment_info: {
        paymentMethod: "CASH",
        cardNumber: "",
        mobileNumber: "",
        transactionId: "",
        note: "",
      },
      customer: {
        first_name: "",
        last_name: "",
        mobile: "",
        address: "",
        area: "",
        city: "",
        district: "",
      },
      notes: "",
    },
  });

  const watchedItems = form.watch("order_items");
  const watchedPaymentMethod = form.watch("payment_info.paymentMethod");
  const watchedDiscount = form.watch("discount") || 0;

  const calculateSubtotal = () => {
    return watchedItems.reduce((total, item) => {
      const basePrice = item.costPerItem.price; // Use the updated price from costPerItem
      return total + basePrice * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - watchedDiscount);
  };

  const onSubmit = async (data: CreateInStoreOrderData) => {
    try {
      setIsSubmitting(true);

      if (data.order_items.length === 0) {
        toast.error("Please add at least one product to the order");
        return;
      }

      if (!data.customer?.first_name || !data.customer?.mobile) {
        toast.error("Customer information is required");
        return;
      }

      const result = await createInStoreOrder(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        toast.success(`Order created successfully!`);
        router.push(`/in-store-orders`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/in-store-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductSection form={form} />
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerSection form={form} />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentSection
                    form={form}
                    paymentMethod={watchedPaymentMethod}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderSummary
                    form={form}
                    items={watchedItems}
                    subtotal={calculateSubtotal()}
                    discount={watchedDiscount}
                    total={calculateTotal()}
                  />

                  <div className="mt-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || watchedItems.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        "Create Order"
                      )}
                    </Button>

                    {watchedItems.length === 0 && (
                      <p className="text-sm text-red-600 text-center">
                        Please add products to continue
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

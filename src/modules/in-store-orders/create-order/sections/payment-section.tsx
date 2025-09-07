"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

import type { CreateInStoreOrderData } from "../schema";

const PAYMENT_METHODS = [
  {
    value: "CASH",
    label: "Cash Payment",
    icon: Banknote,
    requiresDetails: false,
  },
  {
    value: "CARD",
    label: "Card Payment",
    icon: CreditCard,
    requiresDetails: true,
  },
  { value: "BKASH", label: "bKash", icon: Smartphone, requiresDetails: true },
  { value: "NAGAD", label: "Nagad", icon: Wallet, requiresDetails: true },
] as const;

interface PaymentSectionProps {
  form: UseFormReturn<CreateInStoreOrderData>;
  paymentMethod: string;
}

export default function PaymentSection({
  form,
  paymentMethod,
}: PaymentSectionProps) {
  const selectedMethod = PAYMENT_METHODS.find(
    (method) => method.value === paymentMethod
  );

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <FormField
        control={form.control}
        name="payment_info.paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Method *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear other payment info when method changes
                  form.setValue("payment_info.cardNumber", "");
                  form.setValue("payment_info.mobileNumber", "");
                  form.setValue("payment_info.transactionId", "");
                  form.setValue("payment_info.note", "");
                }}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <FormItem key={method.value}>
                      <FormControl>
                        <RadioGroupItem
                          value={method.value}
                          id={method.value}
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={method.value}
                        className={cn(
                          "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                          "peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary/20",
                          "hover:border-primary/50",
                          paymentMethod === method.value &&
                            "border-primary bg-primary/5 ring-1 ring-primary/20"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{method.label}</div>
                          {method.requiresDetails && (
                            <div className="text-sm text-muted-foreground">
                              Additional details required
                            </div>
                          )}
                        </div>
                      </FormLabel>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Payment Details */}
      {selectedMethod?.requiresDetails && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium">Payment Details</h4>

          {paymentMethod === "CARD" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="payment_info.cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_info.note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes about the payment..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {paymentMethod === "BKASH" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="payment_info.mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>bKash Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_info.transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="BKS123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {paymentMethod === "NAGAD" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="payment_info.mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nagad Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_info.transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="NGD123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* Order Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any special instructions or notes for this order..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import type { CreateInStoreOrderData, OrderItemData } from "../schema";

interface OrderSummaryProps {
  form: UseFormReturn<CreateInStoreOrderData>;
  items: OrderItemData[];
  subtotal: number;
  discount: number;
  total: number;
}

export default function OrderSummary({
  form,
  items,
  subtotal,
  discount,
  total,
}: OrderSummaryProps) {
  const paymentMethod = form.watch("payment_info.paymentMethod");
  const customer = form.watch("customer");

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "CASH":
        return "Cash Payment";
      case "CARD":
        return "Card Payment";
      case "BKASH":
        return "bKash";
      case "NAGAD":
        return "Nagad";
      default:
        return method;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Items Summary */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">
          Order Items ({totalItems} items)
        </h4>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items added</p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 3).map((item, index) => {
              const basePrice = item.costPerItem.price; // Use the price from costPerItem
              const itemTotal = basePrice * item.quantity;

              return (
                <div key={index} className="flex justify-between text-sm">
                  <span className="truncate flex-1 mr-2">
                    {item.quantity}x {item.title}
                    {item.variantInfo?.color_name && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({item.variantInfo.color_name})
                      </span>
                    )}
                    {item.serial_number && (
                      <span className="text-xs text-blue-600 block">
                        S/N: {item.serial_number}
                      </span>
                    )}
                  </span>
                  <span className="font-medium">৳{itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
            {items.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{items.length - 3} more items
              </p>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Customer Info */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Customer</h4>
        {customer ? (
          <div className="text-sm">
            <div>
              {customer.first_name} {customer.last_name}
            </div>
            {customer.mobile && (
              <div className="text-muted-foreground">{customer.mobile}</div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Walk-in customer</p>
        )}
      </div>

      <Separator />

      {/* Payment Method */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Payment</h4>
        <p className="text-sm">{getPaymentMethodLabel(paymentMethod)}</p>
      </div>

      <Separator />

      {/* Discount and Total */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Discount (৳)</label>
          <Input
            type="number"
            value={discount}
            onChange={(e) =>
              form.setValue("discount", parseFloat(e.target.value) || 0)
            }
            className="h-8"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>৳0.00</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

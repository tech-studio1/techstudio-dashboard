"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Edit } from "lucide-react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import type { Order } from "@/lib/types/order";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/types/order";
import { cn } from "@/lib/utils";
import { ReceiptPrint } from "@/app/(dashboard)/in-store-orders/components/ReceiptPrint";

interface InStoreOrderDetailModuleProps {
  order: Order;
  shouldPrint?: boolean;
}

export default function InStoreOrderDetailModule({
  order,
  shouldPrint = false,
}: InStoreOrderDetailModuleProps) {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${order.order_number}`,
    onAfterPrint: () => {
      if (shouldPrint) {
        router.replace(`/in-store-orders/${order?.id?.split(":")[1]}`, {
          scroll: false,
        });
      }
    },
  });

  useEffect(() => {
    if (shouldPrint && order) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [shouldPrint, order, handlePrint]);

  const totalItems = order.order_items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "COD":
        return "Cash on Delivery";
      case "CARD":
        return "Card Payment";
      case "BKASH":
        return "bKash";
      case "NAGAD":
        return "Nagad";
      // Legacy support
      case "CASH":
        return "Cash Payment";
      case "POS_CARD":
        return "POS Machine (Card)";
      default:
        return method;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/in-store-orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Order #{order.order_number}
              </h1>
              <p className="text-muted-foreground">
                {format(new Date(order.created_at), "MMMM dd, yyyy • HH:mm")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>

            {/* <Button variant="outline" size="sm" asChild>
              <Link href={`/in-store-orders/${order?.id?.split(":")[1]}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Link>
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Status</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        ORDER_STATUS_COLORS[order.status]
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">Payment Status</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        PAYMENT_STATUS_COLORS[order.payment_status]
                      )}
                    >
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            {order.outlet && (
              <Card>
                <CardHeader>
                  <CardTitle>Store Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">
                      {order.outlet.name || "In-Store Location"}
                    </p>
                    {order.outlet.code && (
                      <p className="text-sm text-muted-foreground">
                        Code: {order.outlet.code}
                      </p>
                    )}
                  </div>

                  {order.outlet.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{order.outlet.address}</p>
                      {order.outlet.district && (
                        <p className="text-sm text-muted-foreground">
                          {order.outlet.district}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items ({totalItems} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.variantInfo?.color_name && (
                            <Badge variant="secondary" className="text-xs">
                              {item.variantInfo.color_name}
                            </Badge>
                          )}
                          {item.variantInfo?.sku && (
                            <span className="text-xs text-muted-foreground">
                              SKU: {item.variantInfo.sku}
                            </span>
                          )}
                          {item.serial_number && (
                            <span className="text-xs text-blue-600 font-medium">
                              S/N: {item.serial_number}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold">
                            ৳{item.costPerItem.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="font-semibold">
                        ৳{(item.costPerItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {index < order.order_items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer Information */}
            {(order.customer || order.client_info?.billingAddress) && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {order.customer
                        ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
                        : `${order?.client_info?.billingAddress?.firstName} ${order?.client_info?.billingAddress?.lastName || ""}`.trim()}
                    </p>
                  </div>

                  {(order.customer?.mobile ||
                    order.client_info?.billingAddress?.mobile) && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {order?.customer?.mobile ||
                          order?.client_info?.billingAddress?.mobile}
                      </p>
                    </div>
                  )}

                  {(order.customer?.address ||
                    order.client_info?.billingAddress?.address) && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {order.customer ? (
                          <>
                            {order.customer.address}
                            {order.customer.area && `, ${order.customer.area}`}
                            {order.customer.city && `, ${order.customer.city}`}
                            {order.customer.district &&
                              `, ${order.customer.district}`}
                          </>
                        ) : (
                          <>
                            {order?.client_info?.billingAddress?.address}
                            {order?.client_info?.billingAddress?.city &&
                              `, ${order?.client_info?.billingAddress?.city}`}
                            {order?.client_info?.billingAddress?.district &&
                              `, ${order?.client_info?.billingAddress?.district}`}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Method</p>
                  <p className="font-medium">
                    {getPaymentMethodLabel(
                      order.payment_info?.paymentMethod ||
                        order.client_info?.paymentMethod ||
                        ""
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      PAYMENT_STATUS_COLORS[order.payment_status]
                    )}
                  >
                    {order.payment_status}
                  </Badge>
                </div>

                {/* Payment Details */}
                {order.payment_info?.mobileNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.payment_info?.paymentMethod === "BKASH"
                        ? "bKash"
                        : "Nagad"}{" "}
                      Number
                    </p>
                    <p className="font-medium">
                      {order.payment_info.mobileNumber}
                    </p>
                  </div>
                )}

                {order.payment_info?.transactionId && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-medium">
                      {order.payment_info.transactionId}
                    </p>
                  </div>
                )}

                {order.payment_info?.cardNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Card Number</p>
                    <p className="font-medium">
                      ****{order.payment_info.cardNumber.slice(-4)}
                    </p>
                  </div>
                )}

                {order.payment_info?.note && (
                  <div>
                    <p className="text-sm text-muted-foreground">Note</p>
                    <p className="font-medium">{order.payment_info.note}</p>
                  </div>
                )}

                {/* Legacy support for old payment info structure */}
                {order.payment_info?.bkashNumber &&
                  !order.payment_info?.mobileNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.client_info?.paymentMethod === "BKASH"
                          ? "bKash"
                          : "Nagad"}{" "}
                        Number
                      </p>
                      <p className="font-medium">
                        {order.payment_info.bkashNumber}
                      </p>
                    </div>
                  )}

                {order.payment_info?.bkashTransactionId &&
                  !order.payment_info?.transactionId && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-medium">
                        {order.payment_info.bkashTransactionId}
                      </p>
                    </div>
                  )}

                {order.payment_info?.cardLastFourDigits &&
                  !order.payment_info?.cardNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Card (Last 4 digits)
                      </p>
                      <p className="font-medium">
                        ****{order.payment_info.cardLastFourDigits}
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>৳{order.pricing.items_cost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>৳{order.pricing.shipping.toFixed(2)}</span>
                </div>

                {order.pricing.discount && order.pricing.discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>৳{order.pricing.total_cost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden Receipt Component for Printing */}
      <div style={{ display: "none" }}>
        <ReceiptPrint ref={receiptRef} order={order} />
      </div>
    </>
  );
}

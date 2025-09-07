"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Printer, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { Order } from "@/lib/types/order";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/types/order";
import { cn } from "@/lib/utils";

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "COD":
      return "COD";
    case "CARD":
      return "Card";
    case "BKASH":
      return "bKash";
    case "NAGAD":
      return "Nagad";
    // Legacy support
    case "CASH":
      return "Cash Payment";
    case "POS_CARD":
      return "Card";
    default:
      return method;
  }
};

export const inStoreOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_number",
    header: "Order #",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Link
          href={`/in-store-orders/${order?.id?.split(":")[1]}`}
          className="font-medium text-primary hover:underline"
        >
          #{order.order_number}
        </Link>
      );
    },
  },
  {
    accessorKey: "outlet",
    header: "Store",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-medium">
            {order.outlet?.name || "In-Store Location"}
          </div>
          {order.outlet?.code && (
            <div className="text-sm text-muted-foreground">
              {order.outlet.code}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;

      // Handle new customer structure
      if (order.customer) {
        return (
          <div>
            <div className="font-medium">
              {order.customer.first_name} {order.customer.last_name || ""}
            </div>
            {order.customer.mobile && (
              <div className="text-sm text-muted-foreground">
                {order.customer.mobile}
              </div>
            )}
          </div>
        );
      }

      // Handle legacy client_info structure
      if (order.client_info?.billingAddress) {
        const { billingAddress } = order.client_info;
        return (
          <div>
            <div className="font-medium">
              {billingAddress.firstName} {billingAddress.lastName}
            </div>
            {billingAddress.mobile && (
              <div className="text-sm text-muted-foreground">
                {billingAddress.mobile}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="text-sm text-muted-foreground">Walk-in customer</div>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      return (
        <ul>
          {row?.original?.order_items?.map((item) => {
            return (
              <li
                key={item?.id}
                className="max-w-[200px] list-disc whitespace-normal"
              >
                {item?.title} x {item?.quantity}
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    id: "total_amount",
    header: "Total",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-semibold">
            ৳{order.pricing.total_cost.toFixed(2)}
          </div>
        </div>
      );
    },
  },
  {
    id: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const order = row.original;
      const paymentMethod =
        order.payment_info?.paymentMethod ||
        order.client_info?.paymentMethod ||
        "";

      return (
        <div className="space-y-1">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              PAYMENT_STATUS_COLORS[order.payment_status]
            )}
          >
            {order.payment_status}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {getPaymentMethodLabel(paymentMethod)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Badge
          variant="secondary"
          className={cn("text-xs", ORDER_STATUS_COLORS[order.status])}
        >
          {order.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="text-sm">
          <div>{format(new Date(order.created_at), "MMM dd, yyyy")}</div>
          <div className="text-muted-foreground">
            {format(new Date(order.created_at), "HH:mm")}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/in-store-orders/${order?.id?.split(":")[1]}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href={`/in-store-orders/${order?.id?.split(":")[1]}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Link
                href={`/in-store-orders/${order?.id?.split(":")[1]}?print=true`}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

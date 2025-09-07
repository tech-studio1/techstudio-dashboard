"use client";
import { ColumnDef } from "@tanstack/react-table";
import ViewOrder from "./view-order";
import ChangeStatus from "./change-status";
import CancelOrder from "./cancel-order";
import PrintOrder from "./print-order";
import { format } from "date-fns";
import { capitalize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types/order";

type CONFIG = {
  DELIVERED: { variant: "default"; label: "Delivered" };
  PROCESSING: { variant: "secondary"; label: "Processing" };
  PENDING: { variant: "outline"; label: "Pending" };
  CANCELLED: { variant: "destructive"; label: "Cancelled" };
  SHIPPED: { variant: "default"; label: "Shipped" };
  RETURNED: { variant: "destructive"; label: "Returned" };
};

const StatusBadge = ({
  status,
}: {
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
}) => {
  const statusMap: CONFIG = {
    DELIVERED: { variant: "default", label: "Delivered" },
    PROCESSING: { variant: "secondary", label: "Processing" },
    PENDING: { variant: "outline", label: "Pending" },
    CANCELLED: { variant: "destructive", label: "Cancelled" },
    RETURNED: { variant: "destructive", label: "Returned" },
    SHIPPED: { variant: "default", label: "Shipped" },
  };

  const config = statusMap[status] || statusMap.PENDING;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const orderColumns: ColumnDef<Order, any>[] = [
  {
    accessorKey: "id",
    header: "Order #",
    cell: ({ row }) => row?.original?.order_number,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <StatusBadge status={row?.original?.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] whitespace-normal">
          <div>
            {row?.original?.client_info?.shippingAddress?.firstName +
              " " +
              row?.original?.client_info?.shippingAddress?.lastName}
          </div>
          <div>{row?.original?.client_info?.shippingAddress?.mobile}</div>
          <div className="truncate">
            {row?.original?.client_info?.shippingAddress?.address +
              ", " +
              row?.original?.client_info?.shippingAddress?.area +
              ", "}
          </div>
          <div>{row?.original?.client_info?.shippingAddress?.district}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] whitespace-normal">
          <div>{row?.original?.client_info?.paymentMethod}</div>
          {row?.original?.payment_info && (
            <>
              <div>Bkash Advance info: </div>
              <div>{row?.original?.payment_info?.bkashNumber}</div>
              <div>{row?.original?.payment_info?.bkashTransactionId}</div>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "order_cost",
    header: "Order Cost",
    cell: ({ row }) => {
      return <div>৳{row?.original?.pricing?.total_cost}</div>;
    },
  },
  {
    accessorKey: "order_date",
    header: "Create Date",
    cell: ({ row }) =>
      format(new Date(row?.original?.created_at), "dd/MM/yyyy"),
  },
  {
    accessorKey: "order_update_date",
    header: "Update Date",
    cell: ({ row }) =>
      format(new Date(row?.original?.updated_at), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    // cell: ({ cell, row }) => {
    //   return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    // },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ViewOrder
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
        <PrintOrder
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
        <ChangeStatus
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
          status={row?.original?.status ? row?.original?.status : ""}
        />
        <CancelOrder
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
      </div>
    ),
  },
];

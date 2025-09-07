"use client";
import { Customer } from "@/app/actions/customers";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import EditCustomer from "./edit-customer";

export const customersColumns: ColumnDef<Customer, any>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div>
          <div className="font-medium">
            {customer.first_name} {customer.last_name}
          </div>
          <div className="text-sm text-muted-foreground">
            ID: {customer.id?.split(":")?.[1] || customer.id}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => row.original.mobile,
  },
  {
    accessorKey: "address_info",
    header: "Address",
    cell: ({ row }) => {
      const customer = row.original;
      if (!customer.address && !customer.area && !customer.city) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="text-sm">
          {customer.address && <div>{customer.address}</div>}
          {(customer.area || customer.city || customer.district) && (
            <div className="text-muted-foreground">
              {[customer.area, customer.city, customer.district]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      return gender ? (
        <Badge variant="secondary" className="text-xs">
          {gender}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "ACTIVE" ? "default" : "destructive"}
          className="text-xs"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      return format(new Date(row.original.created_at), "dd/MM/yyyy");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <EditCustomer id={row?.original?.id?.split(":")?.[1] || row?.original?.id} />
      </div>
    ),
  },
];

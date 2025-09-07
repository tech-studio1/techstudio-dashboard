"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@/app/actions/discount";

export const discountColumns: ColumnDef<Discount, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row?.original?.code,
  },
  {
    accessorKey: "discount_type",
    header: "Discount Type",
    cell: ({ row }) => row?.original?.discount_type,
  },
  {
    accessorKey: "discount_value",
    header: "Discount Value",
    cell: ({ row }) => row?.original?.discount_value,
  },
  {
    id: "actions",
    header: "Actions",
    // cell: ({ cell, row }) => {
    //   return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    // },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* <ViewCategory
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
        <EditCategory
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        /> */}
      </div>
    ),
  },
];

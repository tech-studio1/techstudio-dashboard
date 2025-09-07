"use client";
import { Staff } from "@/app/actions/staffs";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { it } from "node:test";

export type Staffs = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const staffsColumns: ColumnDef<Staff, any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row?.original?.profile?.full_name,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => row?.original?.mobiles?.[0]?.formatted_number,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row?.original?.role,
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <div className="max-w-52 gap-1 flex flex-wrap">
        {row?.original?.permissions?.map((item) => (
          <Badge variant={"secondary"} key={item}>
            {capitalize(item)}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => capitalize(row?.original?.status),
  },

  {
    id: "actions",
    header: "Actions",
    // cell: ({ cell, row }) => {
    //   return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    // },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/staffs/${row?.original?.id?.split(":")?.[1]}`}
          className="text-blue-500"
        >
          Edit
        </Link>
        {/* <DeleteStaff id={row?.original?.id} /> */}
      </div>
    ),
  },
];

"use client";
import { Transaction } from "@/app/actions/transactions";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type Transactions = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const transactionsColumns: ColumnDef<Transaction, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    // cell: ({ row }) => row?.original?.title,
    cell: ({ row }) => "TODO",
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    // cell: ({ row }) => row?.original?.title,
    cell: ({ row }) => "TODO",
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => "TODO",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => "TODO",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => "TODO",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row?.original?.status,
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
          href={`/transactions/${row?.original?.id?.split(":")?.[1]}`}
          className="text-blue-500"
        >
          Edit
        </Link>
        {/* <DeleteTransaction id={row?.original?.id} /> */}
      </div>
    ),
  },
];

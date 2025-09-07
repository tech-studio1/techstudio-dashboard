"use client";
import { Category } from "@/app/actions/categories";
import { ColumnDef } from "@tanstack/react-table";
import EditCategory from "./edit-category";
import ViewCategory from "./view-category";
import { format } from "date-fns";

export const categoryColumns: ColumnDef<Category, any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row?.original?.title,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row?.original?.slug,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row?.original?.status,
  },
  {
    accessorKey: "parent",
    header: "Parent Category",
    cell: ({ row }) => row?.original?.parent?.title ?? "----",
  },
  {
    accessorKey: "sequence",
    header: "Sequence",
    cell: ({ row }) => row?.original?.sequence,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="">{row?.original?.featured ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "featured_sequence",
    header: "Featured Sequence",
    cell: ({ row }) => row?.original?.featured_sequence,
  },

  {
    accessorKey: "created_at",
    header: "Create Date",
    cell: ({ row }) =>
      format(new Date(row?.original?.created_at), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    // cell: ({ cell, row }) => {
    //   return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    // },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ViewCategory
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
        <EditCategory
          id={row?.original?.id ? row?.original?.id.split(":")[1] : ""}
        />
      </div>
    ),
  },
];

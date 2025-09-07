"use client";
import { Product } from "@/app/actions/products";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RecordId } from "surrealdb";
import DeleteProduct from "./delete-product";
import { capitalize } from "@/lib/utils";

export type Products = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const productsColumns: ColumnDef<Product, any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row?.original?.title,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row?.original?.category_details?.slug,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => row?.original?.brand_details?.slug,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row?.original?.status,
  },
  {
    accessorKey: "variant",
    header: "Variant",
    cell: ({ row }) => {
      return (
        <>
          {row?.original?.variants?.map((i, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <div
                className="size-4 rounded-full border"
                style={{
                  backgroundColor: i?.color_code,
                }}
              />
              <div>{i?.color_name}</div>
            </div>
          ))}
        </>
      );
    },
  },
  {
    accessorKey: "variant_status",
    header: "Variant Status",
    cell: ({ row }) => {
      return (
        <>
          {row?.original?.variants?.map((i, idx) => (
            <div key={idx}>{i?.status ? capitalize(i?.status) : ""}</div>
          ))}
        </>
      );
    },
  },
  {
    id: "price",
    header: "retail/base/offer",
    cell: ({ row }) => {
      return (
        <>
          {row?.original?.variants?.map((i, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              {`৳${i?.costPerItem}/ ৳${i?.price}/ ৳${i?.compareAtPrice}`}
            </div>
          ))}
        </>
      );
    },
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
          href={`/products/${row?.original?.id?.split(":")?.[1]}`}
          className="text-blue-500"
        >
          Edit
        </Link>
        <DeleteProduct id={row?.original?.id} />
      </div>
    ),
  },
];

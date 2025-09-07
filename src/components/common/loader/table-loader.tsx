import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

function TableLoader() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 py-2 w-10" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 py-2 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 py-2 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 py-2 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 py-2 w-28" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 py-2 w-10" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 py-2 w-10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 py-2 w-40" />
        <Skeleton className="h-10 w-72" />
      </div>
    </div>
  );
}

export default TableLoader;

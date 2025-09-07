"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  pageSize,
  totalItems,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  });

  // This function creates a new URLSearchParams object with all current params
  // and updates or adds the specified parameters
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update or remove parameters based on provided values
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    return newSearchParams.toString();
  };

  // Navigate to a specific page while preserving other parameters
  const navigateToPage = (page: number) => {
    const queryString = createQueryString({ page: page.toString() });
    router.push(`${pathname}?${queryString}`);
  };

  // Change page size while preserving other parameters
  const handlePageSizeChange = (newPageSize: string) => {
    // When changing page size, reset to first page
    const queryString = createQueryString({
      limit: newPageSize,
      page: "1", // Reset to first page
    });
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6">
          {/* Improved rows per page selector for mobile */}
          <div className="flex items-center space-x-2">
            <span className="text-sm whitespace-nowrap">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
              disabled={!totalItems}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination with responsive layout */}
          <Pagination className="flex-wrap justify-center">
            <PaginationContent>
              {/* First page button - hidden on mobile */}
              <PaginationItem className="hidden sm:flex">
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(1);
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                  aria-label="Go to first page"
                >
                  <span className="sr-only">First page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>

              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      navigateToPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page numbers - simplified for mobile */}
              {Array.from({ length: Math.min(3, pageCount) }, (_, i) => {
                let pageNum: number;

                // Calculate which page numbers to show
                if (pageCount <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= pageCount - 1) {
                  pageNum = pageCount - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPage(pageNum);
                      }}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {pageCount > 3 && currentPage < pageCount - 1 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPage(pageCount);
                      }}
                    >
                      {pageCount}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < pageCount) {
                      navigateToPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= pageCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {/* Last page button - hidden on mobile */}
              <PaginationItem className="hidden sm:flex">
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(pageCount);
                  }}
                  className={
                    currentPage >= pageCount
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  aria-label="Go to last page"
                >
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

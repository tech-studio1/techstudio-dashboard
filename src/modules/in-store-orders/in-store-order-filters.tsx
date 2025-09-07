"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Search, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "@/components/ui/label";

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "Returned" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Payment Status" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "PARTIALLY_REFUNDED", label: "Partially Refunded" },
];

const InStoreOrderFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("query")?.toString() ?? ""
  );

  const selectedOutlet = searchParams.get("outlet") || "";
  const selectedStatus = searchParams.get("status") || "";
  const selectedPaymentStatus = searchParams.get("payment_status") || "";
  const selectedDateFrom = searchParams.get("date_from") || "";
  const selectedDateTo = searchParams.get("date_to") || "";

  const [tempSelectedOutlet, setTempSelectedOutlet] = useState(selectedOutlet);
  const [tempSelectedStatus, setTempSelectedStatus] = useState(selectedStatus);
  const [tempSelectedPaymentStatus, setTempSelectedPaymentStatus] = useState(selectedPaymentStatus);
  const [tempSelectedDateFrom, setTempSelectedDateFrom] = useState(selectedDateFrom);
  const [tempSelectedDateTo, setTempSelectedDateTo] = useState(selectedDateTo);

  const applyFiltersToUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (tempSelectedOutlet) {
      params.set("outlet", tempSelectedOutlet);
    } else {
      params.delete("outlet");
    }

    if (tempSelectedStatus) {
      params.set("status", tempSelectedStatus);
    } else {
      params.delete("status");
    }

    if (tempSelectedPaymentStatus) {
      params.set("payment_status", tempSelectedPaymentStatus);
    } else {
      params.delete("payment_status");
    }

    if (tempSelectedDateFrom) {
      params.set("date_from", tempSelectedDateFrom);
    } else {
      params.delete("date_from");
    }

    if (tempSelectedDateTo) {
      params.set("date_to", tempSelectedDateTo);
    } else {
      params.delete("date_to");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setTempSelectedOutlet("");
    setTempSelectedStatus("");
    setTempSelectedPaymentStatus("");
    setTempSelectedDateFrom("");
    setTempSelectedDateTo("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("outlet");
    params.delete("status");
    params.delete("payment_status");
    params.delete("date_from");
    params.delete("date_to");
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export orders");
  };

  useEffect(() => {
    setSearchValue(searchParams.get("query")?.toString() ?? "");
  }, [searchParams]);

  const hasActiveFilters = selectedOutlet || selectedStatus || selectedPaymentStatus || selectedDateFrom || selectedDateTo;

  return (
    <div className="py-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, customer name, or phone..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExport}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Sheet
              open={open}
              onOpenChange={(e) => {
                setTempSelectedOutlet(selectedOutlet);
                setTempSelectedStatus(selectedStatus);
                setTempSelectedPaymentStatus(selectedPaymentStatus);
                setTempSelectedDateFrom(selectedDateFrom);
                setTempSelectedDateTo(selectedDateTo);
                setOpen(e);
              }}
            >
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {[selectedOutlet, selectedStatus, selectedPaymentStatus, selectedDateFrom, selectedDateTo].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter In-Store Orders</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Store/Outlet Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Store Location</h3>
                    <Input
                      placeholder="Enter store name or code"
                      value={tempSelectedOutlet}
                      onChange={(e) => setTempSelectedOutlet(e.target.value)}
                    />
                  </div>

                  {/* Order Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Order Status</h3>
                    <RadioGroup
                      value={tempSelectedStatus}
                      onValueChange={setTempSelectedStatus}
                    >
                      {ORDER_STATUS_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`status-${option.value}`} />
                          <Label htmlFor={`status-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Payment Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Payment Status</h3>
                    <RadioGroup
                      value={tempSelectedPaymentStatus}
                      onValueChange={setTempSelectedPaymentStatus}
                    >
                      {PAYMENT_STATUS_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`payment-${option.value}`} />
                          <Label htmlFor={`payment-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Date Range Filter */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Date Range</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="date-from" className="text-xs text-muted-foreground">From Date</Label>
                        <Input
                          id="date-from"
                          type="date"
                          value={tempSelectedDateFrom}
                          onChange={(e) => setTempSelectedDateFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date-to" className="text-xs text-muted-foreground">To Date</Label>
                        <Input
                          id="date-to"
                          type="date"
                          value={tempSelectedDateTo}
                          onChange={(e) => setTempSelectedDateTo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={resetFilters} variant="outline" size="sm">
                    Reset Filters
                  </Button>
                  <Button onClick={applyFiltersToUrl} size="sm">
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedOutlet && (
              <Badge variant="secondary">
                Store: {selectedOutlet}
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="secondary">
                Status: {ORDER_STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label}
              </Badge>
            )}
            {selectedPaymentStatus && (
              <Badge variant="secondary">
                Payment: {PAYMENT_STATUS_OPTIONS.find(p => p.value === selectedPaymentStatus)?.label}
              </Badge>
            )}
            {(selectedDateFrom || selectedDateTo) && (
              <Badge variant="secondary">
                Date: {selectedDateFrom || '...'} to {selectedDateTo || '...'}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InStoreOrderFilters;
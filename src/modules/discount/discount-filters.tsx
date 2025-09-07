"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebouncedCallback } from "use-debounce";

export type DiscountStatus = "ACTIVE" | "DEACTIVE";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "created-desc", label: "Newest First" },
  { value: "created-asc", label: "Oldest First" },
  { value: "updated-desc", label: "Recently Updated" },
];

const DiscountFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("query")?.toString() ?? ""
  );

  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || SORT_OPTIONS[0].value
  );

  const selectedStatus = searchParams.get("status") || "";

  const [tempSelectedStatus, setTempSelectedStatus] = useState<
    DiscountStatus | ""
  >(selectedStatus as DiscountStatus | "");

  const handleTempStatusChange = (status: DiscountStatus | "") => {
    setTempSelectedStatus(status);
  };

  const applyFiltersToUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (tempSelectedStatus) {
      params.set("status", tempSelectedStatus);
    } else {
      params.delete("status");
    }

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setTempSelectedStatus("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    setSortOption(value);
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

  const getCurrentSortLabel = () => {
    return SORT_OPTIONS.find((s) => s.value === sortOption)?.label || "Sort";
  };

  useEffect(() => {
    setSearchValue(searchParams.get("query")?.toString() ?? "");
  }, [searchParams]);

  return (
    <div className="py-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discounts..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            /> */}
          </div>

          <div className="flex gap-2">
            <Sheet
              open={open}
              onOpenChange={(e) => {
                setTempSelectedStatus(selectedStatus as DiscountStatus | "");
                setOpen(e);
              }}
            >
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Discounts</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Status</h3>
                    <RadioGroup
                      value={tempSelectedStatus}
                      onValueChange={(value) =>
                        handleTempStatusChange(value as DiscountStatus | "")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="status-all" />
                        <label htmlFor="status-all" className="text-sm">
                          All
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ACTIVE" id="status-active" />
                        <label htmlFor="status-active" className="text-sm">
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DEACTIVE" id="status-inactive" />
                        <label htmlFor="status-inactive" className="text-sm">
                          Inactive
                        </label>
                      </div>
                    </RadioGroup>
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

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <SortAsc className="h-4 w-4" />
                  {getCurrentSortLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className={sortOption === option.value ? "bg-accent" : ""}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>

        {/* Active Filters */}
        {selectedStatus && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedStatus && (
              <Badge variant="default">
                Status: {selectedStatus.toLowerCase()}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountFilters;

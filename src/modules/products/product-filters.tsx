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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Search, SortAsc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "@/components/ui/label";

export type ProductStatus = "ACTIVE" | "DEACTIVE";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "created-desc", label: "Newest First" },
  { value: "created-asc", label: "Oldest First" },
  { value: "updated-desc", label: "Recently Updated" },
];

interface ProductFiltersProps {
  categories?: Array<{ slug: string; title: string }>;
  brands?: Array<{ slug: string; title: string }>;
}

const ProductFilters = ({ categories, brands }: ProductFiltersProps) => {
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

  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const selectedStatus = searchParams.get("status") || "";

  const [tempSelectedBrands, setTempSelectedBrands] =
    useState<string[]>(selectedBrands);
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<string[]>(selectedCategories);
  const [tempSelectedStatus, setTempSelectedStatus] = useState<
    ProductStatus | ""
  >(selectedStatus as ProductStatus | "");

  const handleTempBrandChange = (slug: string) => {
    setTempSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  const handleTempCategoryChange = (slug: string) => {
    setTempSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const handleTempStatusChange = (status: ProductStatus | "") => {
    setTempSelectedStatus(status);
  };

  const applyFiltersToUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (tempSelectedBrands.length) {
      params.set("brand", tempSelectedBrands.join(","));
    } else {
      params.delete("brand");
    }

    if (tempSelectedCategories.length) {
      params.set("category", tempSelectedCategories.join(","));
    } else {
      params.delete("category");
    }

    if (tempSelectedStatus) {
      params.set("status", tempSelectedStatus);
    } else {
      params.delete("status");
    }

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const resetFilters = () => {
    setTempSelectedBrands([]);
    setTempSelectedCategories([]);
    setTempSelectedStatus("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("category");
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
    console.log(`Searching... ${term}`);

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Sheet
              open={open}
              onOpenChange={(e) => {
                setTempSelectedBrands(selectedBrands);
                setTempSelectedCategories(selectedCategories);
                setTempSelectedStatus(selectedStatus as ProductStatus | "");
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
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Brands</h3>
                    <div className="space-y-2">
                      {brands?.map((brand) => (
                        <div
                          key={brand.slug}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={brand?.slug}
                            checked={tempSelectedBrands.includes(brand.slug)}
                            onCheckedChange={() =>
                              handleTempBrandChange(brand.slug)
                            }
                          />
                          <Label htmlFor={brand?.slug} className="text-sm">
                            {brand.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Categories</h3>
                    <div className="space-y-2">
                      {categories?.map((cat) => (
                        <div
                          key={cat.slug}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={cat?.slug}
                            checked={tempSelectedCategories.includes(cat.slug)}
                            onCheckedChange={() =>
                              handleTempCategoryChange(cat.slug)
                            }
                          />
                          <Label htmlFor={cat?.slug} className="text-sm">
                            {cat.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Status</h3>
                    <RadioGroup
                      value={tempSelectedStatus}
                      onValueChange={(value) =>
                        handleTempStatusChange(value as ProductStatus | "")
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

            <DropdownMenu>
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
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedBrands.length ||
          selectedCategories.length ||
          selectedStatus) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedBrands.map((slug) => {
              const brand = brands?.find((b) => b.slug === slug);
              return (
                brand && (
                  <Badge variant={"secondary"} key={slug}>
                    {brand.title}
                  </Badge>
                )
              );
            })}
            {selectedCategories.map((slug) => {
              const category = categories?.find((c) => c.slug === slug);
              return (
                category && (
                  <Badge key={slug} variant="outline">
                    {category.title}
                  </Badge>
                )
              );
            })}
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

export default ProductFilters;

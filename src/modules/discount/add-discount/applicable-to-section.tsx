import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import {
  CouponFormType,
  mockProducts,
  mockCategories,
  mockBrands,
} from "./utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ApplicableToSectionProps {
  control: any;
}

const ApplicableToSection: React.FC<ApplicableToSectionProps> = ({
  control,
}) => {
  const { watch, setValue } = useFormContext<CouponFormType>();
  const scope = watch("applicable_to.scope");

  // Add selected item to form
  const handleAddItem = (
    field: "products" | "categories" | "brands",
    newItemId: string
  ) => {
    const currentItems = watch(`applicable_to.${field}`) || [];
    if (!currentItems.includes(newItemId)) {
      setValue(`applicable_to.${field}`, [...currentItems, newItemId]);
    }
  };

  // Remove item from form
  const handleRemoveItem = (
    field: "products" | "categories" | "brands",
    itemId: string
  ) => {
    const currentItems = watch(`applicable_to.${field}`) || [];
    setValue(
      `applicable_to.${field}`,
      currentItems.filter((id) => id !== itemId)
    );
  };

  // Get item title by ID
  const getItemTitle = (
    field: "products" | "categories" | "brands",
    itemId: string
  ) => {
    let collection;
    switch (field) {
      case "products":
        collection = mockProducts;
        break;
      case "categories":
        collection = mockCategories;
        break;
      case "brands":
        collection = mockBrands;
        break;
      default:
        return itemId;
    }
    return collection.find((item) => item.id === itemId)?.title || itemId;
  };

  return (
    <>
      <FormField
        control={control}
        name="applicable_to.scope"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Applicability</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="all-products" />
                  <Label htmlFor="all-products" className="cursor-pointer">
                    All Products
                  </Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRODUCTS" id="specific-products" />
                  <Label htmlFor="specific-products" className="cursor-pointer">
                    Specific Products
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CATEGORIES" id="specific-categories" />
                  <Label
                    htmlFor="specific-categories"
                    className="cursor-pointer"
                  >
                    Specific Categories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BRANDS" id="specific-brands" />
                  <Label htmlFor="specific-brands" className="cursor-pointer">
                    Specific Brands
                  </Label>
                </div> */}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose what this coupon applies to
            </FormDescription>
          </FormItem>
        )}
      />

      {/* {scope === "PRODUCTS" && (
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <Label>Select Products</Label>
            <Select onValueChange={(value) => handleAddItem("products", value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add a product" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {watch("applicable_to.products")?.map((productId) => (
              <Badge
                key={productId}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {getItemTitle("products", productId)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleRemoveItem("products", productId)}
                />
              </Badge>
            ))}
            {watch("applicable_to.products")?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No products selected
              </div>
            )}
          </div>
        </div>
      )}

      {scope === "CATEGORIES" && (
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <Label>Select Categories</Label>
            <Select
              onValueChange={(value) => handleAddItem("categories", value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add a category" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {watch("applicable_to.categories")?.map((categoryId) => (
              <Badge
                key={categoryId}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {getItemTitle("categories", categoryId)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleRemoveItem("categories", categoryId)}
                />
              </Badge>
            ))}
            {watch("applicable_to.categories")?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No categories selected
              </div>
            )}
          </div>
        </div>
      )}

      {scope === "BRANDS" && (
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <Label>Select Brands</Label>
            <Select onValueChange={(value) => handleAddItem("brands", value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add a brand" />
              </SelectTrigger>
              <SelectContent>
                {mockBrands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {watch("applicable_to.brands")?.map((brandId) => (
              <Badge
                key={brandId}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {getItemTitle("brands", brandId)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleRemoveItem("brands", brandId)}
                />
              </Badge>
            ))}
            {watch("applicable_to.brands")?.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No brands selected
              </div>
            )}
          </div>
        </div>
      )} */}
    </>
  );
};

export default ApplicableToSection;

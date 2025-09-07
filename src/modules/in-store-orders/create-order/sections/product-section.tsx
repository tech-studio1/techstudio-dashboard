"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useDebounce } from "use-debounce";

import type { CreateInStoreOrderData, OrderItemData } from "../schema";
import { handleGetProducts } from "@/app/actions/products";
import type { Product as ApiProduct } from "@/app/actions/products";

interface ProductSectionProps {
  form: UseFormReturn<CreateInStoreOrderData>;
}

export default function ProductSection({ form }: ProductSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const watchedItems = form.watch("order_items") || [];

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await handleGetProducts({ search: query, limit: 20 });
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery]);

  const addProduct = (product: ApiProduct, variant?: any) => {
    const newItem: OrderItemData = {
      id: product.id,
      title: product.title,
      image: product.medias?.[0] || "",
      quantity: 1,
      serial_number: "", // Initialize with empty string for user input
      costPerItem: {
        price: variant?.price || product.pricing.price,
        compareAtPrice: variant?.compareAtPrice || product.pricing.compareAtPrice,
        costPerItem: variant?.costPerItem || product.pricing.costPerItem,
      },
      variantInfo: variant ? {
        sku: variant.sku,
        color_name: variant.color_name,
        color_code: variant.color_code,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        costPerItem: variant.costPerItem,
        quantity: variant.quantity,
      } : undefined,
    };

    const currentItems = form.getValues("order_items");
    form.setValue("order_items", [...currentItems, newItem]);
    setSearchQuery("");
    setProducts([]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("order_items");
    form.setValue("order_items", currentItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const currentItems = form.getValues("order_items");
    currentItems[index].quantity = quantity;
    form.setValue("order_items", [...currentItems]);
  };

  const updatePrice = (index: number, price: number) => {
    if (price < 0) return;
    const currentItems = form.getValues("order_items");
    const updatedItems = currentItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          costPerItem: {
            ...item.costPerItem,
            price: price, // Update the price in costPerItem
          }
        };
      }
      return item;
    });
    form.setValue("order_items", updatedItems);
  };

  const updateSerialNumber = (index: number, serialNumber: string) => {
    const currentItems = form.getValues("order_items");
    const updatedItems = currentItems.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          serial_number: serialNumber,
        };
      }
      return item;
    });
    form.setValue("order_items", updatedItems);
  };

  const getItemTotal = (item: OrderItemData) => {
    const basePrice = item.costPerItem.price; // Use the price from costPerItem
    return basePrice * item.quantity;
  };

  return (
    <div className="space-y-4">
      {/* Direct Product Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {products.length > 0 && (
          <div className="border rounded-lg max-h-60 overflow-y-auto">
            <div className="space-y-1 p-2">
              {products.map((product) => (
                <Card key={product.id} className="p-3 hover:shadow-sm border-0 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-sm">৳{product.pricing.price}</span>
                        {product.pricing.compareAtPrice > product.pricing.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ৳{product.pricing.compareAtPrice}
                          </span>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addProduct(product)}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Variants:</p>
                      {product.variants.map((variant, idx) => (
                        <div key={idx} className="flex justify-between items-center p-1 bg-muted rounded text-xs">
                          <div>
                            <span className="font-medium">{variant.color_name}</span>
                            <span className="ml-2">৳{variant.price}</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                            onClick={() => addProduct(product, variant)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Products */}
      {watchedItems.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium">Selected Products</h3>
          {watchedItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    {item.variantInfo?.color_name && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.variantInfo.color_name}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Price (৳)
                    </label>
                    <Input
                      type="number"
                      value={item.costPerItem.price}
                      onChange={(e) => updatePrice(index, parseFloat(e.target.value) || 0)}
                      className="h-8"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Serial Number (Optional)
                    </label>
                    <Input
                      type="text"
                      value={item.serial_number || ""}
                      onChange={(e) => updateSerialNumber(index, e.target.value)}
                      className="h-8"
                      placeholder="Enter serial number"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">
                      Total: ৳{getItemTotal(item).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No products added. Search and add products to start building the order.
        </div>
      )}
    </div>
  );
}
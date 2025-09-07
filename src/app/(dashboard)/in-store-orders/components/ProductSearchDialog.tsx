"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Package, ImageIcon } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/app/actions/in-store-products';
import type { Product } from '@/lib/types/order';

interface ProductSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Product, quantity: number, variant?: any) => void;
}

export function ProductSearchDialog({
  open,
  onOpenChange,
  onAddProduct,
}: ProductSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const result = await getProducts({ search: query, limit: 20 });
      console.log('Product search result:', result);
      if (result.error) {
        console.error('Product search error:', result.error);
        setProducts([]);
      } else {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const handleAddProduct = (product: Product, variant?: any) => {
    const quantity = selectedQuantities[product.id] || 1;
    onAddProduct(product, quantity, variant);
    
    // Reset quantity for this product
    setSelectedQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const getProductPrice = (product: Product, variant?: any) => {
    return variant?.price || product.price;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Products to Order</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products by name, SKU, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && searchQuery && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Search for products</h3>
              <p className="text-muted-foreground">
                Start typing to find products to add to the order
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        SKU: {product.sku || 'N/A'}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold">৳{product.price}</span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ৳{product.compare_at_price}
                          </span>
                        )}
                        {product.status === 'active' ? (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Draft</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(
                              product.id, 
                              (selectedQuantities[product.id] || 1) - 1
                            )}
                            disabled={(selectedQuantities[product.id] || 1) <= 1}
                          >
                            -
                          </Button>
                          <span className="w-12 text-center text-sm">
                            {selectedQuantities[product.id] || 1}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(
                              product.id, 
                              (selectedQuantities[product.id] || 1) + 1
                            )}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          className="ml-auto"
                          onClick={() => handleAddProduct(product)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>

                      {/* Variants */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Variants:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {product.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className="flex items-center justify-between p-2 border rounded text-xs"
                              >
                                <div>
                                  <span className="font-medium">{variant.title}</span>
                                  {variant.color_name && (
                                    <span className="ml-2 text-muted-foreground">
                                      {variant.color_name}
                                    </span>
                                  )}
                                  <div className="text-muted-foreground">
                                    ৳{variant.price} • SKU: {variant.sku || 'N/A'}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 text-xs"
                                  onClick={() => handleAddProduct(product, variant)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
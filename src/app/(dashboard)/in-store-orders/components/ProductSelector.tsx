"use client";

import { useState } from 'react';
import { Plus, ShoppingCart, Trash2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductSearchDialog } from './ProductSearchDialog';
import { useOrderStore } from '@/lib/stores/order-store';
import type { Product } from '@/lib/types/order';

export function ProductSelector() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { 
    currentOrder, 
    addItem, 
    removeItem, 
    updateQuantity,
    getSubtotal,
    getTotal 
  } = useOrderStore();

  const handleAddProduct = (product: Product, quantity: number, variant?: any) => {
    addItem(product, quantity, variant);
    setIsSearchOpen(false);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Order Items</h3>
          <p className="text-sm text-muted-foreground">
            Add products to the customer&apos;s order
          </p>
        </div>
        <Button onClick={() => setIsSearchOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {currentOrder.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium">No items in order</h4>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding products to create the order
            </p>
            <Button onClick={() => setIsSearchOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Order Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Items ({currentOrder.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  <div className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title || 'Product'}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      
                      {item.variantInfo && (
                        <div className="flex items-center gap-2 mt-1">
                          {item.variantInfo.color_name && (
                            <Badge variant="secondary" className="text-xs">
                              {item.variantInfo.color_name}
                            </Badge>
                          )}
                          {item.variantInfo.sku && (
                            <span className="text-xs text-muted-foreground">
                              SKU: {item.variantInfo.sku}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">৳{item.costPerItem.price}</span>
                          {item.costPerItem.compareAtPrice > item.costPerItem.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ৳{item.costPerItem.compareAtPrice}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          
                          <span className="font-medium min-w-[60px] text-right">
                            ৳{(item.costPerItem.price * item.quantity).toFixed(2)}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < currentOrder.items.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>৳{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>৳0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>৳0.00</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>৳{getTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ProductSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
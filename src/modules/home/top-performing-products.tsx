import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const topProducts = [
  { id: "PRD-234", name: "Wireless Headphones", sales: 142, revenue: 14200 },
  { id: "PRD-876", name: "Smart Watch", sales: 98, revenue: 19600 },
  { id: "PRD-543", name: "Smartphone", sales: 87, revenue: 43500 },
];

function TopPerformingProducts() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.id}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${product.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.sales} units
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopPerformingProducts;

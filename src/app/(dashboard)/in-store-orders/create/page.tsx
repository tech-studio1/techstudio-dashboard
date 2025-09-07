import React from "react";
import CreateInStoreOrderModule from "@/modules/in-store-orders/create-order";

export default function CreateInStoreOrderPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Create In-Store Order</h1>
        <p className="text-muted-foreground">
          Process a new order for walk-in customers at your store location
        </p>
      </div>

      <CreateInStoreOrderModule />
    </div>
  );
}

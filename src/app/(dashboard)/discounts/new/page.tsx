import CouponForm from "@/modules/discount/add-discount";
import React from "react";

async function AddDiscountPage() {
  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4 bg-primary/5 p-2 rounded-xl">
            <div className="bg-primary/10 px-3 py-1 rounded-lg text-primary text-sm font-medium">
              Coupon Management
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-3">
            Create New Coupon
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design promotional offers with precise control over discount values,
            eligible products, and customer criteria.
          </p>
        </div>

        <CouponForm />
      </div>
    </div>
  );
}

export default AddDiscountPage;

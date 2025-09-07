import { Button } from "@/components/ui/button";
import Link from "next/link";
import SummarySection from "./summary-section";
import RevenueChart from "./revenue-chart";
import SalesCategoryChart from "./sales-category-chart";
import RecentOrders from "./recent-orders";
import TopPerformingProducts from "./top-performing-products";
import { Suspense } from "react";

const DashboardModule = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/in-store-orders/create">Create Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products/new">Add New Product</Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SummarySection />
      </Suspense>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Chart - Revenue & Orders Timeline */}
        <RevenueChart />
        {/* Secondary Chart - Sales by Category */}
        <SalesCategoryChart />
      </div>

      {/* Order Status Chart */}
      {/* <div className="grid grid-cols-1 gap-6 mt-6">
        <OrderStatusChart />
      </div> */}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Orders */}
        <RecentOrders />

        {/* Top Products & Quick Actions */}
        <div className="space-y-6">
          {/* Top Products */}
          <TopPerformingProducts />
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;

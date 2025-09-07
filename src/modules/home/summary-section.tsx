import { handleGetDashboardAnalytics } from "@/app/actions/analytics";
import MetricCard from "@/components/ui/metric-card";
import { Package, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import React from "react";

async function SummarySection() {
  const analytics = await handleGetDashboardAnalytics();
  // console.log("analytics", analytics);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Revenue"
        value={`৳${analytics?.data?.total_revenue}`}
        // prevValue="$22,345.67"
        // trend={9.8}
        icon={TrendingUp}
      />
      <MetricCard
        title="Pending Revenue"
        value={`৳${analytics?.data?.pending_revenue}`}
        // prevValue="$22,345.67"
        // trend={9.8}
        icon={TrendingUp}
      />
      <MetricCard
        title="Total Orders"
        value={`${analytics?.data?.total_orders}`}
        // prevValue="1,180"
        // trend={4.6}
        icon={ShoppingBag}
      />
      <MetricCard
        title="Total Products"
        value={`${analytics?.data?.total_products}`}
        trend={0}
        icon={Package}
      />
      <MetricCard
        title="Total Categories"
        value={`${analytics?.data?.total_categories}`}
        trend={0}
        icon={Tag}
      />
      <MetricCard
        title="Total Brands"
        value={`${analytics?.data?.total_brands}`}
        trend={0}
        icon={Tag}
      />
    </div>
  );
}

export default SummarySection;

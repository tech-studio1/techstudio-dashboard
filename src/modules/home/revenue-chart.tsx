"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

// Sample data for demonstration
const revenueData = [
  { name: "Jan 1", revenue: 1400, orders: 24 },
  { name: "Jan 2", revenue: 2210, orders: 32 },
  { name: "Jan 3", revenue: 1900, orders: 28 },
  { name: "Jan 4", revenue: 2400, orders: 36 },
  { name: "Jan 5", revenue: 1500, orders: 21 },
  { name: "Jan 6", revenue: 2800, orders: 42 },
  { name: "Jan 7", revenue: 2100, orders: 30 },
  { name: "Jan 8", revenue: 2600, orders: 39 },
  { name: "Jan 9", revenue: 1800, orders: 27 },
  { name: "Jan 10", revenue: 2200, orders: 33 },
  { name: "Jan 11", revenue: 2700, orders: 41 },
  { name: "Jan 12", revenue: 1600, orders: 23 },
  { name: "Jan 13", revenue: 2400, orders: 36 },
  { name: "Jan 14", revenue: 2900, orders: 44 },
];

function RevenueChart() {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Revenue & Orders (Last 14 Days)
        </h3>
        <div className="h-80 w-full ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#1a79ff" />
              <YAxis yAxisId="right" orientation="right" stroke="#32CD32" />
              <RechartsTooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#1a79ff"
                name="Revenue ($)"
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                fill="#32CD32"
                name="Orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueChart;

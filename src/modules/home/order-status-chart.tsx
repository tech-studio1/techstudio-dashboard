import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

const orderStatusData = [
  { name: "Delivered", value: 65 },
  { name: "Processing", value: 20 },
  { name: "Pending", value: 10 },
  { name: "Cancelled", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

function OrderStatusChart() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
        <div className="h-80">
          <ChartContainer
            config={{
              Delivered: { color: "#10b981" },
              Processing: { color: "#6366f1" },
              Pending: { color: "#f59e0b" },
              Cancelled: { color: "#ef4444" },
            }}
          >
            <BarChart
              data={orderStatusData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Orders" fill="#8884d8">
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderStatusChart;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

type RECENTORDERS = {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: "delivered" | "processing" | "pending" | "cancelled";
}[];

const recentOrders: RECENTORDERS = [
  {
    id: "ORD-5392",
    customer: "John Doe",
    amount: 249.99,
    status: "delivered",
    date: "Today, 2:30 PM",
  },
  {
    id: "ORD-5391",
    customer: "Jane Smith",
    amount: 129.5,
    status: "processing",
    date: "Today, 11:24 AM",
  },
  {
    id: "ORD-5390",
    customer: "Robert Johnson",
    amount: 399.99,
    status: "pending",
    date: "Yesterday, 3:45 PM",
  },
  {
    id: "ORD-5389",
    customer: "Emily Davis",
    amount: 79.99,
    status: "delivered",
    date: "Yesterday, 1:15 PM",
  },
  {
    id: "ORD-5388",
    customer: "Michael Brown",
    amount: 149.5,
    status: "cancelled",
    date: "Jan 12, 10:30 AM",
  },
];

type CONFIG = {
  delivered: { variant: "default"; label: "Delivered" };
  processing: { variant: "secondary"; label: "Processing" };
  pending: { variant: "outline"; label: "Pending" };
  cancelled: { variant: "destructive"; label: "Cancelled" };
};

const StatusBadge = ({
  status,
}: {
  status: "delivered" | "processing" | "pending" | "cancelled";
}) => {
  const statusMap: CONFIG = {
    delivered: { variant: "default", label: "Delivered" },
    processing: { variant: "secondary", label: "Processing" },
    pending: { variant: "outline", label: "Pending" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = statusMap[status] || statusMap.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

function RecentOrders() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">View All</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Order
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-2">{order.customer}</td>
                  <td className="py-3 px-2">${order.amount.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentOrders;

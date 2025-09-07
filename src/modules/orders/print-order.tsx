"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderPrint } from "@/app/(dashboard)/orders/components/OrderPrint";
import { useQuery } from "@tanstack/react-query";
import { handleGetSingleOrder } from "@/app/actions/orders";
import type { Order } from "@/lib/types/order";

interface PrintOrderProps {
  id: string;
}

export default function PrintOrder({ id }: PrintOrderProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => handleGetSingleOrder(id),
    enabled: !!id,
  });

  const order = orderResponse?.data;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order-${order?.order_number || id}`,
  });

  if (isLoading || !order) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Printer className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrint}
        title="Print Order"
      >
        <Printer className="h-4 w-4" />
      </Button>

      {/* Hidden Print Component */}
      <div style={{ display: "none" }}>
        <OrderPrint ref={printRef} order={order} />
      </div>
    </>
  );
}
import React from "react";
import { notFound } from "next/navigation";
import InStoreOrderDetailModule from "@/modules/in-store-orders/order-detail";
import { getInStoreOrder } from "@/app/actions/in-store-orders";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ print?: string }>;
}

export default async function InStoreOrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { id } = await params;
  const search = await searchParams;
  const shouldPrint = search?.print === "true";

  const result = await getInStoreOrder(id);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <InStoreOrderDetailModule order={result.data} shouldPrint={shouldPrint} />
    </div>
  );
}

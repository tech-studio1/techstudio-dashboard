import {
  Address,
  handleGetSingleOrder,
  OrderItem,
  SingleApiResponse,
} from "@/app/actions/orders";
import { handleGetSingleProduct, Product } from "@/app/actions/products";
import LoaderComponent from "@/components/ui/loader";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { CustomerAddress, Order } from "@/lib/types/order";

const ViewOrder = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderAndProducts = async () => {
      if (isOpen) {
        setIsLoading(true);
        try {
          const orderResult: SingleApiResponse = await handleGetSingleOrder(id);
          if (orderResult?.success) {
            setOrder(orderResult.data);

            const productIds = orderResult.data.order_items.map(
              (item) => item.id.split(":")[1]
            );
            const productPromises = productIds.map((id) =>
              handleGetSingleProduct(id)
            );
            const productsResults = await Promise.all(productPromises);
            const productsData = productsResults.map(
              (res) => res.data as Product
            );
            setProducts(productsData);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrderAndProducts();
  }, [isOpen, id]);

  if (!order && isLoading) return <LoaderComponent />;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger onClick={() => setIsOpen(true)}>
              <Eye className="h-4 w-4" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View order</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details
            {order?.status && (
              <span className="text-sm font-normal text-gray-500">
                (Status: {order.status})
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Order ID: {order?.id?.split(":")[1]}
            <br />
            Status: {order?.status} <br />
            {order?.notes && (
              <span className="text-red-500">
                Cancel Reason: {order?.notes}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoaderComponent />
        ) : (
          order && (
            <div className="space-y-6">
              {/* Client Information Section */}
              <div className="space-y-4">
                <h3 className="font-semibold">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Billing Address</h4>
                    <AddressInfo address={order?.client_info?.billingAddress} />
                  </div>
                  {!order?.client_info?.sameAsBilling && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Shipping Address</h4>
                      <AddressInfo
                        address={order?.client_info?.shippingAddress}
                      />
                    </div>
                  )}
                </div>

                <p className="text-sm">
                  Payment Method: {order?.client_info?.paymentMethod}
                </p>
                {order?.payment_info && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Bkash Advance info:</p>
                    <p>Bkash no: {order?.payment_info?.bkashNumber}</p>
                    <p>trxId: {order?.payment_info?.bkashTransactionId}</p>
                  </div>
                )}
              </div>

              {/* Order Items Section */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Items</h3>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <OrderItemDisplay
                      key={item.id}
                      item={item}
                      product={products[index]}
                    />
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold">Pricing Summary</h3>
                <div className="flex justify-between">
                  <span>Items Cost:</span>
                  <span>BDT{order.pricing.items_cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>BDT{order.pricing.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Cost:</span>
                  <span>BDT{order.pricing.total_cost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

const AddressInfo = ({ address }: { address: CustomerAddress | undefined }) => (
  <div className="text-sm text-gray-600 space-y-1">
    <p>
      {address?.firstName} {address?.lastName}
    </p>
    <p>{address?.address}</p>
    <p>
      {address?.area}, {address?.city}
    </p>
    <p>{address?.district}</p>
    <p>Mobile: {address?.mobile}</p>
  </div>
);

const OrderItemDisplay = ({
  item,
  product,
}: {
  item: any;
  product?: Product;
}) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg">
    {item?.image && (
      <picture>
        {" "}
        <img
          src={item?.image}
          alt={item?.title}
          className="w-16 h-16 object-cover rounded-md"
        />
      </picture>
    )}
    <div className="flex-1">
      <h4 className="font-medium">{item?.title || "Product not found"}</h4>
      <div className="text-sm text-gray-600 space-y-1 mt-1">
        <p>
          Color: {item.variantInfo.color_name} ({item.variantInfo.color_code})
        </p>
        <p>SKU: {item.variantInfo.sku}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">
        BDT{(item.quantity * item.costPerItem.compareAtPrice).toFixed(2)}
      </p>
      <p className="text-sm text-gray-600">
        BDT{item.costPerItem.compareAtPrice.toFixed(2)} each
      </p>
    </div>
  </div>
);

export default ViewOrder;

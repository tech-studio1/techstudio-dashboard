"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import Image from "next/image";
import type { Order, Outlet } from "@/lib/types/order";

interface ReceiptPrintProps {
  order: Order;
  outlet?: Outlet;
}

export const ReceiptPrint = forwardRef<HTMLDivElement, ReceiptPrintProps>(
  function ReceiptPrint({ order, outlet }, ref) {
    const getPaymentMethodLabel = (method: string) => {
      switch (method) {
        case "CASH":
          return "Cash Payment";
        case "POS_CARD":
          return "Card Payment";
        case "BKASH":
          return "bKash";
        case "NAGAD":
          return "Nagad";
        case "COD":
          return "Cash on Delivery";
        case "CARD":
          return "Card Payment";
        default:
          return method;
      }
    };

    const totalItems = order.order_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Use outlet data from outlet.json as fallback
    const outletData = {
      name: "Tech Studio",
      address:
        "Shop no 22, Moon Tower(Shundorban Courier office), Munshiganj Sadar",
      district: "Munshiganj",
      contactPhone: "+88 01670957108",
      email: "support@techstudio.com.bd",
      website: "www.techstudio.com.bd",
    };

    return (
      <div
        ref={ref}
        className="receipt-print bg-white text-black relative"
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          lineHeight: "1.3",
          padding: "15mm",
          boxSizing: "border-box",
        }}
      >
        {/* Store Header with Logo on Left, Info on Right */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-gray-800">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Image
              src="/FullBlack_alt.svg"
              alt="Tech Studio Logo"
              width={200}
              height={100}
              style={{ filter: "none" }}
            />
          </div>

          {/* Shop Info on Right */}
          <div className="text-right">
            <h1 className="text-xl font-bold mb-1 text-gray-800">
              {outletData.name}
            </h1>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p>{outletData.address}</p>
              <p>{outletData.district}</p>
              <p className="font-medium">Phone: {outletData.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Invoice Title - Centered */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-5">
          {/* Left Side - Customer Information */}
          <div>
            <h3 className="text-base font-bold mb-2 text-gray-800 border-b border-gray-400 pb-1">
              CUSTOMER INFORMATION
            </h3>
            {order.customer || order.client_info?.billingAddress ? (
              <div className="space-y-1">
                <div className="flex">
                  <span className="font-semibold text-gray-800 w-16">
                    Name:
                  </span>
                  <span>
                    {order.customer
                      ? `${order?.customer?.first_name} ${order.customer.last_name || ""}`.trim()
                      : `${order?.client_info?.billingAddress?.firstName} ${order?.client_info?.billingAddress?.lastName || ""}`.trim()}
                  </span>
                </div>
                {(order.customer?.mobile ||
                  order.client_info?.billingAddress?.mobile) && (
                  <div className="flex">
                    <span className="font-semibold text-gray-800 w-16">
                      Phone:
                    </span>
                    <span>
                      {order.customer?.mobile ||
                        order?.client_info?.billingAddress?.mobile}
                    </span>
                  </div>
                )}
                {(order.customer?.address ||
                  order.client_info?.billingAddress?.address) && (
                  <div className="flex">
                    <span className="font-semibold text-gray-800 w-16">
                      Address:
                    </span>
                    <span>
                      {order.customer ? (
                        <>
                          {order.customer.address}
                          {order.customer.area && `, ${order.customer.area}`}
                          {order.customer.city && `, ${order.customer.city}`}
                          {order.customer.district &&
                            `, ${order.customer.district}`}
                        </>
                      ) : (
                        <>
                          {order?.client_info?.billingAddress?.address}
                          {order?.client_info?.billingAddress?.city &&
                            `, ${order?.client_info?.billingAddress?.city}`}
                          {order?.client_info?.billingAddress?.district &&
                            `, ${order.client_info.billingAddress.district}`}
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 italic">Walk-in Customer</p>
            )}
          </div>

          {/* Right Side - Order Information */}
          <div>
            <h3 className="text-base font-bold mb-2 text-gray-800 border-b border-gray-400 pb-1">
              ORDER DETAILS
            </h3>
            <div className="space-y-1">
              <div className="flex">
                <span className="font-semibold text-gray-800 w-24">
                  Order ID:
                </span>
                <span>#{order.order_number}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-800 w-24">Date:</span>
                <span>
                  {format(new Date(order.created_at), "dd MMMM yyyy, HH:mm")}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-800 w-24">
                  Payment:
                </span>
                <span>
                  {getPaymentMethodLabel(
                    order.client_info?.paymentMethod ||
                      order.payment_info?.paymentMethod ||
                      ""
                  )}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-800 w-24">
                  Status:
                </span>
                <span className="font-medium">{order.payment_status}</span>
              </div>

              {/* Payment Details */}
              {(order?.payment_info?.mobileNumber ||
                order.payment_info?.bkashNumber) && (
                <div className="flex">
                  <span className="font-semibold text-gray-800 w-24">
                    {order.payment_info?.paymentMethod === "BKASH" ||
                    order.client_info?.paymentMethod === "BKASH"
                      ? "bKash"
                      : "Nagad"}
                    :
                  </span>
                  <span>
                    {order.payment_info?.mobileNumber ||
                      order.payment_info?.bkashNumber}
                  </span>
                </div>
              )}

              {(order.payment_info?.transactionId ||
                order.payment_info?.bkashTransactionId) && (
                <div className="flex">
                  <span className="font-semibold text-gray-800 w-24">
                    Txn ID:
                  </span>
                  <span>
                    {order.payment_info?.transactionId ||
                      order.payment_info?.bkashTransactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-5">
          <h3 className="text-base font-bold mb-2 text-gray-800 border-b border-gray-400 pb-1">
            PRODUCT DETAILS
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-2 px-2 font-bold text-sm">S/N</th>
                <th className="text-left py-2 px-2 font-bold text-sm">
                  Product Name
                </th>
                {/* <th className="text-left py-2 px-2 font-bold text-sm">SKU</th> */}
                <th className="text-center py-2 px-2 font-bold text-sm">Qty</th>
                <th className="text-right py-2 px-2 font-bold text-sm">
                  Unit Price
                </th>
                <th className="text-right py-2 px-2 font-bold text-sm">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <div className="text-xs text-gray-600 space-x-2">
                        {item.variantInfo?.color_name && (
                          <span>Color: {item.variantInfo.color_name}</span>
                        )}
                        {item.serial_number && (
                          <span className="text-blue-600 font-medium">
                            S/N: {item.serial_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* <td className="py-2 px-2 text-sm">
                    {item.variantInfo?.sku || "N/A"}
                  </td> */}
                  <td className="py-2 px-2 text-center">{item.quantity}</td>
                  <td className="py-2 px-2 text-right">
                    ৳{item.costPerItem.price.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    ৳{(item.quantity * item.costPerItem.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-end mb-5">
          <div className="w-72">
            <div className="border-t-2 border-gray-800 pt-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>৳{order.pricing.items_cost.toFixed(2)}</span>
                </div>

                {order.pricing.shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>৳{order.pricing.shipping.toFixed(2)}</span>
                  </div>
                )}

                {/* {order.pricing.tax && order.pricing.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>৳{order.pricing.tax.toFixed(2)}</span>
                  </div>
                )} */}

                {order.pricing.discount && order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-৳{order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t-2 border-gray-800 pt-2 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL:</span>
                    <span>৳{order.pricing.total_cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="mb-5">
            <h3 className="text-base font-bold mb-1 text-gray-800">NOTES:</h3>
            <p className="p-2 bg-gray-50 border border-gray-300 rounded text-sm">
              {order.notes}
            </p>
          </div>
        )}

        {/* Footer - Sticky at Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center pt-4 border-t-2 border-gray-800"
          style={{ padding: "15mm" }}
        >
          <div className="mb-2">
            <p className="text-base font-bold text-gray-800">
              Thank you for shopping with us!
            </p>
            <p className="text-gray-600 text-sm">Visit us again soon</p>
          </div>
          <div className="text-sm text-gray-700 space-y-0.5">
            <p>Email: {outletData.email}</p>
            <p>Website: {outletData.website}</p>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            .receipt-print {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 12mm !important;
              font-size: 11px !important;
              line-height: 1.3 !important;
              background: white !important;
              color: black !important;
              position: relative !important;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* Hide everything except the receipt */
            body * {
              visibility: hidden;
            }

            .receipt-print,
            .receipt-print * {
              visibility: visible;
            }

            .receipt-print {
              position: absolute;
              left: 0;
              top: 0;
            }

            /* Ensure table borders print */
            table,
            th,
            td {
              border-color: #000 !important;
            }

            /* Ensure images print */
            img {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            /* Optimize spacing for print */
            h2,
            h3 {
              margin-bottom: 8px !important;
            }

            .grid {
              gap: 20px !important;
            }

            /* Footer positioning for print */
            .absolute.bottom-0 {
              position: fixed !important;
              bottom: 15mm !important;
            }
          }

          @page {
            size: A4;
            margin: 12mm;
          }
        `}</style>
      </div>
    );
  }
);

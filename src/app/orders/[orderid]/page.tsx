"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/app/api/axios";
import { Order } from "@/app/types";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
  Link,
  ChevronLeft,
} from "lucide-react";

export default function OrderStatusPage() {
  const pathname = usePathname();
  const splitpath = pathname?.split("/");
  const orderId = splitpath?.[splitpath.length - 1] ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        toast.error("Order ID is required");
        return;
      }

      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        if (error?.response?.status === 404) {
          toast.error("Order not found");
        } else if (error?.response?.status === 401) {
          toast.error("Unauthorized access");
        } else {
          toast.error(
            error?.response?.data?.message || "Failed to fetch order details"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg shadow-sm">
          Order not found or error loading order details
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return <Package className="w-6 h-6" />;
      case "COMPLETED":
        return <CheckCircle className="w-6 h-6" />;
      case "CANCELLED":
        return <XCircle className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
      COMPLETED: "bg-green-50 text-green-700 border-green-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full border ${getStatusColor(
              order.status
            )} flex items-center gap-2`}
          >
            {getStatusIcon(order.status)}
            <span className="font-medium">{order.status}</span>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 font-mono text-gray-500">
          Order Progress
        </h2>
        <div className="space-y-4">
          {["PROCESSING", "COMPLETED", "CANCELLED"].map((status, index) => {
            const isCurrentStatus = order.status === status;
            const isPastStatus =
              ["PROCESSING", "COMPLETED", "FAILED"].indexOf(order.status) >=
              index;

            return (
              <div key={status} className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${
                    isCurrentStatus
                      ? "bg-emerald-100"
                      : isPastStatus
                      ? "bg-emerald-50"
                      : "bg-gray-100"
                  }`}
                >
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium font-mono ${
                      isCurrentStatus
                        ? "text-emerald-600"
                        : isPastStatus
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>
                </div>
                {isCurrentStatus && (
                  <span className="text-sm text-emerald-600">
                    Current Status
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 font-mono text-gray-500">
          Order Items
        </h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Product #{item.productId}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ฿{(item.quantity * item.price).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  ฿{item.price.toLocaleString()} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-500 font-mono">
              Total Amount
            </h2>
            <p className="text-sm text-gray-500">Including all items</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">
              ฿{order.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

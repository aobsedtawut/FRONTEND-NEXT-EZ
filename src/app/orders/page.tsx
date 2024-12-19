"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "../api/axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { Order } from "../types";
import router from "next/router";
import { ChevronLeft } from "lucide-react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get(
          `/api/orders/customer/${session?.user?.id}`
        );
        setOrders(data);
      } catch (error) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-600 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Link
            href={`/orders/${order.id}`}
            key={order.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">
                  ฿{order.total.toLocaleString()}
                </p>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    {
                      PROCESSING: "bg-blue-100 text-blue-800",
                      COMPLETED: "bg-green-100 text-green-800",
                      FAILED: "bg-red-100 text-red-800",
                    }[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
}

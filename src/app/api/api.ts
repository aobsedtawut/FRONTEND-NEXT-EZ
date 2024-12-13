import { OrderItem } from "../types";
import api from "@/app/api/axios";
export const fetchProducts = async (page: number = 1) => {
  const res = await api.get(`/api/products?page=${page}`);
  return res.data;
};

export const fetchBalance = async () => {
  const res = await api.get("/api/balance");
  return res.data;
};

export const createOrder = async (items: OrderItem[]) => {
  const res = await api.post("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  return res.data;
};

export const fetchOrderStatus = async (orderId: number) => {
  const res = await api.get(`/api/orders/${orderId}`);
  return res.data;
};

import { mockProducts } from "@/app/mock/product";

export const mockApi = {
  getProducts: async (page: number = 1, limit: number = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = mockProducts.slice(start, end);

    return {
      items,
      total: mockProducts.length,
      page,
      limit,
      totalPages: Math.ceil(mockProducts.length / limit),
    };
  },

  getBalance: async () => {
    return {
      balance: 5000,
    };
  },

  createOrder: async (items: { productId: number; quantity: number }[]) => {
    const orderId = Math.floor(Math.random() * 1000);
    return {
      orderId,
      status: "PROCESSING",
      items,
    };
  },

  getOrderStatus: async (orderId: number) => {
    return {
      orderId,
      status: ["PROCESSING", "COMPLETED", "FAILED"][
        Math.floor(Math.random() * 3)
      ],
    };
  },
};

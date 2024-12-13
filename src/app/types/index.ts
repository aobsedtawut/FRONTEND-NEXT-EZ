export interface Stock {
  id: number;
  code: string;
  status: StockStatus;
  productId: number;
  createdAt: string;
  stock: number;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  denomination: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  stocks: Stock[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}
export interface CreateOrderPayload {
  customerId: number; // This will come from auth/session
  items: OrderItem[];
}

export interface Order {
  id: number;
  customerId: number;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}
export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

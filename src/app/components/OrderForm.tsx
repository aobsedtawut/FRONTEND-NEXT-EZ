"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Product, StockStatus } from "../types";
import { useProducts } from "../hooks/useProducts";
import { mapImagePath } from "../constants/images";
import api from "../api/axios";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface OrderFormProps {
  onOrderComplete: (newBalance: number) => void;
}

export default function OrderForm({ onOrderComplete }: OrderFormProps) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateQuantity = useCallback(
    (inputQuantity: number) => {
      if (!selectedProduct) return false;

      const availableStock = selectedProduct.stocks.reduce(
        (total, stock) =>
          stock.status === StockStatus.IN_STOCK ? total + stock.stock : total,
        0
      );

      return inputQuantity > 0 && inputQuantity <= availableStock;
    },
    [selectedProduct]
  );

  const handleQuantityChange = useCallback(
    (value: number) => {
      if (!selectedProduct) return;

      const availableStock = selectedProduct.stocks.reduce(
        (total, stock) =>
          stock.status === StockStatus.IN_STOCK ? total + stock.stock : total,
        0
      );

      if (value < 1) {
        setErrorMessage("Quantity must be at least 1");
        setQuantity(1);
        return;
      }

      if (value > availableStock) {
        setErrorMessage(`Only ${availableStock} items available in stock`);
        setQuantity(availableStock);
        return;
      }

      setErrorMessage(null);
      setQuantity(value);
    },
    [selectedProduct]
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedProduct) return;
    const orderItem = {
      productId: selectedProduct?.id,
      quantity: quantity,
      price: Number(selectedProduct?.price),
      code: selectedProduct.stocks.map((stock) => stock.code).join(" "),
    };
    try {
      const { data } = await toast.promise(
        api.post(`api/orders`, {
          items: [orderItem],
          customerId: session?.user?.id ?? "",
          total: Number(selectedProduct.price) * quantity,
        }),
        {
          loading: "Placing your order...",
          success: "Order placed successfully! 🎉",
          error: (err) => {
            const message =
              err?.response?.data?.message || "Failed to place order";
            return `Error: ${message}`;
          },
        }
      );
      if (data?.balance !== undefined) {
        onOrderComplete(data.balance);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 font-mono">
        Place Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                       transition-shadow duration-300 cursor-pointer
                       ${
                         selectedProduct?.id === product.id
                           ? "ring-2 ring-emerald-500"
                           : ""
                       }`}
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-200">
              <Image
                src={mapImagePath(product.imageUrl)}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">
                ฿{product.price}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 font-mono">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 font-mono">
                {product.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 font-mono ${
                      product.stocks.some(
                        (stock) => stock.status === StockStatus.IN_STOCK
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-500 font-mono">
                    {product.stocks.map((stock) => stock.status).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Order Details</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={mapImagePath(selectedProduct.imageUrl)}
                alt={selectedProduct.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-semibold">{selectedProduct.name}</h4>
              <p className="text-emerald-600 font-bold">
                ฿{selectedProduct.price}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || loading}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center
                  hover:bg-gray-50 transition-colors disabled:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-20 text-center p-2 border rounded-lg"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!validateQuantity(quantity + 1) || loading}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center
                  hover:bg-gray-50 transition-colors disabled:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-emerald-600">
                  ฿{(Number(selectedProduct.price) * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg 
                        transition-colors duration-200 disabled:bg-gray-300
                        flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

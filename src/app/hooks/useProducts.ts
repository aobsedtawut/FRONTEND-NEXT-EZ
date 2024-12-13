// types/index.ts

import { PaginationMeta, Product, ProductsResponse } from "../types";
// hooks/useProducts.ts
import { useState, useEffect } from "react";
import api from "../api/axios";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await api.get<ProductsResponse>(
          "/products",
          {
            params: {
              page,
            },
          }
        );

        setProducts(response.data);
        setMeta(response.meta);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const nextPage = () => {
    if (meta.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (meta.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  };

  return {
    products,
    loading,
    error,
    page,
    setPage,
    totalPages: meta.totalPages,
    hasNextPage: meta.hasNextPage,
    hasPreviousPage: meta.hasPreviousPage,
    nextPage,
    previousPage,
  };
};

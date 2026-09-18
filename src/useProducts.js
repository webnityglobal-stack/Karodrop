import { useEffect, useState } from "react";
import { fetchProducts } from "./api.js";
import sampleProducts from "./data/sampleProducts.js";

// =========================================================
// USE PRODUCTS HOOK
// =========================================================
// Backend/API available hai:
//     → live products load honge
//
// Backend unavailable hai:
//     → sampleProducts fallback use hoga
//
// API empty array return kare:
//     → sampleProducts fallback use hoga
// =========================================================

export default function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(params);

        if (cancelled) return;

        const apiProducts = Array.isArray(data) ? data : [];

        // =====================================================
        // API ne products diye hain
        // =====================================================
        if (apiProducts.length > 0) {
          setProducts(apiProducts);
          setUsingFallback(false);
          setError(null);
          return;
        }

        // =====================================================
        // API connected hai but empty response mila
        // Fallback use karo
        // =====================================================

        let fallbackProducts = Array.isArray(sampleProducts)
          ? [...sampleProducts]
          : [];

        // Category filter
        if (params.category) {
          fallbackProducts = fallbackProducts.filter(
            (product) =>
              String(product?.category || "").toLowerCase() ===
              String(params.category).toLowerCase()
          );
        }

        // Featured filter
        if (params.featured) {
          fallbackProducts = fallbackProducts.filter(
            (product) => product?.isFeatured === true
          );
        }

        setProducts(fallbackProducts);
        setUsingFallback(true);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        console.warn(
          "Products API unavailable. Using sample products instead.",
          err
        );

        // =====================================================
        // Backend unavailable → sample products
        // =====================================================

        let fallbackProducts = Array.isArray(sampleProducts)
          ? [...sampleProducts]
          : [];

        // Category filter
        if (params.category) {
          fallbackProducts = fallbackProducts.filter(
            (product) =>
              String(product?.category || "").toLowerCase() ===
              String(params.category).toLowerCase()
          );
        }

        // Featured filter
        if (params.featured) {
          fallbackProducts = fallbackProducts.filter(
            (product) => product?.isFeatured === true
          );
        }

        setProducts(fallbackProducts);
        setUsingFallback(true);

        // Backend error ki wajah se website break nahi hogi
        setError(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    usingFallback,
    error,
  };
}
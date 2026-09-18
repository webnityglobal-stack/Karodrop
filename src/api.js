const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/products${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(slug) {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function placeOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

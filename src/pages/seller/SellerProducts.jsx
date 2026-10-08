import React from "react";
import { Link } from "react-router-dom";

export default function SellerProducts() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0078ED]">
            Store
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A] sm:text-3xl">
            My Products
          </h1>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            Manage the products available in your seller store.
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="inline-flex items-center justify-center rounded-lg bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">

          <input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED]"
          />

          <select
            className="rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            defaultValue=""
          >
            <option value="">All Categories</option>
            <option value="tshirts">T-Shirts</option>
            <option value="handicrafts">Handicrafts</option>
            <option value="jewellery">Jewellery</option>
            <option value="idols">Idols</option>
          </select>

          <select
            className="rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-10 text-center sm:p-16">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FF] text-2xl">
          📦
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
          No products yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#5E6B7A]">
          Add your first product to start selling through your Karodrop store.
        </p>

        <Link
          to="/seller/products/add"
          className="mt-6 inline-flex rounded-lg bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
        >
          Add Your First Product
        </Link>

      </div>

    </div>
  );
}
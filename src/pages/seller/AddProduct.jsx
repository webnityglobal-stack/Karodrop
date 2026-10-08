import React from "react";

export default function AddProduct() {
  return (
    <div>
      <p className="text-sm font-medium text-[#0078ED]">
        Store
      </p>

      <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
        Add Product
      </h1>

      <p className="mt-2 text-sm text-[#5E6B7A]">
        Create a new product for your store.
      </p>

      <div className="mt-8 rounded-2xl border border-[#DCE7F2] bg-white p-6">
        <p className="text-sm text-[#5E6B7A]">
          Product creation form will be added here.
        </p>
      </div>
    </div>
  );
}
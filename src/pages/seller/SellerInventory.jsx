import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const demoInventory = [
  {
    id: "PRD-1001",
    name: "Premium Cotton T-Shirt",
    sku: "KD-TS-001",
    category: "T-Shirts",
    stock: 86,
    lowStockAt: 20,
    price: 799,
    status: "In Stock",
  },
  {
    id: "PRD-1002",
    name: "Designer Hoodie",
    sku: "KD-HD-002",
    category: "Hoodies",
    stock: 12,
    lowStockAt: 20,
    price: 1499,
    status: "Low Stock",
  },
  {
    id: "PRD-1003",
    name: "Custom Mug",
    sku: "KD-MG-003",
    category: "Mugs",
    stock: 0,
    lowStockAt: 10,
    price: 499,
    status: "Out of Stock",
  },
  {
    id: "PRD-1004",
    name: "Handmade Wall Decor",
    sku: "KD-WD-004",
    category: "Home Decor",
    stock: 31,
    lowStockAt: 15,
    price: 1299,
    status: "In Stock",
  },
  {
    id: "PRD-1005",
    name: "Printed T-Shirt",
    sku: "KD-TS-005",
    category: "T-Shirts",
    stock: 18,
    lowStockAt: 20,
    price: 699,
    status: "Low Stock",
  },
  {
    id: "PRD-1006",
    name: "Classic Black Cap",
    sku: "KD-CP-006",
    category: "Accessories",
    stock: 54,
    lowStockAt: 15,
    price: 399,
    status: "In Stock",
  },
];

const statusStyles = {
  "In Stock": "bg-green-50 text-green-700",
  "Low Stock": "bg-orange-50 text-orange-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

export default function Inventory() {
  const [inventory, setInventory] = useState(demoInventory);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.sku.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, status]);

  const totalProducts = inventory.length;

  const totalUnits = inventory.reduce(
    (total, item) => total + item.stock,
    0
  );

  const lowStockProducts = inventory.filter(
    (item) =>
      item.stock > 0 &&
      item.stock <= item.lowStockAt
  ).length;

  const outOfStockProducts = inventory.filter(
    (item) => item.stock === 0
  ).length;

  const updateStock = (id, value) => {
    const newStock = Math.max(0, Number(value) || 0);

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let newStatus = "In Stock";

        if (newStock === 0) {
          newStatus = "Out of Stock";
        } else if (newStock <= item.lowStockAt) {
          newStatus = "Low Stock";
        }

        return {
          ...item,
          stock: newStock,
          status: newStatus,
        };
      })
    );
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Inventory
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Monitor product stock and keep your inventory updated.
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="
            inline-flex
            w-fit
            items-center
            justify-center
            rounded-xl
            bg-[#0078ED]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#012467]
          "
        >
          + Add Product
        </Link>

      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Units
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {totalUnits.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Low Stock
          </p>

          <p className="mt-2 text-2xl font-semibold text-orange-600">
            {lowStockProducts}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Out of Stock
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {outOfStockProducts}
          </p>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, SKU or category..."
            className="
              flex-1
              rounded-xl
              border
              border-[#DCE7F2]
              bg-[#F5FAFF]
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              transition
              focus:border-[#0078ED]
              focus:bg-white
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              rounded-xl
              border
              border-[#DCE7F2]
              bg-white
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              focus:border-[#0078ED]
            "
          >
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

        </div>

      </div>

      {/* =====================================================
          INVENTORY TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Product Inventory
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Update stock quantities for your products.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-[#F5FAFF]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  SKU
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#DCE7F2]">

              {filteredInventory.map((item) => (

                <tr
                  key={item.id}
                  className="transition hover:bg-[#F9FCFF]"
                >

                  {/* Product */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      {item.id}
                    </p>

                  </td>

                  {/* SKU */}

                  <td className="px-5 py-4">

                    <span className="rounded-lg bg-[#F5FAFF] px-2.5 py-1.5 text-xs font-medium text-[#5E6B7A]">
                      {item.sku}
                    </span>

                  </td>

                  {/* Category */}

                  <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                    {item.category}
                  </td>

                  {/* Price */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                  </td>

                  {/* Stock */}

                  <td className="px-5 py-4">

                    <input
                      type="number"
                      min="0"
                      value={item.stock}
                      onChange={(e) =>
                        updateStock(item.id, e.target.value)
                      }
                      className="
                        w-24
                        rounded-lg
                        border
                        border-[#DCE7F2]
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-[#0B1F3A]
                        outline-none
                        focus:border-[#0078ED]
                      "
                    />

                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${statusStyles[item.status]}
                      `}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

              {filteredInventory.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      No products found
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Try changing your search or stock filter.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          LOW STOCK NOTICE
      ====================================================== */}

      {lowStockProducts > 0 && (

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
              ⚠️
            </div>

            <div>

              <h3 className="text-sm font-semibold text-orange-800">
                Low Stock Alert
              </h3>

              <p className="mt-1 text-xs leading-5 text-orange-700">
                {lowStockProducts} product
                {lowStockProducts > 1 ? "s are" : " is"} running
                low on stock. Consider updating your inventory
                before these products become unavailable.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
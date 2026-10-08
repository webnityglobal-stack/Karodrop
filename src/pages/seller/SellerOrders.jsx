import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const demoOrders = [
  {
    id: "KD-1001",
    customer: "Rahul Sharma",
    product: "Premium Black T-Shirt",
    amount: 899,
    status: "Delivered",
    date: "28 Sep 2026",
  },
  {
    id: "KD-1002",
    customer: "Priya Singh",
    product: "Handmade Gift Box",
    amount: 1299,
    status: "Processing",
    date: "27 Sep 2026",
  },
  {
    id: "KD-1003",
    customer: "Aman Verma",
    product: "Custom Hoodie",
    amount: 1499,
    status: "Shipped",
    date: "26 Sep 2026",
  },
  {
    id: "KD-1004",
    customer: "Neha Gupta",
    product: "Designer Mug",
    amount: 499,
    status: "Pending",
    date: "25 Sep 2026",
  },
  {
    id: "KD-1005",
    customer: "Vikas Kumar",
    product: "Printed T-Shirt",
    amount: 699,
    status: "Cancelled",
    date: "24 Sep 2026",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  Processing: "bg-yellow-50 text-yellow-700",
  Shipped: "bg-blue-50 text-blue-700",
  Pending: "bg-orange-50 text-orange-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function SellerOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredOrders = useMemo(() => {
    return demoOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Orders
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Orders
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Manage and track orders placed for your products.
          </p>
        </div>

        <Link
          to="/seller/products"
          className="rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
        >
          Manage Products
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">Total Orders</p>
          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            128
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">Processing</p>
          <p className="mt-2 text-2xl font-semibold text-yellow-600">
            12
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">Shipped</p>
          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            18
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">Delivered</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            91
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search order, customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-[#DCE7F2]
                bg-[#F5FAFF]
                px-4
                py-3
                text-sm
                text-[#0B1F3A]
                outline-none
                focus:border-[#0078ED]
              "
            />
          </div>

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
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-4">
          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-[#F5FAFF]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DCE7F2]">

              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-[#F9FCFF]"
                >

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#0078ED]">
                      #{order.id}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0B1F3A]">
                      {order.customer}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-[220px] truncate text-sm text-[#5E6B7A]">
                      {order.product}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${statusStyles[order.status]}
                      `}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-[#5E6B7A]">
                      {order.date}
                    </p>
                  </td>

                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-[#0B1F3A]">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}
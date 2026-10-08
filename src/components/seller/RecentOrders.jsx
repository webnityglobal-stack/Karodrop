import React from "react";
import { Link } from "react-router-dom";

const demoOrders = [
  {
    id: "#KD10245",
    customer: "Rahul Sharma",
    product: "Premium Cotton T-Shirt",
    amount: 799,
    status: "Delivered",
    date: "28 Sep 2026",
  },
  {
    id: "#KD10244",
    customer: "Priya Singh",
    product: "Handmade Wall Decor",
    amount: 1299,
    status: "Processing",
    date: "27 Sep 2026",
  },
  {
    id: "#KD10243",
    customer: "Amit Kumar",
    product: "Designer Hoodie",
    amount: 1499,
    status: "Shipped",
    date: "26 Sep 2026",
  },
  {
    id: "#KD10242",
    customer: "Neha Verma",
    product: "Custom Mug",
    amount: 499,
    status: "Pending",
    date: "25 Sep 2026",
  },
  {
    id: "#KD10241",
    customer: "Vikas Gupta",
    product: "Printed T-Shirt",
    amount: 699,
    status: "Delivered",
    date: "24 Sep 2026",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-orange-50 text-orange-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function RecentOrders({ orders = demoOrders }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#DCE7F2] px-5 py-5 sm:flex-row sm:items-center sm:px-6">

        <div>
          <h3 className="text-base font-semibold text-[#0B1F3A]">
            Recent Orders
          </h3>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Latest orders received from your customers
          </p>
        </div>

        <Link
          to="/seller/orders"
          className="
            inline-flex
            w-fit
            items-center
            rounded-lg
            px-3
            py-2
            text-xs
            font-semibold
            text-[#0078ED]
            transition
            hover:bg-[#EAF4FF]
          "
        >
          View All Orders →
        </Link>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[760px]">

          <thead className="bg-[#F5FAFF]">

            <tr>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Order
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Customer
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Product
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Amount
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Status
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Date
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#EEF3F8]">

            {orders.length > 0 ? (
              orders.map((order) => (

                <tr
                  key={order.id}
                  className="transition hover:bg-[#F9FCFF]"
                >

                  {/* Order */}
                  <td className="px-5 py-4">

                    <Link
                      to={`/seller/orders/${order.id.replace("#", "")}`}
                      className="text-sm font-semibold text-[#0078ED] hover:underline"
                    >
                      {order.id}
                    </Link>

                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EAF4FF]
                          text-xs
                          font-semibold
                          text-[#0078ED]
                        "
                      >
                        {order.customer
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </span>

                      <span className="text-sm font-medium text-[#0B1F3A]">
                        {order.customer}
                      </span>

                    </div>

                  </td>

                  {/* Product */}
                  <td className="px-5 py-4">

                    <p className="max-w-[220px] truncate text-sm text-[#5E6B7A]">
                      {order.product}
                    </p>

                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                    </p>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        ${
                          statusStyles[order.status] ||
                          "bg-gray-50 text-gray-600"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">

                    <p className="text-xs text-[#5E6B7A]">
                      {order.date}
                    </p>

                  </td>

                </tr>

              ))
            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="px-5 py-12 text-center"
                >

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5FAFF] text-xl">
                    📦
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#0B1F3A]">
                    No orders yet
                  </p>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    Your recent customer orders will appear here.
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      {orders.length > 0 && (
        <div className="border-t border-[#DCE7F2] bg-[#FCFEFF] px-5 py-3.5 sm:px-6">

          <div className="flex items-center justify-between">

            <p className="text-xs text-[#5E6B7A]">
              Showing latest {orders.length} orders
            </p>

            <Link
              to="/seller/orders"
              className="text-xs font-semibold text-[#0078ED] hover:underline"
            >
              Manage Orders
            </Link>

          </div>

        </div>
      )}

    </div>
  );
}
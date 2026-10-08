import React from "react";
import { Link } from "react-router-dom";

import StatCard from "../../components/seller/StatCard.jsx";
import SalesChart from "../../components/seller/SalesChart.jsx";
import RecentOrders from "../../components/seller/RecentOrders.jsx";

/* =========================================================
   SELLER DASHBOARD DATA
========================================================= */

const stats = [
  {
    title: "Total Sales",
    value: "₹48,250",
    change: "+12.5%",
    icon: "₹",
    iconBg: "bg-[#EAF4FF]",
    iconColor: "text-[#0078ED]",
    changeColor: "text-green-600",
    subtitle: "this month",
  },
  {
    title: "Total Orders",
    value: "186",
    change: "+8.2%",
    icon: "▤",
    iconBg: "bg-[#EAF4FF]",
    iconColor: "text-[#0078ED]",
    changeColor: "text-green-600",
    subtitle: "this month",
  },
  {
    title: "Products",
    value: "32",
    change: "+4",
    icon: "▣",
    iconBg: "bg-[#EAF4FF]",
    iconColor: "text-[#0078ED]",
    changeColor: "text-green-600",
    subtitle: "this month",
  },
  {
    title: "Customers",
    value: "124",
    change: "+15.4%",
    icon: "♙",
    iconBg: "bg-[#EAF4FF]",
    iconColor: "text-[#0078ED]",
    changeColor: "text-green-600",
    subtitle: "this month",
  },
];

/* =========================================================
   TOP PRODUCTS
========================================================= */

const topProducts = [
  {
    name: "Premium Cotton T-Shirt",
    sold: 86,
    revenue: "₹68,400",
  },
  {
    name: "Designer Hoodie",
    sold: 54,
    revenue: "₹80,946",
  },
  {
    name: "Custom Mug",
    sold: 42,
    revenue: "₹20,958",
  },
  {
    name: "Handmade Wall Decor",
    sold: 31,
    revenue: "₹40,269",
  },
];

/* =========================================================
   SELLER DASHBOARD
========================================================= */

export default function SellerDashboard() {
  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Seller Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Manage your products, orders and store performance.
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="
            inline-flex
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            changeColor={item.changeColor}
            subtitle={item.subtitle}
          />
        ))}

      </div>

      {/* =====================================================
          SALES + QUICK ACTIONS
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* Sales Chart */}

        <div
          className="
            rounded-2xl
            border
            border-[#DCE7F2]
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Sales Overview
              </h2>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Revenue performance for this month
              </p>
            </div>

          </div>

          <div className="mt-5">
            <SalesChart />
          </div>

        </div>

        {/* Quick Actions */}

        <div
          className="
            rounded-2xl
            border
            border-[#DCE7F2]
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Manage your seller account quickly.
          </p>

          <div className="mt-5 grid gap-3">

            {/* Add Product */}

            <Link
              to="/seller/products/add"
              className="
                rounded-xl
                border
                border-[#DCE7F2]
                p-4
                transition
                hover:border-[#0078ED]
                hover:bg-[#F5FAFF]
              "
            >
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Add New Product
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Add products to your store.
              </p>
            </Link>

            {/* Orders */}

            <Link
              to="/seller/orders"
              className="
                rounded-xl
                border
                border-[#DCE7F2]
                p-4
                transition
                hover:border-[#0078ED]
                hover:bg-[#F5FAFF]
              "
            >
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Manage Orders
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Check and process your orders.
              </p>
            </Link>

            {/* Store */}

            <Link
              to="/seller/store"
              className="
                rounded-xl
                border
                border-[#DCE7F2]
                p-4
                transition
                hover:border-[#0078ED]
                hover:bg-[#F5FAFF]
              "
            >
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Manage Store
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Update your store information.
              </p>
            </Link>

          </div>

        </div>

      </div>

      {/* =====================================================
          RECENT ORDERS
      ====================================================== */}

      <RecentOrders />

      {/* =====================================================
          TOP PRODUCTS
      ====================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-[#DCE7F2]
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-base font-semibold text-[#0B1F3A]">
              Top Products
            </h2>

            <p className="mt-1 text-xs text-[#5E6B7A]">
              Your best performing products
            </p>
          </div>

          <Link
            to="/seller/products"
            className="
              text-xs
              font-semibold
              text-[#0078ED]
              hover:underline
            "
          >
            Manage Products
          </Link>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">

          {topProducts.map((product, index) => (

            <div
              key={product.name}
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-[#DCE7F2]
                p-4
                transition
                hover:border-[#0078ED]
                hover:bg-[#F9FCFF]
              "
            >

              {/* Rank */}

              <span
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#EAF4FF]
                  text-sm
                  font-bold
                  text-[#0078ED]
                "
              >
                #{index + 1}
              </span>

              {/* Product */}

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  {product.sold} units sold
                </p>

              </div>

              {/* Revenue */}

              <p className="shrink-0 text-sm font-semibold text-[#0B1F3A]">
                {product.revenue}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
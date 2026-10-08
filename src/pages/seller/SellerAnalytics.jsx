import React, { useMemo, useState } from "react";

export default function SellerAnalytics() {
  const [period, setPeriod] = useState("6M");

  const monthlyData = {
    "6M": [
      { month: "Apr", sales: 18500, orders: 42 },
      { month: "May", sales: 24200, orders: 56 },
      { month: "Jun", sales: 31800, orders: 71 },
      { month: "Jul", sales: 28600, orders: 64 },
      { month: "Aug", sales: 39400, orders: 89 },
      { month: "Sep", sales: 46200, orders: 103 },
    ],
    "3M": [
      { month: "Jul", sales: 28600, orders: 64 },
      { month: "Aug", sales: 39400, orders: 89 },
      { month: "Sep", sales: 46200, orders: 103 },
    ],
    "1M": [
      { month: "Week 1", sales: 9800, orders: 21 },
      { month: "Week 2", sales: 11200, orders: 25 },
      { month: "Week 3", sales: 12600, orders: 29 },
      { month: "Week 4", sales: 12600, orders: 28 },
    ],
  };

  const topProducts = [
    {
      name: "Premium Cotton T-Shirt",
      category: "T-Shirts",
      sales: 18450,
      orders: 68,
      growth: "+18.4%",
    },
    {
      name: "Handmade Wall Decor",
      category: "Home Decor",
      sales: 15200,
      orders: 47,
      growth: "+14.2%",
    },
    {
      name: "Designer Bracelet",
      category: "Jewellery",
      sales: 12800,
      orders: 39,
      growth: "+11.8%",
    },
    {
      name: "Decorative Idol",
      category: "Idols",
      sales: 10950,
      orders: 31,
      growth: "+8.6%",
    },
    {
      name: "Printed Hoodie",
      category: "Clothing",
      sales: 8750,
      orders: 24,
      growth: "+6.4%",
    },
  ];

  const orderStats = [
    {
      label: "Completed",
      value: 72,
      percentage: 70,
      className: "bg-green-500",
      textClass: "text-green-600",
    },
    {
      label: "Processing",
      value: 14,
      percentage: 14,
      className: "bg-blue-500",
      textClass: "text-blue-600",
    },
    {
      label: "Pending",
      value: 9,
      percentage: 9,
      className: "bg-orange-500",
      textClass: "text-orange-600",
    },
    {
      label: "Cancelled",
      value: 8,
      percentage: 7,
      className: "bg-red-500",
      textClass: "text-red-600",
    },
  ];

  const data = monthlyData[period];

  const totalSales = useMemo(
    () => data.reduce((sum, item) => sum + item.sales, 0),
    [data]
  );

  const totalOrders = useMemo(
    () => data.reduce((sum, item) => sum + item.orders, 0),
    [data]
  );

  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const maxSales = Math.max(...data.map((item) => item.sales));

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Insights
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Understand your store performance and customer activity.
          </p>
        </div>

        {/* Period Selector */}

        <div className="flex w-fit rounded-xl border border-[#DCE7F2] bg-white p-1">

          {["1M", "3M", "6M"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`
                rounded-lg
                px-4
                py-2
                text-xs
                font-semibold
                transition
                ${
                  period === item
                    ? "bg-[#0078ED] text-white"
                    : "text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

      </div>


      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Revenue
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(totalSales)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg font-semibold text-[#0078ED]">
              ₹
            </span>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            ↑ 16.8% compared to previous period
          </p>

        </div>


        {/* Orders */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Total Orders
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {totalOrders}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              #
            </span>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            ↑ 12.4% compared to previous period
          </p>

        </div>


        {/* Average Order */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Average Order Value
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(averageOrderValue)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
              ↗
            </span>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            ↑ 7.2% compared to previous period
          </p>

        </div>


        {/* Conversion */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Conversion Rate
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                4.82%
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
              %
            </span>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            ↑ 0.8% compared to previous period
          </p>

        </div>

      </div>


      {/* =====================================================
          SALES CHART
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 sm:p-6">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-base font-semibold text-[#0B1F3A]">
              Revenue Overview
            </h2>

            <p className="mt-1 text-xs text-[#5E6B7A]">
              Revenue generated during the selected period
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-[#0B1F3A]">
              {formatCurrency(totalSales)}
            </p>

            <p className="text-xs text-green-600">
              Positive growth
            </p>
          </div>

        </div>


        {/* Chart */}

        <div className="mt-8 flex h-[300px] items-end gap-3 overflow-x-auto pb-2 sm:gap-5">

          {data.map((item) => {

            const height =
              (item.sales / maxSales) * 220;

            return (
              <div
                key={item.month}
                className="flex min-w-[48px] flex-1 flex-col items-center justify-end gap-3"
              >

                <span className="text-[10px] font-medium text-[#5E6B7A]">
                  ₹{Math.round(item.sales / 1000)}k
                </span>

                <div
                  className="
                    w-full
                    max-w-[52px]
                    rounded-t-xl
                    bg-[#0078ED]
                    transition-all
                    hover:bg-[#012467]
                  "
                  style={{
                    height: `${height}px`,
                  }}
                />

                <span className="text-xs font-medium text-[#5E6B7A]">
                  {item.month}
                </span>

              </div>
            );
          })}

        </div>

      </div>


      {/* =====================================================
          PRODUCT + ORDER ANALYTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">

        {/* Top Products */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white">

          <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

            <h2 className="text-base font-semibold text-[#0B1F3A]">
              Top Performing Products
            </h2>

            <p className="mt-1 text-xs text-[#5E6B7A]">
              Products generating the most sales
            </p>

          </div>


          <div className="divide-y divide-[#DCE7F2]">

            {topProducts.map((product, index) => (

              <div
                key={product.name}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >

                {/* Rank */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5FAFF] text-sm font-semibold text-[#0078ED]">
                  {index + 1}
                </div>


                {/* Product */}

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    {product.category} · {product.orders} orders
                  </p>

                </div>


                {/* Sales */}

                <div className="text-right">

                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    {formatCurrency(product.sales)}
                  </p>

                  <p className="mt-1 text-xs font-medium text-green-600">
                    {product.growth}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* Order Status */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 sm:p-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Order Status
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Current order distribution
          </p>


          {/* Donut-style visual */}

          <div className="mt-7 flex justify-center">

            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#22c55e_0_70%,#3b82f6_70%_84%,#f97316_84%_93%,#ef4444_93%_100%)]">

              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">

                <span className="text-2xl font-semibold text-[#0B1F3A]">
                  103
                </span>

                <span className="text-[10px] text-[#5E6B7A]">
                  Total Orders
                </span>

              </div>

            </div>

          </div>


          {/* Status List */}

          <div className="mt-7 space-y-4">

            {orderStats.map((item) => (

              <div key={item.label}>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.className}`}
                    />

                    <span className="text-sm text-[#5E6B7A]">
                      {item.label}
                    </span>

                  </div>

                  <span
                    className={`text-sm font-semibold ${item.textClass}`}
                  >
                    {item.value}
                  </span>

                </div>


                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0F4F8]">

                  <div
                    className={`h-full rounded-full ${item.className}`}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* =====================================================
          CUSTOMER INSIGHTS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
              ♙
            </span>

            <div>
              <p className="text-xs text-[#5E6B7A]">
                Total Customers
              </p>

              <p className="text-xl font-semibold text-[#0B1F3A]">
                684
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            +9.6% this period
          </p>

        </div>


        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              ↻
            </span>

            <div>
              <p className="text-xs text-[#5E6B7A]">
                Repeat Customers
              </p>

              <p className="text-xl font-semibold text-[#0B1F3A]">
                38%
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            +4.3% this period
          </p>

        </div>


        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

          <div className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              ★
            </span>

            <div>
              <p className="text-xs text-[#5E6B7A]">
                Average Rating
              </p>

              <p className="text-xl font-semibold text-[#0B1F3A]">
                4.7/5
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            Based on customer reviews
          </p>

        </div>

      </div>


      {/* =====================================================
          INSIGHT MESSAGE
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-5 sm:p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#0078ED] shadow-sm">
            i
          </div>

          <div>

            <h3 className="text-sm font-semibold text-[#0B1F3A]">
              Seller Insight
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
              Your sales analytics will help you understand which
              products are generating revenue, how customers are
              ordering and where your store performance can be
              improved. These values are currently demo data and
              should be connected to the seller analytics API later.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
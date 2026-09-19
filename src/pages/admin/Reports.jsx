import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   STORAGE
========================================================= */

const ORDERS_KEY = "karodrop-orders";
const PRODUCTS_KEY = "karodrop-products";
const USERS_KEY = "karodrop-users";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  lightBlue: "#EAF4FF",
  background: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
};

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 5h12" />
      <path d="M6 9h12" />
      <path d="M9 5c5 0 5 8 0 8H6l8 6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m16.5 9.4-9-5.19" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m3 17 6-6 4 4 8-9" />
      <path d="M14 6h7v7" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);

    if (!value) return [];

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Unable to read ${key}`, error);
    return [];
  }
}

function getOrderAmount(order) {
  return Number(
    order?.total ??
      order?.totalAmount ??
      order?.grandTotal ??
      order?.amount ??
      order?.price ??
      0
  );
}

function getOrderStatus(order) {
  return String(
    order?.status ??
      order?.orderStatus ??
      "pending"
  ).toLowerCase();
}

function getOrderDate(order) {
  return (
    order?.createdAt ||
    order?.created_at ||
    order?.date ||
    order?.orderDate ||
    order?.updatedAt ||
    null
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isDateInRange(date, range) {
  if (range === "all") return true;

  if (!date) return false;

  const orderDate = new Date(date);

  if (Number.isNaN(orderDate.getTime())) {
    return false;
  }

  const now = new Date();

  const start = new Date(now);

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
  }

  if (range === "7days") {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }

  if (range === "30days") {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  }

  return orderDate >= start && orderDate <= now;
}

function getProductName(product) {
  return (
    product?.name ||
    product?.title ||
    product?.productName ||
    "Unnamed Product"
  );
}

function getProductPrice(product) {
  return Number(
    product?.price ??
      product?.sellingPrice ??
      product?.salePrice ??
      0
  );
}

function getItemsFromOrder(order) {
  const items =
    order?.items ||
    order?.products ||
    order?.cartItems ||
    order?.orderItems ||
    [];

  return Array.isArray(items) ? items : [];
}

function getItemQuantity(item) {
  return Number(
    item?.quantity ??
      item?.qty ??
      1
  );
}

function getItemName(item) {
  return (
    item?.name ||
    item?.title ||
    item?.productName ||
    "Unknown Product"
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Reports() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [dateRange, setDateRange] = useState("30days");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const loadData = () => {
      setOrders(readStorage(ORDERS_KEY));
      setProducts(readStorage(PRODUCTS_KEY));
      setUsers(readStorage(USERS_KEY));
    };

    loadData();

    window.addEventListener("ordersUpdated", loadData);
    window.addEventListener("productsUpdated", loadData);
    window.addEventListener("usersUpdated", loadData);

    return () => {
      window.removeEventListener("ordersUpdated", loadData);
      window.removeEventListener("productsUpdated", loadData);
      window.removeEventListener("usersUpdated", loadData);
    };
  }, []);

  /* =======================================================
     FILTERED ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      isDateInRange(getOrderDate(order), dateRange)
    );
  }, [orders, dateRange]);

  /* =======================================================
     REPORT SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const totalOrders = filteredOrders.length;

    const completedOrders = filteredOrders.filter((order) =>
      ["delivered", "completed", "success"].includes(
        getOrderStatus(order)
      )
    ).length;

    const cancelledOrders = filteredOrders.filter((order) =>
      ["cancelled", "canceled", "rejected"].includes(
        getOrderStatus(order)
      )
    ).length;

    const pendingOrders = filteredOrders.filter((order) =>
      ["pending", "processing", "confirmed"].includes(
        getOrderStatus(order)
      )
    ).length;

    const revenue = filteredOrders
      .filter(
        (order) =>
          !["cancelled", "canceled", "rejected"].includes(
            getOrderStatus(order)
          )
      )
      .reduce(
        (sum, order) => sum + getOrderAmount(order),
        0
      );

    return {
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      revenue,
    };
  }, [filteredOrders]);

  /* =======================================================
     PRODUCTS SOLD
  ======================================================= */

  const productsSold = useMemo(() => {
    return filteredOrders
      .filter(
        (order) =>
          !["cancelled", "canceled", "rejected"].includes(
            getOrderStatus(order)
          )
      )
      .reduce((total, order) => {
        const items = getItemsFromOrder(order);

        return (
          total +
          items.reduce(
            (sum, item) => sum + getItemQuantity(item),
            0
          )
        );
      }, 0);
  }, [filteredOrders]);

  /* =======================================================
     TOP PRODUCTS
  ======================================================= */

  const topProducts = useMemo(() => {
    const productMap = {};

    filteredOrders
      .filter(
        (order) =>
          !["cancelled", "canceled", "rejected"].includes(
            getOrderStatus(order)
          )
      )
      .forEach((order) => {
        const items = getItemsFromOrder(order);

        items.forEach((item) => {
          const name = getItemName(item);
          const quantity = getItemQuantity(item);

          if (!productMap[name]) {
            productMap[name] = {
              name,
              quantity: 0,
              revenue: 0,
            };
          }

          productMap[name].quantity += quantity;

          const itemPrice = Number(
            item?.price ??
              item?.sellingPrice ??
              item?.salePrice ??
              0
          );

          productMap[name].revenue +=
            itemPrice * quantity;
        });
      });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  /* =======================================================
     ORDER STATUS
  ======================================================= */

  const orderStatusData = useMemo(() => {
    const statusMap = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((order) => {
      const status = getOrderStatus(order);

      if (
        ["pending", "confirmed"].includes(status)
      ) {
        statusMap.pending += 1;
      } else if (status === "processing") {
        statusMap.processing += 1;
      } else if (
        ["shipped", "out_for_delivery"].includes(status)
      ) {
        statusMap.shipped += 1;
      } else if (
        ["delivered", "completed", "success"].includes(
          status
        )
      ) {
        statusMap.delivered += 1;
      } else if (
        ["cancelled", "canceled", "rejected"].includes(
          status
        )
      ) {
        statusMap.cancelled += 1;
      }
    });

    return statusMap;
  }, [filteredOrders]);

  /* =======================================================
     CUSTOMER COUNT
  ======================================================= */

  const customerCount = useMemo(() => {
    return users.filter((user) => {
      const role = String(
        user?.role || "customer"
      ).toLowerCase();

      return role === "customer";
    }).length;
  }, [users]);

  /* =======================================================
     TOP PRODUCT BAR MAX
  ======================================================= */

  const maxProductQuantity = useMemo(() => {
    return Math.max(
      ...topProducts.map((product) => product.quantity),
      1
    );
  }, [topProducts]);

  /* =======================================================
     EXPORT REPORT
  ======================================================= */

  function exportReport() {
    const reportRows = [
      ["Karodrop Sales Report"],
      [],
      ["Date Range", dateRange],
      [],
      ["Metric", "Value"],
      ["Total Orders", summary.totalOrders],
      ["Revenue", summary.revenue],
      ["Products Sold", productsSold],
      ["Customers", customerCount],
      ["Completed Orders", summary.completedOrders],
      ["Pending Orders", summary.pendingOrders],
      ["Cancelled Orders", summary.cancelledOrders],
      [],
      ["Top Products"],
      ["Product", "Quantity", "Revenue"],
      ...topProducts.map((product) => [
        product.name,
        product.quantity,
        product.revenue,
      ]),
    ];

    const csv = reportRows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");

            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `karodrop-report-${dateRange}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     DATE RANGE LABEL
  ======================================================= */

  const rangeLabel = {
    today: "Today",
    "7days": "Last 7 Days",
    "30days": "Last 30 Days",
    all: "All Time",
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Reports
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Track sales, orders, customers and product
                performance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* DATE FILTER */}

              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
                  <FilterIcon />
                </div>

                <select
                  value={dateRange}
                  onChange={(event) =>
                    setDateRange(event.target.value)
                  }
                  className="w-full rounded-xl border border-[#DCE7F2] bg-white py-3 pl-10 pr-9 text-sm font-semibold text-[#0B1F3A] outline-none transition focus:border-[#0078ED] sm:w-auto"
                >
                  <option value="today">Today</option>
                  <option value="7days">
                    Last 7 Days
                  </option>
                  <option value="30days">
                    Last 30 Days
                  </option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* EXPORT */}

              <button
                type="button"
                onClick={exportReport}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0078ED] bg-white px-5 py-3 text-sm font-semibold text-[#0078ED] transition hover:bg-[#EAF4FF]"
              >
                <DownloadIcon />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            REPORT RANGE
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white px-5 py-4">
          <p className="text-sm text-[#5E6B7A]">
            Showing report for
          </p>

          <p className="mt-1 text-lg font-bold text-[#0B1F3A]">
            {rangeLabel[dateRange]}
          </p>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportCard
            title="Total Revenue"
            value={formatCurrency(summary.revenue)}
            icon={<RupeeIcon />}
            description={`${summary.completedOrders} completed orders`}
          />

          <ReportCard
            title="Total Orders"
            value={summary.totalOrders}
            icon={<ShoppingBagIcon />}
            description={`${summary.pendingOrders} pending`}
          />

          <ReportCard
            title="Products Sold"
            value={productsSold}
            icon={<PackageIcon />}
            description="Units sold"
          />

          <ReportCard
            title="Customers"
            value={customerCount}
            icon={<UsersIcon />}
            description="Registered customers"
          />
        </div>

        {/* =================================================
            SECONDARY STATS
        ================================================= */}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SmallReportCard
            title="Completed Orders"
            value={summary.completedOrders}
            text="Successfully completed"
          />

          <SmallReportCard
            title="Pending Orders"
            value={summary.pendingOrders}
            text="Pending / processing"
          />

          <SmallReportCard
            title="Cancelled Orders"
            value={summary.cancelledOrders}
            text="Cancelled / rejected"
          />
        </div>

        {/* =================================================
            MAIN REPORT GRID
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* =================================================
              ORDER STATUS
          ================================================= */}

          <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Order Status
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Orders grouped by current status.
                </p>
              </div>

              <div className="rounded-xl bg-[#EAF4FF] p-3 text-[#0078ED]">
                <ShoppingBagIcon />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <StatusProgress
                label="Pending"
                value={orderStatusData.pending}
                total={filteredOrders.length}
              />

              <StatusProgress
                label="Processing"
                value={orderStatusData.processing}
                total={filteredOrders.length}
              />

              <StatusProgress
                label="Shipped"
                value={orderStatusData.shipped}
                total={filteredOrders.length}
              />

              <StatusProgress
                label="Delivered"
                value={orderStatusData.delivered}
                total={filteredOrders.length}
              />

              <StatusProgress
                label="Cancelled"
                value={orderStatusData.cancelled}
                total={filteredOrders.length}
              />
            </div>
          </section>

          {/* =================================================
              TOP PRODUCTS
          ================================================= */}

          <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Top Products
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Best-selling products for this period.
                </p>
              </div>

              <div className="rounded-xl bg-[#EAF4FF] p-3 text-[#0078ED]">
                <TrendingUpIcon />
              </div>
            </div>

            <div className="mt-6">
              {topProducts.length === 0 ? (
                <EmptyState
                  title="No product sales yet"
                  text="Product sales will appear here when orders contain product items."
                />
              ) : (
                <div className="space-y-5">
                  {topProducts.map(
                    (product, index) => (
                      <div key={product.name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FF] text-xs font-bold text-[#0078ED]">
                              {index + 1}
                            </span>

                            <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                              {product.name}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-[#0B1F3A]">
                              {product.quantity} units
                            </p>

                            <p className="text-xs text-[#5E6B7A]">
                              {formatCurrency(
                                product.revenue
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#EAF4FF]">
                          <div
                            className="h-full rounded-full bg-[#0078ED] transition-all"
                            style={{
                              width: `${
                                (product.quantity /
                                  maxProductQuantity) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            ALL PRODUCTS
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white">
          <div className="border-b border-[#DCE7F2] px-5 py-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Product Catalog
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Current products available in Karodrop.
                </p>
              </div>

              <span className="rounded-full bg-[#EAF4FF] px-3 py-1.5 text-xs font-bold text-[#0078ED]">
                {products.length} Products
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <div className="p-10">
                <EmptyState
                  title="No products found"
                  text="Products added from the Products section will appear here."
                />
              </div>
            ) : (
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#F8FBFF]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Stock
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.slice(0, 10).map(
                    (product, index) => (
                      <tr
                        key={
                          product.id ||
                          product._id ||
                          index
                        }
                        className="border-t border-[#EEF3F8] hover:bg-[#F8FBFF]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0B1F3A]">
                            {getProductName(product)}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                          {product.category ||
                            product.categoryName ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#0B1F3A]">
                          {formatCurrency(
                            getProductPrice(product)
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                          {product.stock ??
                            product.inventory ??
                            product.quantity ??
                            "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* =================================================
            REPORT FOOTER
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#EAF4FF] p-3 text-[#0078ED]">
              <TrendingUpIcon />
            </div>

            <div>
              <h3 className="font-bold text-[#0B1F3A]">
                Report Information
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#5E6B7A]">
                This report uses the orders, products and
                customer data stored in your Karodrop
                application. Cancelled orders are excluded
                from revenue calculations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-[#0B1F3A]">
            {value}
          </p>

          <p className="mt-2 text-xs text-[#5E6B7A]">
            {description}
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-[#EAF4FF] p-3 text-[#0078ED]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL REPORT CARD
========================================================= */

function SmallReportCard({
  title,
  value,
  text,
}) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </p>
        </div>

        <span className="rounded-xl bg-[#F5FAFF] px-3 py-2 text-xs font-semibold text-[#5E6B7A]">
          {text}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS PROGRESS
========================================================= */

function StatusProgress({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#0B1F3A]">
          {label}
        </span>

        <span className="text-sm font-bold text-[#5E6B7A]">
          {value}{" "}
          <span className="font-normal">
            ({percentage}%)
          </span>
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#EAF4FF]">
        <div
          className="h-full rounded-full bg-[#0078ED] transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  title,
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 rounded-full bg-[#EAF4FF] p-4 text-[#0078ED]">
        <PackageIcon />
      </div>

      <h3 className="text-base font-semibold text-[#0B1F3A]">
        {title}
      </h3>

      <p className="mt-1 max-w-md text-sm text-[#5E6B7A]">
        {text}
      </p>
    </div>
  );
}
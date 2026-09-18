import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ORDERS_STORAGE_KEY = "karodrop-orders";

const BLUE = "#0078ED";
const NAVY = "#012467";
const TEXT = "#0B1F3A";
const MUTED = "#5E6B7A";
const BORDER = "#DCE7F2";
const LIGHT_BLUE = "#EAF4FF";
const PAGE_BG = "#F5FAFF";

/* =========================================================
   HELPERS
========================================================= */

function getCurrentUser() {
  try {
    const user = localStorage.getItem("karodrop-user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function getCustomerId(user) {
  if (!user) return "";

  return String(
    user._id ||
      user.id ||
      user.email ||
      ""
  ).toLowerCase();
}

function getCustomerOrders() {
  const user = getCurrentUser();

  if (!user) return [];

  try {
    const savedOrders = JSON.parse(
      localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(savedOrders)) {
      return [];
    }

    const customerId = getCustomerId(user);

    return savedOrders.filter((order) => {
      const orderCustomerId = String(
        order.customerId ||
          order.userId ||
          order.customerEmail ||
          order.email ||
          ""
      ).toLowerCase();

      return orderCustomerId === customerId;
    });
  } catch {
    return [];
  }
}

function getOrderNumber(order) {
  return (
    order.orderNumber ||
    order.id ||
    order._id ||
    "Order"
  );
}

function getOrderDate(order) {
  return (
    order.createdAt ||
    order.date ||
    order.created_at ||
    null
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getItems(order) {
  return Array.isArray(order.items) ? order.items : [];
}

function getItemQuantity(item) {
  return Number(
    item.qty ||
      item.quantity ||
      1
  );
}

function getOrderAmount(order) {
  const items = getItems(order);

  if (
    order.total !== undefined &&
    order.total !== null
  ) {
    return Number(order.total);
  }

  if (
    order.amount !== undefined &&
    order.amount !== null
  ) {
    return Number(order.amount);
  }

  if (
    order.totalAmount !== undefined &&
    order.totalAmount !== null
  ) {
    return Number(order.totalAmount);
  }

  return items.reduce((total, item) => {
    return (
      total +
      Number(item.price || 0) *
        getItemQuantity(item)
    );
  }, 0);
}

function getTrackingNumber(order) {
  return (
    order.trackingNumber ||
    order.awbNumber ||
    order.awb ||
    order.trackingId ||
    order.shipmentId ||
    ""
  );
}

function getCourierName(order) {
  return (
    order.courierName ||
    order.courier ||
    order.shippingPartner ||
    order.deliveryPartner ||
    ""
  );
}

function getEstimatedDelivery(order) {
  return (
    order.estimatedDelivery ||
    order.estimatedDeliveryDate ||
    order.eta ||
    ""
  );
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString(
    "en-IN"
  )}`;
}

/* =========================================================
   STATUS
========================================================= */

function getStatusKey(status) {
  const value = String(
    status || "Order Placed"
  )
    .trim()
    .toLowerCase();

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "cancelled";
  }

  if (value === "delivered") {
    return "delivered";
  }

  if (
    value === "out-for-delivery" ||
    value === "out_for_delivery" ||
    value === "out for delivery"
  ) {
    return "out_for_delivery";
  }

  if (value === "shipped") {
    return "shipped";
  }

  if (value === "packed") {
    return "packed";
  }

  if (
    value === "payment confirmed" ||
    value === "payment_confirmed" ||
    value === "confirmed" ||
    value === "paid" ||
    value === "payment"
  ) {
    return "payment";
  }

  if (
    value === "processing" ||
    value === "pending" ||
    value === "design/production" ||
    value === "production"
  ) {
    return "processing";
  }

  return "placed";
}

function getStatusLabel(status) {
  const key = getStatusKey(status);

  const labels = {
    placed: "Order Placed",
    payment: "Payment Confirmed",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[key] || "Order Placed";
}

function getStatusClasses(status) {
  const key = getStatusKey(status);

  if (key === "delivered") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    key === "shipped" ||
    key === "out_for_delivery"
  ) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (key === "cancelled") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (key === "payment") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

/* =========================================================
   TIMELINE
========================================================= */

const TIMELINE = [
  {
    key: "placed",
    label: "Order Placed",
    description:
      "Your order has been received.",
  },
  {
    key: "payment",
    label: "Payment Confirmed",
    description:
      "Payment has been successfully confirmed.",
  },
  {
    key: "processing",
    label: "Processing",
    description:
      "Your order is being prepared.",
  },
  {
    key: "packed",
    label: "Packed",
    description:
      "Your order has been packed.",
  },
  {
    key: "shipped",
    label: "Shipped",
    description:
      "Your order is on the way.",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    description:
      "Your order is arriving soon.",
  },
  {
    key: "delivered",
    label: "Delivered",
    description:
      "Order delivered successfully.",
  },
];

function getTimelineProgress(status) {
  const key = getStatusKey(status);

  if (key === "cancelled") {
    return -1;
  }

  const index = TIMELINE.findIndex(
    (step) => step.key === key
  );

  return index >= 0 ? index : 0;
}

/* =========================================================
   MAIN ORDERS PAGE
========================================================= */

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState(null);
  const [helpOrder, setHelpOrder] =
    useState(null);

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getCustomerOrders());
    };

    loadOrders();

    window.addEventListener(
      "ordersUpdated",
      loadOrders
    );

    window.addEventListener(
      "storage",
      loadOrders
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        loadOrders
      );

      window.removeEventListener(
        "storage",
        loadOrders
      );
    };
  }, []);

  const counts = useMemo(() => {
    return {
      All: orders.length,

      Processing: orders.filter(
        (order) =>
          ["placed", "payment", "processing", "packed"].includes(
            getStatusKey(order.status)
          )
      ).length,

      Shipped: orders.filter(
        (order) =>
          ["shipped", "out_for_delivery"].includes(
            getStatusKey(order.status)
          )
      ).length,

      Delivered: orders.filter(
        (order) =>
          getStatusKey(order.status) ===
          "delivered"
      ).length,

      Cancelled: orders.filter(
        (order) =>
          getStatusKey(order.status) ===
          "cancelled"
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeTab !== "All") {
      result = result.filter((order) => {
        const status = getStatusKey(
          order.status
        );

        if (activeTab === "Processing") {
          return [
            "placed",
            "payment",
            "processing",
            "packed",
          ].includes(status);
        }

        if (activeTab === "Shipped") {
          return [
            "shipped",
            "out_for_delivery",
          ].includes(status);
        }

        if (activeTab === "Delivered") {
          return status === "delivered";
        }

        if (activeTab === "Cancelled") {
          return status === "cancelled";
        }

        return true;
      });
    }

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter((order) => {
        const orderNumber = String(
          getOrderNumber(order)
        ).toLowerCase();

        const productNames = getItems(order)
          .map(
            (item) =>
              item.title ||
              item.name ||
              ""
          )
          .join(" ")
          .toLowerCase();

        return (
          orderNumber.includes(query) ||
          productNames.includes(query)
        );
      });
    }

    result.sort((a, b) => {
      const first = new Date(
        getOrderDate(a) || 0
      ).getTime();

      const second = new Date(
        getOrderDate(b) || 0
      ).getTime();

      return second - first;
    });

    return result;
  }, [
    orders,
    activeTab,
    search,
  ]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (orders.length === 0) {
    return (
      <main
        className="min-h-screen"
        style={{
          backgroundColor: PAGE_BG,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
            <div>
              <p
                className="text-xs uppercase tracking-[0.18em] font-semibold mb-2"
                style={{ color: BLUE }}
              >
                Customer Panel
              </p>

              <h1
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: TEXT }}
              >
                Orders
              </h1>

              <p
                className="text-sm mt-2"
                style={{ color: MUTED }}
              >
                Track and manage all your
                Karodrop orders.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/search")
              }
              className="inline-flex items-center justify-center text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{
                backgroundColor: BLUE,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  NAVY;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor =
                  BLUE;
              }}
            >
              Explore Products →
            </button>
          </div>

          <div
            className="bg-white rounded-2xl shadow-sm"
            style={{
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="px-6 sm:px-10 py-16 sm:py-20 text-center">

              <div
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6"
                style={{
                  backgroundColor:
                    LIGHT_BLUE,
                }}
              >
                📦
              </div>

              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: TEXT }}
              >
                No orders yet
              </h2>

              <p
                className="max-w-md mx-auto text-sm leading-6 mt-3"
                style={{ color: MUTED }}
              >
                Once you place an order,
                you'll be able to track its
                status, shipment and details
                from this section.
              </p>

              <Link
                to="/search"
                className="inline-flex mt-7 text-white px-6 py-3 rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: BLUE,
                }}
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ORDERS
  ======================================================= */

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: PAGE_BG,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

          <div>
            <p
              className="text-xs uppercase tracking-[0.18em] font-semibold mb-2"
              style={{ color: BLUE }}
            >
              Customer Panel
            </p>

            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: TEXT }}
            >
              Orders
            </h1>

            <p
              className="text-sm mt-2"
              style={{ color: MUTED }}
            >
              Track your orders and stay
              updated on every step.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/search")
            }
            className="self-start lg:self-auto inline-flex items-center justify-center text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: BLUE,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor =
                NAVY;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor =
                BLUE;
            }}
          >
            + Create New Order
          </button>
        </div>

        {/* SEARCH */}

        <div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm mb-6"
          style={{
            border: `1px solid ${BORDER}`,
          }}
        >
          <div className="relative max-w-xl">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: MUTED }}
            >
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by order number or product..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#F5FAFF] text-sm outline-none"
              style={{
                border: `1px solid ${BORDER}`,
                color: TEXT,
              }}
            />
          </div>
        </div>

        {/* TABS */}

        <div
          className="bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto"
          style={{
            border: `1px solid ${BORDER}`,
          }}
        >
          <div className="flex min-w-max">
            {[
              "All",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((tab) => {
              const active =
                activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className="relative px-5 sm:px-6 py-4 text-sm font-medium transition-colors"
                  style={{
                    color: active
                      ? BLUE
                      : MUTED,
                  }}
                >
                  {tab}

                  <span
                    className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: active
                        ? LIGHT_BLUE
                        : PAGE_BG,
                      color: active
                        ? BLUE
                        : MUTED,
                    }}
                  >
                    {counts[tab]}
                  </span>

                  {active && (
                    <span
                      className="absolute left-4 right-4 bottom-0 h-0.5 rounded-full"
                      style={{
                        backgroundColor: BLUE,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* LIST */}

        {filteredOrders.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-12 text-center"
            style={{
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="text-3xl mb-4">
              🔎
            </div>

            <h2
              className="text-lg font-semibold"
              style={{ color: TEXT }}
            >
              No matching orders
            </h2>

            <p
              className="text-sm mt-2"
              style={{ color: MUTED }}
            >
              Try another search or select
              a different order status.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map(
              (order) => (
                <OrderCard
                  key={
                    order.id ||
                    order._id ||
                    order.orderNumber
                  }
                  order={order}
                  onViewDetails={() =>
                    setSelectedOrder(order)
                  }
                  onNeedHelp={() =>
                    setHelpOrder(order)
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          onNeedHelp={() => {
            setSelectedOrder(null);
            setHelpOrder(
              selectedOrder
            );
          }}
        />
      )}

      {/* HELP MODAL */}

      {helpOrder && (
        <HelpModal
          order={helpOrder}
          onClose={() =>
            setHelpOrder(null)
          }
        />
      )}
    </main>
  );
}

/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({
  order,
  onViewDetails,
  onNeedHelp,
}) {
  const items = getItems(order);

  const firstItem =
    items[0] || {};

  const itemCount = items.reduce(
    (total, item) =>
      total + getItemQuantity(item),
    0
  );

  const statusKey = getStatusKey(
    order.status
  );

  const progress =
    getTimelineProgress(
      order.status
    );

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* TOP */}

      <div
        className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">

            <span
              className="text-sm font-semibold"
              style={{ color: TEXT }}
            >
              #{getOrderNumber(order)}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusClasses(
                order.status
              )}`}
            >
              {getStatusLabel(
                order.status
              )}
            </span>
          </div>

          <p
            className="text-xs mt-1"
            style={{ color: MUTED }}
          >
            Placed on{" "}
            {formatDate(
              getOrderDate(order)
            )}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p
            className="text-xs"
            style={{ color: MUTED }}
          >
            Order total
          </p>

          <p
            className="text-base font-bold mt-0.5"
            style={{ color: TEXT }}
          >
            {formatCurrency(
              getOrderAmount(order)
            )}
          </p>
        </div>
      </div>

      {/* BODY */}

      <div className="p-5 sm:p-6">

        <div className="flex flex-col md:flex-row gap-5 md:items-center">

          {/* PRODUCT */}

          <div className="flex items-center gap-4 flex-1 min-w-0">

            <div
              className="w-20 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
              style={{
                backgroundColor:
                  LIGHT_BLUE,
                border: `1px solid ${BORDER}`,
              }}
            >
              {firstItem.image ? (
                <img
                  src={firstItem.image}
                  alt={
                    firstItem.title ||
                    firstItem.name ||
                    "Product"
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">
                  📦
                </span>
              )}
            </div>

            <div className="min-w-0">

              <h3
                className="text-sm sm:text-base font-semibold truncate"
                style={{ color: TEXT }}
              >
                {firstItem.title ||
                  firstItem.name ||
                  "Karodrop Product"}
              </h3>

              <p
                className="text-xs mt-1"
                style={{ color: MUTED }}
              >
                {itemCount}{" "}
                {itemCount === 1
                  ? "item"
                  : "items"}

                {items.length > 1 &&
                  ` • ${items.length} products`}
              </p>

              {items.length > 1 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: MUTED }}
                >
                  + {items.length - 1} more product
                  {items.length - 1 === 1
                    ? ""
                    : "s"}
                </p>
              )}

              {order.shippingAddress && (
                <p
                  className="text-xs mt-2 truncate max-w-[400px]"
                  style={{ color: MUTED }}
                >
                  📍{" "}
                  {order.shippingAddress.city ||
                    order.shippingAddress.address ||
                    "Shipping address added"}
                </p>
              )}
            </div>
          </div>

          {/* SHIPMENT INFO */}

          {(getTrackingNumber(order) ||
            getCourierName(order) ||
            getEstimatedDelivery(order)) && (
            <div
              className="rounded-xl p-3 md:max-w-[360px]"
              style={{
                backgroundColor: PAGE_BG,
                border: `1px solid ${BORDER}`,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-wide font-semibold"
                style={{ color: MUTED }}
              >
                Shipment
              </p>

              <div className="mt-1.5 space-y-1">
                {getTrackingNumber(order) && (
                  <p className="text-xs" style={{ color: TEXT }}>
                    <span style={{ color: MUTED }}>Tracking:</span>{" "}
                    <span className="font-semibold">
                      {getTrackingNumber(order)}
                    </span>
                  </p>
                )}

                {getCourierName(order) && (
                  <p className="text-xs" style={{ color: TEXT }}>
                    <span style={{ color: MUTED }}>Courier:</span>{" "}
                    {getCourierName(order)}
                  </p>
                )}

                {getEstimatedDelivery(order) && (
                  <p className="text-xs" style={{ color: TEXT }}>
                    <span style={{ color: MUTED }}>Expected:</span>{" "}
                    {formatDate(getEstimatedDelivery(order))}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-2 md:justify-end">

            <button
              type="button"
              onClick={onViewDetails}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                border: `1px solid ${BORDER}`,
                color: NAVY,
                backgroundColor:
                  "#FFFFFF",
              }}
            >
              View Details
            </button>

            {statusKey !==
              "cancelled" && (
              <button
                type="button"
                onClick={onNeedHelp}
                className="px-4 py-2.5 rounded-lg text-white text-xs font-semibold"
                style={{
                  backgroundColor: BLUE,
                }}
              >
                Need Help
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS */}

        {statusKey !==
          "cancelled" && (
          <MiniProgress
            status={order.status}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MINI PROGRESS
========================================================= */

function MiniProgress({ status }) {
  const progress =
    getTimelineProgress(status);

  return (
    <div className="mt-7">

      {/* DESKTOP TIMELINE */}

      <div className="hidden sm:flex items-center">
        {TIMELINE.map(
          (step, index) => {
            const completed =
              index <= progress;

            return (
              <React.Fragment
                key={step.key}
              >
                <div className="flex flex-col items-center shrink-0">

                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor:
                        completed
                          ? BLUE
                          : "#FFFFFF",
                      borderColor:
                        completed
                          ? BLUE
                          : "#C9D8E8",
                    }}
                  />
                </div>

                {index <
                  TIMELINE.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1"
                    style={{
                      backgroundColor:
                        BORDER,
                    }}
                  >
                    <div
                      className="h-full"
                      style={{
                        width:
                          index < progress
                            ? "100%"
                            : "0%",
                        backgroundColor:
                          BLUE,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          }
        )}
      </div>

      <div
        className="hidden sm:flex justify-between mt-2 text-[9px]"
        style={{
          color: "#7B8794",
        }}
      >
        {TIMELINE.map(
          (step) => (
            <span
              key={step.key}
              className="text-center"
            >
              {step.label}
            </span>
          )
        )}
      </div>

      {/* MOBILE */}

      <div className="sm:hidden mt-2">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold"
            style={{ color: BLUE }}
          >
            {TIMELINE[progress]?.label ||
              "Order Placed"}
          </span>

          <span
            className="text-[11px]"
            style={{ color: MUTED }}
          >
            Step {progress + 1} of{" "}
            {TIMELINE.length}
          </span>
        </div>

        <div
          className="h-1.5 rounded-full mt-2 overflow-hidden"
          style={{
            backgroundColor: BORDER,
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${
                ((progress + 1) /
                  TIMELINE.length) *
                100
              }%`,
              backgroundColor: BLUE,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER DETAILS MODAL
========================================================= */

function OrderDetailsModal({
  order,
  onClose,
  onNeedHelp,
}) {
  const items = getItems(order);

  const progress =
    getTimelineProgress(
      order.status
    );

  const cancelled =
    getStatusKey(order.status) ===
    "cancelled";

  return (
    <Modal onClose={onClose}>

      <div className="p-5 sm:p-7">

        {/* HEADER */}

        <div
          className="flex items-start justify-between gap-4 pb-5"
          style={{
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div>

            <p
              className="text-xs uppercase tracking-[0.15em] font-semibold"
              style={{ color: BLUE }}
            >
              Order Details
            </p>

            <h2
              className="text-xl sm:text-2xl font-bold mt-1"
              style={{ color: TEXT }}
            >
              #{getOrderNumber(order)}
            </h2>

            <p
              className="text-xs mt-1"
              style={{ color: MUTED }}
            >
              Placed on{" "}
              {formatDateTime(
                getOrderDate(order)
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                PAGE_BG,
              color: MUTED,
            }}
          >
            ✕
          </button>
        </div>

        {/* STATUS */}

        <div className="py-5 flex items-center justify-between gap-3">
          <span
            className="text-sm font-semibold"
            style={{ color: TEXT }}
          >
            Current Status
          </span>

          <span
            className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusClasses(
              order.status
            )}`}
          >
            {getStatusLabel(
              order.status
            )}
          </span>
        </div>

        {/* TIMELINE */}

        {!cancelled ? (
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor:
                PAGE_BG,
              border: `1px solid ${BORDER}`,
            }}
          >
            <h3
              className="text-sm font-semibold mb-5"
              style={{ color: TEXT }}
            >
              Shipment Timeline
            </h3>

            <div>
              {TIMELINE.map(
                (step, index) => {
                  const completed =
                    index <= progress;

                  const active =
                    index === progress;

                  return (
                    <div
                      key={step.key}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">

                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor:
                              completed
                                ? BLUE
                                : "#FFFFFF",
                            color:
                              completed
                                ? "#FFFFFF"
                                : "#8A98A8",
                            border:
                              completed
                                ? `1px solid ${BLUE}`
                                : `1px solid ${BORDER}`,
                          }}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        {index <
                          TIMELINE.length -
                            1 && (
                          <div
                            className="w-px h-10"
                            style={{
                              backgroundColor:
                                index <
                                progress
                                  ? BLUE
                                  : BORDER,
                            }}
                          />
                        )}
                      </div>

                      <div className="pb-5">

                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: active
                              ? BLUE
                              : completed
                              ? TEXT
                              : "#7B8794",
                          }}
                        >
                          {step.label}
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{
                            color: MUTED,
                          }}
                        >
                          {
                            step.description
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-red-50 border border-red-200 p-5">
            <p className="text-sm font-semibold text-red-700">
              This order has been cancelled.
            </p>

            <p className="text-xs text-red-600 mt-1">
              If you need more information,
              contact Karodrop support.
            </p>
          </div>
        )}

        {/* SHIPMENT DETAILS */}

        {(getTrackingNumber(order) ||
          getCourierName(order) ||
          getEstimatedDelivery(order) ||
          order.trackingUrl) && (
          <div className="mt-6">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: TEXT }}
            >
              Shipment Details
            </h3>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: LIGHT_BLUE,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p
                    className="text-[11px] uppercase tracking-wide font-semibold"
                    style={{ color: MUTED }}
                  >
                    Tracking Number
                  </p>
                  <p
                    className="text-sm font-semibold mt-1 break-all"
                    style={{ color: TEXT }}
                  >
                    {getTrackingNumber(order) || "Not assigned yet"}
                  </p>
                </div>

                <div>
                  <p
                    className="text-[11px] uppercase tracking-wide font-semibold"
                    style={{ color: MUTED }}
                  >
                    Courier
                  </p>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: TEXT }}
                  >
                    {getCourierName(order) || "Not assigned yet"}
                  </p>
                </div>

                <div>
                  <p
                    className="text-[11px] uppercase tracking-wide font-semibold"
                    style={{ color: MUTED }}
                  >
                    Expected Delivery
                  </p>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: TEXT }}
                  >
                    {getEstimatedDelivery(order)
                      ? formatDate(getEstimatedDelivery(order))
                      : "Will be updated soon"}
                  </p>
                </div>
              </div>

              {getTrackingNumber(order) && (
                <button
                  type="button"
                  onClick={() => {
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText(
                        getTrackingNumber(order)
                      );
                    }
                  }}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: NAVY,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  Copy Tracking Number
                </button>
              )}
            </div>
          </div>
        )}

        {/* PAYMENT */}

        <div className="mt-6">

          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: TEXT }}
          >
            Payment Information
          </h3>

          <div
            className="rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              backgroundColor:
                "#FFFFFF",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div>
              <p
                className="text-[11px] uppercase tracking-wide font-semibold"
                style={{ color: MUTED }}
              >
                Payment Method
              </p>

              <p
                className="text-sm font-semibold mt-1"
                style={{ color: TEXT }}
              >
                {order.paymentMethod ||
                  "Cash on Delivery"}
              </p>
            </div>

            <div>
              <p
                className="text-[11px] uppercase tracking-wide font-semibold"
                style={{ color: MUTED }}
              >
                Payment Status
              </p>

              <p
                className="text-sm font-semibold mt-1"
                style={{ color: TEXT }}
              >
                {order.paymentStatus ||
                  "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="mt-6">

          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: TEXT }}
          >
            Products
          </h3>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: `1px solid ${BORDER}`,
            }}
          >
            {items.length > 0 ? (
              items.map(
                (item, index) => (
                  <div
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                    className="p-4 flex items-center gap-4"
                    style={{
                      borderBottom:
                        index <
                        items.length - 1
                          ? `1px solid ${BORDER}`
                          : "none",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor:
                          LIGHT_BLUE,
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={
                            item.title ||
                            item.name ||
                            "Product"
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          📦
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">

                      <p
                        className="text-sm font-medium"
                        style={{ color: TEXT }}
                      >
                        {item.title ||
                          item.name ||
                          "Karodrop Product"}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{ color: MUTED }}
                      >
                        Qty:{" "}
                        {getItemQuantity(
                          item
                        )}
                      </p>

                      {item.price !==
                        undefined && (
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: MUTED,
                          }}
                        >
                          {formatCurrency(
                            item.price
                          )}{" "}
                          each
                        </p>
                      )}
                    </div>

                    <p
                      className="text-sm font-semibold"
                      style={{ color: TEXT }}
                    >
                      {formatCurrency(
                        Number(
                          item.price || 0
                        ) *
                          getItemQuantity(
                            item
                          )
                      )}
                    </p>
                  </div>
                )
              )
            ) : (
              <div
                className="p-5 text-sm"
                style={{ color: MUTED }}
              >
                Product information
                unavailable.
              </div>
            )}
          </div>
        </div>

        {/* SHIPPING ADDRESS */}

        {order.shippingAddress && (
          <div className="mt-6">

            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: TEXT }}
            >
              Shipping Address
            </h3>

            <div
              className="rounded-xl p-4 text-sm leading-6"
              style={{
                border: `1px solid ${BORDER}`,
                color: MUTED,
              }}
            >
              {order.shippingAddress.name && (
                <p
                  className="font-semibold"
                  style={{ color: TEXT }}
                >
                  {
                    order.shippingAddress
                      .name
                  }
                </p>
              )}

              <p>
                {order.shippingAddress
                  .address ||
                  order.shippingAddress
                    .line1 ||
                  ""}
              </p>

              <p>
                {order.shippingAddress
                  .city || ""}

                {order.shippingAddress
                  .state
                  ? `, ${order.shippingAddress.state}`
                  : ""}

                {order.shippingAddress
                  .pincode
                  ? ` - ${order.shippingAddress.pincode}`
                  : ""}
              </p>

              {order.shippingAddress
                .phone && (
                <p>
                  Phone:{" "}
                  {
                    order.shippingAddress
                      .phone
                  }
                </p>
              )}
            </div>
          </div>
        )}

        {/* TOTAL */}

        <div
          className="mt-6 pt-5 flex items-center justify-between"
          style={{
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: TEXT }}
          >
            Order Total
          </span>

          <span
            className="text-xl font-bold"
            style={{ color: BLUE }}
          >
            {formatCurrency(
              getOrderAmount(order)
            )}
          </span>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">

          <button
            type="button"
            onClick={onNeedHelp}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{
              border: `1px solid ${BORDER}`,
              color: NAVY,
              backgroundColor:
                "#FFFFFF",
            }}
          >
            Need Help
          </button>

          {!cancelled && (
            <button
              type="button"
              disabled={!order.trackingUrl}
              onClick={() => {
                if (
                  order.trackingUrl
                ) {
                  window.open(
                    order.trackingUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: BLUE,
              }}
            >
              {order.trackingUrl
                ? "Track Shipment →"
                : getTrackingNumber(order)
                ? "Tracking Link Not Available"
                : "Tracking Not Available"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   HELP MODAL
========================================================= */

function HelpModal({
  order,
  onClose,
}) {
  const [selectedIssue, setSelectedIssue] =
    useState("");

  const issues = [
    {
      title: "Delivery Issue",
      icon: "🚚",
      description:
        "Order is delayed, not received or tracking issue.",
    },
    {
      title: "Product Issue",
      icon: "📦",
      description:
        "Product damaged, incorrect or missing.",
    },
    {
      title: "Return / Replacement",
      icon: "↩",
      description:
        "Request support for an eligible return or replacement.",
    },
    {
      title: "Other Question",
      icon: "💬",
      description:
        "Something else related to your order.",
    },
  ];

  return (
    <Modal onClose={onClose}>

      <div className="p-5 sm:p-7">

        <div
          className="flex items-start justify-between gap-4 pb-5"
          style={{
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div>

            <p
              className="text-xs uppercase tracking-[0.15em] font-semibold"
              style={{ color: BLUE }}
            >
              Order Support
            </p>

            <h2
              className="text-xl font-bold mt-1"
              style={{ color: TEXT }}
            >
              Need Help?
            </h2>

            <p
              className="text-xs mt-1"
              style={{ color: MUTED }}
            >
              Order #{getOrderNumber(
                order
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                PAGE_BG,
              color: MUTED,
            }}
          >
            ✕
          </button>
        </div>

        {!selectedIssue ? (
          <div className="py-6">

            <p
              className="text-sm leading-6 mb-4"
              style={{ color: MUTED }}
            >
              Choose what you need help
              with. Our support team can
              assist you with your order.
            </p>

            <div className="space-y-3">
              {issues.map((issue) => (
                <button
                  key={issue.title}
                  type="button"
                  onClick={() =>
                    setSelectedIssue(
                      issue.title
                    )
                  }
                  className="w-full text-left p-4 rounded-xl transition-colors hover:bg-[#F5FAFF]"
                  style={{
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: TEXT }}
                  >
                    {issue.icon}{" "}
                    {issue.title}
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{ color: MUTED }}
                  >
                    {issue.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">

            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl"
              style={{
                backgroundColor:
                  LIGHT_BLUE,
              }}
            >
              ✓
            </div>

            <h3
              className="text-lg font-bold mt-5"
              style={{ color: TEXT }}
            >
              {selectedIssue}
            </h3>

            <p
              className="text-sm leading-6 mt-2 max-w-md mx-auto"
              style={{ color: MUTED }}
            >
              Your support request for
              order #{getOrderNumber(order)}
              can be connected to the
              Karodrop admin support system.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-6 py-3 rounded-xl text-white text-sm font-semibold"
              style={{
                backgroundColor: BLUE,
              }}
            >
              Close
            </button>
          </div>
        )}

        <div
          className="pt-5"
          style={{
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <p
            className="text-xs text-center"
            style={{ color: MUTED }}
          >
            Support requests will be
            connected to the admin system
            when the backend is added.
          </p>
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   MODAL WRAPPER
========================================================= */

function Modal({
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-[#012467]/45 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {children}
      </div>
    </div>
  );
}
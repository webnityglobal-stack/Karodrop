import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "karodrop-notifications";
const LOW_STOCK_LIMIT = 5;

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  lightBlue: "#EAF4FF",
  background: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
  white: "#FFFFFF",
};

const TYPE_CONFIG = {
  order: {
    label: "Orders",
    icon: "🛒",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  customer: {
    label: "Customers",
    icon: "👤",
    bg: "bg-green-50",
    color: "text-green-600",
  },
  design: {
    label: "Design Requests",
    icon: "🎨",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  stock: {
    label: "Low Stock",
    icon: "📦",
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  coupon: {
    label: "Coupons",
    icon: "🎟️",
    bg: "bg-pink-50",
    color: "text-pink-600",
  },
  offer: {
    label: "Offers",
    icon: "🏷️",
    bg: "bg-yellow-50",
    color: "text-yellow-600",
  },
  system: {
    label: "System",
    icon: "🔔",
    bg: "bg-slate-100",
    color: "text-slate-600",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

  window.dispatchEvent(new Event("notificationsUpdated"));
}

function getEntityId(item, index) {
  return (
    item?.id ||
    item?._id ||
    item?.orderId ||
    item?.productId ||
    item?.userId ||
    item?.requestId ||
    item?.couponId ||
    item?.offerId ||
    `item-${index}`
  );
}

function getDateValue(item) {
  return (
    item?.createdAt ||
    item?.created_at ||
    item?.date ||
    item?.updatedAt ||
    item?.updated_at ||
    item?.timestamp ||
    new Date().toISOString()
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "Just now";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isToday(dateValue) {
  if (!dateValue) return false;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/* =========================================================
   BUILD NOTIFICATIONS
========================================================= */

function generateNotifications() {
  const existing = readStorage(STORAGE_KEY, []);

  const orders = readStorage("karodrop-orders", []);
  const users = readStorage("karodrop-users", []);
  const designRequests = readStorage("karodrop-design-requests", []);
  const products = readStorage("karodrop-products", []);
  const coupons = readStorage("karodrop-coupons", []);
  const offers = readStorage("karodrop-offers", []);

  const generated = [];

  /* ---------------- ORDERS ---------------- */

  orders.slice(0, 10).forEach((order, index) => {
    const id = getEntityId(order, index);

    const customerName =
      order?.customerName ||
      order?.name ||
      order?.customer?.name ||
      "A customer";

    const amount =
      order?.total ??
      order?.grandTotal ??
      order?.amount ??
      order?.price ??
      null;

    generated.push({
      id: `order-${id}`,
      type: "order",
      title: "New order received",
      message:
        amount !== null
          ? `${customerName} placed an order worth ₹${Number(amount).toLocaleString(
              "en-IN"
            )}.`
          : `${customerName} placed a new order.`,
      read: false,
      createdAt: getDateValue(order),
      link: "/admin/orders",
    });
  });

  /* ---------------- CUSTOMERS ---------------- */

  users
    .filter((user) => {
      const role = String(user?.role || "customer").toLowerCase();

      return (
        role === "customer" ||
        role === "user" ||
        role === ""
      );
    })
    .slice(0, 10)
    .forEach((user, index) => {
      const id = getEntityId(user, index);

      const name =
        user?.name ||
        user?.fullName ||
        user?.username ||
        user?.email ||
        "New customer";

      generated.push({
        id: `customer-${id}`,
        type: "customer",
        title: "New customer registered",
        message: `${name} has registered on Karodrop.`,
        read: false,
        createdAt: getDateValue(user),
        link: "/admin/customers",
      });
    });

  /* ---------------- DESIGN REQUESTS ---------------- */

  designRequests.slice(0, 10).forEach((request, index) => {
    const id = getEntityId(request, index);

    const name =
      request?.customerName ||
      request?.name ||
      request?.userName ||
      "A customer";

    generated.push({
      id: `design-${id}`,
      type: "design",
      title: "New design request",
      message: `${name} submitted a new design request.`,
      read: false,
      createdAt: getDateValue(request),
      link: "/admin/design-requests",
    });
  });

  /* ---------------- LOW STOCK ---------------- */

  products.forEach((product, index) => {
    const stock =
      product?.stock ??
      product?.inventory ??
      product?.quantity ??
      product?.availableStock;

    const numericStock = Number(stock);

    if (
      Number.isFinite(numericStock) &&
      numericStock <= LOW_STOCK_LIMIT
    ) {
      const id = getEntityId(product, index);

      const name =
        product?.name ||
        product?.title ||
        "Product";

      generated.push({
        id: `stock-${id}`,
        type: "stock",
        title: "Low stock alert",
        message: `${name} has only ${numericStock} item${
          numericStock === 1 ? "" : "s"
        } left in stock.`,
        read: false,
        createdAt: getDateValue(product),
        link: "/admin/products",
      });
    }
  });

  /* ---------------- COUPONS ---------------- */

  coupons.slice(0, 10).forEach((coupon, index) => {
    const id = getEntityId(coupon, index);

    const code =
      coupon?.code ||
      coupon?.name ||
      "Coupon";

    generated.push({
      id: `coupon-${id}`,
      type: "coupon",
      title: "Coupon updated",
      message: `Coupon "${code}" is available in Coupons & Offers.`,
      read: false,
      createdAt: getDateValue(coupon),
      link: "/admin/offers",
    });
  });

  /* ---------------- OFFERS ---------------- */

  offers.slice(0, 10).forEach((offer, index) => {
    const id = getEntityId(offer, index);

    const name =
      offer?.name ||
      offer?.title ||
      "New offer";

    generated.push({
      id: `offer-${id}`,
      type: "offer",
      title: "Offer updated",
      message: `"${name}" is available in Coupons & Offers.`,
      read: false,
      createdAt: getDateValue(offer),
      link: "/admin/offers",
    });
  });

  /* ---------------- MERGE ---------------- */

  const existingMap = new Map(
    existing.map((notification) => [
      notification.id,
      notification,
    ])
  );

  generated.forEach((notification) => {
    const oldNotification = existingMap.get(notification.id);

    if (oldNotification) {
      existingMap.set(notification.id, {
        ...notification,
        read: Boolean(oldNotification.read),
      });
    } else {
      existingMap.set(notification.id, notification);
    }
  });

  const merged = Array.from(existingMap.values());

  merged.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return dateB - dateA;
  });

  return merged.slice(0, 100);
}

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

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- LOAD ---------------- */

  const loadNotifications = () => {
    const generated = generateNotifications();

    setNotifications(generated);

    saveNotifications(generated);
  };

  useEffect(() => {
    loadNotifications();

    const events = [
      "notificationsUpdated",
      "ordersUpdated",
      "usersUpdated",
      "designRequestsUpdated",
      "productsUpdated",
      "couponsUpdated",
      "offersUpdated",
    ];

    events.forEach((event) => {
      window.addEventListener(event, loadNotifications);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadNotifications);
      });
    };
  }, []);

  /* ---------------- STATS ---------------- */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const todayCount = notifications.filter((notification) =>
    isToday(notification.createdAt)
  ).length;

  /* ---------------- FILTER ---------------- */

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesRead =
        filter === "all" ||
        (filter === "unread" && !notification.read) ||
        (filter === "read" && notification.read);

      const matchesType =
        typeFilter === "all" ||
        notification.type === typeFilter;

      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query);

      return (
        matchesRead &&
        matchesType &&
        matchesSearch
      );
    });
  }, [
    notifications,
    filter,
    typeFilter,
    search,
  ]);

  /* ---------------- MARK READ ---------------- */

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            read: true,
          }
        : notification
    );

    setNotifications(updated);
    saveNotifications(updated);
  };

  /* ---------------- TOGGLE READ ---------------- */

  const toggleRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            read: !notification.read,
          }
        : notification
    );

    setNotifications(updated);
    saveNotifications(updated);
  };

  /* ---------------- MARK ALL ---------------- */

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updated);
    saveNotifications(updated);
  };

  /* ---------------- DELETE ---------------- */

  const deleteNotification = (id) => {
    const updated = notifications.filter(
      (notification) => notification.id !== id
    );

    setNotifications(updated);
    saveNotifications(updated);
  };

  /* ---------------- CLEAR ALL ---------------- */

  const clearAll = () => {
    if (notifications.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications?"
    );

    if (!confirmed) {
      return;
    }

    setNotifications([]);
    saveNotifications([]);
  };

  /* ---------------- CLICK ---------------- */

  const openNotification = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: COLORS.navy }}
              >
                Notifications
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Stay updated with important activity across Karodrop.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-semibold text-[#012467] transition hover:border-[#0078ED] hover:text-[#0078ED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckIcon />
                Mark all as read
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TrashIcon />
                Clear all
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* TOTAL */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5E6B7A]">
                  Total Notifications
                </p>

                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: COLORS.navy }}
                >
                  {notifications.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                <BellIcon />
              </div>
            </div>
          </div>

          {/* UNREAD */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5E6B7A]">
                  Unread
                </p>

                <p className="mt-2 text-3xl font-bold text-red-500">
                  {unreadCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <span className="text-2xl">●</span>
              </div>
            </div>
          </div>

          {/* TODAY */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#5E6B7A]">
                  Today
                </p>

                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: COLORS.blue }}
                >
                  {todayCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-5 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* READ FILTER */}

            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === value
                      ? "bg-[#0078ED] text-white"
                      : "bg-[#F5FAFF] text-[#5E6B7A] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                  }`}
                >
                  {label}

                  {value === "unread" && unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* TYPE */}

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="rounded-lg border border-[#DCE7F2] bg-white px-3 py-2.5 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
              >
                <option value="all">All Types</option>
                <option value="order">Orders</option>
                <option value="customer">Customers</option>
                <option value="design">Design Requests</option>
                <option value="stock">Low Stock</option>
                <option value="coupon">Coupons</option>
                <option value="offer">Offers</option>
                <option value="system">System</option>
              </select>

              {/* SEARCH */}

              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search notifications..."
                  className="w-full rounded-lg border border-[#DCE7F2] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B1F3A] outline-none placeholder:text-[#9AA7B5] focus:border-[#0078ED] sm:w-[280px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-[#DCE7F2] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
              <BellIcon />
            </div>

            <h2
              className="mt-5 text-lg font-bold"
              style={{ color: COLORS.navy }}
            >
              No notifications found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#5E6B7A]">
              {notifications.length === 0
                ? "You don't have any notifications yet. New activity will appear here automatically."
                : "Try changing your filters or search keyword."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const config =
                TYPE_CONFIG[notification.type] ||
                TYPE_CONFIG.system;

              return (
                <div
                  key={notification.id}
                  className={`group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                    notification.read
                      ? "border-[#DCE7F2]"
                      : "border-blue-200 bg-[#FBFDFF]"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* ICON */}

                    <button
                      type="button"
                      onClick={() =>
                        openNotification(notification)
                      }
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl ${config.bg}`}
                      title="Open notification"
                    >
                      {config.icon}
                    </button>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            openNotification(notification)
                          }
                          className="text-left"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm font-bold ${
                                notification.read
                                  ? "text-[#0B1F3A]"
                                  : "text-[#012467]"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-[#0078ED]" />
                            )}

                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.color}`}
                            >
                              {config.label}
                            </span>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-[#5E6B7A]">
                            {notification.message}
                          </p>
                        </button>

                        {/* ACTIONS */}

                        <div className="flex flex-shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              toggleRead(notification.id)
                            }
                            className="rounded-lg p-2 text-[#5E6B7A] transition hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                            title={
                              notification.read
                                ? "Mark as unread"
                                : "Mark as read"
                            }
                          >
                            <CheckIcon />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                            className="rounded-lg p-2 text-[#5E6B7A] transition hover:bg-red-50 hover:text-red-600"
                            title="Delete notification"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#8A98A8]">
                        <span>
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                        {!notification.read && (
                          <span className="font-semibold text-[#0078ED]">
                            Unread
                          </span>
                        )}

                        {notification.link && (
                          <button
                            type="button"
                            onClick={() =>
                              openNotification(notification)
                            }
                            className="font-semibold text-[#0078ED] hover:underline"
                          >
                            View details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
import React, { useMemo, useState } from "react";

const initialNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message:
      "You have received a new order #KD10245 for Premium Cotton T-Shirt.",
    time: "10 minutes ago",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    message:
      "Payment of ₹1,299 has been received successfully for order #KD10244.",
    time: "1 hour ago",
    date: "Today",
    read: false,
  },
  {
    id: 3,
    type: "product",
    title: "Product Approved",
    message:
      "Your product Designer Hoodie has been approved and is now live in your store.",
    time: "3 hours ago",
    date: "Today",
    read: true,
  },
  {
    id: 4,
    type: "shipping",
    title: "Order Shipped",
    message:
      "Order #KD10243 has been marked as shipped. You can track the shipment from Orders.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    title: "Low Stock Alert",
    message:
      "Custom Mug is running low on stock. Only 5 units are remaining.",
    time: "Yesterday",
    date: "Yesterday",
    read: false,
  },
  {
    id: 6,
    type: "system",
    title: "Seller Account Updated",
    message:
      "Your seller account information was successfully updated.",
    time: "2 days ago",
    date: "Earlier",
    read: true,
  },
  {
    id: 7,
    type: "order",
    title: "Order Delivered",
    message:
      "Order #KD10241 has been successfully delivered to the customer.",
    time: "3 days ago",
    date: "Earlier",
    read: true,
  },
  {
    id: 8,
    type: "payment",
    title: "Payout Processed",
    message:
      "Your payout of ₹8,450 has been processed and sent to your registered bank account.",
    time: "5 days ago",
    date: "Earlier",
    read: true,
  },
];

const typeStyles = {
  order: {
    icon: "🛍",
    bg: "bg-blue-50",
    color: "text-[#0078ED]",
  },
  payment: {
    icon: "₹",
    bg: "bg-green-50",
    color: "text-green-600",
  },
  product: {
    icon: "▣",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  shipping: {
    icon: "🚚",
    bg: "bg-indigo-50",
    color: "text-indigo-600",
  },
  warning: {
    icon: "!",
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  system: {
    icon: "⚙",
    bg: "bg-gray-100",
    color: "text-gray-600",
  },
};

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.read) ||
        (filter === "read" && notification.read);

      const searchText = search.toLowerCase();

      const matchesSearch =
        notification.title.toLowerCase().includes(searchText) ||
        notification.message.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, search]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Panel
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#0B1F3A]">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Stay updated with orders, payments, products and store activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="
              rounded-xl
              border
              border-[#DCE7F2]
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-[#0B1F3A]
              transition
              hover:border-[#0078ED]
              hover:text-[#0078ED]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Mark All Read
          </button>

          <button
            type="button"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="
              rounded-xl
              border
              border-red-100
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Clear All
          </button>

        </div>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Notifications
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Unread
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Read
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-600">
            {notifications.filter((item) => item.read).length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Today
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            {notifications.filter((item) => item.date === "Today").length}
          </p>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <div className="flex-1">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
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
                transition
                focus:border-[#0078ED]
                focus:bg-white
              "
            />

          </div>

          {/* Filter */}
          <div className="flex rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-1">

            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "all"
                  ? "bg-white text-[#0078ED] shadow-sm"
                  : "text-[#5E6B7A] hover:text-[#0078ED]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "unread"
                  ? "bg-white text-[#0078ED] shadow-sm"
                  : "text-[#5E6B7A] hover:text-[#0078ED]"
              }`}
            >
              Unread
            </button>

            <button
              type="button"
              onClick={() => setFilter("read")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === "read"
                  ? "bg-white text-[#0078ED] shadow-sm"
                  : "text-[#5E6B7A] hover:text-[#0078ED]"
              }`}
            >
              Read
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          NOTIFICATIONS
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Recent Notifications
              </h2>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Latest updates from your seller account.
              </p>
            </div>

            <span className="text-xs text-[#5E6B7A]">
              {filteredNotifications.length} shown
            </span>

          </div>

        </div>

        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-[#DCE7F2]">

            {filteredNotifications.map((notification) => {

              const style =
                typeStyles[notification.type] || typeStyles.system;

              return (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-4 p-5 transition sm:flex-row sm:items-start sm:px-6 ${
                    notification.read
                      ? "bg-white"
                      : "bg-[#F8FBFF]"
                  } hover:bg-[#F5FAFF]`}
                >

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${style.bg} ${style.color}`}
                  >
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col justify-between gap-1 sm:flex-row">

                      <div className="flex items-center gap-2">

                        <h3
                          className={`text-sm ${
                            notification.read
                              ? "font-medium text-[#0B1F3A]"
                              : "font-semibold text-[#0B1F3A]"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-[#0078ED]" />
                        )}

                      </div>

                      <span className="text-xs text-[#5E6B7A]">
                        {notification.time}
                      </span>

                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5E6B7A]">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      {notification.read ? (
                        <button
                          type="button"
                          onClick={() =>
                            markAsUnread(notification.id)
                          }
                          className="text-xs font-semibold text-[#0078ED] hover:underline"
                        >
                          Mark as unread
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="text-xs font-semibold text-[#0078ED] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}

                      <span className="text-[#DCE7F2]">
                        |
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          /* Empty State */
          <div className="px-5 py-16 text-center sm:px-6">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5FAFF] text-2xl">
              🔔
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">
              No notifications found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B7A]">
              {notifications.length === 0
                ? "You don't have any notifications right now."
                : "Try changing your search or notification filter."}
            </p>

            {(search || filter !== "all") && notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 rounded-xl bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#012467]"
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          NOTIFICATION INFO
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-5">

        <div className="flex gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0078ED]">
            ℹ
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#0B1F3A]">
              About Seller Notifications
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
              Important updates about your orders, payments, products,
              payouts and seller account will appear here.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
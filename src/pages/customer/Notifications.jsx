import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const NOTIFICATIONS_STORAGE_KEY = "karodrop-notifications";

function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem("karodrop-user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);
    return null;
  }
}

function getCustomerId(user) {
  return String(
    user?.id ||
      user?.userId ||
      user?._id ||
      user?.email ||
      ""
  ).trim();
}

function getCustomerEmail(user) {
  return String(user?.email || "")
    .trim()
    .toLowerCase();
}

function isNotificationForCurrentUser(notification, user) {
  const customerId = getCustomerId(user);
  const customerEmail = getCustomerEmail(user);

  // Personal notification by customer ID
  if (
    notification.customerId &&
    customerId &&
    String(notification.customerId) === customerId
  ) {
    return true;
  }

  // Personal notification by email
  if (
    notification.customerEmail &&
    customerEmail &&
    String(notification.customerEmail)
      .trim()
      .toLowerCase() === customerEmail
  ) {
    return true;
  }

  // General notification for all customers
  if (
    notification.customerId === "all" ||
    notification.customerEmail === "all" ||
    notification.isGlobal === true
  ) {
    return true;
  }

  return false;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Just now";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} min ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hr ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getNotificationIcon(type) {
  switch (type) {
    case "order":
      return "📦";

    case "shipping":
      return "🚚";

    case "delivered":
      return "✅";

    case "design":
      return "🎨";

    case "brand":
      return "🏷️";

    case "success":
      return "✓";

    case "warning":
      return "⚠️";

    default:
      return "🔔";
  }
}

function getNotificationIconStyle(type) {
  switch (type) {
    case "order":
      return "bg-[#EAF4FF] text-[#0078ED]";

    case "shipping":
      return "bg-blue-50 text-blue-600";

    case "delivered":
      return "bg-emerald-50 text-emerald-600";

    case "design":
      return "bg-purple-50 text-purple-600";

    case "brand":
      return "bg-orange-50 text-orange-600";

    case "warning":
      return "bg-amber-50 text-amber-600";

    default:
      return "bg-[#F5FAFF] text-[#0078ED]";
  }
}

function getNotificationId(notification, index) {
  return (
    notification.id ||
    notification._id ||
    `notification-${index}-${notification.createdAt || ""}`
  );
}

export default function Notifications() {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  // =========================
  // LOAD CURRENT USER
  // =========================

  useEffect(() => {
    const loadUser = () => {
      setCurrentUser(getCurrentUser());
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem(
        NOTIFICATIONS_STORAGE_KEY
      );

      if (!savedNotifications) {
        setNotifications([]);
        return;
      }

      try {
        const parsedNotifications = JSON.parse(
          savedNotifications
        );

        if (!Array.isArray(parsedNotifications)) {
          setNotifications([]);
          return;
        }

        setNotifications(parsedNotifications);
      } catch (error) {
        console.error(
          "Unable to load notifications:",
          error
        );

        setNotifications([]);
      }
    };

    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(
      "storage",
      handleNotificationUpdate
    );

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationUpdate
    );

    window.addEventListener(
      "ordersUpdated",
      handleNotificationUpdate
    );

    window.addEventListener(
      "designRequestsUpdated",
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleNotificationUpdate
      );

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationUpdate
      );

      window.removeEventListener(
        "ordersUpdated",
        handleNotificationUpdate
      );

      window.removeEventListener(
        "designRequestsUpdated",
        handleNotificationUpdate
      );
    };
  }, []);

  // =========================
  // CURRENT CUSTOMER NOTIFICATIONS
  // =========================

  const customerNotifications = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return notifications
      .filter((notification) =>
        isNotificationForCurrentUser(
          notification,
          currentUser
        )
      )
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.date || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.date || 0
        ).getTime();

        return dateB - dateA;
      });
  }, [notifications, currentUser]);

  // =========================
  // COUNTS
  // =========================

  const unreadCount = useMemo(() => {
    return customerNotifications.filter(
      (notification) => !notification.read
    ).length;
  }, [customerNotifications]);

  const readCount = useMemo(() => {
    return customerNotifications.filter(
      (notification) => notification.read
    ).length;
  }, [customerNotifications]);

  // =========================
  // FILTER
  // =========================

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "Unread") {
      return customerNotifications.filter(
        (notification) => !notification.read
      );
    }

    if (activeFilter === "Read") {
      return customerNotifications.filter(
        (notification) => notification.read
      );
    }

    return customerNotifications;
  }, [
    customerNotifications,
    activeFilter,
  ]);

  // =========================
  // SAVE NOTIFICATIONS
  // =========================

  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);

    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // =========================
  // MARK ONE AS READ
  // =========================

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(
      (notification, index) => {
        const id = getNotificationId(
          notification,
          index
        );

        if (id === notificationId) {
          return {
            ...notification,
            read: true,
          };
        }

        return notification;
      }
    );

    saveNotifications(updatedNotifications);
  };

  // =========================
  // MARK ALL AS READ
  // =========================

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    const updatedNotifications = notifications.map(
      (notification) => {
        if (
          isNotificationForCurrentUser(
            notification,
            currentUser
          )
        ) {
          return {
            ...notification,
            read: true,
          };
        }

        return notification;
      }
    );

    saveNotifications(updatedNotifications);
  };

  // =========================
  // DELETE ONE
  // =========================

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      (notification, index) => {
        const id = getNotificationId(
          notification,
          index
        );

        return id !== notificationId;
      }
    );

    saveNotifications(updatedNotifications);
  };

  // =========================
  // CLEAR ALL CUSTOMER NOTIFICATIONS
  // =========================

  const clearAllNotifications = () => {
    const updatedNotifications =
      notifications.filter(
        (notification) =>
          !isNotificationForCurrentUser(
            notification,
            currentUser
          )
      );

    saveNotifications(updatedNotifications);
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-[#DCE7F2] rounded-2xl p-8 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Login Required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Please login to view your notifications.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-xl bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
          >
            Go to Login
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAFF]">

      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-white border-b border-[#DCE7F2]">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <Link
                to="/account"
                className="inline-flex items-center text-sm font-medium text-[#0078ED] hover:text-[#012467] mb-3"
              >
                ← Back to Account
              </Link>

              <div className="flex items-center gap-3">

                <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="min-w-7 h-7 px-2 rounded-full bg-[#0078ED] text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}

              </div>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Stay updated with your orders, designs and
                account activity.
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="self-start sm:self-auto px-4 py-2.5 rounded-lg border border-[#DCE7F2] text-sm font-semibold text-[#0078ED] hover:bg-[#EAF4FF] hover:border-[#0078ED] transition"
              >
                Mark all as read
              </button>
            )}

          </div>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SUMMARY */}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">

          <SummaryCard
            label="All Notifications"
            value={customerNotifications.length}
            active={activeFilter === "All"}
            onClick={() => setActiveFilter("All")}
          />

          <SummaryCard
            label="Unread"
            value={unreadCount}
            active={activeFilter === "Unread"}
            onClick={() => setActiveFilter("Unread")}
          />

          <SummaryCard
            label="Read"
            value={readCount}
            active={activeFilter === "Read"}
            onClick={() => setActiveFilter("Read")}
          />

        </div>

        {/* LIST HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          <div>

            <h2 className="text-lg font-bold text-[#0B1F3A]">
              {activeFilter === "All"
                ? "All Notifications"
                : `${activeFilter} Notifications`}
            </h2>

            <p className="text-sm text-[#8A98A8] mt-1">
              {filteredNotifications.length} notification
              {filteredNotifications.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          {customerNotifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="self-start text-sm font-semibold text-[#5E6B7A] hover:text-red-600 transition"
            >
              Clear all
            </button>
          )}

        </div>

        {/* =========================
            NOTIFICATIONS LIST
        ========================= */}

        {filteredNotifications.length > 0 ? (

          <div className="space-y-3">

            {filteredNotifications.map(
              (notification, index) => {

                const notificationId =
                  getNotificationId(
                    notification,
                    index
                  );

                const isUnread =
                  !notification.read;

                const iconType =
                  notification.type || "general";

                return (
                  <div
                    key={notificationId}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 transition ${
                      isUnread
                        ? "border-[#BBD9F7] shadow-sm"
                        : "border-[#DCE7F2]"
                    }`}
                  >

                    <div className="flex gap-4">

                      {/* ICON */}

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${getNotificationIconStyle(
                          iconType
                        )}`}
                      >
                        {getNotificationIcon(
                          iconType
                        )}
                      </div>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A]">
                                {notification.title ||
                                  "Notification"}
                              </h3>

                              {isUnread && (
                                <span className="px-2 py-0.5 rounded-full bg-[#EAF4FF] text-[#0078ED] text-[10px] font-bold uppercase tracking-wide">
                                  New
                                </span>
                              )}

                            </div>

                            <p className="mt-1 text-xs text-[#8A98A8]">
                              {formatDate(
                                notification.createdAt ||
                                  notification.date
                              )}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notificationId
                              )
                            }
                            className="self-start text-[#8A98A8] hover:text-red-600 transition text-sm"
                            title="Delete notification"
                          >
                            ✕
                          </button>

                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                          {notification.message ||
                            "You have a new update from Karodrop."}
                        </p>

                        {/* ACTION */}

                        <div className="mt-4 flex flex-wrap items-center gap-3">

                          {notification.actionLabel &&
                            notification.actionLink && (
                              <Link
                                to={
                                  notification.actionLink
                                }
                                onClick={() => {
                                  if (isUnread) {
                                    markAsRead(
                                      notificationId
                                    );
                                  }
                                }}
                                className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#0078ED] text-white text-xs font-semibold hover:bg-[#012467] transition"
                              >
                                {
                                  notification.actionLabel
                                }
                              </Link>
                            )}

                          {isUnread && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notificationId
                                )
                              }
                              className="text-xs font-semibold text-[#0078ED] hover:text-[#012467] transition"
                            >
                              Mark as read
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <EmptyNotifications
            activeFilter={activeFilter}
            onReset={() =>
              setActiveFilter("All")
            }
          />

        )}

      </main>

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  label,
  value,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left bg-white border rounded-2xl p-4 transition ${
        active
          ? "border-[#0078ED] ring-2 ring-[#0078ED]/10"
          : "border-[#DCE7F2] hover:border-[#0078ED]"
      }`}
    >

      <p className="text-xs text-[#8A98A8]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
        {value}
      </p>

    </button>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyNotifications({
  activeFilter,
  onReset,
}) {
  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl py-16 px-6 text-center">

      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
        🔔
      </div>

      {activeFilter === "Unread" ? (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            You're all caught up
          </h2>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            You don't have any unread notifications.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-5 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            View All Notifications
          </button>
        </>
      ) : activeFilter === "Read" ? (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No read notifications
          </h2>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            Read notifications will appear here.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-5 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            View All Notifications
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No notifications yet
          </h2>

          <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-[#5E6B7A]">
            Order updates, design updates and other
            important account notifications will appear here.
          </p>

          <Link
            to="/products"
            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
          >
            Browse Products
          </Link>
        </>
      )}

    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   ICONS
========================= */

const Icon = ({ children, size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

const FilterIcon = () => (
  <Icon>
    <path d="M4 6h16" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </Icon>
);

const EyeIcon = () => (
  <Icon size={17}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Icon>
);

const ArrowLeftIcon = () => (
  <Icon size={18}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

const PackageIcon = () => (
  <Icon size={20}>
    <path d="m16.5 9.4-9-5.2" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="M3.3 7 12 12l8.7-5" />
    <path d="M12 22V12" />
  </Icon>
);

const TruckIcon = () => (
  <Icon size={20}>
    <path d="M3 6h11v11H3z" />
    <path d="M14 10h4l3 3v4h-7z" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="18" cy="19" r="2" />
  </Icon>
);

const CheckIcon = () => (
  <Icon size={20}>
    <path d="m5 12 4 4L19 6" />
  </Icon>
);

const ClockIcon = () => (
  <Icon size={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const XIcon = () => (
  <Icon size={18}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </Icon>
);

const UserIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5" />
  </Icon>
);

const CalendarIcon = () => (
  <Icon size={17}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </Icon>
);

/* =========================
   HELPERS
========================= */

const getOrders = () => {
  try {
    const data = JSON.parse(localStorage.getItem("karodrop-orders") || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const getOrderId = (order) => {
  return (
    order?.orderNumber ||
    order?.orderId ||
    order?.id ||
    order?._id ||
    "N/A"
  );
};

const getCustomerName = (order) => {
  return (
    order?.customerName ||
    order?.customer?.name ||
    order?.user?.name ||
    order?.name ||
    "Guest Customer"
  );
};

const getCustomerEmail = (order) => {
  return (
    order?.customerEmail ||
    order?.customer?.email ||
    order?.user?.email ||
    order?.email ||
    ""
  );
};

const getCustomerPhone = (order) => {
  return (
    order?.customerPhone ||
    order?.customer?.phone ||
    order?.user?.phone ||
    order?.phone ||
    ""
  );
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.products)) return order.products;
  if (order?.product) return [order.product];
  return [];
};

const getProductName = (item) => {
  return (
    item?.productName ||
    item?.name ||
    item?.title ||
    item?.product?.name ||
    item?.product?.title ||
    "Product"
  );
};

const getProductImage = (item) => {
  return (
    item?.image ||
    item?.imageUrl ||
    item?.productImage ||
    item?.product?.image ||
    item?.product?.imageUrl ||
    "/images/Karodrop-logo.png"
  );
};

const getItemQuantity = (item) => {
  const quantity = Number(item?.quantity ?? item?.qty ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

const getOrderAmount = (order) => {
  const possibleValues = [
    order?.totalAmount,
    order?.total,
    order?.grandTotal,
    order?.amount,
    order?.orderTotal,
    order?.pricing?.total,
    order?.summary?.total,
  ];

  for (const value of possibleValues) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }

  const items = getOrderItems(order);

  return items.reduce((sum, item) => {
    const price = Number(
      item?.totalPrice ??
        item?.price ??
        item?.sellingPrice ??
        item?.product?.price ??
        0
    );

    return sum + price * getItemQuantity(item);
  }, 0);
};

const getOrderDate = (order) => {
  return (
    order?.createdAt ||
    order?.createdDate ||
    order?.date ||
    order?.orderDate ||
    order?.placedAt ||
    null
  );
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  const number = Number(amount);

  if (!Number.isFinite(number)) return "₹0";

  return `₹${number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const normalizeStatus = (status) => {
  if (!status) return "Order Placed";

  const value = String(status).trim().toLowerCase();

  const map = {
    placed: "Order Placed",
    "order placed": "Order Placed",
    pending: "Order Placed",

    paid: "Payment Confirmed",
    "payment confirmed": "Payment Confirmed",

    processing: "Processing",

    production: "Production",
    "in production": "Production",
    design: "Production",

    packed: "Packed",

    shipped: "Shipped",

    "out for delivery": "Out for Delivery",
    outfordelivery: "Out for Delivery",

    delivered: "Delivered",

    cancelled: "Cancelled",
    canceled: "Cancelled",

    failed: "Cancelled",
  };

  return map[value] || String(status);
};

const getPaymentStatus = (order) => {
  const status =
    order?.paymentStatus ||
    order?.payment?.status ||
    order?.paymentInfo?.status ||
    "";

  if (!status) {
    if (
      order?.paymentMethod === "COD" ||
      order?.paymentMethod === "cod"
    ) {
      return "Pending";
    }

    return "Paid";
  }

  const value = String(status).toLowerCase();

  if (
    value.includes("paid") ||
    value.includes("success") ||
    value.includes("complete")
  ) {
    return "Paid";
  }

  if (
    value.includes("fail") ||
    value.includes("cancel") ||
    value.includes("refund")
  ) {
    return "Failed";
  }

  return "Pending";
};

const getStatusClass = (status) => {
  const value = normalizeStatus(status);

  const classes = {
    "Order Placed":
      "bg-blue-50 text-blue-700 border-blue-100",
    "Payment Confirmed":
      "bg-cyan-50 text-cyan-700 border-cyan-100",
    Processing:
      "bg-amber-50 text-amber-700 border-amber-100",
    Production:
      "bg-purple-50 text-purple-700 border-purple-100",
    Packed:
      "bg-indigo-50 text-indigo-700 border-indigo-100",
    Shipped:
      "bg-sky-50 text-sky-700 border-sky-100",
    "Out for Delivery":
      "bg-orange-50 text-orange-700 border-orange-100",
    Delivered:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    Cancelled:
      "bg-red-50 text-red-700 border-red-100",
  };

  return (
    classes[value] ||
    "bg-slate-50 text-slate-700 border-slate-200"
  );
};

const getPaymentClass = (status) => {
  if (status === "Paid") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (status === "Failed") {
    return "bg-red-50 text-red-700 border-red-100";
  }

  return "bg-amber-50 text-amber-700 border-amber-100";
};

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  title,
  value,
  icon,
  description,
  iconClass = "bg-blue-50 text-[#0078ED]",
}) => {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_4px_20px_rgba(1,36,103,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-[#7A8795]">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =========================
   ORDER DETAILS MODAL
========================= */

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const items = getOrderItems(order);
  const orderStatus = normalizeStatus(order?.status);
  const paymentStatus = getPaymentStatus(order);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001637]/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#0078ED]">
              Order Details
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#0B1F3A]">
              #{getOrderId(order)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
          >
            <XIcon />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-4">
              <p className="text-xs text-[#7A8795]">Order Date</p>
              <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                {formatDateTime(getOrderDate(order))}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-4">
              <p className="text-xs text-[#7A8795]">Order Amount</p>
              <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                {formatCurrency(getOrderAmount(order))}
              </p>
            </div>

            <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-4">
              <p className="text-xs text-[#7A8795]">Payment</p>
              <span
                className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentClass(
                  paymentStatus
                )}`}
              >
                {paymentStatus}
              </span>
            </div>

            <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-4">
              <p className="text-xs text-[#7A8795]">Order Status</p>
              <span
                className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                  orderStatus
                )}`}
              >
                {orderStatus}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
              Customer Information
            </h3>

            <div className="rounded-xl border border-[#DCE7F2] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                  <UserIcon size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-[#0B1F3A]">
                    {getCustomerName(order)}
                  </p>

                  {getCustomerEmail(order) && (
                    <p className="mt-1 break-all text-sm text-[#5E6B7A]">
                      {getCustomerEmail(order)}
                    </p>
                  )}

                  {getCustomerPhone(order) && (
                    <p className="mt-1 text-sm text-[#5E6B7A]">
                      {getCustomerPhone(order)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          {(order?.shippingAddress ||
            order?.address ||
            order?.deliveryAddress) && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                Shipping Address
              </h3>

              <div className="rounded-xl border border-[#DCE7F2] p-4 text-sm leading-6 text-[#5E6B7A]">
                {typeof (
                  order?.shippingAddress ||
                  order?.address ||
                  order?.deliveryAddress
                ) === "string" ? (
                  order?.shippingAddress ||
                  order?.address ||
                  order?.deliveryAddress
                ) : (
                  <>
                    <p>
                      {(
                        order?.shippingAddress ||
                        order?.address ||
                        order?.deliveryAddress
                      )?.name ||
                        getCustomerName(order)}
                    </p>

                    <p>
                      {(
                        order?.shippingAddress ||
                        order?.address ||
                        order?.deliveryAddress
                      )?.address ||
                        (
                          order?.shippingAddress ||
                          order?.address ||
                          order?.deliveryAddress
                        )?.street}
                    </p>

                    <p>
                      {(
                        order?.shippingAddress ||
                        order?.address ||
                        order?.deliveryAddress
                      )?.city}
                      {(
                        order?.shippingAddress ||
                        order?.address ||
                        order?.deliveryAddress
                      )?.state
                        ? `, ${
                            (
                              order?.shippingAddress ||
                              order?.address ||
                              order?.deliveryAddress
                            )?.state
                          }`
                        : ""}
                    </p>

                    <p>
                      {(
                        order?.shippingAddress ||
                        order?.address ||
                        order?.deliveryAddress
                      )?.pincode ||
                        (
                          order?.shippingAddress ||
                          order?.address ||
                          order?.deliveryAddress
                        )?.zip}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Ordered Products
              </h3>

              <span className="text-xs text-[#7A8795]">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#C8D8E8] p-8 text-center text-sm text-[#7A8795]">
                No product details available for this order.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[#DCE7F2]">
                {items.map((item, index) => {
                  const quantity = getItemQuantity(item);

                  const price = Number(
                    item?.price ??
                      item?.sellingPrice ??
                      item?.product?.price ??
                      0
                  );

                  return (
                    <div
                      key={`${getProductName(item)}-${index}`}
                      className={`flex gap-4 p-4 ${
                        index !== items.length - 1
                          ? "border-b border-[#DCE7F2]"
                          : ""
                      }`}
                    >
                      <img
                        src={getProductImage(item)}
                        alt={getProductName(item)}
                        className="h-16 w-16 shrink-0 rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/Karodrop-logo.png";
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#0B1F3A]">
                          {getProductName(item)}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7A8795]">
                          <span>
                            Qty: {quantity}
                          </span>

                          {item?.size && (
                            <span>
                              Size: {item.size}
                            </span>
                          )}

                          {item?.color && (
                            <span>
                              Color: {item.color}
                            </span>
                          )}

                          {item?.printingType && (
                            <span>
                              Printing: {item.printingType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-[#0B1F3A]">
                          {formatCurrency(price * quantity)}
                        </p>

                        {price > 0 && quantity > 1 && (
                          <p className="mt-1 text-xs text-[#7A8795]">
                            {formatCurrency(price)} × {quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          {(order?.notes ||
            order?.customerNotes ||
            order?.requirements) && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                Customer Requirements
              </h3>

              <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-4 text-sm leading-6 text-[#5E6B7A]">
                {order?.notes ||
                  order?.customerNotes ||
                  order?.requirements}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   MAIN ADMIN ORDERS PAGE
========================= */

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(() => getOrders());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* =========================
     LOAD / UPDATE ORDERS
  ========================= */

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, []);

  /* =========================
     FILTERED ORDERS
  ========================= */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (!query) return true;

        const orderId = String(getOrderId(order)).toLowerCase();
        const customer = getCustomerName(order).toLowerCase();
        const email = getCustomerEmail(order).toLowerCase();

        return (
          orderId.includes(query) ||
          customer.includes(query) ||
          email.includes(query)
        );
      })
      .filter((order) => {
        if (statusFilter === "All") return true;

        return normalizeStatus(order?.status) === statusFilter;
      })
      .filter((order) => {
        if (dateFilter === "All") return true;

        const orderDate = getOrderDate(order);

        if (!orderDate) return false;

        const date = new Date(orderDate);

        if (Number.isNaN(date.getTime())) return false;

        const now = new Date();

        if (dateFilter === "Today") {
          return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }

        if (dateFilter === "7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);

          return date >= sevenDaysAgo;
        }

        if (dateFilter === "30 Days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          return date >= thirtyDaysAgo;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(getOrderDate(a) || 0).getTime();
        const dateB = new Date(getOrderDate(b) || 0).getTime();

        return dateB - dateA;
      });
  }, [orders, search, statusFilter, dateFilter]);

  /* =========================
     STATS
  ========================= */

  const stats = useMemo(() => {
    let processing = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      const status = normalizeStatus(order?.status);

      totalRevenue += getOrderAmount(order);

      if (
        status === "Processing" ||
        status === "Production" ||
        status === "Packed"
      ) {
        processing += 1;
      }

      if (
        status === "Shipped" ||
        status === "Out for Delivery"
      ) {
        shipped += 1;
      }

      if (status === "Delivered") {
        delivered += 1;
      }

      if (status === "Cancelled") {
        cancelled += 1;
      }
    });

    return {
      total: orders.length,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("All");
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* PAGE HEADER */}
      <div className="border-b border-[#DCE7F2] bg-white">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
              >
                <ArrowLeftIcon />
                Back to Dashboard
              </button>

              <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Orders
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage and monitor all Karodrop customer orders.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] px-4 py-3">
              <PackageIcon />
              <div>
                <p className="text-xs text-[#7A8795]">
                  Total order value
                </p>
                <p className="text-sm font-bold text-[#0B1F3A]">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Orders"
            value={stats.total}
            description="All customer orders"
            icon={<PackageIcon />}
          />

          <StatCard
            title="Processing"
            value={stats.processing}
            description="Needs fulfillment"
            icon={<ClockIcon />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Shipped"
            value={stats.shipped}
            description="In transit"
            icon={<TruckIcon />}
            iconClass="bg-sky-50 text-sky-600"
          />

          <StatCard
            title="Delivered"
            value={stats.delivered}
            description="Successfully delivered"
            icon={<CheckIcon />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            description="Cancelled orders"
            icon={<XIcon />}
            iconClass="bg-red-50 text-red-600"
          />
        </div>

        {/* FILTER SECTION */}
        <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-[0_4px_20px_rgba(1,36,103,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, customer name or email..."
                className="h-11 w-full rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] pl-11 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:bg-white focus:ring-2 focus:ring-[#0078ED]/10"
              />

              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8795]">
                <SearchIcon />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex">
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8795]">
                  <FilterIcon />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="h-11 w-full min-w-[180px] appearance-none rounded-xl border border-[#DCE7F2] bg-white pl-10 pr-9 text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                >
                  <option value="All">All Status</option>
                  <option value="Order Placed">
                    Order Placed
                  </option>
                  <option value="Payment Confirmed">
                    Payment Confirmed
                  </option>
                  <option value="Processing">
                    Processing
                  </option>
                  <option value="Production">
                    Production
                  </option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>
                  <option value="Delivered">
                    Delivered
                  </option>
                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8795]">
                  <CalendarIcon />
                </div>

                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
                  className="h-11 w-full min-w-[160px] appearance-none rounded-xl border border-[#DCE7F2] bg-white pl-10 pr-9 text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                >
                  <option value="All">All Dates</option>
                  <option value="Today">Today</option>
                  <option value="7 Days">Last 7 Days</option>
                  <option value="30 Days">
                    Last 30 Days
                  </option>
                </select>
              </div>

              {(search ||
                statusFilter !== "All" ||
                dateFilter !== "All") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 rounded-xl border border-[#DCE7F2] px-4 text-sm font-semibold text-[#5E6B7A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#EDF2F7] pt-4">
            <p className="text-sm text-[#5E6B7A]">
              Showing{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {orders.length}
              </span>{" "}
              orders
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white px-5 py-16 text-center shadow-[0_4px_20px_rgba(1,36,103,0.04)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
              <PackageIcon size={28} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#0B1F3A]">
              No orders found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#7A8795]">
              {orders.length === 0
                ? "Orders placed by customers will appear here."
                : "No orders match your current search or filters."}
            </p>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012467]"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-[0_4px_20px_rgba(1,36,103,0.04)] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-[#DCE7F2] bg-[#F8FBFF]">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Order
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Products
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Payment
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const items = getOrderItems(order);
                      const status = normalizeStatus(
                        order?.status
                      );
                      const payment = getPaymentStatus(order);

                      return (
                        <tr
                          key={`${getOrderId(order)}-${index}`}
                          className="border-b border-[#EDF2F7] last:border-b-0 transition hover:bg-[#FAFCFF]"
                        >
                          {/* ORDER */}
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-[#0078ED]">
                                #{getOrderId(order)}
                              </p>

                              <p className="mt-1 text-xs text-[#7A8795]">
                                {items.reduce(
                                  (sum, item) =>
                                    sum +
                                    getItemQuantity(item),
                                  0
                                )}{" "}
                                item
                                {items.reduce(
                                  (sum, item) =>
                                    sum +
                                    getItemQuantity(item),
                                  0
                                ) !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-xs font-bold text-[#0078ED]">
                                {getCustomerName(order)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[160px] truncate text-sm font-semibold text-[#0B1F3A]">
                                  {getCustomerName(order)}
                                </p>

                                {getCustomerEmail(order) && (
                                  <p className="mt-0.5 max-w-[180px] truncate text-xs text-[#7A8795]">
                                    {getCustomerEmail(order)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* PRODUCTS */}
                          <td className="px-5 py-4">
                            {items.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {items
                                    .slice(0, 3)
                                    .map((item, itemIndex) => (
                                      <img
                                        key={itemIndex}
                                        src={getProductImage(item)}
                                        alt=""
                                        className="h-9 w-9 rounded-lg border-2 border-white bg-[#F5FAFF] object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/images/Karodrop-logo.png";
                                        }}
                                      />
                                    ))}
                                </div>

                                <div>
                                  <p className="max-w-[150px] truncate text-sm font-medium text-[#0B1F3A]">
                                    {getProductName(items[0])}
                                  </p>

                                  {items.length > 1 && (
                                    <p className="text-xs text-[#7A8795]">
                                      +{items.length - 1} more
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-[#9AA7B5]">
                                No items
                              </span>
                            )}
                          </td>

                          {/* AMOUNT */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-[#0B1F3A]">
                              {formatCurrency(
                                getOrderAmount(order)
                              )}
                            </p>
                          </td>

                          {/* PAYMENT */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentClass(
                                payment
                              )}`}
                            >
                              {payment}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* DATE */}
                          <td className="px-5 py-4">
                            <p className="whitespace-nowrap text-sm text-[#5E6B7A]">
                              {formatDate(
                                getOrderDate(order)
                              )}
                            </p>
                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOrder(order)
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE7F2] px-3 text-xs font-semibold text-[#0078ED] transition hover:border-[#0078ED] hover:bg-[#EAF4FF]"
                            >
                              <EyeIcon />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET CARDS */}
            <div className="mt-6 space-y-4 lg:hidden">
              {filteredOrders.map((order, index) => {
                const items = getOrderItems(order);
                const status = normalizeStatus(order?.status);
                const payment = getPaymentStatus(order);

                return (
                  <div
                    key={`${getOrderId(order)}-mobile-${index}`}
                    className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-[0_4px_20px_rgba(1,36,103,0.04)]"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#7A8795]">
                          Order
                        </p>

                        <p className="mt-1 font-bold text-[#0078ED]">
                          #{getOrderId(order)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE7F2] px-3 text-xs font-semibold text-[#0078ED] transition hover:border-[#0078ED] hover:bg-[#EAF4FF]"
                      >
                        <EyeIcon />
                        View
                      </button>
                    </div>

                    {/* Customer */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-sm font-bold text-[#0078ED]">
                        {getCustomerName(order)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                          {getCustomerName(order)}
                        </p>

                        {getCustomerEmail(order) && (
                          <p className="truncate text-xs text-[#7A8795]">
                            {getCustomerEmail(order)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Product */}
                    <div className="mt-4 rounded-xl bg-[#F8FBFF] p-3">
                      <p className="text-xs font-medium text-[#7A8795]">
                        Products
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        {items.length > 0 ? (
                          <>
                            <img
                              src={getProductImage(items[0])}
                              alt={getProductName(items[0])}
                              className="h-12 w-12 rounded-lg border border-[#DCE7F2] bg-white object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/Karodrop-logo.png";
                              }}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                                {getProductName(items[0])}
                              </p>

                              <p className="mt-0.5 text-xs text-[#7A8795]">
                                {items.reduce(
                                  (sum, item) =>
                                    sum +
                                    getItemQuantity(item),
                                  0
                                )}{" "}
                                item
                                {items.reduce(
                                  (sum, item) =>
                                    sum +
                                    getItemQuantity(item),
                                  0
                                ) !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-[#9AA7B5]">
                            No product details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#7A8795]">
                          Amount
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                          {formatCurrency(
                            getOrderAmount(order)
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#7A8795]">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                          {formatDate(
                            getOrderDate(order)
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Statuses */}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EDF2F7] pt-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentClass(
                          payment
                        )}`}
                      >
                        Payment: {payment}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  lightBlue: "#EAF4FF",
  background: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
};

const STORAGE_KEYS = {
  orders: "karodrop-orders",
  users: "karodrop-users",
  brands: "karodrop-brands",
  products: "karodrop-products",
  designRequests: "karodrop-design-requests",
  coupons: "karodrop-coupons",
  offers: "karodrop-offers",
};

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("karodrop-user") || "null");
  } catch {
    return null;
  }
}

function getOrderAmount(order) {
  const value =
    order?.grandTotal ??
    order?.total ??
    order?.totalAmount ??
    order?.payableAmount ??
    order?.amount ??
    0;

  const number = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function getOrderStatus(order) {
  return (
    order?.status ||
    order?.orderStatus ||
    order?.paymentStatus ||
    "Processing"
  );
}

function getOrderNumber(order, index = 0) {
  return (
    order?.orderNumber ||
    order?.orderId ||
    order?.id ||
    `KD${String(index + 1).padStart(4, "0")}`
  );
}

function getCustomerName(order) {
  return (
    order?.customerName ||
    order?.customer?.name ||
    order?.userName ||
    order?.user?.name ||
    order?.name ||
    "Guest Customer"
  );
}

function getCustomerEmail(order) {
  return (
    order?.customerEmail ||
    order?.customer?.email ||
    order?.userEmail ||
    order?.user?.email ||
    order?.email ||
    ""
  );
}

function getOrderDate(order) {
  return (
    order?.createdAt ||
    order?.created_at ||
    order?.orderDate ||
    order?.date ||
    order?.createdOn ||
    null
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();
}

function getStatusStyle(status) {
  const normalized = normalizeStatus(status);

  if (
    normalized.includes("delivered") ||
    normalized.includes("completed") ||
    normalized.includes("approved")
  ) {
    return {
      background: "#DDF7EC",
      color: "#087443",
    };
  }

  if (
    normalized.includes("shipped") ||
    normalized.includes("out for delivery")
  ) {
    return {
      background: "#E4F0FF",
      color: "#0066CC",
    };
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject") ||
    normalized.includes("failed")
  ) {
    return {
      background: "#FFE5E7",
      color: "#C62828",
    };
  }

  if (
    normalized.includes("production") ||
    normalized.includes("processing") ||
    normalized.includes("design")
  ) {
    return {
      background: "#FFF1D8",
      color: "#A55A00",
    };
  }

  return {
    background: "#EEF3F8",
    color: "#526275",
  };
}

/* =========================
   ICONS
========================= */

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    orders: (
      <>
        <path d="M6 3h12l2 4v13H4V7l2-4Z" />
        <path d="M4 7h16" />
        <path d="M9 11h6" />
      </>
    ),

    products: (
      <>
        <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
        <path d="m4 12 8 4.5 8-4.5" />
        <path d="m4 16.5 8 4.5 8-4.5" />
      </>
    ),

    categories: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    brands: (
      <>
        <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
        <circle cx="8" cy="8" r="1.2" />
      </>
    ),

    customers: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21c0-3.5 2.5-6 6-6s6 2.5 6 6" />
        <path d="M16 11c2.8 0 5 2 5 5" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      </>
    ),

    sellers: (
      <>
        <circle cx="8" cy="8" r="3.5" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M2.5 20c.5-3.2 2.5-5 5.5-5s5 1.8 5.5 5" />
        <path d="M14 16c2.5 0 4.5 1.2 5.5 4" />
      </>
    ),

    design: (
      <>
        <path d="m14 5 5 5" />
        <path d="M4 20h5l10-10a3.5 3.5 0 0 0-5-5L4 15v5Z" />
      </>
    ),

    production: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M8 6V3h8v3" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),

    shipping: (
      <>
        <path d="M3 6h11v11H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),

    coupons: (
      <>
        <path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z" />
        <path d="M9 8v8" strokeDasharray="2 2" />
      </>
    ),

    reports: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="m7 15 4-4 3 2 5-6" />
      </>
    ),

    notifications: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.1A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5H15v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),

    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.dashboard}</svg>;
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon,
  iconBg = COLORS.lightBlue,
  iconColor = COLORS.blue,
  footer,
}) {
  return (
    <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-[0_3px_15px_rgba(1,36,103,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#012467]">
            {value}
          </h3>

          {footer && (
            <p className="mt-2 text-xs text-[#5E6B7A]">
              {footer}
            </p>
          )}
        </div>

        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: iconBg,
            color: iconColor,
          }}
        >
          <Icon name={icon} size={23} />
        </div>
      </div>
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({ message = "No data available yet." }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
        <Icon name="products" size={18} />
      </div>

      <p className="mt-3 text-sm text-[#5E6B7A]">{message}</p>
    </div>
  );
}

/* =========================
   MAIN DASHBOARD
========================= */

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [designRequests, setDesignRequests] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = () => {
      setCurrentUser(readCurrentUser());
      setOrders(readStorage(STORAGE_KEYS.orders));
      setUsers(readStorage(STORAGE_KEYS.users));
      setBrands(readStorage(STORAGE_KEYS.brands));
      setProducts(readStorage(STORAGE_KEYS.products));
      setDesignRequests(readStorage(STORAGE_KEYS.designRequests));
      setCoupons(readStorage(STORAGE_KEYS.coupons));
      setOffers(readStorage(STORAGE_KEYS.offers));
    };

    loadData();

    const events = [
      "storage",
      "userChanged",
      "ordersUpdated",
      "brandsUpdated",
      "productsUpdated",
      "designRequestsUpdated",
      "couponsUpdated",
      "offersUpdated",
    ];

    events.forEach((event) => {
      window.addEventListener(event, loadData);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadData);
      });
    };
  }, []);

  /* =========================
     USER COUNTS
  ========================= */

  const customerUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user?.role === "customer" &&
          user?.role !== "admin"
      ),
    [users]
  );

  const sellerUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          (user?.role === "seller" ||
            user?.role === "reseller") &&
          user?.role !== "admin"
      ),
    [users]
  );

  /* =========================
     SALES
  ========================= */

  const totalSales = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + getOrderAmount(order),
        0
      ),
    [orders]
  );

  /* =========================
     ORDER STATUS
  ========================= */

  const orderStatusCounts = useMemo(() => {
    const result = {
      delivered: 0,
      processing: 0,
      shipped: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = normalizeStatus(getOrderStatus(order));

      if (status.includes("delivered")) {
        result.delivered += 1;
      } else if (
        status.includes("cancel") ||
        status.includes("failed")
      ) {
        result.cancelled += 1;
      } else if (status.includes("shipped")) {
        result.shipped += 1;
      } else {
        result.processing += 1;
      }
    });

    return result;
  }, [orders]);

  /* =========================
     RECENT ORDERS
  ========================= */

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const first = new Date(getOrderDate(a) || 0).getTime();
        const second = new Date(getOrderDate(b) || 0).getTime();

        return second - first;
      })
      .slice(0, 6);
  }, [orders]);

  /* =========================
     RECENT CUSTOMERS
  ========================= */

  const recentCustomers = useMemo(() => {
    return [...customerUsers]
      .sort((a, b) => {
        const first = new Date(
          a?.createdAt || a?.created_at || 0
        ).getTime();

        const second = new Date(
          b?.createdAt || b?.created_at || 0
        ).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [customerUsers]);

  /* =========================
     RECENT BRANDS
  ========================= */

  const recentBrands = useMemo(() => {
    return [...brands]
      .sort((a, b) => {
        const first = new Date(
          a?.createdAt || a?.created_at || 0
        ).getTime();

        const second = new Date(
          b?.createdAt || b?.created_at || 0
        ).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [brands]);

  /* =========================
     LOW STOCK
  ========================= */

  const lowStockProducts = useMemo(() => {
    return products
      .map((product) => {
        const stock = Number(
          product?.stock ??
          product?.inventory ??
          product?.quantity ??
          0
        );

        return {
          ...product,
          calculatedStock: Number.isFinite(stock) ? stock : 0,
        };
      })
      .filter((product) => product.calculatedStock <= 5)
      .sort(
        (a, b) =>
          a.calculatedStock - b.calculatedStock
      )
      .slice(0, 5);
  }, [products]);

  /* =========================
     DESIGN REQUESTS
  ========================= */

  const pendingDesignRequests = useMemo(() => {
    return designRequests.filter((item) => {
      const status = normalizeStatus(
        item?.status || item?.designStatus
      );

      return ![
        "completed",
        "approved",
        "rejected",
      ].some((value) => status.includes(value));
    }).length;
  }, [designRequests]);

  /* =========================
     PENDING PROCESSING
  ========================= */

  const processingOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = normalizeStatus(
        getOrderStatus(order)
      );

      return (
        status.includes("processing") ||
        status.includes("production") ||
        status.includes("design") ||
        status === "order placed" ||
        status === "payment confirmed"
      );
    }).length;
  }, [orders]);

  /* =========================
     SHIPPING
  ========================= */

  const shippingOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = normalizeStatus(
        getOrderStatus(order)
      );

      return (
        status.includes("shipped") ||
        status.includes("out for delivery")
      );
    }).length;
  }, [orders]);

  /* =========================
     SALES BY LAST 7 DAYS
     REAL ORDER DATA ONLY
  ========================= */

  const salesChart = useMemo(() => {
    const today = new Date();

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - (6 - index));

      return {
        date,
        label: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        sales: 0,
        orders: 0,
      };
    });

    orders.forEach((order) => {
      const rawDate = getOrderDate(order);

      if (!rawDate) return;

      const orderDate = new Date(rawDate);

      if (Number.isNaN(orderDate.getTime())) return;

      orderDate.setHours(0, 0, 0, 0);

      const day = days.find(
        (item) =>
          item.date.getTime() === orderDate.getTime()
      );

      if (day) {
        day.sales += getOrderAmount(order);
        day.orders += 1;
      }
    });

    return days;
  }, [orders]);

  const maxSales = Math.max(
    ...salesChart.map((item) => item.sales),
    1
  );

  /* =========================
     GLOBAL SEARCH
  ========================= */

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    const results = [];

    customerUsers.forEach((user) => {
      const text = [
        user?.name,
        user?.email,
        user?.phone,
      ]
        .join(" ")
        .toLowerCase();

      if (text.includes(query)) {
        results.push({
          type: "Customer",
          name: user?.name || "Customer",
          detail: user?.email || "",
          path: "/admin/customers",
        });
      }
    });

    sellerUsers.forEach((user) => {
      const text = [
        user?.name,
        user?.email,
        user?.businessName,
      ]
        .join(" ")
        .toLowerCase();

      if (text.includes(query)) {
        results.push({
          type: "Seller",
          name:
            user?.businessName ||
            user?.name ||
            "Seller",
          detail: user?.email || "",
          path: "/admin/customers",
        });
      }
    });

    brands.forEach((brand) => {
      const text = [
        brand?.name,
        brand?.brandName,
        brand?.ownerName,
        brand?.ownerEmail,
      ]
        .join(" ")
        .toLowerCase();

      if (text.includes(query)) {
        results.push({
          type: "Brand",
          name:
            brand?.name ||
            brand?.brandName ||
            "Brand",
          detail:
            brand?.ownerName ||
            brand?.ownerEmail ||
            "",
          path: "/admin/brands",
        });
      }
    });

    return results.slice(0, 8);
  }, [
    search,
    customerUsers,
    sellerUsers,
    brands,
  ]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("karodrop-user");

    window.dispatchEvent(new Event("userChanged"));

    navigate("/admin-login");
  };

  /* =========================
     SIDEBAR
  ========================= */

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      path: "/admin",
      active: true,
    },
    {
      label: "Orders",
      icon: "orders",
      path: "/admin/orders",
    },
    {
      label: "Products",
      icon: "products",
      path: "/admin/products",
    },
    {
      label: "Categories",
      icon: "categories",
      path: "/admin/categories",
    },
    {
      label: "Brands",
      icon: "brands",
      path: "/admin/brands",
    },
    {
      label: "Customers",
      icon: "customers",
      path: "/admin/customers",
    },
    {
      label: "Sellers / Resellers",
      icon: "sellers",
      path: "/admin/customers",
    },
    {
      label: "Design Requests",
      icon: "design",
      path: "/admin/design-requests",
    },
    {
      label: "Production / Fulfillment",
      icon: "production",
      path: "/admin/production",
    },
    {
      label: "Shipping",
      icon: "shipping",
      path: "/admin/shipping",
    },
    {
      label: "Coupons & Offers",
      icon: "coupons",
      path: "/admin/offers",
    },
    {
      label: "Reports",
      icon: "reports",
      path: "/admin/reports",
    },
    {
      label: "Notifications",
      icon: "notifications",
      path: "/admin/notifications",
    },
    {
      label: "Settings",
      icon: "settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#012467]/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[250px] bg-[#012467] text-white transition-transform duration-300 ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}

        <div className="h-[78px] px-5 flex items-center border-b border-white/10">
          <Link
            to="/admin"
            className="w-full h-[50px] bg-white rounded-xl flex items-center justify-center px-3"
          >
            <img
              src="/images/Karodrop-logo.png"
              alt="Karodrop"
              className="max-h-10 max-w-full w-auto object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback =
                  event.currentTarget.nextElementSibling;

                if (fallback) {
                  fallback.style.display = "block";
                }
              }}
            />

            
          </Link>
        </div>

        {/* Sidebar Navigation */}

        <div
          className="h-[calc(100vh-78px)] overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition ${item.active
                    ? "bg-[#0078ED] text-white shadow-lg shadow-[#0078ED]/20"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span
                  className={`shrink-0 ${item.active
                      ? "text-white"
                      : "text-white/75 group-hover:text-white"
                    }`}
                >
                  <Icon name={item.icon} size={18} />
                </span>

                <span className="truncate">
                  {item.label}
                </span>

                {item.label === "Orders" &&
                  orders.length > 0 && (
                    <span className="ml-auto min-w-6 h-5 px-1.5 rounded-full bg-white text-[#012467] text-[10px] font-bold flex items-center justify-center">
                      {orders.length > 99
                        ? "99+"
                        : orders.length}
                    </span>
                  )}

                {item.label ===
                  "Design Requests" &&
                  pendingDesignRequests > 0 && (
                    <span className="ml-auto min-w-6 h-5 px-1.5 rounded-full bg-[#FFEEE0] text-[#B95C00] text-[10px] font-bold flex items-center justify-center">
                      {pendingDesignRequests >
                        99
                        ? "99+"
                        : pendingDesignRequests}
                    </span>
                  )}
              </Link>
            ))}
          </nav>

          {/* Logout */}

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/75 hover:bg-red-500/10 hover:text-red-200 transition"
            >
              <Icon name="logout" size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="lg:ml-[250px] min-h-screen">
        {/* =========================
            TOP HEADER
        ========================= */}

        <header className="sticky top-0 z-30 h-[70px] bg-white border-b border-[#DCE7F2]">
          <div className="h-full px-4 sm:px-6 flex items-center gap-3">
            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg border border-[#DCE7F2] text-[#012467] flex items-center justify-center"
            >
              <Icon name="menu" size={21} />
            </button>

            {/* Search */}

            <div className="relative flex-1 max-w-[650px]">
              <div className="h-11 bg-[#F5F8FC] border border-[#DCE7F2] rounded-xl flex items-center px-3 gap-2">
                <span className="text-[#5E6B7A]">
                  <Icon name="search" size={19} />
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search brands, customers, sellers, orders, products..."
                  className="flex-1 bg-transparent outline-none text-sm text-[#0B1F3A] placeholder:text-[#8491A5]"
                />

                <span className="hidden sm:block text-[10px] border border-[#DCE7F2] bg-white px-2 py-1 rounded-md text-[#7A8798]">
                  Ctrl + K
                </span>
              </div>

              {/* Search Results */}

              {search.trim() && (
                <div className="absolute top-14 left-0 right-0 bg-white border border-[#DCE7F2] rounded-xl shadow-xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(
                      (result, index) => (
                        <button
                          key={`${result.type}-${index}`}
                          type="button"
                          onClick={() => {
                            navigate(result.path);
                            setSearch("");
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F5FAFF] border-b border-[#EEF3F8] last:border-0"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                            <Icon
                              name={
                                result.type ===
                                  "Brand"
                                  ? "brands"
                                  : "customers"
                              }
                              size={17}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#0B1F3A] truncate">
                              {result.name}
                            </p>

                            <p className="text-xs text-[#5E6B7A] truncate">
                              {result.type}
                              {result.detail
                                ? ` • ${result.detail}`
                                : ""}
                            </p>
                          </div>

                          <Icon
                            name="arrow"
                            size={16}
                          />
                        </button>
                      )
                    )
                  ) : (
                    <div className="p-5 text-center text-sm text-[#5E6B7A]">
                      No matching customers, sellers or
                      brands found.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 ml-auto">
              {/* Notification */}

              <button
                type="button"
                className="relative w-10 h-10 rounded-lg hover:bg-[#F5FAFF] flex items-center justify-center text-[#012467]"
              >
                <Icon name="bell" size={20} />

                {(pendingDesignRequests >
                  0 ||
                  processingOrders > 0) && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
                  )}
              </button>

              {/* Divider */}

              <div className="w-px h-8 bg-[#DCE7F2] mx-1" />

              {/* Admin */}

              <div className="flex items-center gap-3 pl-1">
                <div className="w-9 h-9 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center font-bold text-sm">
                  {(
                    currentUser?.name ||
                    "Admin"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden xl:block">
                  <p className="text-sm font-semibold text-[#012467] leading-4">
                    {currentUser?.name ||
                      "Admin"}
                  </p>

                  <p className="text-[11px] text-[#5E6B7A] mt-1">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            CONTENT
        ========================= */}

        <main className="p-4 sm:p-6 xl:p-7">
          {/* Welcome */}

          <section className="mb-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0078ED]">
                  Good morning,
                </p>

                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#012467]">
                  Welcome back,{" "}
                  {currentUser?.name ||
                    "Admin"}{" "}
                  <span>👋</span>
                </h1>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Here's what's happening with
                  your Karodrop store today.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="h-11 bg-white border border-[#DCE7F2] rounded-xl px-4 flex items-center gap-2 text-sm text-[#0B1F3A]">
                  <Icon
                    name="calendar"
                    size={18}
                  />

                  <span>
                    {new Date().toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <Link
                  to="/admin/products"
                  className="h-11 px-4 rounded-xl bg-[#0078ED] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#012467] transition shadow-lg shadow-[#0078ED]/20"
                >
                  <Icon name="plus" size={18} />
                  Add Product
                </Link>
              </div>
            </div>
          </section>

          {/* =========================
              KPI CARDS
          ========================= */}

          <section className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <StatCard
              title="Total Orders"
              value={orders.length.toLocaleString("en-IN")}
              icon="orders"
              iconBg="#FFF1E5"
              iconColor="#E77819"
              footer="All orders"
            />

            <StatCard
              title="Total Sales"
              value={formatCurrency(totalSales)}
              icon="reports"
              iconBg="#DDF7EC"
              iconColor="#0A8B59"
              footer="Order value"
            />

            <StatCard
              title="Total Customers"
              value={customerUsers.length.toLocaleString(
                "en-IN"
              )}
              icon="customers"
              iconBg="#EAF4FF"
              iconColor="#0078ED"
              footer="Registered customers"
            />

            <StatCard
              title="Total Sellers"
              value={sellerUsers.length.toLocaleString(
                "en-IN"
              )}
              icon="sellers"
              iconBg="#F0E9FF"
              iconColor="#7447C7"
              footer="Sellers & resellers"
            />

            <StatCard
              title="Total Products"
              value={products.length.toLocaleString(
                "en-IN"
              )}
              icon="products"
              iconBg="#FFE9EC"
              iconColor="#D6455D"
              footer="Product catalog"
            />

            <StatCard
              title="Total Brands"
              value={brands.length.toLocaleString(
                "en-IN"
              )}
              icon="brands"
              iconBg="#DDF7EC"
              iconColor="#087B55"
              footer="Connected brands"
            />
          </section>

          {/* =========================
              SALES + STATUS + REVENUE
          ========================= */}

          <section className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr_1fr] gap-4 mb-6">
            {/* Sales Overview */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 sm:p-5 shadow-[0_3px_15px_rgba(1,36,103,0.04)]">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-bold text-[#012467]">
                    Sales & Orders Overview
                  </h2>

                  <p className="text-xs text-[#5E6B7A] mt-1">
                    Last 7 days from actual orders
                  </p>
                </div>

                <span className="text-xs font-medium text-[#0078ED] bg-[#EAF4FF] px-3 py-2 rounded-lg">
                  Last 7 Days
                </span>
              </div>

              {orders.length === 0 ? (
                <EmptyState message="Sales data will appear here when orders are placed." />
              ) : (
                <>
                  <div className="h-[220px] flex items-end gap-2 sm:gap-3">
                    {salesChart.map(
                      (item, index) => {
                        const height =
                          item.sales > 0
                            ? Math.max(
                              (item.sales /
                                maxSales) *
                              165,
                              8
                            )
                            : 5;

                        return (
                          <div
                            key={`${item.label}-${index}`}
                            className="flex-1 h-full flex flex-col justify-end"
                          >
                            <div className="flex-1 flex items-end justify-center">
                              <div
                                title={`${item.label}: ${formatCurrency(
                                  item.sales
                                )}`}
                                className="w-full max-w-[42px] bg-[#0078ED] rounded-t-lg hover:bg-[#012467] transition"
                                style={{
                                  height: `${height}px`,
                                }}
                              />
                            </div>

                            <p className="mt-2 text-[10px] sm:text-xs text-center text-[#7A8798]">
                              {item.label}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#EEF3F8] flex flex-wrap items-center gap-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0078ED]" />
                      <span className="text-xs text-[#5E6B7A]">
                        Sales
                      </span>
                    </div>

                    <div className="text-xs text-[#5E6B7A]">
                      Total:{" "}
                      <span className="font-semibold text-[#012467]">
                        {formatCurrency(totalSales)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Order Status */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 sm:p-5 shadow-[0_3px_15px_rgba(1,36,103,0.04)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-[#012467]">
                    Order Status
                  </h2>

                  <p className="text-xs text-[#5E6B7A] mt-1">
                    Current order distribution
                  </p>
                </div>

                <span className="text-xl font-bold text-[#012467]">
                  {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <EmptyState message="No orders yet." />
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      label: "Delivered",
                      count:
                        orderStatusCounts.delivered,
                      color: "#19B879",
                      bg: "#DDF7EC",
                    },
                    {
                      label: "Processing",
                      count:
                        orderStatusCounts.processing,
                      color: "#0078ED",
                      bg: "#EAF4FF",
                    },
                    {
                      label: "Shipped",
                      count:
                        orderStatusCounts.shipped,
                      color: "#F39A3D",
                      bg: "#FFF1E5",
                    },
                    {
                      label: "Cancelled",
                      count:
                        orderStatusCounts.cancelled,
                      color: "#E34D59",
                      bg: "#FFE5E7",
                    },
                  ].map((item) => {
                    const percentage =
                      orders.length > 0
                        ? Math.round(
                          (item.count /
                            orders.length) *
                          100
                        )
                        : 0;

                    return (
                      <div
                        key={item.label}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                background:
                                  item.color,
                              }}
                            />

                            <span className="text-xs font-medium text-[#0B1F3A]">
                              {item.label}
                            </span>
                          </div>

                          <span className="text-xs text-[#5E6B7A]">
                            {item.count} (
                            {percentage}%)
                          </span>
                        </div>

                        <div className="h-2 bg-[#F0F4F8] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              background:
                                item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Revenue Breakdown */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 sm:p-5 shadow-[0_3px_15px_rgba(1,36,103,0.04)]">
              <div className="mb-5">
                <h2 className="font-bold text-[#012467]">
                  Revenue Breakdown
                </h2>

                <p className="text-xs text-[#5E6B7A] mt-1">
                  Based on available order data
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F5FAFF] rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                      <Icon
                        name="products"
                        size={15}
                      />
                    </span>

                    <span className="text-xs font-medium">
                      Product Sales
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#012467]">
                    {formatCurrency(totalSales)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F5FAFF] rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#DDF7EC] text-[#087B55] flex items-center justify-center">
                      <Icon
                        name="shipping"
                        size={15}
                      />
                    </span>

                    <span className="text-xs font-medium">
                      Shipping
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#012467]">
                    Included
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F5FAFF] rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF1E5] text-[#C96A11] flex items-center justify-center">
                      <Icon
                        name="orders"
                        size={15}
                      />
                    </span>

                    <span className="text-xs font-medium">
                      Orders
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#012467]">
                    {orders.length}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-[#EAF8F3] border border-[#CBEDE0]">
                <p className="text-xs text-[#087B55]">
                  Total order value
                </p>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xl font-bold text-[#087B55]">
                    {formatCurrency(
                      totalSales
                    )}
                  </p>

                  <Icon
                    name="reports"
                    size={22}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              RECENT ORDERS
          ========================= */}

          <section className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] mb-6 overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-[#EEF3F8] flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-[#012467]">
                  Recent Orders
                </h2>

                <p className="text-xs text-[#5E6B7A] mt-1">
                  Latest orders placed on Karodrop
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs sm:text-sm font-semibold text-[#0078ED] hover:text-[#012467] flex items-center gap-1"
              >
                View All
                <Icon
                  name="arrow"
                  size={15}
                />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <EmptyState message="No orders have been placed yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-[#F8FBFE] text-left">
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C]">
                        Order
                      </th>

                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C]">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C]">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C]">
                        Status
                      </th>

                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C]">
                        Date
                      </th>

                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7A8C] text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map(
                      (order, index) => {
                        const status =
                          getOrderStatus(
                            order
                          );

                        const statusStyle =
                          getStatusStyle(
                            status
                          );

                        return (
                          <tr
                            key={
                              order?.id ||
                              order?.orderId ||
                              index
                            }
                            className="border-t border-[#EEF3F8] hover:bg-[#F9FCFF]"
                          >
                            <td className="px-5 py-3">
                              <span className="text-sm font-semibold text-[#012467]">
                                #
                                {getOrderNumber(
                                  order,
                                  index
                                )}
                              </span>
                            </td>

                            <td className="px-5 py-3">
                              <div>
                                <p className="text-sm font-medium text-[#0B1F3A]">
                                  {getCustomerName(
                                    order
                                  )}
                                </p>

                                <p className="text-xs text-[#7A8798] mt-0.5">
                                  {getCustomerEmail(
                                    order
                                  )}
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-3 text-sm font-semibold text-[#012467]">
                              {formatCurrency(
                                getOrderAmount(
                                  order
                                )
                              )}
                            </td>

                            <td className="px-5 py-3">
                              <span
                                className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize"
                                style={{
                                  background:
                                    statusStyle.background,
                                  color:
                                    statusStyle.color,
                                }}
                              >
                                {status}
                              </span>
                            </td>

                            <td className="px-5 py-3 text-xs text-[#5E6B7A]">
                              {formatDate(
                                getOrderDate(
                                  order
                                )
                              )}
                            </td>

                            <td className="px-5 py-3 text-right">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg hover:bg-[#EAF4FF] text-[#5E6B7A] hover:text-[#0078ED] inline-flex items-center justify-center"
                              >
                                <Icon
                                  name="more"
                                  size={17}
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* =========================
              3 COLUMN TABLES
          ========================= */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            {/* Low Stock */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[#EEF3F8] flex items-center justify-between">
                <h2 className="font-bold text-[#012467]">
                  Low Stock Products
                </h2>

                <Link
                  to="/admin/products"
                  className="text-xs font-semibold text-[#0078ED]"
                >
                  View All →
                </Link>
              </div>

              {lowStockProducts.length ===
                0 ? (
                <EmptyState message="No low-stock products." />
              ) : (
                <div className="divide-y divide-[#EEF3F8]">
                  {lowStockProducts.map(
                    (product, index) => (
                      <div
                        key={
                          product?.id ||
                          product?.productId ||
                          index
                        }
                        className="px-4 py-3 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#F5F8FC] border border-[#EEF3F8] overflow-hidden flex items-center justify-center">
                          {product?.image ? (
                            <img
                              src={
                                product.image
                              }
                              alt={
                                product?.name ||
                                "Product"
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon
                              name="products"
                              size={17}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#0B1F3A] truncate">
                            {product?.name ||
                              product?.title ||
                              "Product"}
                          </p>

                          <p className="text-[11px] text-[#7A8798] mt-1">
                            Stock:{" "}
                            {product.calculatedStock}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${product.calculatedStock ===
                              0
                              ? "bg-[#FFE5E7] text-[#C62828]"
                              : "bg-[#FFF1E5] text-[#B85B00]"
                            }`}
                        >
                          {product.calculatedStock ===
                            0
                            ? "Out of Stock"
                            : "Low Stock"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Recent Customers */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[#EEF3F8] flex items-center justify-between">
                <h2 className="font-bold text-[#012467]">
                  Recent Customers
                </h2>

                <Link
                  to="/admin/customers"
                  className="text-xs font-semibold text-[#0078ED]"
                >
                  View All →
                </Link>
              </div>

              {recentCustomers.length ===
                0 ? (
                <EmptyState message="No customers registered yet." />
              ) : (
                <div className="divide-y divide-[#EEF3F8]">
                  {recentCustomers.map(
                    (customer, index) => (
                      <div
                        key={
                          customer?.id ||
                          customer?.email ||
                          index
                        }
                        className="px-4 py-3 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center text-xs font-bold">
                          {(
                            customer?.name ||
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#0B1F3A] truncate">
                            {customer?.name ||
                              "Customer"}
                          </p>

                          <p className="text-[11px] text-[#7A8798] truncate mt-1">
                            {customer?.email ||
                              customer?.phone ||
                              "No contact"}
                          </p>
                        </div>

                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#EAF4FF] text-[#0078ED] font-semibold">
                          Customer
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Recent Brands */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[#EEF3F8] flex items-center justify-between">
                <h2 className="font-bold text-[#012467]">
                  Recent Brands
                </h2>

                <Link
                  to="/admin/brands"
                  className="text-xs font-semibold text-[#0078ED]"
                >
                  View All →
                </Link>
              </div>

              {recentBrands.length === 0 ? (
                <EmptyState message="No brands added yet." />
              ) : (
                <div className="divide-y divide-[#EEF3F8]">
                  {recentBrands.map(
                    (brand, index) => (
                      <div
                        key={
                          brand?.id ||
                          brand?.brandId ||
                          index
                        }
                        className="px-4 py-3 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                          <Icon
                            name="brands"
                            size={17}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#0B1F3A] truncate">
                            {brand?.name ||
                              brand?.brandName ||
                              "Brand"}
                          </p>

                          <p className="text-[11px] text-[#7A8798] truncate mt-1">
                            {brand?.ownerName ||
                              brand?.ownerEmail ||
                              "Brand owner"}
                          </p>
                        </div>

                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#DDF7EC] text-[#087B55] font-semibold">
                          Active
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* =========================
              TOP SELLING + PENDING WORK
          ========================= */}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Selling Products */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[#EEF3F8] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#012467]">
                    Top Selling Products
                  </h2>

                  <p className="text-xs text-[#5E6B7A] mt-1">
                    Based on order item data
                  </p>
                </div>

                <Link
                  to="/admin/products"
                  className="text-xs font-semibold text-[#0078ED]"
                >
                  View All →
                </Link>
              </div>

              {products.length === 0 ? (
                <EmptyState message="Products will appear here after they are added." />
              ) : (
                <div className="divide-y divide-[#EEF3F8]">
                  {products
                    .slice(0, 5)
                    .map(
                      (product, index) => (
                        <div
                          key={
                            product?.id ||
                            product?.productId ||
                            index
                          }
                          className="px-4 py-3 flex items-center gap-3"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>

                          <div className="w-10 h-10 rounded-lg bg-[#F5F8FC] overflow-hidden flex items-center justify-center">
                            {product?.image ? (
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product?.name ||
                                  "Product"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon
                                name="products"
                                size={17}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#0B1F3A] truncate">
                              {product?.name ||
                                product?.title ||
                                "Product"}
                            </p>

                            <p className="text-[11px] text-[#7A8798] mt-1">
                              {product?.category ||
                                "Product"}
                            </p>
                          </div>

                          <p className="text-xs font-bold text-[#012467]">
                            {formatCurrency(
                              product?.price ||
                              product?.sellingPrice ||
                              0
                            )}
                          </p>
                        </div>
                      )
                    )}
                </div>
              )}
            </div>

            {/* Pending Work */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-[0_3px_15px_rgba(1,36,103,0.04)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[#EEF3F8]">
                <h2 className="font-bold text-[#012467]">
                  Pending Work
                </h2>

                <p className="text-xs text-[#5E6B7A] mt-1">
                  Tasks that need admin attention
                </p>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  to="/admin/design-requests"
                  className="p-4 rounded-xl bg-[#FFF7EA] border border-[#FFE7BF] hover:border-[#F5C979] transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-white text-[#C96A11] flex items-center justify-center">
                    <Icon
                      name="design"
                      size={18}
                    />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-[#012467]">
                    {pendingDesignRequests}
                  </p>

                  <p className="text-xs font-medium text-[#5E6B7A] mt-1">
                    Design Requests
                  </p>
                </Link>

                <Link
                  to="/admin/orders"
                  className="p-4 rounded-xl bg-[#EAF4FF] border border-[#D5E9FF] hover:border-[#9BCBFF] transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-white text-[#0078ED] flex items-center justify-center">
                    <Icon
                      name="production"
                      size={18}
                    />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-[#012467]">
                    {processingOrders}
                  </p>

                  <p className="text-xs font-medium text-[#5E6B7A] mt-1">
                    Processing Orders
                  </p>
                </Link>

                <Link
                  to="/admin/shipping"
                  className="p-4 rounded-xl bg-[#EAF8F3] border border-[#D4EEE3] hover:border-[#A9DCC8] transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-white text-[#087B55] flex items-center justify-center">
                    <Icon
                      name="shipping"
                      size={18}
                    />
                  </div>

                  <p className="mt-3 text-2xl font-bold text-[#012467]">
                    {shippingOrders}
                  </p>

                  <p className="text-xs font-medium text-[#5E6B7A] mt-1">
                    Shipping
                  </p>
                </Link>
              </div>
            </div>
          </section>

          {/* =========================
              FOOTER
          ========================= */}

          <footer className="mt-7 pt-5 border-t border-[#DCE7F2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7A8C]">
            <p>
              © {new Date().getFullYear()} Karodrop.
              Your Smart Dropshipping Partner.
            </p>

            <div className="flex items-center gap-5">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
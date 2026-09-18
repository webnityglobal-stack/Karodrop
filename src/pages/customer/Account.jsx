import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =========================================================
   KARODROP CUSTOMER PANEL
========================================================= */

const BLUE = "#0078ED";
const NAVY = "#012467";

const ORDERS_KEY = "karodrop-orders";
const BRANDS_KEY = "karodrop-brands";
const DESIGNS_KEY = "karodrop-design-requests";

export default function Account() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const [user, setUser] = useState({
    name: "Customer",
    email: "customer@example.com",
    profileImage: "",
  });

  const [orders, setOrders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [designRequests, setDesignRequests] = useState([]);

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("karodrop-user");

      if (!savedUser) {
        setUser({
          name: "Customer",
          email: "customer@example.com",
          profileImage: "",
        });
        return;
      }

      try {
        const parsed = JSON.parse(savedUser);

        setUser((current) => ({
          ...current,
          ...parsed,
        }));
      } catch (error) {
        console.error("Unable to read user:", error);
      }
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const loadDashboardData = () => {
      /* ---------------- ORDERS ---------------- */

      try {
        const savedOrders = JSON.parse(
          localStorage.getItem(ORDERS_KEY) || "[]"
        );

        setOrders(Array.isArray(savedOrders) ? savedOrders : []);
      } catch (error) {
        console.error("Unable to load orders:", error);
        setOrders([]);
      }

      /* ---------------- BRANDS ---------------- */

      try {
        const savedBrands = JSON.parse(
          localStorage.getItem(BRANDS_KEY) || "[]"
        );

        setBrands(Array.isArray(savedBrands) ? savedBrands : []);
      } catch (error) {
        console.error("Unable to load brands:", error);
        setBrands([]);
      }

      /* ---------------- DESIGNS ---------------- */

      try {
        const savedDesigns = JSON.parse(
          localStorage.getItem(DESIGNS_KEY) || "[]"
        );

        setDesignRequests(
          Array.isArray(savedDesigns) ? savedDesigns : []
        );
      } catch (error) {
        console.error("Unable to load designs:", error);
        setDesignRequests([]);
      }
    };

    loadDashboardData();

    window.addEventListener("storage", loadDashboardData);
    window.addEventListener("ordersUpdated", loadDashboardData);
    window.addEventListener("brandsUpdated", loadDashboardData);
    window.addEventListener("designRequestsUpdated", loadDashboardData);
    window.addEventListener("userChanged", loadDashboardData);

    return () => {
      window.removeEventListener("storage", loadDashboardData);
      window.removeEventListener("ordersUpdated", loadDashboardData);
      window.removeEventListener("brandsUpdated", loadDashboardData);
      window.removeEventListener("designRequestsUpdated", loadDashboardData);
      window.removeEventListener("userChanged", loadDashboardData);
    };
  }, []);

  /* =========================================================
     CUSTOMER ID / EMAIL
  ========================================================= */

  const customerEmail = String(user?.email || "")
    .trim()
    .toLowerCase();

  const customerId = user?.id || user?._id || user?.userId || "";

  /* =========================================================
     CUSTOMER ORDERS
  ========================================================= */

  const customerOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((order) => {
      const orderEmail = String(order.customerEmail || "")
        .trim()
        .toLowerCase();

      const orderCustomerId =
        order.customerId || order.userId || order.customer?.id || "";

      /*
        Prefer customer ID when available.
        Fall back to email because current frontend
        orders use customerEmail.
      */

      if (customerId && orderCustomerId) {
        return String(orderCustomerId) === String(customerId);
      }

      if (customerEmail && orderEmail) {
        return orderEmail === customerEmail;
      }

      return false;
    });
  }, [orders, customerId, customerEmail]);

  /* =========================================================
     CUSTOMER BRANDS
  ========================================================= */

  const customerBrands = useMemo(() => {
    if (!Array.isArray(brands)) return [];

    /*
      Current MyBrands implementation stores brands globally.
      Until owner/customer information is added there,
      we keep the existing brands visible here.

      Once owner fields are added, this automatically filters.
    */

    const hasOwnerInformation = brands.some(
      (brand) =>
        brand.customerEmail ||
        brand.customerId ||
        brand.userId ||
        brand.ownerEmail
    );

    if (!hasOwnerInformation) {
      return brands;
    }

    return brands.filter((brand) => {
      const brandEmail = String(
        brand.customerEmail || brand.ownerEmail || ""
      )
        .trim()
        .toLowerCase();

      const brandCustomerId =
        brand.customerId || brand.userId || "";

      if (customerId && brandCustomerId) {
        return String(brandCustomerId) === String(customerId);
      }

      return brandEmail === customerEmail;
    });
  }, [brands, customerId, customerEmail]);

  /* =========================================================
     CUSTOMER DESIGNS
  ========================================================= */

  const customerDesignRequests = useMemo(() => {
    if (!Array.isArray(designRequests)) return [];

    return designRequests.filter((request) => {
      const requestEmail = String(request.customerEmail || "")
        .trim()
        .toLowerCase();

      const requestCustomerId =
        request.customerId ||
        request.userId ||
        request.customer?.id ||
        "";

      if (customerId && requestCustomerId) {
        return String(requestCustomerId) === String(customerId);
      }

      if (requestEmail) {
        return requestEmail === customerEmail;
      }

      return false;
    });
  }, [designRequests, customerId, customerEmail]);

  /* =========================================================
     ORDER COUNTS
  ========================================================= */

  const orderCounts = useMemo(() => {
    const counts = {
      total: customerOrders.length,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    customerOrders.forEach((order) => {
      const status = String(order.status || "")
        .toLowerCase()
        .trim();

      if (
        status === "processing" ||
        status === "design/production" ||
        status === "payment confirmed" ||
        status === "packed"
      ) {
        counts.processing += 1;
      }

      if (
        status === "shipped" ||
        status === "out for delivery"
      ) {
        counts.shipped += 1;
      }

      if (status === "delivered") {
        counts.delivered += 1;
      }

      if (
        status === "cancelled" ||
        status === "canceled"
      ) {
        counts.cancelled += 1;
      }
    });

    return counts;
  }, [customerOrders]);

  /* =========================================================
     DESIGN COUNTS
  ========================================================= */

  const designCount = customerDesignRequests.length;

  const productCount = useMemo(() => {
    return customerDesignRequests.filter((item) => {
      const status = String(item.status || "").toLowerCase();

      return (
        status === "approved" ||
        status === "in production" ||
        status === "completed"
      );
    }).length;
  }, [customerDesignRequests]);

  /* =========================================================
     RECENT ORDERS
  ========================================================= */

  const recentOrders = useMemo(() => {
    return [...customerOrders]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || b.updatedAt || 0
          ) -
          new Date(
            a.createdAt || a.updatedAt || 0
          )
      )
      .slice(0, 5);
  }, [customerOrders]);

  /* =========================================================
     RECENT DESIGNS
  ========================================================= */

  const recentDesigns = useMemo(() => {
    return [...customerDesignRequests]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [customerDesignRequests]);

  /* =========================================================
     DESIGN STATUS COUNTS
  ========================================================= */

  const designStatusCounts = useMemo(() => {
    const counts = {
      New: 0,
      "Under Review": 0,
      Approved: 0,
      "Request Changes": 0,
      "In Production": 0,
      Completed: 0,
      Rejected: 0,
    };

    customerDesignRequests.forEach((request) => {
      const status = request.status || "New";

      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [customerDesignRequests]);

  /* =========================================================
     FIRST LETTER
  ========================================================= */

  const firstLetter = String(user.name || "C")
    .charAt(0)
    .toUpperCase();

  /* =========================================================
     ORDER PROGRESS
  ========================================================= */

  const orderProgress = useMemo(() => {
    const total = orderCounts.total;

    const getPercent = (count) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      processing: getPercent(orderCounts.processing),
      shipped: getPercent(orderCounts.shipped),
      delivered: getPercent(orderCounts.delivered),
      cancelled: getPercent(orderCounts.cancelled),
    };
  }, [orderCounts]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("karodrop-user");

    window.dispatchEvent(new Event("userChanged"));

    navigate("/login");
  };

  /* =========================================================
     SIDEBAR NAVIGATION
  ========================================================= */

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);

    if (section === "orders") {
      navigate("/orders");
      return;
    }

    if (section === "products") {
      navigate("/search");
      return;
    }

    if (section === "brands") {
      navigate("/brands");
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "delivered":
      case "approved":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "shipped":
      case "out for delivery":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "processing":
      case "in production":
      case "packed":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "under review":
      case "payment confirmed":
        return "bg-sky-50 text-sky-700 border-sky-100";

      case "request changes":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "cancelled":
      case "canceled":
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#012467]/30 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[250px] bg-white border-r border-[#DCE7F2] transition-transform duration-300 ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* LOGO */}

        <div className="h-[82px] flex items-center px-7 border-b border-[#EEF3F8]">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center"
          >
            <img
              src="/images/Karodrop-logo.png"
              alt="Karodrop"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* CUSTOMER */}

        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5FAFF] border border-[#E7F0F8]">
            <ProfileAvatar
              user={user}
              firstLetter={firstLetter}
              size="small"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.name || "Customer"}
              </p>

              <p className="text-xs text-[#6D7A89] truncate">
                Customer Account
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="px-4 pt-6 space-y-1">
          <SidebarItem
            label="Dashboard"
            icon={<DashboardIcon />}
            active={activeSection === "overview"}
            onClick={() => handleSectionClick("overview")}
          />

          <SidebarItem
            label="Orders"
            icon={<OrdersIcon />}
            active={false}
            onClick={() => handleSectionClick("orders")}
          />

          <SidebarItem
            label="Products"
            icon={<ProductsIcon />}
            active={false}
            onClick={() => handleSectionClick("products")}
          />

          <SidebarItem
            label="Designs"
            icon={<DesignIcon />}
            active={activeSection === "designs"}
            onClick={() => handleSectionClick("designs")}
          />

          <SidebarItem
            label="My Brands"
            icon={<BrandIcon />}
            active={false}
            onClick={() => handleSectionClick("brands")}
          />

          <SidebarItem
            label="Integrations"
            icon={<IntegrationIcon />}
            active={false}
            onClick={() => {
              setSidebarOpen(false);
              navigate("/integrations");
            }}
          />

          <div className="py-3">
            <div className="h-px bg-[#EEF3F8]" />
          </div>

          <SidebarItem
            label="Profile"
            icon={<ProfileIcon />}
            active={activeSection === "profile"}
            onClick={() => handleSectionClick("profile")}
          />

          <SidebarItem
            label="Settings"
            icon={<SettingsIcon />}
            active={activeSection === "settings"}
            onClick={() => handleSectionClick("settings")}
          />

          <SidebarItem
            label="Help & Support"
            icon={<HelpIcon />}
            active={false}
            onClick={() => {
              setSidebarOpen(false);
              navigate("/help-support");
            }}
          />
        </nav>

        {/* LOGOUT */}

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#EEF3F8]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#5E6B7A] hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:ml-[250px] min-h-screen">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 h-[82px] bg-white border-b border-[#DCE7F2]">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-lg border border-[#DCE7F2] flex items-center justify-center"
              >
                <MenuIcon />
              </button>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg border border-[#DCE7F2] bg-white text-[#536273] text-xs sm:text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED] transition"
                  title="Back to Home"
                >
                  <span className="text-base leading-none">←</span>
                  <span>Back to Home</span>
                </button>

                <div>
                  <p className="hidden sm:block text-xs font-semibold text-[#0078ED] uppercase tracking-wide">
                    Customer Panel
                  </p>

                  <h1 className="text-lg sm:text-xl font-bold">
                    Dashboard
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* SEARCH */}

              <button
                type="button"
                onClick={() => navigate("/search")}
                className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg border border-[#DCE7F2] text-sm text-[#6D7A89] hover:border-[#0078ED] hover:text-[#0078ED] transition"
              >
                <SearchIcon />
                Search products
              </button>

              {/* CART */}

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative w-10 h-10 rounded-lg border border-[#DCE7F2] flex items-center justify-center text-[#536273] hover:text-[#0078ED] hover:border-[#0078ED] transition"
                title="Cart"
              >
                <CartIcon />
              </button>

              {/* NOTIFICATION */}

              <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="relative w-10 h-10 rounded-lg border border-[#DCE7F2] flex items-center justify-center text-[#536273] hover:text-[#0078ED] hover:border-[#0078ED] transition"
                title="Notifications"
              >
                <BellIcon />

                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0078ED]" />
              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => handleSectionClick("profile")}
                className="hidden sm:flex items-center gap-2 pl-2"
              >
                <ProfileAvatar
                  user={user}
                  firstLetter={firstLetter}
                  size="tiny"
                />

                <div className="hidden md:block max-w-[130px] text-left">
                  <p className="text-sm font-semibold truncate">
                    {user.name || "Customer"}
                  </p>

                  <p className="text-xs text-[#6D7A89]">
                    Customer
                  </p>
                </div>

                <ChevronDownIcon />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section
            id="overview"
            className="scroll-mt-28 mb-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white border border-[#DCE7F2]">

              <div className="absolute right-[-70px] top-[-80px] w-72 h-72 rounded-full bg-[#EAF4FF]" />

              <div className="absolute right-24 bottom-[-110px] w-60 h-60 rounded-full bg-[#F5FAFF]" />

              <div className="relative z-10 p-6 sm:p-8 lg:p-9">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7">

                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF4FF] text-[#0078ED] text-xs font-semibold mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0078ED]" />
                      Welcome to Karodrop
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Welcome back, {user.name || "Customer"}!
                    </h2>

                    <p className="mt-2 text-sm sm:text-base text-[#5E6B7A] leading-6">
                      Manage your brands, designs, products and
                      orders from one simple workspace.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate("/design-request")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467] transition"
                    >
                      <PlusIcon />
                      Create Custom Product
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/search")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#C9DDED] text-[#0B1F3A] text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED] transition"
                    >
                      <ProductsIcon />
                      Explore Products
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            <DashboardStat
              label="Total Orders"
              value={orderCounts.total}
              helper="All your orders"
              icon={<OrdersIcon />}
            />

            <DashboardStat
              label="Design Requests"
              value={designCount}
              helper="Submitted designs"
              icon={<DesignIcon />}
            />

            <DashboardStat
              label="My Brands"
              value={customerBrands.length}
              helper="Connected brands"
              icon={<BrandIcon />}
            />

            <DashboardStat
              label="Products"
              value={productCount}
              helper="Approved products"
              icon={<ProductsIcon />}
            />

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-[#6D7A89]">
                Common actions to manage your business faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <QuickAction
                title="Create Custom Product"
                description="Choose a product, upload your design and submit requirements."
                icon={<PlusIcon />}
                onClick={() => navigate("/design-request")}
                primary
              />

              <QuickAction
                title="Manage Your Brands"
                description="Create and manage multiple brands for your products."
                icon={<BrandIcon />}
                onClick={() => navigate("/brands")}
              />

              <QuickAction
                title="Explore Products"
                description="Browse products available for your dropshipping business."
                icon={<ProductsIcon />}
                onClick={() => navigate("/search")}
              />

            </div>
          </section>

          {/* =================================================
              ORDER OVERVIEW + RECENT ORDERS
          ================================================= */}

          <section className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-5 mb-6">

            {/* ORDER OVERVIEW */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold">
                    Order Overview
                  </h2>

                  <p className="mt-1 text-sm text-[#6D7A89]">
                    Keep track of your order progress.
                  </p>
                </div>

                <span className="text-xs text-[#7A8795]">
                  All time
                </span>
              </div>

              <div className="space-y-5">

                <OrderProgress
                  label="Processing"
                  count={orderCounts.processing}
                  percent={orderProgress.processing}
                />

                <OrderProgress
                  label="Shipped"
                  count={orderCounts.shipped}
                  percent={orderProgress.shipped}
                />

                <OrderProgress
                  label="Delivered"
                  count={orderCounts.delivered}
                  percent={orderProgress.delivered}
                />

                <OrderProgress
                  label="Cancelled"
                  count={orderCounts.cancelled}
                  percent={orderProgress.cancelled}
                />

              </div>

              <div className="mt-7 pt-5 border-t border-[#EEF3F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div>
                  <p className="text-sm font-semibold">
                    {orderCounts.total === 0
                      ? "No orders yet"
                      : `${orderCounts.total} order${orderCounts.total > 1 ? "s" : ""
                      } placed`}
                  </p>

                  <p className="text-xs text-[#6D7A89] mt-1">
                    {orderCounts.total === 0
                      ? "Your order activity will appear here."
                      : "Track your orders and delivery status."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
                >
                  View Orders →
                </button>

              </div>
            </div>

            {/* RECENT ORDERS */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6">

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-[#6D7A89]">
                    Your latest order activity.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  className="text-xs font-semibold text-[#0078ED]"
                >
                  View all
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <EmptyOrders
                  onClick={() => navigate("/search")}
                />
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <RecentOrder
                      key={order.id || order.orderNumber}
                      order={order}
                      getStatusStyle={getStatusStyle}
                    />
                  ))}
                </div>
              )}

            </div>

          </section>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section
            id="products"
            className="scroll-mt-28 bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6 mb-6"
          >

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>
                <h2 className="text-lg font-bold">
                  Products
                </h2>

                <p className="mt-1 text-sm text-[#6D7A89]">
                  Explore products and create products for your brands.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/search")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467] transition"
              >
                <SearchIcon />
                Browse Products
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <ProductCategoryCard
                title="T-Shirts"
                description="Customisable apparel products."
                icon="👕"
                onClick={() => navigate("/category/tshirts")}
              />

              <ProductCategoryCard
                title="Handicrafts"
                description="Unique products for your store."
                icon="🏺"
                onClick={() => navigate("/category/handicrafts")}
              />

              <ProductCategoryCard
                title="Jewellery"
                description="Trending accessories and jewellery."
                icon="💎"
                onClick={() => navigate("/category/jewellery")}
              />

            </div>
          </section>

          {/* =================================================
              DESIGNS
          ================================================= */}

          <section
            id="designs"
            className="scroll-mt-28 bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6 mb-6"
          >

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

              <div>
                <h2 className="text-lg font-bold">
                  Designs
                </h2>

                <p className="mt-1 text-sm text-[#6D7A89]">
                  Track your custom product design requests.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/design-request")}
                className="text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
              >
                + New Design Request
              </button>

            </div>

            {/* DESIGN STATUS */}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">

              <MiniStatus
                label="New"
                value={designStatusCounts.New}
              />

              <MiniStatus
                label="Review"
                value={designStatusCounts["Under Review"]}
              />

              <MiniStatus
                label="Approved"
                value={designStatusCounts.Approved}
              />

              <MiniStatus
                label="Changes"
                value={designStatusCounts["Request Changes"]}
              />

              <MiniStatus
                label="Production"
                value={designStatusCounts["In Production"]}
              />

              <MiniStatus
                label="Completed"
                value={designStatusCounts.Completed}
              />

              <MiniStatus
                label="Rejected"
                value={designStatusCounts.Rejected}
              />

            </div>

            {recentDesigns.length === 0 ? (
              <div className="border border-dashed border-[#CFE0EF] rounded-xl p-8 sm:p-10 text-center">

                <div className="mx-auto w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center mb-4">
                  <DesignIcon />
                </div>

                <h3 className="text-base font-semibold">
                  No designs yet
                </h3>

                <p className="mt-1 max-w-md mx-auto text-sm text-[#6D7A89]">
                  Upload your first design and create a custom
                  product for your brand.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/design-request")}
                  className="mt-5 px-4 py-2.5 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467]"
                >
                  Create Your First Design
                </button>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <div className="min-w-[700px]">

                  <div className="grid grid-cols-[2fr_1.3fr_1fr_1.1fr] gap-4 px-4 py-3 bg-[#F5FAFF] rounded-lg text-xs font-semibold text-[#5E6B7A] uppercase tracking-wide">
                    <span>Design / Product</span>
                    <span>Brand</span>
                    <span>Quantity</span>
                    <span>Status</span>
                  </div>

                  <div className="divide-y divide-[#EEF3F8]">

                    {recentDesigns.map((design) => (
                      <div
                        key={design.id}
                        className="grid grid-cols-[2fr_1.3fr_1fr_1.1fr] gap-4 items-center px-4 py-4"
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-11 h-11 rounded-lg bg-[#F5FAFF] border border-[#E2EDF6] overflow-hidden flex items-center justify-center shrink-0">

                            {design.designImage ? (
                              <img
                                src={design.designImage}
                                alt={design.fileName || "Design"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <DesignIcon />
                            )}

                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {design.productName || "Custom Product"}
                            </p>

                            <p className="text-xs text-[#6D7A89] truncate">
                              {design.fileName || "Custom design"}
                            </p>
                          </div>

                        </div>

                        <p className="text-sm text-[#425466] truncate">
                          {design.brandName || "My Brand"}
                        </p>

                        <p className="text-sm font-semibold">
                          {design.quantity || 0}
                        </p>

                        <span
                          className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                            design.status
                          )}`}
                        >
                          {design.status || "New"}
                        </span>

                      </div>
                    ))}

                  </div>
                </div>
              </div>
            )}

          </section>

          {/* =================================================
              BRANDS + CUSTOM PRODUCT
          ================================================= */}

          <section
            id="brands"
            className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"
          >

            {/* BRANDS */}

            <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4 mb-6">

                <div>
                  <h2 className="text-lg font-bold">
                    My Brands
                  </h2>

                  <p className="mt-1 text-sm text-[#6D7A89]">
                    Manage brands connected to your products.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                  <BrandIcon />
                </div>

              </div>

              {customerBrands.length === 0 ? (
                <div className="py-6 text-center">

                  <p className="text-sm font-semibold">
                    No brands added yet
                  </p>

                  <p className="mt-1 text-xs text-[#6D7A89]">
                    Create your first brand to start building products.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/brands")}
                    className="mt-4 px-4 py-2.5 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467]"
                  >
                    Add Your Brand
                  </button>

                </div>
              ) : (
                <div className="space-y-3">

                  {customerBrands.slice(0, 3).map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FBFE] border border-[#E7F0F7]"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center text-[#0078ED] font-bold overflow-hidden shrink-0">

                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            String(brand.name || "B")
                              .charAt(0)
                              .toUpperCase()
                          )}

                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {brand.name}
                          </p>

                          <p className="text-xs text-[#6D7A89] truncate">
                            {brand.category || "Brand"}
                          </p>
                        </div>

                      </div>

                      <span className="shrink-0 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        Active
                      </span>

                    </div>
                  ))}

                </div>
              )}

              <button
                type="button"
                onClick={() => navigate("/brands")}
                className="w-full mt-5 py-2.5 rounded-lg border border-[#CFE0EF] text-[#0078ED] text-sm font-semibold hover:bg-[#EAF4FF] hover:border-[#0078ED]"
              >
                Manage All Brands
              </button>

            </div>

            {/* CUSTOM PRODUCT CTA */}

            <div className="relative overflow-hidden rounded-2xl bg-[#012467] text-white p-6 sm:p-7">

              <div className="absolute right-[-50px] top-[-50px] w-44 h-44 rounded-full bg-[#0078ED]/30" />

              <div className="absolute right-10 bottom-[-70px] w-32 h-32 rounded-full bg-white/5" />

              <div className="relative z-10">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <PlusIcon />
                </div>

                <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  Custom Product
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Turn your design into a product
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/70 max-w-md">
                  Choose your brand, select a product, upload your
                  design and send your requirements to Karodrop.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/design-request")}
                  className="mt-6 px-5 py-3 rounded-lg bg-white text-[#012467] text-sm font-semibold hover:bg-[#EAF4FF] transition"
                >
                  Start Creating →
                </button>

              </div>
            </div>

          </section>

          {/* =================================================
              PROFILE
          ================================================= */}

          <section
            id="profile"
            className="scroll-mt-28 bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6 mb-6"
          >

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div className="flex items-center gap-4">

                <ProfileAvatar
                  user={user}
                  firstLetter={firstLetter}
                  size="large"
                />

                <div>
                  <p className="text-lg font-bold">
                    {user.name || "Customer"}
                  </p>

                  <p className="text-sm text-[#6D7A89] mt-1">
                    {user.email || "No email available"}
                  </p>

                  <span className="inline-flex mt-2 px-2.5 py-1 rounded-full bg-[#EAF4FF] text-[#0078ED] text-xs font-semibold">
                    Customer Account
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() => handleSectionClick("settings")}
                className="px-4 py-2.5 rounded-lg border border-[#CFE0EF] text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED]"
              >
                Account Settings
              </button>

            </div>

          </section>

          {/* =================================================
              SETTINGS
          ================================================= */}

          <section
            id="settings"
            className="scroll-mt-28 bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6 mb-6"
          >

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                <SettingsIcon />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Account Settings
                </h2>

                <p className="text-sm text-[#6D7A89] mt-1">
                  Manage your account information.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <SettingRow
                title="Name"
                value={user.name || "Customer"}
              />

              <SettingRow
                title="Email"
                value={user.email || "Not available"}
              />

            </div>

          </section>

          {/* FOOTER */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 text-xs text-[#7A8795]">

            <p>
              © {new Date().getFullYear()} Karodrop. All rights reserved.
            </p>

            <p>
              Your dropshipping business, simplified.
            </p>

          </div>

        </main>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE AVATAR
========================================================= */

function ProfileAvatar({ user, firstLetter, size = "small" }) {
  const sizeClasses = {
    tiny: "w-9 h-9 text-sm",
    small: "w-10 h-10 text-sm",
    large: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-[#EAF4FF] border border-[#D7E8F6] flex items-center justify-center shrink-0`}
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name || "Customer"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-bold text-[#0078ED]">
          {firstLetter}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  label,
  icon,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${active
        ? "bg-[#EAF4FF] text-[#0078ED]"
        : "text-[#59697A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
        }`}
    >
      <span
        className={`shrink-0 ${active ? "text-[#0078ED]" : "text-[#748294]"
          }`}
      >
        {icon}
      </span>

      <span>{label}</span>

      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0078ED]" />
      )}
    </button>
  );
}

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  label,
  value,
  helper,
  icon,
}) {
  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 hover:border-[#BFD9EE] transition">
      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-sm font-medium text-[#6D7A89]">
            {label}
          </p>

          <p className="mt-2 text-2xl sm:text-3xl font-bold">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#8A96A3]">
            {helper}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
          {icon}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  title,
  description,
  icon,
  onClick,
  primary = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left bg-white border rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-sm ${primary
        ? "border-[#0078ED]"
        : "border-[#DCE7F2] hover:border-[#BFD9EE]"
        }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${primary
          ? "bg-[#0078ED] text-white"
          : "bg-[#EAF4FF] text-[#0078ED] group-hover:bg-[#0078ED] group-hover:text-white"
          }`}
      >
        {icon}
      </div>

      <h3 className="text-base font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 text-sm leading-5 text-[#6D7A89]">
        {description}
      </p>

      <span className="inline-block mt-4 text-sm font-semibold text-[#0078ED]">
        Open →
      </span>
    </button>
  );
}

/* =========================================================
   ORDER PROGRESS
========================================================= */

function OrderProgress({
  label,
  count,
  percent,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">

        <span className="text-sm font-medium text-[#425466]">
          {label}
        </span>

        <span className="text-sm font-semibold">
          {count}
        </span>

      </div>

      <div className="h-2 bg-[#EEF4F9] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0078ED] rounded-full transition-all"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   RECENT ORDER
========================================================= */

function RecentOrder({
  order,
  getStatusStyle,
}) {
  const orderNumber =
    order.orderNumber ||
    order.id ||
    "Order";

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const firstItem = items[0];

  const productName =
    firstItem?.title ||
    firstItem?.productName ||
    firstItem?.name ||
    order.productName ||
    "Order";

  const itemCount = items.reduce(
    (total, item) =>
      total +
      Number(item.qty || item.quantity || 1),
    0
  );

  const total = Number(
    order.total ||
    order.amount ||
    order.totalAmount ||
    0
  );

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FBFE] border border-[#E7F0F7]">

      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">
          {orderNumber}
        </p>

        <p className="text-xs text-[#6D7A89] truncate mt-1">
          {productName}
          {itemCount > 1
            ? ` + ${itemCount - 1} more`
            : ""}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">
          {formatCurrency(total)}
        </p>

        <span
          className={`inline-flex mt-1 px-2 py-1 rounded-full border text-[10px] font-semibold ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status || "Order Placed"}
        </span>
      </div>

    </div>
  );
}

/* =========================================================
   EMPTY ORDERS
========================================================= */

function EmptyOrders({ onClick }) {
  return (
    <div className="h-[250px] flex flex-col items-center justify-center text-center border border-dashed border-[#D6E4EF] rounded-xl bg-[#FBFDFF]">

      <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center mb-4">
        <OrdersIcon />
      </div>

      <h3 className="text-sm font-semibold">
        No recent orders
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-[#7A8795]">
        Once you place an order, its status and details
        will appear here.
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 text-xs font-semibold text-[#0078ED]"
      >
        Explore Products →
      </button>
    </div>
  );
}

/* =========================================================
   PRODUCT CATEGORY CARD
========================================================= */

function ProductCategoryCard({
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left p-5 rounded-xl border border-[#E1ECF5] bg-[#F8FBFE] hover:border-[#0078ED] hover:bg-white transition"
    >
      <div className="w-11 h-11 rounded-xl bg-white border border-[#E1ECF5] flex items-center justify-center text-xl mb-4 group-hover:bg-[#EAF4FF]">
        {icon}
      </div>

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#6D7A89]">
        {description}
      </p>

      <span className="inline-block mt-4 text-xs font-semibold text-[#0078ED]">
        Browse →
      </span>
    </button>
  );
}

/* =========================================================
   MINI STATUS
========================================================= */

function MiniStatus({
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-[#F8FBFE] border border-[#E7F0F7]">
      <p className="text-xs text-[#6D7A89]">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SETTINGS ROW
========================================================= */

function SettingRow({
  title,
  value,
}) {
  return (
    <div className="p-4 rounded-xl bg-[#F8FBFE] border border-[#E7F0F7]">

      <p className="text-xs font-medium text-[#7A8795]">
        {title}
      </p>

      <p className="mt-1 text-sm font-semibold break-all">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
}

/* =========================================================
   ICONS
========================================================= */

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function BrandIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M6 7v13h12V7" />
      <path d="M8 7V4h8v3" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  );
}

function IntegrationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12H16M12 8V16M5 5H9V9H5V5ZM15 5H19V9H15V5ZM5 15H9V19H5V15ZM15 15H19V19H15V15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.3v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.8c-.9.8-1.8 1.2-1.8 2.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
import React, { useEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   ICONS
   No external icon library required
========================================================= */

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13h6V4H4v9Z" />
      <path d="M14 20h6v-7h-6v7Z" />
      <path d="M14 10h6V4h-6v6Z" />
      <path d="M4 20h6v-3H4v3Z" />
    </svg>
  ),

  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),

  inventory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5 12 4l8 3.5-8 3-8-3Z" />
      <path d="M4 12.5 12 16l8-3.5M4 17l8 3 8-3" />
    </svg>
  ),

  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),

  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h16" />
      <path d="M5 10v9h14v-9" />
      <path d="M4 10 6 5h12l2 5" />
      <path d="M9 19v-5h6v5" />
    </svg>
  ),

  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3 2.3-5 5.5-5s5 2 5.5 5" />
      <path d="M16 11a3 3 0 1 0 0-6" />
      <path d="M17 14c2 .3 3.2 1.9 3.5 4" />
    </svg>
  ),

  earnings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M15 9.5c0-1.2-1.2-2-3-2s-3 .8-3 2 1.2 2 3 2 3 .8 3 2-1.2 2-3 2-3-.8-3-2" />
    </svg>
  ),

  payouts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M7 12h10M8 9h2M14 15h2" />
    </svg>
  ),

  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 19V10M12 19V5M19 19v-7" />
      <path d="M3 19h18" />
    </svg>
  ),

  designs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m5 17 5-5 3 3 2-2 4 4" />
    </svg>
  ),

  notifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),

  help: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.8-1.7 1.2-1.7 2.7" />
      <path d="M12 17h.01" />
    </svg>
  ),

  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6v-2.6h.5A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),

  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),

  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),

  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),
};

/* =========================================================
   SIDEBAR MENU
========================================================= */

const mainMenu = [
  {
    label: "Dashboard",
    path: "/seller/dashboard",
    icon: icons.dashboard,
  },
  {
    label: "Products",
    path: "/seller/products",
    icon: icons.products,
  },
  {
    label: "Inventory",
    path: "/seller/inventory",
    icon: icons.inventory,
  },
  {
    label: "Orders",
    path: "/seller/orders",
    icon: icons.orders,
  },
  {
    label: "My Store",
    path: "/seller/store",
    icon: icons.store,
  },
  {
    label: "Customers",
    path: "/seller/customers",
    icon: icons.customers,
  },
  {
    label: "Earnings",
    path: "/seller/earnings",
    icon: icons.earnings,
  },
  {
    label: "Payouts",
    path: "/seller/payouts",
    icon: icons.payouts,
  },
  {
    label: "Analytics",
    path: "/seller/analytics",
    icon: icons.analytics,
  },
  {
    label: "Designs",
    path: "/seller/designs",
    icon: icons.designs,
  },
  {
    label: "Notifications",
    path: "/seller/notifications",
    icon: icons.notifications,
  },
];

const bottomMenu = [
  {
    label: "Help & Support",
    path: "/seller/help",
    icon: icons.help,
  },
  {
    label: "Settings",
    path: "/seller/settings",
    icon: icons.settings,
  },
];

/* =========================================================
   SELLER LAYOUT
========================================================= */

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [seller, setSeller] = useState(null);

  /* =======================================================
     LOAD SELLER
  ======================================================= */

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("karodrop-user");

      if (savedUser) {
        setSeller(JSON.parse(savedUser));
      }
    } catch {
      setSeller(null);
    }
  }, []);

  /* =======================================================
     CLOSE MOBILE SIDEBAR ON PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* =======================================================
     KEEP SELLER CONTENT AT TOP
     
     Important:
     Main seller area is its own scroll container.
     This prevents browser/window auto-scroll issues.
  ======================================================= */

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("karodrop-user");

    window.dispatchEvent(new Event("userChanged"));

    navigate("/login", {
      replace: true,
    });
  };

  /* =======================================================
     SELLER NAME
  ======================================================= */

  const sellerName = seller?.name || "Seller";

  const sellerInitial = sellerName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#F5FAFF]">

      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[110] bg-black/30 lg:hidden"
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[120]
          flex
          w-[296px]
          flex-col
          border-r
          border-[#DCE7F2]
          bg-white
          transition-transform
          duration-300
          lg:static
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ===============================================
            LOGO AREA
        ================================================ */}

        <div className="flex h-[92px] shrink-0 items-center justify-between border-b border-[#DCE7F2] px-7">

          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="flex items-center"
          >
            <img
              src="/images/Karodrop-logo.png"
              alt="Karodrop"
              className="h-auto max-h-[58px] w-auto max-w-[180px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <span className="hidden text-xl font-bold tracking-tight text-[#012467]">
              Karodrop
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0B1F3A] hover:bg-[#F5FAFF] lg:hidden"
          >
            <span className="h-5 w-5">
              {icons.close}
            </span>
          </button>

        </div>

        {/* ===============================================
            SIDEBAR CONTENT
            scrollbar hidden
        ================================================ */}

        <div className="seller-scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">

          <div className="px-3 pb-3 pt-7">

            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5E6B7A]">
              Seller Panel
            </p>

            <nav className="mt-4 space-y-1">

              {mainMenu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/seller/dashboard"}
                  className={({ isActive }) => `
                    group
                    flex
                    min-h-[52px]
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    text-[15px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#EAF4FF] text-[#0078ED] shadow-sm"
                        : "text-[#0B1F3A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          transition
                          ${
                            isActive
                              ? "text-[#0078ED]"
                              : "text-[#0B1F3A]"
                          }
                        `}
                      >
                        {item.icon}
                      </span>

                      <span className="truncate">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[#0078ED]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

            </nav>
          </div>

          {/* =============================================
              BOTTOM MENU
          ============================================== */}

          <div className="mt-auto px-3 pb-4">

            <div className="mb-3 border-t border-[#DCE7F2]" />

            <nav className="space-y-1">

              {bottomMenu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    group
                    flex
                    min-h-[50px]
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    text-[15px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#EAF4FF] text-[#0078ED] shadow-sm"
                        : "text-[#0B1F3A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex
                          h-5
                          w-5
                          shrink-0
                          ${
                            isActive
                              ? "text-[#0078ED]"
                              : "text-[#0B1F3A]"
                          }
                        `}
                      >
                        {item.icon}
                      </span>

                      <span>
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[#0078ED]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}

            </nav>

            {/* =========================================
                HELP CARD
            ========================================== */}

            <div className="mt-4 rounded-2xl bg-[#F1F8FF] p-4">

              <p className="text-sm font-semibold text-[#0B1F3A]">
                Need Help?
              </p>

              <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                Contact Karodrop support for seller assistance.
              </p>

              <button
                type="button"
                onClick={() => navigate("/seller/help")}
                className="mt-3 text-xs font-bold text-[#0078ED] hover:underline"
              >
                Contact Support →
              </button>

            </div>

          </div>

        </div>

      </aside>

      {/* ===================================================
          RIGHT SIDE
      =================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="z-50 flex h-[92px] shrink-0 items-center justify-between border-b border-[#DCE7F2] bg-white px-4 sm:px-6 lg:px-9">

          {/* LEFT HEADER */}

          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE7F2] text-[#0B1F3A] hover:bg-[#F5FAFF] lg:hidden"
            >
              <span className="h-5 w-5">
                {icons.menu}
              </span>
            </button>

            <div className="min-w-0">

              <p className="text-xs font-medium text-[#5E6B7A]">
                Seller Panel
              </p>

              <h1 className="truncate text-lg font-semibold text-[#0B1F3A] sm:text-xl">
                Welcome back, {sellerName}
              </h1>

            </div>

          </div>

          {/* RIGHT HEADER */}

          <div className="flex shrink-0 items-center gap-3">

            {/* Notifications */}

            <button
              type="button"
              onClick={() => navigate("/seller/notifications")}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE7F2] text-[#0B1F3A] transition hover:border-[#0078ED] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
              title="Notifications"
            >
              <span className="h-5 w-5">
                {icons.bell}
              </span>

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0078ED]" />
            </button>

            {/* Profile */}

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-2 rounded-full border border-[#DCE7F2] bg-white px-2 py-1.5 transition hover:border-[#0078ED] hover:bg-[#F5FAFF]"
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF] text-sm font-bold text-[#0078ED]">
                {sellerInitial}
              </span>

              <span className="hidden max-w-[110px] truncate text-sm font-medium text-[#0B1F3A] sm:block">
                {sellerName}
              </span>

            </button>

          </div>

        </header>

        {/* =================================================
            MAIN CONTENT
            ONLY THIS AREA SCROLLS
        ================================================= */}

        <main
          ref={mainRef}
          className="seller-scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden bg-[#F5FAFF]"
        >

          <div className="min-h-full p-4 sm:p-6 lg:p-8">

            <Outlet />

          </div>

        </main>

      </div>

      {/* ===================================================
          HIDE SCROLLBAR
      =================================================== */}

      <style>
        {`
          .seller-scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .seller-scrollbar-hide::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          html,
          body {
            scrollbar-width: auto;
          }
        `}
      </style>

    </div>
  );
}
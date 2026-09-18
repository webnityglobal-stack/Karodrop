import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const USERS_KEY = "karodrop-users";
const BRANDS_KEY = "karodrop-brands";
const ORDERS_KEY = "karodrop-orders";
const DESIGNS_KEY = "karodrop-design-requests";

const getStorageData = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getUserKey = (user) => {
  return String(user?.id || user?.email || "").toLowerCase();
};

const getOwnerKey = (item) => {
  return String(
    item?.customerId ||
      item?.userId ||
      item?.customerEmail ||
      item?.userEmail ||
      item?.email ||
      ""
  ).toLowerCase();
};

const getOrderAmount = (order) => {
  return Number(
    order?.grandTotal ??
      order?.total ??
      order?.totalAmount ??
      order?.payableAmount ??
      order?.amount ??
      0
  );
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.products)) return order.products;
  return [];
};

const getStatusLabel = (status) => {
  if (!status) return "Active";

  const normalized = String(status).toLowerCase();

  if (
    normalized.includes("inactive") ||
    normalized.includes("blocked") ||
    normalized.includes("suspend")
  ) {
    return "Inactive";
  }

  return "Active";
};

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h3a6 6 0 0 0 0-12h-3Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="6.5" r="1" />
      <circle cx="15" cy="6.5" r="1" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function StatCard({ label, value, icon, small }) {
  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#5E6B7A]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {small ? value : value}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#EDF2F7] last:border-b-0">
      <div className="w-9 h-9 rounded-lg bg-[#F5FAFF] text-[#0078ED] flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-[#7A8795]">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-[#0B1F3A] break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadData = () => {
    setUsers(getStorageData(USERS_KEY));
    setBrands(getStorageData(BRANDS_KEY));
    setOrders(getStorageData(ORDERS_KEY));
    setDesigns(getStorageData(DESIGNS_KEY));
  };

  useEffect(() => {
    loadData();

    const events = [
      "storage",
      "userChanged",
      "ordersUpdated",
      "brandsUpdated",
      "designRequestsUpdated",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, loadData);
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, loadData);
      });
    };
  }, []);

  const customerRows = useMemo(() => {
    return users
      .filter((user) => {
        const role = String(user?.role || "customer").toLowerCase();

        // Admin should never appear in customer management.
        return role !== "admin";
      })
      .map((user) => {
        const userKey = getUserKey(user);

        const userBrands = brands.filter((brand) => {
          return getOwnerKey(brand) === userKey;
        });

        const userOrders = orders.filter((order) => {
          return getOwnerKey(order) === userKey;
        });

        const userDesigns = designs.filter((design) => {
          return getOwnerKey(design) === userKey;
        });

        const totalSpent = userOrders.reduce(
          (sum, order) => sum + getOrderAmount(order),
          0
        );

        const role =
          String(user?.role || "customer").toLowerCase() === "seller"
            ? "Seller"
            : "Customer";

        return {
          ...user,
          role,
          userKey,
          brands: userBrands,
          orders: userOrders,
          designs: userDesigns,
          totalSpent,
          status: getStatusLabel(user?.status),
        };
      });
  }, [users, brands, orders, designs]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customerRows.filter((customer) => {
      const matchesRole =
        roleFilter === "All" || customer.role === roleFilter;

      if (!matchesRole) return false;

      if (!query) return true;

      return (
        String(customer.name || "")
          .toLowerCase()
          .includes(query) ||
        String(customer.email || "")
          .toLowerCase()
          .includes(query) ||
        String(customer.phone || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [customerRows, search, roleFilter]);

  const totalCustomers = customerRows.filter(
    (customer) => customer.role === "Customer"
  ).length;

  const totalSellers = customerRows.filter(
    (customer) => customer.role === "Seller"
  ).length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + getOrderAmount(order),
    0
  );

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* Header */}
      <header className="bg-white border-b border-[#DCE7F2]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#DCE7F2] bg-white text-[#536273] hover:border-[#0078ED] hover:text-[#0078ED] transition"
                  title="Back to Dashboard"
                >
                  ←
                </Link>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0078ED]">
                    Admin Panel
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                    Customers
                  </h1>
                </div>
              </div>

              <p className="mt-2 text-sm text-[#5E6B7A]">
                Manage registered customers, sellers, brands, orders and
                designs.
              </p>
            </div>

            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE7F2] bg-white text-sm font-semibold text-[#536273] hover:border-[#0078ED] hover:text-[#0078ED] transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Customers"
            value={totalCustomers}
            icon={<UserIcon />}
          />

          <StatCard
            label="Total Sellers"
            value={totalSellers}
            icon={<BriefcaseIcon />}
          />

          <StatCard
            label="Total Orders"
            value={totalOrders}
            icon={<ShoppingBagIcon />}
          />

          <StatCard
            label="Total Order Value"
            value={formatCurrency(totalRevenue)}
            icon={<span className="font-bold text-lg">₹</span>}
          />
        </div>

        {/* Main card */}
        <section className="bg-white border border-[#DCE7F2] rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-[#EDF2F7]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">All Customers</h2>
                <p className="text-sm text-[#6B7785] mt-1">
                  {filteredCustomers.length}{" "}
                  {filteredCustomers.length === 1
                    ? "account"
                    : "accounts"}{" "}
                  found
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8795]">
                    <SearchIcon />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or phone..."
                    className="w-full sm:w-[280px] pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7F2] bg-white text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                  />
                </div>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#DCE7F2] bg-white text-sm font-medium outline-none focus:border-[#0078ED]"
                >
                  <option value="All">All Roles</option>
                  <option value="Customer">Customers</option>
                  <option value="Seller">Sellers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5FAFF] border-b border-[#DCE7F2]">
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Customer
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Role
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Contact
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Brands
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Orders
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Order Value
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Joined
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#667586]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.userKey}
                      className="border-b border-[#EDF2F7] last:border-b-0 hover:bg-[#F9FCFF] transition"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center font-bold shrink-0">
                            {String(customer.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate max-w-[180px]">
                              {customer.name || "Unnamed User"}
                            </p>

                            <p className="text-xs text-[#7A8795] truncate max-w-[180px]">
                              {customer.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                            customer.role === "Seller"
                              ? "bg-[#F0F7FF] text-[#005FCC]"
                              : "bg-[#EEF8F4] text-[#167A57]"
                          }`}
                        >
                          {customer.role}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#3F4D5D]">
                          {customer.phone || "—"}
                        </p>
                      </td>

                      {/* Brands */}
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold">
                          {customer.brands.length}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold">
                          {customer.orders.length}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-5 py-4">
                        <span className="font-semibold">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#5E6B7A]">
                          {formatDate(
                            customer.createdAt ||
                              customer.registeredAt ||
                              customer.created_at
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#167A57]">
                          <span className="w-2 h-2 rounded-full bg-[#22A06B]" />
                          {customer.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openCustomer(customer)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0078ED] text-white text-xs font-bold hover:bg-[#012467] transition"
                        >
                          View
                          <ChevronRightIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                          <UserIcon />
                        </div>

                        <h3 className="mt-4 font-bold text-lg">
                          No customers found
                        </h3>

                        <p className="mt-1 text-sm text-[#6B7785]">
                          Try changing your search or role filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet cards */}
          <div className="lg:hidden p-4 space-y-3">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.userKey}
                  className="border border-[#DCE7F2] rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center font-bold shrink-0">
                        {String(customer.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold truncate">
                          {customer.name || "Unnamed User"}
                        </h3>

                        <p className="text-xs text-[#7A8795] truncate">
                          {customer.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        customer.role === "Seller"
                          ? "bg-[#F0F7FF] text-[#005FCC]"
                          : "bg-[#EEF8F4] text-[#167A57]"
                      }`}
                    >
                      {customer.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-[#F5FAFF] rounded-xl p-3">
                      <p className="text-xs text-[#7A8795]">Brands</p>
                      <p className="mt-1 font-bold">
                        {customer.brands.length}
                      </p>
                    </div>

                    <div className="bg-[#F5FAFF] rounded-xl p-3">
                      <p className="text-xs text-[#7A8795]">Orders</p>
                      <p className="mt-1 font-bold">
                        {customer.orders.length}
                      </p>
                    </div>

                    <div className="bg-[#F5FAFF] rounded-xl p-3">
                      <p className="text-xs text-[#7A8795]">Designs</p>
                      <p className="mt-1 font-bold">
                        {customer.designs.length}
                      </p>
                    </div>

                    <div className="bg-[#F5FAFF] rounded-xl p-3">
                      <p className="text-xs text-[#7A8795]">Order Value</p>
                      <p className="mt-1 font-bold text-sm">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#EDF2F7]">
                    <div>
                      <p className="text-xs text-[#7A8795]">Joined</p>
                      <p className="text-sm font-semibold">
                        {formatDate(
                          customer.createdAt ||
                            customer.registeredAt ||
                            customer.created_at
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCustomer(customer)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0078ED] text-white text-xs font-bold hover:bg-[#012467] transition"
                    >
                      View Details
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center">
                  <UserIcon />
                </div>

                <h3 className="mt-4 font-bold text-lg">
                  No customers found
                </h3>

                <p className="mt-1 text-sm text-[#6B7785]">
                  Try changing your search or role filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1F3A]/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#DCE7F2] px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center font-bold shrink-0">
                  {String(selectedCustomer.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    {selectedCustomer.name || "Unnamed User"}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6B7785] truncate">
                    {selectedCustomer.email || "No email"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-9 h-9 rounded-lg border border-[#DCE7F2] text-[#536273] flex items-center justify-center hover:border-[#0078ED] hover:text-[#0078ED] transition shrink-0"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Customer basic info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 border border-[#DCE7F2] rounded-2xl p-4">
                  <h3 className="font-bold text-base mb-2">
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <InfoRow
                      icon={<UserIcon />}
                      label="Full Name"
                      value={selectedCustomer.name}
                    />

                    <InfoRow
                      icon={<MailIcon />}
                      label="Email"
                      value={selectedCustomer.email}
                    />

                    <InfoRow
                      icon={<PhoneIcon />}
                      label="Phone"
                      value={selectedCustomer.phone}
                    />

                    <InfoRow
                      icon={<BriefcaseIcon />}
                      label="Account Type"
                      value={selectedCustomer.role}
                    />

                    <InfoRow
                      icon={<span className="font-bold">✓</span>}
                      label="Status"
                      value={selectedCustomer.status}
                    />

                    <InfoRow
                      icon={<span className="font-bold">📅</span>}
                      label="Joined"
                      value={formatDate(
                        selectedCustomer.createdAt ||
                          selectedCustomer.registeredAt ||
                          selectedCustomer.created_at
                      )}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="border border-[#DCE7F2] rounded-2xl p-4">
                  <h3 className="font-bold text-base mb-3">
                    Account Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7785]">Brands</span>
                      <span className="font-bold">
                        {selectedCustomer.brands.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7785]">Orders</span>
                      <span className="font-bold">
                        {selectedCustomer.orders.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7785]">Designs</span>
                      <span className="font-bold">
                        {selectedCustomer.designs.length}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Order Value
                      </span>
                      <span className="font-bold text-[#0078ED]">
                        {formatCurrency(selectedCustomer.totalSpent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="mt-5 border border-[#DCE7F2] rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold">Brands</h3>
                    <p className="text-xs text-[#7A8795] mt-1">
                      Brands owned by this customer.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF4FF] text-[#0078ED]">
                    {selectedCustomer.brands.length}
                  </span>
                </div>

                {selectedCustomer.brands.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedCustomer.brands.map((brand, index) => (
                      <div
                        key={brand.id || brand._id || `${brand.name}-${index}`}
                        className="border border-[#EDF2F7] rounded-xl p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F5FAFF] border border-[#DCE7F2] flex items-center justify-center overflow-hidden">
                            {brand.logo ? (
                              <img
                                src={brand.logo}
                                alt={brand.name || "Brand"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-bold text-[#0078ED]">
                                {String(brand.name || "B")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {brand.name || "Unnamed Brand"}
                            </p>

                            <p className="text-xs text-[#7A8795] truncate">
                              {brand.category || "Brand"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#7A8795] py-3">
                    No brands added yet.
                  </p>
                )}
              </div>

              {/* Orders */}
              <div className="mt-5 border border-[#DCE7F2] rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold">Orders</h3>
                    <p className="text-xs text-[#7A8795] mt-1">
                      Orders placed by this customer.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF4FF] text-[#0078ED]">
                    {selectedCustomer.orders.length}
                  </span>
                </div>

                {selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.orders.slice(0, 10).map((order, index) => {
                      const items = getOrderItems(order);

                      return (
                        <div
                          key={
                            order.id ||
                            order.orderNumber ||
                            order._id ||
                            index
                          }
                          className="border border-[#EDF2F7] rounded-xl p-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">
                                {order.orderNumber ||
                                  order.orderId ||
                                  `Order #${index + 1}`}
                              </p>

                              <p className="text-xs text-[#7A8795] mt-1">
                                {formatDate(
                                  order.createdAt ||
                                    order.orderDate ||
                                    order.date
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5FAFF] text-[#536273]">
                                {order.status || "Order Placed"}
                              </span>

                              <span className="font-bold text-sm">
                                {formatCurrency(getOrderAmount(order))}
                              </span>
                            </div>
                          </div>

                          {items.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-[#EDF2F7]">
                              <p className="text-xs text-[#7A8795]">
                                {items.length} product
                                {items.length !== 1 ? "s" : ""}
                              </p>

                              <div className="mt-2 space-y-1">
                                {items.slice(0, 3).map((item, itemIndex) => (
                                  <p
                                    key={itemIndex}
                                    className="text-sm text-[#3F4D5D]"
                                  >
                                    {item.productName ||
                                      item.title ||
                                      item.name ||
                                      "Product"}{" "}
                                    ×{" "}
                                    {item.quantity || item.qty || 1}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#7A8795] py-3">
                    No orders placed yet.
                  </p>
                )}
              </div>

              {/* Designs */}
              <div className="mt-5 border border-[#DCE7F2] rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold">Design Requests</h3>
                    <p className="text-xs text-[#7A8795] mt-1">
                      Designs submitted by this customer.
                    </p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF4FF] text-[#0078ED]">
                    {selectedCustomer.designs.length}
                  </span>
                </div>

                {selectedCustomer.designs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedCustomer.designs.slice(0, 9).map((design, index) => (
                      <div
                        key={
                          design.id ||
                          design.requestId ||
                          design._id ||
                          index
                        }
                        className="border border-[#EDF2F7] rounded-xl p-3"
                      >
                        {design.designImage || design.image ? (
                          <img
                            src={design.designImage || design.image}
                            alt={design.designName || "Design"}
                            className="w-full h-32 object-cover rounded-lg bg-[#F5FAFF]"
                          />
                        ) : (
                          <div className="w-full h-32 rounded-lg bg-[#F5FAFF] text-[#0078ED] flex items-center justify-center">
                            <PaletteIcon />
                          </div>
                        )}

                        <div className="mt-3">
                          <p className="font-semibold text-sm truncate">
                            {design.designName ||
                              design.designFileName ||
                              design.fileName ||
                              "Custom Design"}
                          </p>

                          <p className="text-xs text-[#7A8795] mt-1">
                            {design.status || "New"}
                          </p>

                          {design.productName || design.product ? (
                            <p className="text-xs text-[#5E6B7A] mt-1 truncate">
                              {design.productName || design.product}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#7A8795] py-3">
                    No design requests yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
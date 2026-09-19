import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =======================================================
   ICONS
======================================================= */

const SearchIcon = () => (
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

const ArrowLeftIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const UsersIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
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

const StoreIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l1-5h16l1 5" />
    <path d="M5 9v11h14V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const UserCheckIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
    <path d="m16 19 2 2 4-4" />
  </svg>
);

const ClockIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const EyeIcon = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const XIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/* =======================================================
   CONSTANTS
======================================================= */

const STORAGE_KEY = "karodrop-users";

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  accentBlue: "#0087F5",
  lightBlue: "#EAF4FF",
  background: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
};

/* =======================================================
   HELPERS
======================================================= */

const getUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read users:", error);
    return [];
  }
};

const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase();

  if (value === "reseller") return "reseller";
  if (value === "seller") return "seller";

  return "";
};

const getDisplayName = (user) => {
  if (user?.name) return user.name;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  if (fullName) return fullName;

  return user?.email?.split("@")[0] || "Unnamed User";
};

const getBusinessName = (user) => {
  return (
    user?.businessName ||
    user?.storeName ||
    user?.shopName ||
    user?.companyName ||
    "—"
  );
};

const getPhone = (user) => {
  return user?.phone || user?.mobile || user?.phoneNumber || "—";
};

const getJoinedDate = (user) => {
  const dateValue =
    user?.createdAt ||
    user?.joinedAt ||
    user?.registeredAt ||
    user?.dateJoined;

  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isUserActive = (user) => {
  if (typeof user?.isActive === "boolean") {
    return user.isActive;
  }

  const status = String(user?.status || "").toLowerCase();

  if (status === "inactive" || status === "disabled") {
    return false;
  }

  return true;
};

const getStatus = (user) => {
  if (user?.status) {
    const status = String(user.status).toLowerCase();

    if (status === "pending") return "pending";
    if (status === "inactive" || status === "disabled") {
      return "inactive";
    }
  }

  return isUserActive(user) ? "active" : "inactive";
};

const formatRole = (role) => {
  return role === "reseller" ? "Reseller" : "Seller";
};

/* =======================================================
   STAT CARD
======================================================= */

function StatCard({ title, value, icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#5E6B7A]">{title}</p>

          <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: iconBg,
            color: COLORS.blue,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   SELLERS PAGE
======================================================= */

export default function Sellers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  /* =====================================================
     LOAD USERS
  ===================================================== */

  const loadUsers = () => {
    const allUsers = getUsers();

    const sellerUsers = allUsers.filter((user) => {
      const role = normalizeRole(user?.role);
      return role === "seller" || role === "reseller";
    });

    setUsers(sellerUsers);
  };

  useEffect(() => {
    loadUsers();

    const handleUsersUpdated = () => {
      loadUsers();
    };

    window.addEventListener("storage", handleUsersUpdated);
    window.addEventListener("usersUpdated", handleUsersUpdated);
    window.addEventListener("userChanged", handleUsersUpdated);

    return () => {
      window.removeEventListener("storage", handleUsersUpdated);
      window.removeEventListener("usersUpdated", handleUsersUpdated);
      window.removeEventListener("userChanged", handleUsersUpdated);
    };
  }, []);

  /* =====================================================
     COUNTS
  ===================================================== */

  const stats = useMemo(() => {
    const total = users.length;

    const sellers = users.filter(
      (user) => normalizeRole(user?.role) === "seller"
    ).length;

    const resellers = users.filter(
      (user) => normalizeRole(user?.role) === "reseller"
    ).length;

    const active = users.filter(
      (user) => getStatus(user) === "active"
    ).length;

    const pending = users.filter(
      (user) => getStatus(user) === "pending"
    ).length;

    return {
      total,
      sellers,
      resellers,
      active,
      pending,
    };
  }, [users]);

  /* =====================================================
     FILTERED USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = normalizeRole(user?.role);
      const status = getStatus(user);

      /* TAB */
      if (activeTab === "seller" && role !== "seller") {
        return false;
      }

      if (activeTab === "reseller" && role !== "reseller") {
        return false;
      }

      /* STATUS */
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      /* SEARCH */
      if (searchValue) {
        const searchableText = [
          getDisplayName(user),
          user?.email,
          getBusinessName(user),
          getPhone(user),
          role,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchValue)) {
          return false;
        }
      }

      return true;
    });
  }, [users, activeTab, statusFilter, search]);

  /* =====================================================
     TABS
  ===================================================== */

  const tabs = [
    {
      id: "all",
      label: "All",
      count: stats.total,
    },
    {
      id: "seller",
      label: "Sellers",
      count: stats.sellers,
    },
    {
      id: "reseller",
      label: "Resellers",
      count: stats.resellers,
    },
  ];

  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const StatusBadge = ({ status }) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Pending
        </span>
      );
    }

    if (status === "inactive") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          Inactive
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Active
      </span>
    );
  };

  /* =====================================================
     ROLE BADGE
  ===================================================== */

  const RoleBadge = ({ role }) => {
    const isReseller = role === "reseller";

    return (
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: isReseller ? "#F1EAFE" : COLORS.lightBlue,
          color: isReseller ? "#6D28D9" : COLORS.blue,
        }}
      >
        {formatRole(role)}
      </span>
    );
  };

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  const EmptyState = () => (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
        <UsersIcon size={25} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">
        No sellers or resellers found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-[#5E6B7A]">
        {search || statusFilter !== "all" || activeTab !== "all"
          ? "Try changing your search or filters."
          : "Seller and reseller accounts will appear here once they are registered."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
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

          <div>
            <h1 className="text-2xl font-bold text-[#0B1F3A]">
              Sellers / Resellers
            </h1>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              Manage seller and reseller accounts from one place.
            </p>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Accounts"
            value={stats.total}
            icon={<UsersIcon />}
            iconBg="#EAF4FF"
          />

          <StatCard
            title="Sellers"
            value={stats.sellers}
            icon={<StoreIcon />}
            iconBg="#EAF4FF"
          />

          <StatCard
            title="Resellers"
            value={stats.resellers}
            icon={<StoreIcon />}
            iconBg="#F1EAFE"
          />

          <StatCard
            title="Active"
            value={stats.active}
            icon={<UserCheckIcon />}
            iconBg="#ECFDF5"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<ClockIcon />}
            iconBg="#FFF7ED"
          />
        </div>

        {/* =================================================
            CONTENT CARD
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
          {/* TABS */}

          <div className="border-b border-[#DCE7F2] px-4 pt-4 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[#0078ED] text-white shadow-sm"
                        : "bg-[#F5FAFF] text-[#5E6B7A] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                    }`}
                  >
                    {tab.label}

                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#5E6B7A]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTER BAR */}

          <div className="flex flex-col gap-3 border-b border-[#DCE7F2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {/* SEARCH */}

            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8A9A]">
                <SearchIcon />
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, store..."
                className="h-11 w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] pl-10 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#91A0AF] focus:border-[#0078ED] focus:bg-white focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-[#DCE7F2] bg-white px-4 text-sm font-medium text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* RESULT INFO */}

          <div className="flex items-center justify-between border-b border-[#DCE7F2] px-4 py-3 sm:px-6">
            <p className="text-sm text-[#5E6B7A]">
              Showing{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {filteredUsers.length}
              </span>{" "}
              account
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto md:block">
            {filteredUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#DCE7F2] bg-[#F8FBFE] text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Name
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Business / Store
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => {
                    const role = normalizeRole(user?.role);
                    const status = getStatus(user);

                    return (
                      <tr
                        key={
                          user?.id ||
                          user?._id ||
                          user?.email ||
                          `${role}-${index}`
                        }
                        className="border-b border-[#EDF2F7] transition hover:bg-[#F8FBFE]"
                      >
                        {/* NAME */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-sm font-bold text-[#0078ED]">
                              {getDisplayName(user)
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                                {getDisplayName(user)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-4">
                          <RoleBadge role={role} />
                        </td>

                        {/* BUSINESS */}

                        <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                          {getBusinessName(user)}
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                          {user?.email || "—"}
                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                          {getPhone(user)}
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                          {getJoinedDate(user)}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE7F2] bg-white px-3 py-2 text-sm font-semibold text-[#0078ED] transition hover:border-[#0078ED] hover:bg-[#EAF4FF]"
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
            )}
          </div>

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredUsers.length === 0 ? (
              <EmptyState />
            ) : (
              filteredUsers.map((user, index) => {
                const role = normalizeRole(user?.role);
                const status = getStatus(user);

                return (
                  <div
                    key={
                      user?.id ||
                      user?._id ||
                      user?.email ||
                      `${role}-${index}`
                    }
                    className="rounded-2xl border border-[#DCE7F2] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-sm font-bold text-[#0078ED]">
                          {getDisplayName(user)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                            {getDisplayName(user)}
                          </p>

                          <p className="truncate text-xs text-[#5E6B7A]">
                            {user?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={status} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <RoleBadge role={role} />

                      <span className="rounded-full bg-[#F5FAFF] px-3 py-1 text-xs font-medium text-[#5E6B7A]">
                        {getBusinessName(user)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EDF2F7] pt-4">
                      <div>
                        <p className="text-xs text-[#7B8A9A]">Phone</p>
                        <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                          {getPhone(user)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#7B8A9A]">Joined</p>
                        <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                          {getJoinedDate(user)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE7F2] bg-white py-2.5 text-sm font-semibold text-[#0078ED] transition hover:border-[#0078ED] hover:bg-[#EAF4FF]"
                    >
                      <EyeIcon />
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#DCE7F2] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Account Details
                </h2>

                <p className="mt-0.5 text-xs text-[#5E6B7A]">
                  Seller / reseller information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
              >
                <XIcon />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FF] text-lg font-bold text-[#0078ED]">
                  {getDisplayName(selectedUser)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">
                    {getDisplayName(selectedUser)}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">
                    <RoleBadge
                      role={normalizeRole(selectedUser?.role)}
                    />

                    <StatusBadge status={getStatus(selectedUser)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-[#7B8A9A]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-[#0B1F3A]">
                    {selectedUser?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#7B8A9A]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                    {getPhone(selectedUser)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#7B8A9A]">
                    Business / Store
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                    {getBusinessName(selectedUser)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#7B8A9A]">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                    {getJoinedDate(selectedUser)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Account ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#0B1F3A]">
                  {selectedUser?.id ||
                    selectedUser?._id ||
                    "Not available"}
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-[#DCE7F2] px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0069D1]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
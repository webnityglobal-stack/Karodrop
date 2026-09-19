import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "karodrop-design-requests";

const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Approved",
  "Request Changes",
  "Rejected",
  "In Production",
  "Completed",
];

const emptyRequest = {
  id: "",
  customerName: "",
  customerEmail: "",
  productName: "",
  productId: "",
  designName: "",
  designImage: "",
  placement: "",
  quantity: 1,
  requirements: "",
  notes: "",
  status: "New",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const getRequests = () => {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveRequests = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("designRequestsUpdated"));
};

const getDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRequestId = (request) => {
  return (
    request.id ||
    request.requestId ||
    `DR-${String(requestsFallbackId(request)).padStart(4, "0")}`
  );
};

const requestsFallbackId = (request) => {
  const value = request.createdAt
    ? new Date(request.createdAt).getTime()
    : Date.now();

  return String(value).slice(-4);
};

const getStatusClasses = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Request Changes":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "In Production":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Completed":
      return "bg-slate-100 text-slate-700 border-slate-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

function Icon({ type, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg {...common}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  if (type === "edit") {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    );
  }

  if (type === "trash") {
    return (
      <svg {...common}>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  if (type === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (type === "close") {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  if (type === "requests") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    );
  }

  if (type === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "production") {
    return (
      <svg {...common}>
        <path d="M4 6h16v12H4z" />
        <path d="M8 6V4h8v2M8 10h8M8 14h5" />
      </svg>
    );
  }

  return null;
}

export default function DesignRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    setRequests(getRequests());

    const handleUpdate = () => {
      setRequests(getRequests());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("designRequestsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("designRequestsUpdated", handleUpdate);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return requests.filter((request) => {
      const requestId = String(
        request.id || request.requestId || ""
      ).toLowerCase();

      const customerName = String(
        request.customerName ||
          request.customer?.name ||
          request.userName ||
          ""
      ).toLowerCase();

      const customerEmail = String(
        request.customerEmail ||
          request.customer?.email ||
          request.userEmail ||
          ""
      ).toLowerCase();

      const productName = String(
        request.productName ||
          request.product?.name ||
          request.product ||
          ""
      ).toLowerCase();

      const designName = String(
        request.designName ||
          request.design?.name ||
          ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        requestId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue) ||
        productName.includes(searchValue) ||
        designName.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        String(request.status || "New") === statusFilter;

      let matchesDate = true;

      if (dateFilter !== "All" && request.createdAt) {
        const created = new Date(request.createdAt);
        const now = new Date();

        if (dateFilter === "Today") {
          matchesDate =
            created.toDateString() === now.toDateString();
        }

        if (dateFilter === "7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          matchesDate = created >= sevenDaysAgo;
        }

        if (dateFilter === "30 Days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          matchesDate = created >= thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [requests, search, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,

      newRequests: requests.filter(
        (item) => (item.status || "New") === "New"
      ).length,

      review: requests.filter(
        (item) => item.status === "Under Review"
      ).length,

      approved: requests.filter(
        (item) => item.status === "Approved"
      ).length,

      production: requests.filter(
        (item) => item.status === "In Production"
      ).length,

      completed: requests.filter(
        (item) => item.status === "Completed"
      ).length,
    };
  }, [requests]);

  const updateStatus = (id, status) => {
    const updated = requests.map((request) => {
      const requestId = request.id || request.requestId;

      if (requestId !== id) return request;

      return {
        ...request,
        status,
        updatedAt: new Date().toISOString(),
      };
    });

    setRequests(updated);
    saveRequests(updated);

    if (selectedRequest) {
      setSelectedRequest((prev) => ({
        ...prev,
        status,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const saveAdminNotes = (id, notes) => {
    const updated = requests.map((request) => {
      const requestId = request.id || request.requestId;

      if (requestId !== id) return request;

      return {
        ...request,
        adminNotes: notes,
        updatedAt: new Date().toISOString(),
      };
    });

    setRequests(updated);
    saveRequests(updated);

    const updatedRequest = updated.find(
      (item) => (item.id || item.requestId) === id
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }
  };

  const deleteRequest = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this design request?"
    );

    if (!confirmed) return;

    const updated = requests.filter(
      (request) => (request.id || request.requestId) !== id
    );

    setRequests(updated);
    saveRequests(updated);

    setSelectedRequest(null);
    setEditingRequest(null);
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#DCE7F2] bg-white">
        <div className="flex h-[74px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src="/images/Karodrop-logo.png"
                  alt="Karodrop"
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div>
                <p className="text-lg font-bold text-[#012467]">
                  Karodrop
                </p>
                <p className="text-xs text-[#5E6B7A]">
                  Admin Panel
                </p>
              </div>
            </Link>

            <div className="hidden h-8 w-px bg-[#DCE7F2] md:block" />

            <div className="hidden md:block">
              <p className="text-sm font-semibold">
                Design Requests
              </p>
              <p className="text-xs text-[#5E6B7A]">
                Manage customer design requests
              </p>
            </div>
          </div>

          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-lg border border-[#DCE7F2] px-3 py-2 text-sm font-medium text-[#0B1F3A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
          >
            <span>Back to Dashboard</span>
            <Icon type="arrow" size={16} />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
              <Icon type="requests" size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Design Requests
              </h1>
              <p className="text-sm text-[#5E6B7A]">
                Review and manage customer customization requests.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Requests"
            value={stats.total}
            icon="requests"
          />

          <StatCard
            title="New"
            value={stats.newRequests}
            icon="clock"
          />

          <StatCard
            title="Under Review"
            value={stats.review}
            icon="clock"
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            icon="check"
          />

          <StatCard
            title="In Production"
            value={stats.production}
            icon="production"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon="check"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-[500px]">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
                <Icon type="search" size={18} />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search request ID, customer, product..."
                className="h-11 w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] pl-10 pr-4 text-sm outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border border-[#DCE7F2] bg-white px-4 text-sm outline-none focus:border-[#0078ED]"
              >
                <option value="All">All Status</option>

                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-11 rounded-xl border border-[#DCE7F2] bg-white px-4 text-sm outline-none focus:border-[#0078ED]"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="7 Days">Last 7 Days</option>
                <option value="30 Days">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="border-b border-[#DCE7F2] bg-[#F5FAFF]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Request
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Design
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DCE7F2]">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                          <Icon type="requests" size={25} />
                        </div>

                        <h3 className="text-base font-semibold">
                          No design requests found
                        </h3>

                        <p className="mt-1 text-sm text-[#5E6B7A]">
                          Customer design requests will appear here
                          when they are submitted.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => {
                    const id =
                      request.id ||
                      request.requestId ||
                      `DR-${index + 1}`;

                    const customerName =
                      request.customerName ||
                      request.customer?.name ||
                      request.userName ||
                      "Unknown Customer";

                    const customerEmail =
                      request.customerEmail ||
                      request.customer?.email ||
                      request.userEmail ||
                      "";

                    const productName =
                      request.productName ||
                      request.product?.name ||
                      request.product ||
                      "—";

                    const designName =
                      request.designName ||
                      request.design?.name ||
                      "Custom Design";

                    const status = request.status || "New";

                    return (
                      <tr
                        key={id}
                        className="transition hover:bg-[#F5FAFF]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0078ED]">
                            {id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold">
                            {customerName}
                          </p>

                          {customerEmail && (
                            <p className="mt-0.5 text-xs text-[#5E6B7A]">
                              {customerEmail}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-sm">
                            {productName}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-sm">
                            {designName}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {request.quantity || 1}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                          {getDate(
                            request.createdAt ||
                              request.date ||
                              request.createdDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedRequest(request)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#0078ED] transition hover:bg-[#EAF4FF]"
                              title="View details"
                            >
                              <Icon type="eye" size={17} />
                            </button>

                            <button
                              onClick={() =>
                                setEditingRequest(request)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#0B1F3A] transition hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                              title="Edit request"
                            >
                              <Icon type="edit" size={17} />
                            </button>

                            <button
                              onClick={() => deleteRequest(id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                              title="Delete request"
                            >
                              <Icon type="trash" size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Cards */}
        <div className="space-y-4 lg:hidden">
          {filteredRequests.length === 0 ? (
            <div className="rounded-2xl border border-[#DCE7F2] bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                <Icon type="requests" size={25} />
              </div>

              <h3 className="text-base font-semibold">
                No design requests found
              </h3>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Customer design requests will appear here.
              </p>
            </div>
          ) : (
            filteredRequests.map((request, index) => {
              const id =
                request.id ||
                request.requestId ||
                `DR-${index + 1}`;

              const customerName =
                request.customerName ||
                request.customer?.name ||
                request.userName ||
                "Unknown Customer";

              const customerEmail =
                request.customerEmail ||
                request.customer?.email ||
                request.userEmail ||
                "";

              const productName =
                request.productName ||
                request.product?.name ||
                request.product ||
                "—";

              const designName =
                request.designName ||
                request.design?.name ||
                "Custom Design";

              const status = request.status || "New";

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#0078ED]">
                        {id}
                      </p>

                      <p className="mt-1 text-base font-semibold">
                        {customerName}
                      </p>

                      {customerEmail && (
                        <p className="text-xs text-[#5E6B7A]">
                          {customerEmail}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F5FAFF] p-3">
                    <InfoItem
                      label="Product"
                      value={productName}
                    />

                    <InfoItem
                      label="Design"
                      value={designName}
                    />

                    <InfoItem
                      label="Quantity"
                      value={request.quantity || 1}
                    />

                    <InfoItem
                      label="Date"
                      value={getDate(
                        request.createdAt ||
                          request.date ||
                          request.createdDate
                      )}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012467]"
                    >
                      <Icon type="eye" size={16} />
                      View
                    </button>

                    <button
                      onClick={() => setEditingRequest(request)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7F2] text-[#0B1F3A] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                    >
                      <Icon type="edit" size={17} />
                    </button>

                    <button
                      onClick={() => deleteRequest(id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                    >
                      <Icon type="trash" size={17} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* View Modal */}
      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={(status) =>
            updateStatus(
              selectedRequest.id || selectedRequest.requestId,
              status
            )
          }
          onSaveNotes={(notes) =>
            saveAdminNotes(
              selectedRequest.id || selectedRequest.requestId,
              notes
            )
          }
        />
      )}

      {/* Edit Modal */}
      {editingRequest && (
        <EditModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onSave={(updatedRequest) => {
            const id =
              editingRequest.id ||
              editingRequest.requestId;

            const updated = requests.map((request) => {
              const requestId =
                request.id || request.requestId;

              if (requestId !== id) return request;

              return {
                ...request,
                ...updatedRequest,
                updatedAt: new Date().toISOString(),
              };
            });

            setRequests(updated);
            saveRequests(updated);

            setEditingRequest(null);

            const refreshed = updated.find(
              (request) =>
                (request.id || request.requestId) === id
            );

            if (selectedRequest && refreshed) {
              setSelectedRequest(refreshed);
            }
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#5E6B7A]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
          <Icon type={icon} size={19} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#5E6B7A]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-[#0B1F3A]">
        {value}
      </p>
    </div>
  );
}

function RequestModal({
  request,
  onClose,
  onStatusChange,
  onSaveNotes,
}) {
  const [notes, setNotes] = useState(
    request.adminNotes || request.notes || ""
  );

  const customerName =
    request.customerName ||
    request.customer?.name ||
    request.userName ||
    "Unknown Customer";

  const customerEmail =
    request.customerEmail ||
    request.customer?.email ||
    request.userEmail ||
    "—";

  const productName =
    request.productName ||
    request.product?.name ||
    request.product ||
    "—";

  const designName =
    request.designName ||
    request.design?.name ||
    "Custom Design";

  const placement =
    request.placement ||
    request.printingPlacement ||
    request.printPlacement ||
    "—";

  const requirements =
    request.requirements ||
    request.customerRequirements ||
    request.description ||
    "No requirements provided.";

  const designImage =
    request.designImage ||
    request.image ||
    request.design?.image ||
    "";

  const id =
    request.id ||
    request.requestId ||
    "Design Request";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012467]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-5 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
              Design Request
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
          >
            <Icon type="close" size={19} />
          </button>
        </div>

        <div className="space-y-6 p-5 md:p-6">
          {/* Top */}
          <div className="grid gap-4 md:grid-cols-2">
            <DetailBox title="Customer">
              <p className="font-semibold">{customerName}</p>
              <p className="mt-1 text-sm text-[#5E6B7A]">
                {customerEmail}
              </p>
            </DetailBox>

            <DetailBox title="Product">
              <p className="font-semibold">{productName}</p>

              {request.productId && (
                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Product ID: {request.productId}
                </p>
              )}
            </DetailBox>
          </div>

          {/* Design */}
          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <div className="overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF]">
              {designImage ? (
                <img
                  src={designImage}
                  alt={designName}
                  className="h-44 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-sm text-[#5E6B7A]">
                  No design image
                </div>
              )}
            </div>

            <div className="space-y-4">
              <DetailBox title="Design Name">
                <p className="font-semibold">{designName}</p>
              </DetailBox>

              <div className="grid grid-cols-2 gap-4">
                <DetailBox title="Placement">
                  <p className="font-semibold">{placement}</p>
                </DetailBox>

                <DetailBox title="Quantity">
                  <p className="font-semibold">
                    {request.quantity || 1}
                  </p>
                </DetailBox>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <DetailBox title="Customer Requirements">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#5E6B7A]">
              {requirements}
            </p>
          </DetailBox>

          {/* Status */}
          <div>
            <p className="mb-2 text-sm font-semibold">
              Update Status
            </p>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    request.status === status
                      ? getStatusClasses(status)
                      : "border-[#DCE7F2] bg-white text-[#5E6B7A] hover:border-[#0078ED] hover:text-[#0078ED]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Admin Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Add internal notes about this design request..."
              className="w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-3 text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />

            <button
              onClick={() => onSaveNotes(notes)}
              className="mt-3 rounded-xl bg-[#0078ED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#012467]"
            >
              Save Notes
            </button>
          </div>

          {/* Dates */}
          <div className="grid gap-4 border-t border-[#DCE7F2] pt-5 sm:grid-cols-2">
            <DetailBox title="Created">
              <p className="text-sm font-semibold">
                {getDate(
                  request.createdAt ||
                    request.date ||
                    request.createdDate
                )}
              </p>
            </DetailBox>

            <DetailBox title="Last Updated">
              <p className="text-sm font-semibold">
                {getDate(request.updatedAt)}
              </p>
            </DetailBox>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ request, onClose, onSave }) {
  const [form, setForm] = useState({
    customerName:
      request.customerName ||
      request.customer?.name ||
      request.userName ||
      "",

    customerEmail:
      request.customerEmail ||
      request.customer?.email ||
      request.userEmail ||
      "",

    productName:
      request.productName ||
      request.product?.name ||
      request.product ||
      "",

    designName:
      request.designName ||
      request.design?.name ||
      "",

    placement:
      request.placement ||
      request.printingPlacement ||
      request.printPlacement ||
      "",

    quantity: request.quantity || 1,

    requirements:
      request.requirements ||
      request.customerRequirements ||
      request.description ||
      "",

    status: request.status || "New",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      quantity: Number(form.quantity) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012467]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
              Edit Request
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {request.id ||
                request.requestId ||
                "Design Request"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6B7A] hover:bg-[#F5FAFF]"
          >
            <Icon type="close" size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Customer Name"
              value={form.customerName}
              onChange={(value) =>
                updateField("customerName", value)
              }
            />

            <FormField
              label="Customer Email"
              value={form.customerEmail}
              onChange={(value) =>
                updateField("customerEmail", value)
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Product"
              value={form.productName}
              onChange={(value) =>
                updateField("productName", value)
              }
            />

            <FormField
              label="Design Name"
              value={form.designName}
              onChange={(value) =>
                updateField("designName", value)
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Placement"
              value={form.placement}
              onChange={(value) =>
                updateField("placement", value)
              }
            />

            <FormField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(value) =>
                updateField("quantity", value)
              }
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className="h-11 w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] px-3 text-sm outline-none focus:border-[#0078ED]"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Customer Requirements
            </label>

            <textarea
              value={form.requirements}
              onChange={(e) =>
                updateField("requirements", e.target.value)
              }
              rows="5"
              className="w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-3 text-sm outline-none focus:border-[#0078ED]"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#DCE7F2] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DCE7F2] px-5 py-2.5 text-sm font-semibold hover:bg-[#F5FAFF]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#012467]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] px-3 text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
      />
    </div>
  );
}

function DetailBox({ title, children }) {
  return (
    <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#5E6B7A]">
        {title}
      </p>

      {children}
    </div>
  );
}
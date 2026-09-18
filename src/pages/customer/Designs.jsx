import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const DESIGN_REQUESTS_STORAGE_KEY = "karodrop-design-requests";

const STATUS_TABS = [
  "All",
  "New",
  "Under Review",
  "Approved",
  "Request Changes",
  "In Production",
  "Completed",
  "Rejected",
];

const STATUS_STYLES = {
  New: "bg-[#EAF4FF] text-[#0078ED] border-[#CDE4FA]",
  "Under Review":
    "bg-amber-50 text-amber-700 border-amber-100",
  Approved:
    "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Request Changes":
    "bg-orange-50 text-orange-700 border-orange-100",
  "In Production":
    "bg-purple-50 text-purple-700 border-purple-100",
  Completed:
    "bg-green-50 text-green-700 border-green-100",
  Rejected:
    "bg-red-50 text-red-700 border-red-100",
};

const TIMELINE = [
  "New",
  "Under Review",
  "Approved",
  "In Production",
  "Completed",
];

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

function isRequestForCurrentUser(request, user) {
  const customerId = getCustomerId(user);
  const customerEmail = getCustomerEmail(user);

  if (
    request.customerId &&
    customerId &&
    String(request.customerId) === customerId
  ) {
    return true;
  }

  if (
    request.customerEmail &&
    customerEmail &&
    String(request.customerEmail)
      .trim()
      .toLowerCase() === customerEmail
  ) {
    return true;
  }

  return false;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRequestNumber(request) {
  if (request.requestNumber) {
    return request.requestNumber;
  }

  if (request.id) {
    return `DR-${String(request.id)
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-8)
      .toUpperCase()}`;
  }

  return "DR-REQUEST";
}

function getStatusStyle(status) {
  return (
    STATUS_STYLES[status] ||
    "bg-gray-50 text-gray-600 border-gray-100"
  );
}

function getTimelineProgress(status) {
  if (status === "Rejected") {
    return 0;
  }

  const index = TIMELINE.indexOf(status);

  if (index === -1) {
    return 0;
  }

  return index;
}

export default function Designs() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState(null);

  // =========================
  // LOAD CURRENT USER
  // =========================

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // =========================
  // LOAD DESIGN REQUESTS
  // =========================

  useEffect(() => {
    const loadRequests = () => {
      const savedRequests = localStorage.getItem(
        DESIGN_REQUESTS_STORAGE_KEY
      );

      if (!savedRequests) {
        setRequests([]);
        return;
      }

      try {
        const parsedRequests = JSON.parse(savedRequests);

        if (!Array.isArray(parsedRequests)) {
          setRequests([]);
          return;
        }

        setRequests(parsedRequests);
      } catch (error) {
        console.error(
          "Unable to load design requests:",
          error
        );

        setRequests([]);
      }
    };

    loadRequests();

    const handleStorageChange = () => {
      loadRequests();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "designRequestsUpdated",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "designRequestsUpdated",
        handleStorageChange
      );
    };
  }, []);

  // =========================
  // CURRENT CUSTOMER REQUESTS
  // =========================

  const customerRequests = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return requests.filter((request) =>
      isRequestForCurrentUser(request, currentUser)
    );
  }, [requests, currentUser]);

  // =========================
  // FILTER REQUESTS
  // =========================

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customerRequests.filter((request) => {
      const matchesTab =
        activeTab === "All" ||
        request.status === activeTab;

      if (!matchesTab) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        request.brandName
          ?.toLowerCase()
          .includes(query) ||
        request.productName
          ?.toLowerCase()
          .includes(query) ||
        request.designFileName
          ?.toLowerCase()
          .includes(query) ||
        getRequestNumber(request)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    customerRequests,
    activeTab,
    search,
  ]);

  // =========================
  // STATUS COUNTS
  // =========================

  const statusCounts = useMemo(() => {
    const counts = {
      All: customerRequests.length,
      New: 0,
      "Under Review": 0,
      Approved: 0,
      "Request Changes": 0,
      "In Production": 0,
      Completed: 0,
      Rejected: 0,
    };

    customerRequests.forEach((request) => {
      if (counts[request.status] !== undefined) {
        counts[request.status] += 1;
      }
    });

    return counts;
  }, [customerRequests]);

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
            Please login to view your designs.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <Link
                to="/account"
                className="inline-flex items-center text-sm font-medium text-[#0078ED] hover:text-[#012467] mb-3"
              >
                ← Back to Account
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                My Designs
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Track and manage all your custom product designs.
              </p>
            </div>

            <Link
              to="/design-request"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
            >
              <span className="text-lg">+</span>
              Create New Design
            </Link>

          </div>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SEARCH */}

        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 mb-5">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by design, product, brand or request ID..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#8A98A8] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />

          </div>

        </div>

        {/* STATUS TABS */}

        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-3 mb-6 overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {STATUS_TABS.map((status) => {
              const active = activeTab === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setActiveTab(status)
                  }
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition ${active
                      ? "bg-[#0078ED] text-white"
                      : "text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                    }`}
                >
                  {status}

                  <span
                    className={`ml-2 ${active
                        ? "text-white/80"
                        : "text-[#8A98A8]"
                      }`}
                  >
                    {statusCounts[status] || 0}
                  </span>
                </button>
              );
            })}

          </div>

        </div>

        {/* =========================
            DESIGN LIST
        ========================= */}

        {filteredRequests.length > 0 ? (

          <div className="space-y-4">

            {filteredRequests.map((request) => (
              <DesignCard
                key={request.id}
                request={request}
                onView={() =>
                  setSelectedRequest(request)
                }
              />
            ))}

          </div>

        ) : (

          <EmptyState
            hasSearch={Boolean(search)}
            activeTab={activeTab}
            onClear={() => {
              setSearch("");
              setActiveTab("All");
            }}
          />

        )}

      </main>

      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedRequest && (
        <DesignDetailsModal
          request={selectedRequest}
          onClose={() =>
            setSelectedRequest(null)
          }
        />
      )}

    </div>
  );
}

/* =====================================================
   DESIGN CARD
===================================================== */

function DesignCard({ request, onView }) {
  const status = request.status || "New";

  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 sm:p-5 hover:border-[#0078ED] hover:shadow-sm transition">

      <div className="flex flex-col lg:flex-row gap-5">

        {/* DESIGN IMAGE */}

        <div className="w-full lg:w-40 h-40 rounded-xl overflow-hidden bg-[#F5FAFF] border border-[#DCE7F2] shrink-0">

          {request.designImage ? (
            <img
              src={request.designImage}
              alt={request.designFileName || "Design"}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8A98A8]">
              No Design
            </div>
          )}

        </div>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  {request.designFileName ||
                    "Custom Design"}
                </h2>

                <span
                  className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                    status
                  )}`}
                >
                  {status}
                </span>

              </div>

              <p className="mt-1 text-xs text-[#8A98A8]">
                {getRequestNumber(request)}
              </p>

            </div>

            <button
              type="button"
              onClick={onView}
              className="self-start px-4 py-2 rounded-lg border border-[#DCE7F2] text-sm font-semibold text-[#0078ED] hover:border-[#0078ED] hover:bg-[#EAF4FF] transition"
            >
              View Details
            </button>

          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

            <InfoItem
              label="Brand"
              value={request.brandName || "-"}
            />

            <InfoItem
              label="Product"
              value={request.productName || "-"}
            />

            <InfoItem
              label="Printing"
              value={
                request.printingPosition || "-"
              }
            />

            <InfoItem
              label="Quantity"
              value={`${request.quantity || 0} units`}
            />

          </div>

          {/* FOOTER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-5 pt-4 border-t border-[#DCE7F2]">

            <span className="text-xs text-[#8A98A8]">
              Submitted {formatDate(request.createdAt)}
            </span>

            <span className="text-xs text-[#8A98A8]">
              Updated {formatDate(request.updatedAt)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F5FAFF] border border-[#DCE7F2] p-3 min-w-0">

      <p className="text-xs text-[#8A98A8]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#0B1F3A] truncate">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  hasSearch,
  activeTab,
  onClear,
}) {
  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl py-16 px-6 text-center">

      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
        🎨
      </div>

      {hasSearch ? (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No designs found
          </h2>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            Try another search term.
          </p>

          <button
            type="button"
            onClick={onClear}
            className="mt-5 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            Clear Search
          </button>
        </>
      ) : activeTab !== "All" ? (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No {activeTab} designs
          </h2>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            You don't have any designs with this status yet.
          </p>

          <button
            type="button"
            onClick={onClear}
            className="mt-5 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            View All Designs
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-[#0B1F3A]">
            No designs yet
          </h2>

          <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-[#5E6B7A]">
            Create your first custom product design and
            submit it to the Karodrop team for review.
          </p>

          <Link
            to="/design-request"
            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
          >
            + Create Your First Design
          </Link>
        </>
      )}

    </div>
  );
}

/* =====================================================
   DESIGN DETAILS MODAL
===================================================== */

function DesignDetailsModal({
  request,
  onClose,
}) {
  const status = request.status || "New";
  const progress = getTimelineProgress(status);

  return (
    <div className="fixed inset-0 z-50 bg-[#012467]/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 bg-white border-b border-[#DCE7F2] px-5 sm:px-7 py-5 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <p className="text-xs font-semibold text-[#8A98A8]">
              {getRequestNumber(request)}
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#0B1F3A] truncate">
              {request.designFileName ||
                "Custom Design"}
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-[#DCE7F2] text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0B1F3A] transition shrink-0"
          >
            ✕
          </button>

        </div>

        {/* BODY */}

        <div className="p-5 sm:p-7">

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7">

            {/* IMAGE */}

            <div>

              <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5FAFF] border border-[#DCE7F2]">

                {request.designImage ? (
                  <img
                    src={request.designImage}
                    alt={
                      request.designFileName ||
                      "Design preview"
                    }
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8A98A8]">
                    No Design Preview
                  </div>
                )}

              </div>

              <div className="mt-3 text-center">

                <span
                  className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                    status
                  )}`}
                >
                  {status}
                </span>

              </div>

            </div>

            {/* INFORMATION */}

            <div>

              <h3 className="text-base font-bold text-[#0B1F3A]">
                Design Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                <DetailItem
                  label="Brand"
                  value={request.brandName || "-"}
                />

                <DetailItem
                  label="Product"
                  value={request.productName || "-"}
                />

                <DetailItem
                  label="Category"
                  value={
                    request.productCategory ||
                    request.category ||
                    "-"
                  }
                />

                <DetailItem
                  label="Printing Position"
                  value={
                    request.printingPosition || "-"
                  }
                />

                <DetailItem
                  label="Quantity"
                  value={`${request.quantity || 0} units`}
                />

                <DetailItem
                  label="Submitted"
                  value={formatDate(request.createdAt)}
                />

              </div>

              {/* NOTES */}

              <div className="mt-5">

                <p className="text-sm font-semibold text-[#0B1F3A]">
                  Additional Requirements
                </p>

                <div className="mt-2 p-4 rounded-xl bg-[#F5FAFF] border border-[#DCE7F2]">

                  <p className="text-sm leading-6 text-[#5E6B7A]">
                    {request.notes ||
                      "No additional requirements provided."}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* TIMELINE */}

          <div className="mt-8 pt-7 border-t border-[#DCE7F2]">

            <h3 className="text-base font-bold text-[#0B1F3A]">
              Design Status
            </h3>

            {status === "Rejected" ? (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">

                <p className="text-sm font-semibold text-red-700">
                  This design request was rejected.
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Please check the request notes or contact
                  support for more information.
                </p>

              </div>
            ) : (
              <div className="mt-6">

                <div className="hidden sm:flex items-start">

                  {TIMELINE.map((step, index) => {
                    const completed =
                      index <= progress;

                    const current =
                      index === progress;

                    return (
                      <React.Fragment key={step}>

                        <div className="flex-1">

                          <div className="flex flex-col items-center">

                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold ${completed
                                  ? "bg-[#0078ED] border-[#0078ED] text-white"
                                  : "bg-white border-[#DCE7F2] text-[#8A98A8]"
                                }`}
                            >
                              {completed
                                ? "✓"
                                : index + 1}
                            </div>

                            <p
                              className={`mt-2 text-xs text-center font-semibold ${current
                                  ? "text-[#0078ED]"
                                  : completed
                                    ? "text-[#0B1F3A]"
                                    : "text-[#8A98A8]"
                                }`}
                            >
                              {step}
                            </p>

                          </div>

                        </div>

                        {index <
                          TIMELINE.length - 1 && (
                            <div
                              className={`h-0.5 flex-1 mt-4 ${index < progress
                                  ? "bg-[#0078ED]"
                                  : "bg-[#DCE7F2]"
                                }`}
                            />
                          )}

                      </React.Fragment>
                    );
                  })}

                </div>

                <div className="sm:hidden space-y-3">

                  {TIMELINE.map((step, index) => {
                    const completed =
                      index <= progress;

                    return (
                      <div
                        key={step}
                        className="flex items-center gap-3"
                      >

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold shrink-0 ${completed
                              ? "bg-[#0078ED] border-[#0078ED] text-white"
                              : "bg-white border-[#DCE7F2] text-[#8A98A8]"
                            }`}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        <span
                          className={`text-sm font-semibold ${completed
                              ? "text-[#0B1F3A]"
                              : "text-[#8A98A8]"
                            }`}
                        >
                          {step}
                        </span>

                      </div>
                    );
                  })}

                </div>

              </div>
            )}

          </div>

          {/* FOOTER INFO */}

          <div className="mt-7 p-4 rounded-xl bg-[#EAF4FF] border border-[#CDE4FA]">

            <p className="text-sm leading-6 text-[#0B1F3A]">
              Your design request is handled by the
              Karodrop team. Status updates will appear here
              as your request moves through review and
              production.
            </p>

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t border-[#DCE7F2] px-5 sm:px-7 py-4 flex justify-end">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F5FAFF] border border-[#DCE7F2] p-3">

      <p className="text-xs text-[#8A98A8]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
        {value}
      </p>

    </div>
  );
}
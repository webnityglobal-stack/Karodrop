import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   STORAGE
========================================================= */

const ORDERS_KEY = "karodrop-orders";
const DESIGN_REQUESTS_KEY = "karodrop-design-requests";

const PRODUCTION_STATUSES = [
  "Pending",
  "In Production",
  "Quality Check",
  "Ready to Pack",
  "Completed",
  "On Hold",
];

/* =========================================================
   HELPERS
========================================================= */

function getOrders() {
  try {
    const data = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getDesignRequests() {
  try {
    const data = JSON.parse(
      localStorage.getItem(DESIGN_REQUESTS_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );

  window.dispatchEvent(
    new Event("ordersUpdated")
  );
}

function saveDesignRequests(requests) {
  localStorage.setItem(
    DESIGN_REQUESTS_KEY,
    JSON.stringify(requests)
  );

  window.dispatchEvent(
    new Event("designRequestsUpdated")
  );
}

function getOrderId(order) {
  return (
    order?.orderId ||
    order?.orderNumber ||
    order?.id ||
    "N/A"
  );
}

function getCustomerName(order) {
  return (
    order?.customerName ||
    order?.customer?.name ||
    order?.userName ||
    order?.user?.name ||
    order?.name ||
    "Customer"
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

function getItems(order) {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (order?.product) {
    return [order.product];
  }

  return [];
}

function getProductName(item) {
  return (
    item?.productName ||
    item?.name ||
    item?.product?.name ||
    "Product"
  );
}

function getQuantity(item) {
  const quantity =
    item?.quantity ||
    item?.qty ||
    item?.count ||
    1;

  return Number(quantity) || 1;
}

function getDesignInfo(item, order, request) {
  return (
    item?.design ||
    item?.designName ||
    item?.designDetails ||
    order?.design ||
    request?.design ||
    request?.designName ||
    "Custom Design"
  );
}

function getPlacement(item, order, request) {
  return (
    item?.placement ||
    item?.printPlacement ||
    item?.printingPlacement ||
    order?.placement ||
    request?.placement ||
    request?.printPlacement ||
    "Not specified"
  );
}

function getPrintingMethod(item, order, request) {
  return (
    item?.printingMethod ||
    item?.printMethod ||
    item?.printing ||
    order?.printingMethod ||
    request?.printingMethod ||
    "Not specified"
  );
}

function getDate(order, request) {
  return (
    order?.createdAt ||
    order?.date ||
    order?.orderDate ||
    request?.createdAt ||
    request?.date ||
    new Date().toISOString()
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getProductionStatus(
  order,
  item,
  request
) {
  return (
    item?.productionStatus ||
    item?.fulfillmentStatus ||
    order?.productionStatus ||
    order?.fulfillmentStatus ||
    request?.productionStatus ||
    "Pending"
  );
}

function getAdminNotes(
  order,
  item,
  request
) {
  return (
    item?.productionNotes ||
    item?.adminNotes ||
    order?.productionNotes ||
    order?.adminNotes ||
    request?.productionNotes ||
    request?.adminNotes ||
    ""
  );
}

function getRequestForOrder(
  order,
  requests
) {
  const orderId = getOrderId(order);

  return requests.find((request) => {
    const requestOrderId =
      request?.orderId ||
      request?.orderNumber ||
      request?.order?.id ||
      request?.order?.orderId;

    if (
      requestOrderId &&
      String(requestOrderId) ===
        String(orderId)
    ) {
      return true;
    }

    const customerEmail =
      getCustomerEmail(order);

    const requestEmail =
      request?.customerEmail ||
      request?.email ||
      request?.customer?.email;

    if (
      customerEmail &&
      requestEmail &&
      customerEmail.toLowerCase() ===
        String(requestEmail).toLowerCase()
    ) {
      return true;
    }

    return false;
  });
}

/* =========================================================
   STATUS COLORS
========================================================= */

function getStatusClasses(status) {
  switch (status) {
    case "In Production":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Quality Check":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Ready to Pack":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";

    case "On Hold":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "Pending":
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
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
}

function FactoryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 21V8l6 3V8l6 3V5h6v16" />
      <path d="M3 21h18" />
      <path d="M7 15h2" />
      <path d="M12 15h2" />
      <path d="M17 15h2" />
      <path d="M7 18h2" />
      <path d="M12 18h2" />
      <path d="M17 18h2" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ArrowLeftIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Production() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [designRequests, setDesignRequests] =
    useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [
    selectedProduction,
    setSelectedProduction,
  ] = useState(null);

  const [editingStatus, setEditingStatus] =
    useState("Pending");

  const [editingNotes, setEditingNotes] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = () => {
    setOrders(getOrders());
    setDesignRequests(getDesignRequests());
  };

  useEffect(() => {
    loadData();

    const handleStorage = () => loadData();
    const handleOrders = () => loadData();
    const handleDesignRequests = () => loadData();

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrders
    );

    window.addEventListener(
      "designRequestsUpdated",
      handleDesignRequests
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrders
      );

      window.removeEventListener(
        "designRequestsUpdated",
        handleDesignRequests
      );
    };
  }, []);

  /* =======================================================
     BUILD PRODUCTION DATA
  ======================================================= */

  const productionItems = useMemo(() => {
    const result = [];

    orders.forEach((order) => {
      const items = getItems(order);

      const request = getRequestForOrder(
        order,
        designRequests
      );

      if (items.length === 0) {
        result.push({
          id: `${getOrderId(order)}-0`,
          order,
          item: order,
          request,
          orderId: getOrderId(order),
          customerName:
            getCustomerName(order),
          customerEmail:
            getCustomerEmail(order),
          productName:
            order?.productName ||
            order?.product?.name ||
            "Product",
          quantity:
            Number(order?.quantity) || 1,
          design: getDesignInfo(
            order,
            order,
            request
          ),
          placement: getPlacement(
            order,
            order,
            request
          ),
          printingMethod:
            getPrintingMethod(
              order,
              order,
              request
            ),
          status: getProductionStatus(
            order,
            order,
            request
          ),
          notes: getAdminNotes(
            order,
            order,
            request
          ),
          date: getDate(
            order,
            request
          ),
        });

        return;
      }

      items.forEach((item, index) => {
        result.push({
          id: `${getOrderId(order)}-${index}`,
          order,
          item,
          request,
          orderId: getOrderId(order),
          customerName:
            getCustomerName(order),
          customerEmail:
            getCustomerEmail(order),
          productName:
            getProductName(item),
          quantity: getQuantity(item),
          design: getDesignInfo(
            item,
            order,
            request
          ),
          placement: getPlacement(
            item,
            order,
            request
          ),
          printingMethod:
            getPrintingMethod(
              item,
              order,
              request
            ),
          status: getProductionStatus(
            order,
            item,
            request
          ),
          notes: getAdminNotes(
            order,
            item,
            request
          ),
          date: getDate(
            order,
            request
          ),
        });
      });
    });

    return result;
  }, [orders, designRequests]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredProduction = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return productionItems.filter(
      (item) => {
        const matchesSearch =
          !query ||
          item.orderId
            .toLowerCase()
            .includes(query) ||
          item.customerName
            .toLowerCase()
            .includes(query) ||
          item.customerEmail
            .toLowerCase()
            .includes(query) ||
          item.productName
            .toLowerCase()
            .includes(query) ||
          item.design
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          item.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    productionItems,
    search,
    statusFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: productionItems.length,

      pending: productionItems.filter(
        (item) =>
          item.status === "Pending"
      ).length,

      production: productionItems.filter(
        (item) =>
          item.status === "In Production"
      ).length,

      quality: productionItems.filter(
        (item) =>
          item.status === "Quality Check"
      ).length,

      ready: productionItems.filter(
        (item) =>
          item.status === "Ready to Pack"
      ).length,

      completed: productionItems.filter(
        (item) =>
          item.status === "Completed"
      ).length,

      hold: productionItems.filter(
        (item) =>
          item.status === "On Hold"
      ).length,
    };
  }, [productionItems]);

  /* =======================================================
     OPEN DETAILS
  ======================================================= */

  const openProduction = (
    production
  ) => {
    setSelectedProduction(production);
    setEditingStatus(
      production.status
    );
    setEditingNotes(
      production.notes || ""
    );
  };

  /* =======================================================
     UPDATE PRODUCTION
  ======================================================= */

  const updateProduction = () => {
    if (!selectedProduction) {
      return;
    }

    const selected =
      selectedProduction;

    const updatedOrders = orders.map(
      (order) => {
        const orderId =
          getOrderId(order);

        if (
          String(orderId) !==
          String(selected.orderId)
        ) {
          return order;
        }

        const items = getItems(order);

        /* ---------------------------------------------
           Order without items
        --------------------------------------------- */

        if (items.length === 0) {
          return {
            ...order,
            productionStatus:
              editingStatus,
            productionNotes:
              editingNotes,
            updatedAt:
              new Date().toISOString(),
          };
        }

        /* ---------------------------------------------
           Update selected item
        --------------------------------------------- */

        const updatedItems =
          items.map(
            (item, index) => {
              if (
                `${orderId}-${index}` !==
                selected.id
              ) {
                return item;
              }

              return {
                ...item,
                productionStatus:
                  editingStatus,
                fulfillmentStatus:
                  editingStatus,
                productionNotes:
                  editingNotes,
              };
            }
          );

        return {
          ...order,
          items: updatedItems,
          productionStatus:
            editingStatus,
          productionNotes:
            editingNotes,
          updatedAt:
            new Date().toISOString(),
        };
      }
    );

    saveOrders(updatedOrders);

    /* ---------------------------------------------
       Update matching design request
    --------------------------------------------- */

    if (selected.request) {
      const requestId =
        selected.request.id ||
        selected.request.requestId;

      const updatedRequests =
        designRequests.map(
          (request) => {
            const currentId =
              request.id ||
              request.requestId;

            if (
              requestId &&
              currentId &&
              String(requestId) ===
                String(currentId)
            ) {
              return {
                ...request,
                productionStatus:
                  editingStatus,
                productionNotes:
                  editingNotes,
                updatedAt:
                  new Date().toISOString(),
              };
            }

            return request;
          }
        );

      saveDesignRequests(
        updatedRequests
      );
    }

    setSelectedProduction(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF]">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="border-b border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          {/* BACK TO DASHBOARD */}

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078ED] text-white shadow-sm">
              <FactoryIcon />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Production
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage production and fulfillment work
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          PAGE CONTENT
      ==================================================== */}

      <div className="px-4 py-6 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-[1500px]">

          {/* ===================================================
              STATS
          ==================================================== */}

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">

            <StatCard
              title="Total"
              value={stats.total}
              icon={<PackageIcon />}
            />

            <StatCard
              title="Pending"
              value={stats.pending}
              icon={<FactoryIcon />}
            />

            <StatCard
              title="In Production"
              value={stats.production}
              icon={<FactoryIcon />}
            />

            <StatCard
              title="Quality Check"
              value={stats.quality}
              icon={<CheckIcon />}
            />

            <StatCard
              title="Ready to Pack"
              value={stats.ready}
              icon={<PackageIcon />}
            />

            <StatCard
              title="Completed"
              value={stats.completed}
              icon={<CheckIcon />}
            />

            <StatCard
              title="On Hold"
              value={stats.hold}
              icon={<PauseIcon />}
            />

          </div>

          {/* ===================================================
              FILTERS
          ==================================================== */}

          <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">

                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search order, customer, product or design..."
                  className="w-full rounded-xl border border-[#DCE7F2] bg-white py-3 pl-10 pr-4 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                />

              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
              >

                <option value="All">
                  All Production Status
                </option>

                {PRODUCTION_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* ===================================================
              EMPTY STATE
          ==================================================== */}

          {filteredProduction.length ===
            0 && (
            <div className="rounded-2xl border border-[#DCE7F2] bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
                <FactoryIcon />
              </div>

              <h2 className="text-lg font-semibold text-[#0B1F3A]">
                No production work found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#5E6B7A]">
                Production items will appear here when
                customer orders are available.
              </p>

            </div>
          )}

          {/* ===================================================
              DESKTOP TABLE
          ==================================================== */}

          {filteredProduction.length >
            0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm lg:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  <thead className="border-b border-[#DCE7F2] bg-[#F5FAFF]">

                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">

                      <th className="px-5 py-4">
                        Order
                      </th>

                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Product
                      </th>

                      <th className="px-5 py-4">
                        Qty
                      </th>

                      <th className="px-5 py-4">
                        Design
                      </th>

                      <th className="px-5 py-4">
                        Printing
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-[#DCE7F2]">

                    {filteredProduction.map(
                      (production) => (
                        <tr
                          key={
                            production.id
                          }
                          className="transition hover:bg-[#F8FBFF]"
                        >

                          <td className="px-5 py-4">

                            <p className="font-semibold text-[#0B1F3A]">
                              {
                                production.orderId
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <p className="font-medium text-[#0B1F3A]">
                              {
                                production.customerName
                              }
                            </p>

                            {production.customerEmail && (
                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                {
                                  production.customerEmail
                                }
                              </p>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            <p className="max-w-[180px] truncate font-medium text-[#0B1F3A]">
                              {
                                production.productName
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-[#0B1F3A]">
                            {
                              production.quantity
                            }
                          </td>

                          <td className="px-5 py-4">

                            <p className="max-w-[150px] truncate text-sm text-[#5E6B7A]">
                              {
                                production.design
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div>

                              <p className="text-sm font-medium text-[#0B1F3A]">
                                {
                                  production.printingMethod
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                {
                                  production.placement
                                }
                              </p>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                production.status
                              )}`}
                            >
                              {
                                production.status
                              }
                            </span>

                          </td>

                          <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                            {formatDate(
                              production.date
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                openProduction(
                                  production
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-[#DCE7F2] px-3 py-2 text-sm font-semibold text-[#0078ED] transition hover:border-[#0078ED] hover:bg-[#EAF4FF]"
                            >
                              <EyeIcon />
                              View
                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

          {/* ===================================================
              MOBILE / TABLET CARDS
          ==================================================== */}

          {filteredProduction.length >
            0 && (
            <div className="grid gap-4 lg:hidden">

              {filteredProduction.map(
                (production) => (
                  <div
                    key={
                      production.id
                    }
                    className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm"
                  >

                    <div className="mb-4 flex items-start justify-between gap-3">

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-[#5E6B7A]">
                          Order
                        </p>

                        <p className="mt-1 font-bold text-[#0B1F3A]">
                          {
                            production.orderId
                          }
                        </p>

                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          production.status
                        )}`}
                      >
                        {
                          production.status
                        }
                      </span>

                    </div>

                    <div className="space-y-3">

                      <div>

                        <p className="text-xs text-[#5E6B7A]">
                          Customer
                        </p>

                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {
                            production.customerName
                          }
                        </p>

                        {production.customerEmail && (
                          <p className="text-xs text-[#5E6B7A]">
                            {
                              production.customerEmail
                            }
                          </p>
                        )}

                      </div>

                      <div>

                        <p className="text-xs text-[#5E6B7A]">
                          Product
                        </p>

                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {
                            production.productName
                          }
                        </p>

                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>

                          <p className="text-xs text-[#5E6B7A]">
                            Quantity
                          </p>

                          <p className="text-sm font-semibold text-[#0B1F3A]">
                            {
                              production.quantity
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-[#5E6B7A]">
                            Date
                          </p>

                          <p className="text-sm font-semibold text-[#0B1F3A]">
                            {formatDate(
                              production.date
                            )}
                          </p>

                        </div>

                      </div>

                      <div>

                        <p className="text-xs text-[#5E6B7A]">
                          Printing
                        </p>

                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {
                            production.printingMethod
                          }
                        </p>

                        <p className="text-xs text-[#5E6B7A]">
                          {
                            production.placement
                          }
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openProduction(
                          production
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                    >
                      <EyeIcon />
                      View Production
                    </button>

                  </div>
                )
              )}

            </div>
          )}

          {/* ===================================================
              MODAL
          ==================================================== */}

          {selectedProduction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012467]/40 p-4">

              <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                {/* MODAL HEADER */}

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-5 py-4">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-[#5E6B7A]">
                      Production Details
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-[#0B1F3A]">
                      {
                        selectedProduction.orderId
                      }
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProduction(
                        null
                      )
                    }
                    className="rounded-lg p-2 text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
                  >
                    <XIcon />
                  </button>

                </div>

                {/* MODAL BODY */}

                <div className="space-y-6 p-5">

                  {/* CUSTOMER */}

                  <section>

                    <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                      Customer
                    </h3>

                    <div className="grid gap-4 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4 sm:grid-cols-2">

                      <InfoItem
                        label="Name"
                        value={
                          selectedProduction.customerName
                        }
                      />

                      <InfoItem
                        label="Email"
                        value={
                          selectedProduction.customerEmail ||
                          "Not available"
                        }
                      />

                    </div>

                  </section>

                  {/* PRODUCT */}

                  <section>

                    <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                      Product
                    </h3>

                    <div className="grid gap-4 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4 sm:grid-cols-2">

                      <InfoItem
                        label="Product"
                        value={
                          selectedProduction.productName
                        }
                      />

                      <InfoItem
                        label="Quantity"
                        value={
                          selectedProduction.quantity
                        }
                      />

                      <InfoItem
                        label="Design"
                        value={
                          selectedProduction.design
                        }
                      />

                      <InfoItem
                        label="Printing Method"
                        value={
                          selectedProduction.printingMethod
                        }
                      />

                      <InfoItem
                        label="Placement"
                        value={
                          selectedProduction.placement
                        }
                      />

                      <InfoItem
                        label="Order Date"
                        value={formatDate(
                          selectedProduction.date
                        )}
                      />

                    </div>

                  </section>

                  {/* PRODUCTION */}

                  <section>

                    <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                      Production Update
                    </h3>

                    <div className="space-y-4">

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                          Production Status
                        </label>

                        <select
                          value={
                            editingStatus
                          }
                          onChange={(e) =>
                            setEditingStatus(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                        >

                          {PRODUCTION_STATUSES.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                          Production Notes
                        </label>

                        <textarea
                          value={
                            editingNotes
                          }
                          onChange={(e) =>
                            setEditingNotes(
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Add production notes..."
                          className="w-full resize-none rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none placeholder:text-[#8A96A3] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                        />

                      </div>

                    </div>

                  </section>

                </div>

                {/* MODAL FOOTER */}

                <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7F2] bg-[#F5FAFF] px-5 py-4 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProduction(
                        null
                      )
                    }
                    className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5FAFF]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      updateProduction
                    }
                    className="rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                  >
                    Save Production Update
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">

      <div className="mb-3 flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0078ED]">
          {icon}
        </div>

      </div>

      <p className="text-xs font-medium text-[#5E6B7A]">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-xs font-medium text-[#5E6B7A]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#0B1F3A]">
        {value || "—"}
      </p>

    </div>
  );
}
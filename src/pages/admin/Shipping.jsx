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

const SHIPPING_STATUSES = [
  "Ready to Ship",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delivery Failed",
  "Returned",
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

function saveOrders(orders) {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );

  window.dispatchEvent(new Event("ordersUpdated"));
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
  return (
    Number(
      item?.quantity ||
        item?.qty ||
        item?.count ||
        1
    ) || 1
  );
}

function getShippingAddress(order) {
  const address =
    order?.shippingAddress ||
    order?.deliveryAddress ||
    order?.address ||
    order?.customer?.shippingAddress ||
    order?.customer?.address ||
    {};

  if (typeof address === "string") {
    return address;
  }

  const parts = [
    address?.name,
    address?.addressLine1,
    address?.addressLine2,
    address?.street,
    address?.area,
    address?.city,
    address?.state,
    address?.pincode ||
      address?.postalCode ||
      address?.zip,
    address?.country,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return (
    order?.shippingAddressText ||
    order?.deliveryAddressText ||
    "Address not available"
  );
}

function getShippingStatus(order) {
  return (
    order?.shippingStatus ||
    order?.shipmentStatus ||
    order?.deliveryStatus ||
    "Ready to Ship"
  );
}

function getCourier(order) {
  return (
    order?.courierName ||
    order?.shippingPartner ||
    order?.courier ||
    order?.carrier ||
    ""
  );
}

function getTrackingNumber(order) {
  return (
    order?.trackingNumber ||
    order?.trackingId ||
    order?.awbNumber ||
    order?.awb ||
    ""
  );
}

function getShippingNotes(order) {
  return (
    order?.shippingNotes ||
    order?.deliveryNotes ||
    ""
  );
}

function getOrderDate(order) {
  return (
    order?.createdAt ||
    order?.date ||
    order?.orderDate ||
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

function getStatusClasses(status) {
  switch (status) {
    case "Shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "In Transit":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Out for Delivery":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";

    case "Delivered":
      return "bg-green-50 text-green-700 border-green-200";

    case "Delivery Failed":
      return "bg-red-50 text-red-700 border-red-200";

    case "Returned":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "Ready to Ship":
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon({
  size = 18,
}) {
  return (
    <svg
      width={size}
      height={size}
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

function TruckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
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

function ClockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

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

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Shipping() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [editingStatus, setEditingStatus] =
    useState("Ready to Ship");

  const [editingCourier, setEditingCourier] =
    useState("");

  const [editingTracking, setEditingTracking] =
    useState("");

  const [editingNotes, setEditingNotes] =
    useState("");

  /* =======================================================
     LOAD ORDERS
  ======================================================= */

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();

    const handleStorage = () => loadOrders();
    const handleOrders = () => loadOrders();

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrders
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
    };
  }, []);

  /* =======================================================
     SHIPPING DATA
  ======================================================= */

  const shippingOrders = useMemo(() => {
    return orders.map((order) => {
      const items = getItems(order);

      const productNames =
        items.length > 0
          ? items
              .map((item) =>
                getProductName(item)
              )
              .join(", ")
          : order?.productName ||
            order?.product?.name ||
            "Product";

      const quantity =
        items.length > 0
          ? items.reduce(
              (total, item) =>
                total + getQuantity(item),
              0
            )
          : Number(order?.quantity) || 1;

      return {
        order,
        orderId: getOrderId(order),
        customerName:
          getCustomerName(order),
        customerEmail:
          getCustomerEmail(order),
        productName: productNames,
        quantity,
        address:
          getShippingAddress(order),
        status:
          getShippingStatus(order),
        courier:
          getCourier(order),
        tracking:
          getTrackingNumber(order),
        notes:
          getShippingNotes(order),
        date:
          getOrderDate(order),
      };
    });
  }, [orders]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return shippingOrders.filter(
      (order) => {
        const matchesSearch =
          !query ||
          order.orderId
            .toLowerCase()
            .includes(query) ||
          order.customerName
            .toLowerCase()
            .includes(query) ||
          order.customerEmail
            .toLowerCase()
            .includes(query) ||
          order.productName
            .toLowerCase()
            .includes(query) ||
          order.courier
            .toLowerCase()
            .includes(query) ||
          order.tracking
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          order.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    shippingOrders,
    search,
    statusFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: shippingOrders.length,

      ready: shippingOrders.filter(
        (order) =>
          order.status === "Ready to Ship"
      ).length,

      shipped: shippingOrders.filter(
        (order) =>
          order.status === "Shipped"
      ).length,

      transit: shippingOrders.filter(
        (order) =>
          order.status === "In Transit"
      ).length,

      outForDelivery:
        shippingOrders.filter(
          (order) =>
            order.status ===
            "Out for Delivery"
        ).length,

      delivered: shippingOrders.filter(
        (order) =>
          order.status === "Delivered"
      ).length,

      failed: shippingOrders.filter(
        (order) =>
          order.status ===
          "Delivery Failed"
      ).length,

      returned: shippingOrders.filter(
        (order) =>
          order.status === "Returned"
      ).length,
    };
  }, [shippingOrders]);

  /* =======================================================
     OPEN ORDER
  ======================================================= */

  const openOrder = (order) => {
    setSelectedOrder(order);

    setEditingStatus(
      order.status
    );

    setEditingCourier(
      order.courier || ""
    );

    setEditingTracking(
      order.tracking || ""
    );

    setEditingNotes(
      order.notes || ""
    );
  };

  /* =======================================================
     UPDATE SHIPPING
  ======================================================= */

  const updateShipping = () => {
    if (!selectedOrder) {
      return;
    }

    const selectedOrderId =
      selectedOrder.orderId;

    const updatedOrders =
      orders.map((order) => {
        const currentOrderId =
          getOrderId(order);

        if (
          String(currentOrderId) !==
          String(selectedOrderId)
        ) {
          return order;
        }

        return {
          ...order,

          shippingStatus:
            editingStatus,

          shipmentStatus:
            editingStatus,

          deliveryStatus:
            editingStatus,

          courierName:
            editingCourier.trim(),

          shippingPartner:
            editingCourier.trim(),

          trackingNumber:
            editingTracking.trim(),

          trackingId:
            editingTracking.trim(),

          shippingNotes:
            editingNotes.trim(),

          updatedAt:
            new Date().toISOString(),
        };
      });

    saveOrders(updatedOrders);

    setSelectedOrder(null);
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

        <div className="px-4 py-5 sm:px-6 lg:px-8">

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
              <TruckIcon />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Shipping
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage shipments, tracking and delivery
                status
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          PAGE CONTENT
      ==================================================== */}

      <div className="px-4 py-6 sm:px-6 lg:px-8">

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">

          <StatCard
            title="Total"
            value={stats.total}
            icon={<PackageIcon />}
          />

          <StatCard
            title="Ready"
            value={stats.ready}
            icon={<PackageIcon />}
          />

          <StatCard
            title="Shipped"
            value={stats.shipped}
            icon={<TruckIcon />}
          />

          <StatCard
            title="In Transit"
            value={stats.transit}
            icon={<TruckIcon />}
          />

          <StatCard
            title="Out for Delivery"
            value={stats.outForDelivery}
            icon={<TruckIcon />}
          />

          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={<CheckIcon />}
          />

          <StatCard
            title="Failed"
            value={stats.failed}
            icon={<ClockIcon />}
          />

          <StatCard
            title="Returned"
            value={stats.returned}
            icon={<PackageIcon />}
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
                  setSearch(e.target.value)
                }
                placeholder="Search order, customer, product, courier or tracking..."
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
                All Shipping Status
              </option>

              {SHIPPING_STATUSES.map(
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

        {filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-[#DCE7F2] bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
              <TruckIcon />
            </div>

            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              No shipping orders found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#5E6B7A]">
              Orders will appear here when customer
              orders are available.
            </p>

          </div>
        )}

        {/* ===================================================
            DESKTOP TABLE
        ==================================================== */}

        {filteredOrders.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

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
                      Courier
                    </th>

                    <th className="px-5 py-4">
                      Tracking
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

                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={order.orderId}
                        className="transition hover:bg-[#F8FBFF]"
                      >

                        <td className="px-5 py-4">

                          <p className="font-semibold text-[#0B1F3A]">
                            {order.orderId}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <p className="font-medium text-[#0B1F3A]">
                            {order.customerName}
                          </p>

                          {order.customerEmail && (
                            <p className="mt-1 text-xs text-[#5E6B7A]">
                              {order.customerEmail}
                            </p>
                          )}

                        </td>

                        <td className="px-5 py-4">

                          <p className="max-w-[180px] truncate text-sm font-medium text-[#0B1F3A]">
                            {order.productName}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#0B1F3A]">
                          {order.quantity}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                          {order.courier || "—"}
                        </td>

                        <td className="px-5 py-4">

                          <p className="max-w-[150px] truncate text-sm font-medium text-[#0B1F3A]">
                            {order.tracking || "—"}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                          {formatDate(
                            order.date
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              openOrder(order)
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
            MOBILE CARDS
        ==================================================== */}

        {filteredOrders.length > 0 && (
          <div className="grid gap-4 lg:hidden">

            {filteredOrders.map(
              (order) => (
                <div
                  key={order.orderId}
                  className="rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm"
                >

                  <div className="mb-4 flex items-start justify-between gap-3">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#5E6B7A]">
                        Order
                      </p>

                      <p className="mt-1 font-bold text-[#0B1F3A]">
                        {order.orderId}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="space-y-3">

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Customer
                      </p>

                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        {order.customerName}
                      </p>

                      {order.customerEmail && (
                        <p className="text-xs text-[#5E6B7A]">
                          {order.customerEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Product
                      </p>

                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        {order.productName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div>
                        <p className="text-xs text-[#5E6B7A]">
                          Quantity
                        </p>

                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {order.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#5E6B7A]">
                          Date
                        </p>

                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {formatDate(
                            order.date
                          )}
                        </p>
                      </div>

                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Courier
                      </p>

                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        {order.courier || "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Tracking
                      </p>

                      <p className="break-all text-sm font-semibold text-[#0B1F3A]">
                        {order.tracking || "Not assigned"}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openOrder(order)
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                  >
                    <EyeIcon />
                    Manage Shipment
                  </button>

                </div>
              )
            )}

          </div>
        )}

        {/* ===================================================
            DETAILS MODAL
        ==================================================== */}

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012467]/40 p-4">

            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-5 py-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#5E6B7A]">
                    Shipment Details
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#0B1F3A]">
                    {selectedOrder.orderId}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="rounded-lg p-2 text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
                >
                  <XIcon />
                </button>

              </div>

              {/* BODY */}

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
                        selectedOrder.customerName
                      }
                    />

                    <InfoItem
                      label="Email"
                      value={
                        selectedOrder.customerEmail ||
                        "Not available"
                      }
                    />

                  </div>

                </section>

                {/* PRODUCT */}

                <section>

                  <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                    Order
                  </h3>

                  <div className="grid gap-4 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4 sm:grid-cols-2">

                    <InfoItem
                      label="Product"
                      value={
                        selectedOrder.productName
                      }
                    />

                    <InfoItem
                      label="Quantity"
                      value={
                        selectedOrder.quantity
                      }
                    />

                    <InfoItem
                      label="Order Date"
                      value={formatDate(
                        selectedOrder.date
                      )}
                    />

                    <InfoItem
                      label="Current Status"
                      value={
                        selectedOrder.status
                      }
                    />

                  </div>

                </section>

                {/* ADDRESS */}

                <section>

                  <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                    Shipping Address
                  </h3>

                  <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">

                    <p className="whitespace-pre-wrap text-sm leading-6 text-[#0B1F3A]">
                      {selectedOrder.address}
                    </p>

                  </div>

                </section>

                {/* SHIPPING UPDATE */}

                <section>

                  <h3 className="mb-3 text-sm font-bold text-[#0B1F3A]">
                    Shipment Update
                  </h3>

                  <div className="space-y-4">

                    {/* STATUS */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                        Shipping Status
                      </label>

                      <select
                        value={editingStatus}
                        onChange={(e) =>
                          setEditingStatus(
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                      >

                        {SHIPPING_STATUSES.map(
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

                    {/* COURIER */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                        Courier / Shipping Partner
                      </label>

                      <input
                        type="text"
                        value={editingCourier}
                        onChange={(e) =>
                          setEditingCourier(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Delhivery, Blue Dart, Shiprocket"
                        className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none placeholder:text-[#8A96A3] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                      />

                    </div>

                    {/* TRACKING */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                        Tracking / AWB Number
                      </label>

                      <input
                        type="text"
                        value={editingTracking}
                        onChange={(e) =>
                          setEditingTracking(
                            e.target.value
                          )
                        }
                        placeholder="Enter tracking or AWB number"
                        className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none placeholder:text-[#8A96A3] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                      />

                    </div>

                    {/* NOTES */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                        Shipping Notes
                      </label>

                      <textarea
                        value={editingNotes}
                        onChange={(e) =>
                          setEditingNotes(
                            e.target.value
                          )
                        }
                        rows={4}
                        placeholder="Add shipping or delivery notes..."
                        className="w-full resize-none rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none placeholder:text-[#8A96A3] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                      />

                    </div>

                  </div>

                </section>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7F2] bg-[#F5FAFF] px-5 py-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5FAFF]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={updateShipping}
                  className="rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                >
                  Save Shipping Update
                </button>

              </div>

            </div>

          </div>
        )}

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

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0078ED]">
        {icon}
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
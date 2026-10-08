import React from "react";
import { Link, useParams } from "react-router-dom";

const demoOrder = {
  id: "KD-10245",
  date: "28 Sep 2026",
  status: "Delivered",

  customer: {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
  },

  shippingAddress: {
    name: "Rahul Sharma",
    address: "24, Green Park",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    country: "India",
  },

  items: [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      sku: "KD-TS-001",
      quantity: 2,
      price: 799,
      image: "/images/product-placeholder.png",
    },
    {
      id: 2,
      name: "Classic Black Cap",
      sku: "KD-CP-006",
      quantity: 1,
      price: 399,
      image: "/images/product-placeholder.png",
    },
  ],

  payment: {
    method: "Online Payment",
    status: "Paid",
    transactionId: "TXN-KD10245-001",
  },

  shipping: {
    method: "Standard Delivery",
    courier: "Karodrop Shipping",
    trackingId: "KDTRK10245001",
  },
};

const timeline = [
  {
    title: "Order Delivered",
    description: "The order was successfully delivered to the customer.",
    date: "28 Sep 2026, 04:35 PM",
    completed: true,
  },
  {
    title: "Out for Delivery",
    description: "The order was out for delivery.",
    date: "28 Sep 2026, 09:15 AM",
    completed: true,
  },
  {
    title: "Shipped",
    description: "The order was handed over to the shipping partner.",
    date: "27 Sep 2026, 03:20 PM",
    completed: true,
  },
  {
    title: "Processing",
    description: "Seller started processing the order.",
    date: "27 Sep 2026, 10:10 AM",
    completed: true,
  },
  {
    title: "Order Placed",
    description: "Customer successfully placed the order.",
    date: "26 Sep 2026, 07:42 PM",
    completed: true,
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-orange-50 text-orange-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function OrderDetails() {
  const { id } = useParams();

  const order = {
    ...demoOrder,
    id: id || demoOrder.id,
  };

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCharge = 0;
  const discount = 0;
  const total = subtotal + shippingCharge - discount;

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <Link
              to="/seller/orders"
              className="text-sm font-medium text-[#0078ED] hover:underline"
            >
              ← Orders
            </Link>

            <span className="text-[#CBD5E1]">/</span>

            <span className="text-sm text-[#5E6B7A]">
              Order Details
            </span>

          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-semibold text-[#0B1F3A]">
              #{order.id}
            </h1>

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
                ${statusStyles[order.status]}
              `}
            >
              {order.status}
            </span>

          </div>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Placed on {order.date}
          </p>

        </div>

        <Link
          to="/seller/orders"
          className="
            inline-flex
            w-fit
            items-center
            justify-center
            rounded-xl
            border
            border-[#DCE7F2]
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-[#0B1F3A]
            transition
            hover:border-[#0078ED]
            hover:text-[#0078ED]
          "
        >
          Back to Orders
        </Link>

      </div>

      {/* =====================================================
          ORDER SUMMARY
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Order Total
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Items
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {order.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Payment
          </p>

          <p className="mt-2 text-sm font-semibold text-green-600">
            {order.payment.status}
          </p>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            {order.payment.method}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Tracking
          </p>

          <p className="mt-2 text-sm font-semibold text-[#0078ED]">
            {order.shipping.trackingId}
          </p>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            {order.shipping.courier}
          </p>
        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* ===================================================
            LEFT
        ==================================================== */}

        <div className="space-y-6">

          {/* Products */}

          <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

            <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Ordered Products
              </h2>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Products included in this order.
              </p>

            </div>

            <div className="divide-y divide-[#DCE7F2]">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                >

                  {/* Image */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5FAFF]">

                    <div className="text-2xl">
                      🛍️
                    </div>

                  </div>

                  {/* Product */}

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      SKU: {item.sku}
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  {/* Price */}

                  <div className="text-left sm:text-right">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      ₹{item.price.toLocaleString("en-IN")} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Price Breakdown */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white">

            <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Order Summary
              </h2>

            </div>

            <div className="space-y-4 p-5 sm:p-6">

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#5E6B7A]">
                  Subtotal
                </span>

                <span className="font-medium text-[#0B1F3A]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#5E6B7A]">
                  Shipping
                </span>

                <span className="font-medium text-[#0B1F3A]">
                  {shippingCharge === 0
                    ? "Free"
                    : `₹${shippingCharge}`}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-[#5E6B7A]">
                  Discount
                </span>

                <span className="font-medium text-green-600">
                  -₹{discount.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="border-t border-[#DCE7F2] pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-base font-semibold text-[#0B1F3A]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#0078ED]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            RIGHT
        ==================================================== */}

        <div className="space-y-6">

          {/* Customer */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white">

            <div className="border-b border-[#DCE7F2] px-5 py-5">

              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Customer
              </h2>

            </div>

            <div className="space-y-4 p-5">

              <div>

                <p className="text-xs text-[#5E6B7A]">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
                  {order.customer.name}
                </p>

              </div>

              <div>

                <p className="text-xs text-[#5E6B7A]">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-[#0B1F3A]">
                  {order.customer.email}
                </p>

              </div>

              <div>

                <p className="text-xs text-[#5E6B7A]">
                  Phone
                </p>

                <p className="mt-1 text-sm text-[#0B1F3A]">
                  {order.customer.phone}
                </p>

              </div>

            </div>

          </div>

          {/* Shipping Address */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white">

            <div className="border-b border-[#DCE7F2] px-5 py-5">

              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Shipping Address
              </h2>

            </div>

            <div className="p-5">

              <p className="text-sm font-semibold text-[#0B1F3A]">
                {order.shippingAddress.name}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
                <br />
                {order.shippingAddress.pincode}
                <br />
                {order.shippingAddress.country}
              </p>

            </div>

          </div>

          {/* Payment */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white">

            <div className="border-b border-[#DCE7F2] px-5 py-5">

              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Payment Information
              </h2>

            </div>

            <div className="space-y-4 p-5">

              <div className="flex items-center justify-between gap-4">

                <span className="text-xs text-[#5E6B7A]">
                  Method
                </span>

                <span className="text-sm font-medium text-[#0B1F3A]">
                  {order.payment.method}
                </span>

              </div>

              <div className="flex items-center justify-between gap-4">

                <span className="text-xs text-[#5E6B7A]">
                  Status
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {order.payment.status}
                </span>

              </div>

              <div>

                <p className="text-xs text-[#5E6B7A]">
                  Transaction ID
                </p>

                <p className="mt-1 break-all text-xs font-medium text-[#0B1F3A]">
                  {order.payment.transactionId}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ORDER TIMELINE
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Order Timeline
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Track the progress of this order.
          </p>

        </div>

        <div className="p-5 sm:p-6">

          <div className="space-y-0">

            {timeline.map((item, index) => (

              <div
                key={item.title}
                className="relative flex gap-4"
              >

                {/* Vertical line */}

                {index !== timeline.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-[#DCE7F2]" />
                )}

                {/* Icon */}

                <div
                  className={`
                    relative
                    z-10
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                      item.completed
                        ? "bg-[#EAF4FF] text-[#0078ED]"
                        : "bg-[#F5FAFF] text-[#5E6B7A]"
                    }
                  `}
                >
                  ✓
                </div>

                {/* Content */}

                <div className="pb-7">

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      {item.title}
                    </p>

                    <span className="text-xs text-[#5E6B7A]">
                      {item.date}
                    </span>

                  </div>

                  <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                    {item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          SHIPPING DETAILS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 sm:p-6">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h2 className="text-base font-semibold text-[#0B1F3A]">
              Shipping Details
            </h2>

            <p className="mt-1 text-xs text-[#5E6B7A]">
              Delivery and tracking information.
            </p>

          </div>

          <span className="w-fit rounded-full bg-[#EAF4FF] px-3 py-1.5 text-xs font-semibold text-[#0078ED]">
            {order.shipping.method}
          </span>

        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl bg-[#F5FAFF] p-4">

            <p className="text-xs text-[#5E6B7A]">
              Courier
            </p>

            <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
              {order.shipping.courier}
            </p>

          </div>

          <div className="rounded-xl bg-[#F5FAFF] p-4">

            <p className="text-xs text-[#5E6B7A]">
              Tracking ID
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-[#0078ED]">
              {order.shipping.trackingId}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
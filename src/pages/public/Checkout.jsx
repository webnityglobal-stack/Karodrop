import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ORDERS_STORAGE_KEY = "karodrop-orders";
const ADDRESSES_STORAGE_KEY = "karodrop-addresses";

// Frontend stage par shipping free rakha hai.
// Tax/GST ko backend/tax configuration ke saath later connect kiya ja sakta hai.
const SHIPPING_FEE = 0;
const TAX_RATE = 0;

function getCurrentUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("karodrop-user")) ||
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("currentUser")) ||
      null
    );
  } catch {
    return null;
  }
}

function getAddressId(address) {
  return address?.id || address?._id || "";
}

function getUnitPrice(item) {
  return Number(item?.unitPrice ?? item?.price ?? item?.product?.price ?? 0);
}

function getQuantity(item) {
  return Number(item?.qty ?? item?.quantity ?? 1);
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

export default function Checkout() {
  const navigate = useNavigate();

  const {
    items = [],
    subtotal: cartSubtotal,
    total: cartTotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const currentUser = useMemo(() => getCurrentUser(), []);

  /* =====================================================
     LOAD SAVED ADDRESSES
  ===================================================== */

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(ADDRESSES_STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(stored)) {
        setSavedAddresses([]);
        return;
      }

      const customerId =
        currentUser?.id ||
        currentUser?._id ||
        currentUser?.email ||
        currentUser?.phone ||
        "";

      const filtered = stored
        .filter((address) => {
          if (!customerId) return true;

          const addressCustomerId =
            address?.customerId ||
            address?.userId ||
            address?.email ||
            address?.customerEmail ||
            "";

          return (
            !addressCustomerId ||
            String(addressCustomerId) === String(customerId)
          );
        })
        .sort((a, b) => {
          if (a?.isDefault && !b?.isDefault) return -1;
          if (!a?.isDefault && b?.isDefault) return 1;

          const dateA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
          const dateB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

          return dateB - dateA;
        });

      setSavedAddresses(filtered);
    } catch {
      setSavedAddresses([]);
    }
  }, [currentUser]);

  /* =====================================================
     PREFILL CUSTOMER DETAILS
  ===================================================== */

  useEffect(() => {
    if (!currentUser) return;

    setForm((previous) => ({
      ...previous,
      name:
        previous.name ||
        currentUser?.name ||
        currentUser?.fullName ||
        "",
      email:
        previous.email ||
        currentUser?.email ||
        "",
      phone:
        previous.phone ||
        currentUser?.phone ||
        currentUser?.mobile ||
        "",
    }));
  }, [currentUser]);

  /* =====================================================
     AUTO SELECT DEFAULT ADDRESS
  ===================================================== */

  useEffect(() => {
    if (!savedAddresses.length || selectedAddressId) return;

    const defaultAddress =
      savedAddresses.find((address) => address?.isDefault) ||
      savedAddresses[0];

    const addressId = getAddressId(defaultAddress);

    if (addressId) {
      setSelectedAddressId(addressId);
      fillAddressForm(defaultAddress);
    }
  }, [savedAddresses, selectedAddressId]);

  /* =====================================================
     ADDRESS FORM HELPER
  ===================================================== */

  function fillAddressForm(address) {
    if (!address) return;

    const addressLine =
      address?.address ||
      address?.house ||
      address?.addressLine ||
      "";

    const area = address?.area ? `, ${address.area}` : "";

    setForm((previous) => ({
      ...previous,
      name:
        address?.name ||
        address?.fullName ||
        previous.name ||
        "",
      phone:
        address?.phone ||
        address?.mobile ||
        previous.phone ||
        "",
      email:
        address?.email ||
        previous.email ||
        "",
      address: `${addressLine}${area}`,
      city: address?.city || "",
      pincode:
        address?.pincode ||
        address?.postalCode ||
        "",
      state: address?.state || "",
    }));
  }

  /* =====================================================
     TOTAL CALCULATION
  ===================================================== */

  const calculatedSubtotal = useMemo(() => {
    if (items.length) {
      return items.reduce((sum, item) => {
        return sum + getUnitPrice(item) * getQuantity(item);
      }, 0);
    }

    return Number(cartSubtotal ?? cartTotal ?? 0);
  }, [items, cartSubtotal, cartTotal]);

  const shippingFee = calculatedSubtotal > 0 ? SHIPPING_FEE : 0;

  const tax = Math.round(calculatedSubtotal * TAX_RATE);

  const finalTotal = calculatedSubtotal + shippingFee + tax;

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  function handleChange(event) {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setSelectedAddressId("");
    setError("");
  }

  /* =====================================================
     SELECT SAVED ADDRESS
  ===================================================== */

  function handleAddressSelect(address) {
    const addressId = getAddressId(address);

    setSelectedAddressId(addressId);
    fillAddressForm(address);
    setError("");
  }

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    const phone = String(form.phone || "").replace(/\D/g, "");
    const pincode = String(form.pincode || "").replace(/\D/g, "");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form.address.trim()) {
      setError("Please enter your complete delivery address.");
      return;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!form.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setPlacingOrder(true);

    try {
      const user = getCurrentUser();

      /* =================================================
         PRESERVE COMPLETE CART CONFIGURATION
      ================================================= */

      const orderItems = items.map((item) => {
        const product = item?.product || {};

        const quantity = getQuantity(item);
        const unitPrice = getUnitPrice(item);

        return {
          cartItemId: item?.cartItemId || item?.id || item?._id,

          productId:
            item?.productId ||
            product?._id ||
            product?.id ||
            null,

          slug: item?.slug || product?.slug || "",

          title:
            item?.title ||
            item?.name ||
            product?.title ||
            product?.name ||
            "Product",

          productName:
            item?.productName ||
            item?.title ||
            item?.name ||
            product?.title ||
            product?.name ||
            "Product",

          category:
            item?.category ||
            product?.category ||
            "",

          image:
            item?.image ||
            product?.image ||
            product?.images?.[0] ||
            "",

          price: unitPrice,
          unitPrice,

          qty: quantity,
          quantity,

          /* ==============================
             BRAND
          ============================== */

          brand: item?.brand || null,
          brandId:
            item?.brandId ||
            item?.brand?.id ||
            item?.brand?._id ||
            null,

          /* ==============================
             PRODUCT OPTIONS
          ============================== */

          color: item?.color || "",
          size: item?.size || "",

          /* ==============================
             DESIGN
          ============================== */

          designId: item?.designId || "",
          designName:
            item?.designName ||
            item?.design?.name ||
            "",

          designImage:
            item?.designImage ||
            item?.design?.image ||
            "",

          designFileName:
            item?.designFileName ||
            item?.design?.fileName ||
            "",

          design: item?.design || null,

          /* ==============================
             PRINTING
          ============================== */

          printingMethod:
            item?.printingMethod ||
            "",

          printingPosition:
            item?.printingPosition ||
            "",

          printingOptions:
            item?.printingOptions ||
            [],

          /* ==============================
             CUSTOMER REQUIREMENTS
          ============================== */

          notes:
            item?.notes ||
            item?.customerNotes ||
            "",

          customerNotes:
            item?.customerNotes ||
            item?.notes ||
            "",

          customerRequirements:
            item?.customerRequirements ||
            item?.customerNotes ||
            item?.notes ||
            "",

          /* ==============================
             PRODUCTION / DELIVERY
          ============================== */

          production:
            item?.production ||
            null,

          delivery:
            item?.delivery ||
            null,

          /* ==============================
             ITEM TOTAL
          ============================== */

          itemTotal: unitPrice * quantity,

          configurationKey:
            item?.configurationKey ||
            "",
        };
      });

      /* =================================================
         ORDER NUMBER
      ================================================= */

      const timestamp = Date.now();

      const orderId = `ORD-${timestamp}`;

      const orderNumber = `KD-${timestamp
        .toString()
        .slice(-8)}`;

      /* =================================================
         SHIPPING ADDRESS
      ================================================= */

      const shippingAddress = {
        name: form.name.trim(),
        phone,
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pincode,
        state: form.state.trim(),
      };

      /* =================================================
         ORDER TIMELINE
      ================================================= */

      const timeline = [
        {
          status: "Order Placed",
          label: "Order Placed",
          completed: true,
          date: new Date().toISOString(),
        },
        {
          status: "Payment Confirmed",
          label: "Payment Confirmed",
          completed: paymentMethod !== "COD",
          date: null,
        },
        {
          status: "Processing",
          label: "Processing",
          completed: false,
          date: null,
        },
        {
          status: "Design / Production",
          label: "Design / Production",
          completed: false,
          date: null,
        },
        {
          status: "Packed",
          label: "Packed",
          completed: false,
          date: null,
        },
        {
          status: "Shipped",
          label: "Shipped",
          completed: false,
          date: null,
        },
        {
          status: "Out for Delivery",
          label: "Out for Delivery",
          completed: false,
          date: null,
        },
        {
          status: "Delivered",
          label: "Delivered",
          completed: false,
          date: null,
        },
      ];

      /* =================================================
         COMPLETE ORDER OBJECT
      ================================================= */

      const newOrder = {
        id: orderId,
        orderId,

        orderNumber,

        customerId:
          user?.id ||
          user?._id ||
          user?.email ||
          null,

        customerName:
          form.name.trim(),

        name:
          form.name.trim(),

        customerEmail:
          form.email.trim(),

        email:
          form.email.trim(),

        customerPhone:
          phone,

        phone,

        items: orderItems,

        /* ==============================
           ORDER TOTALS
        ============================== */

        subtotal: calculatedSubtotal,

        shipping: shippingFee,

        shippingFee,

        tax,

        gst: tax,

        total: finalTotal,

        grandTotal: finalTotal,

        payableAmount: finalTotal,

        /* ==============================
           PAYMENT
        ============================== */

        paymentMethod,

        paymentStatus:
          paymentMethod === "COD"
            ? "Pending"
            : "Pending",

        /* ==============================
           ORDER STATUS
        ============================== */

        status: "Order Placed",

        orderStatus: "Order Placed",

        timeline,

        /* ==============================
           SHIPPING
        ============================== */

        shippingAddress,

        address: shippingAddress,

        addressId:
          selectedAddressId || null,

        /* ==============================
           META
        ============================== */

        source: "Karodrop Website",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      };

      /* =================================================
         SAVE ORDER
      ================================================= */

      const existingOrders = JSON.parse(
        localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
      );

      const orders = Array.isArray(existingOrders)
        ? existingOrders
        : [];

      orders.unshift(newOrder);

      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
      );

      /* =================================================
         NOTIFY OTHER COMPONENTS
      ================================================= */

      window.dispatchEvent(
        new CustomEvent("ordersUpdated", {
          detail: {
            order: newOrder,
          },
        })
      );

      /* =================================================
         CLEAR CART
      ================================================= */

      clearCart();

      /* =================================================
         ORDER SUCCESS
      ================================================= */

      navigate("/order-success", {
        replace: true,
        state: {
          orderId,
          orderNumber,
          total: finalTotal,
        },
      });
    } catch (submitError) {
      console.error("Order placement error:", submitError);

      setError(
        "Something went wrong while placing your order. Please try again."
      );

      setPlacingOrder(false);
    }
  }

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (!items.length) {
    return (
      <main className="min-h-[70vh] bg-[#F5FAFF] px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE7F2] bg-white text-2xl shadow-sm">
            🛒
          </div>

          <h1 className="mb-3 text-3xl font-bold text-[#0B1F3A]">
            Your cart is empty
          </h1>

          <p className="mb-7 text-sm leading-6 text-[#5E6B7A]">
            Add a customized product to your cart before proceeding
            to checkout.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#012467]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* =====================================================
     RENDER CHECKOUT
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#F5FAFF] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5E6B7A] transition-colors hover:text-[#0078ED]"
          >
            ← Back to Cart
          </Link>

          <h1 className="text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-[#5E6B7A]">
            Confirm your delivery details and place your Karodrop order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            {savedAddresses.length > 0 && (
              <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5">
                  <h2 className="text-lg font-bold text-[#0B1F3A]">
                    Saved Addresses
                  </h2>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    Select a saved address or enter a new delivery address below.
                  </p>
                </div>

                <div className="grid gap-3">
                  {savedAddresses.map((address, index) => {
                    const addressId =
                      getAddressId(address) ||
                      `saved-${index}`;

                    const selected =
                      selectedAddressId === addressId;

                    return (
                      <button
                        key={addressId}
                        type="button"
                        onClick={() => handleAddressSelect(address)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-[#0078ED] bg-[#F5FAFF]"
                            : "border-[#DCE7F2] bg-white hover:border-[#0078ED]"
                        }`}
                      >
                        <div className="flex items-start gap-3">

                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-[#0078ED] bg-[#0078ED]"
                                : "border-[#B8C8D8]"
                            }`}
                          >
                            {selected && (
                              <span className="text-xs text-white">
                                ✓
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-[#0B1F3A]">
                                {address?.name ||
                                  address?.fullName ||
                                  "Saved Address"}
                              </p>

                              {address?.isDefault && (
                                <span className="rounded-full bg-[#EAF4FF] px-2 py-0.5 text-[10px] font-semibold text-[#0078ED]">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                              {address?.house ||
                                address?.address ||
                                address?.addressLine ||
                                ""}
                              {address?.area
                                ? `, ${address.area}`
                                : ""}
                              {address?.city
                                ? `, ${address.city}`
                                : ""}
                              {address?.state
                                ? `, ${address.state}`
                                : ""}
                              {address?.pincode
                                ? ` - ${address.pincode}`
                                : ""}
                            </p>

                            {(address?.phone ||
                              address?.mobile) && (
                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                Phone:{" "}
                                {address?.phone ||
                                  address?.mobile}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =================================================
                DELIVERY DETAILS
            ================================================= */}

            <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Delivery Details
                </h2>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  Enter the address where you want your order delivered.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    Complete Address *
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Flat, Street, Area"
                    rows={4}
                    required
                    className="w-full resize-none rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>

                {/* STATE */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold text-[#0B1F3A]">
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                    className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#EAF4FF]"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Payment Method
                </h2>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  Select how you want to pay for this order.
                </p>
              </div>

              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                  paymentMethod === "COD"
                    ? "border-[#0078ED] bg-[#F5FAFF]"
                    : "border-[#DCE7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="h-4 w-4 accent-[#0078ED]"
                />

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-xl">
                  💵
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>

              <div className="mt-3 rounded-xl border border-dashed border-[#DCE7F2] bg-[#F5FAFF] p-4">
                <p className="text-xs leading-5 text-[#5E6B7A]">
                  Online payment can be connected later with a payment
                  gateway. Currently, Cash on Delivery is available.
                </p>
              </div>
            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE - ORDER SUMMARY
          ================================================= */}

          <aside className="h-fit lg:sticky lg:top-6">

            <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h2 className="text-lg font-bold text-[#0B1F3A]">
                  Order Summary
                </h2>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  {items.length} configured{" "}
                  {items.length === 1 ? "item" : "items"}
                </p>
              </div>

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div className="space-y-5">
                {items.map((item, index) => {
                  const quantity = getQuantity(item);
                  const unitPrice = getUnitPrice(item);

                  const itemKey =
                    item?.cartItemId ||
                    item?.id ||
                    `${item?._id || "item"}-${index}`;

                  return (
                    <div
                      key={itemKey}
                      className="border-b border-[#DCE7F2] pb-5 last:border-b-0 last:pb-0"
                    >

                      <div className="flex gap-3">

                        {/* IMAGE */}

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF]">
                          {item?.image ||
                          item?.product?.image ? (
                            <img
                              src={
                                item?.image ||
                                item?.product?.image
                              }
                              alt={
                                item?.title ||
                                item?.product?.title ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* BASIC INFO */}

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-semibold text-[#0B1F3A]">
                            {item?.title ||
                              item?.productName ||
                              item?.product?.title ||
                              "Product"}
                          </h3>

                          <p className="mt-1 text-xs text-[#5E6B7A]">
                            Qty: {quantity}
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#0078ED]">
                            ₹
                            {formatPrice(
                              unitPrice * quantity
                            )}
                          </p>
                        </div>
                      </div>

                      {/* =================================================
                          CONFIGURATION DETAILS
                      ================================================= */}

                      <div className="mt-4 rounded-xl bg-[#F5FAFF] p-3">

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0078ED]">
                          Order Configuration
                        </p>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">

                          {item?.brand && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Brand
                              </span>

                              <p className="mt-0.5 font-semibold text-[#0B1F3A]">
                                {typeof item.brand === "string"
                                  ? item.brand
                                  : item.brand?.name ||
                                    "Selected"}
                              </p>
                            </div>
                          )}

                          {item?.color && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Color
                              </span>

                              <p className="mt-0.5 font-semibold text-[#0B1F3A]">
                                {item.color}
                              </p>
                            </div>
                          )}

                          {item?.size && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Size
                              </span>

                              <p className="mt-0.5 font-semibold text-[#0B1F3A]">
                                {item.size}
                              </p>
                            </div>
                          )}

                          {item?.printingMethod && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Printing
                              </span>

                              <p className="mt-0.5 font-semibold text-[#0B1F3A]">
                                {item.printingMethod}
                              </p>
                            </div>
                          )}

                          {item?.printingPosition && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Placement
                              </span>

                              <p className="mt-0.5 font-semibold text-[#0B1F3A]">
                                {item.printingPosition}
                              </p>
                            </div>
                          )}

                          {item?.designName && (
                            <div>
                              <span className="text-[#5E6B7A]">
                                Design
                              </span>

                              <p className="mt-0.5 truncate font-semibold text-[#0B1F3A]">
                                {item.designName}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* DESIGN PREVIEW */}

                        {item?.designImage && (
                          <div className="mt-3 flex items-center gap-3 border-t border-[#DCE7F2] pt-3">
                            <div className="h-12 w-12 overflow-hidden rounded-lg border border-[#DCE7F2] bg-white">
                              <img
                                src={item.designImage}
                                alt="Uploaded design"
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5E6B7A]">
                                Design Uploaded
                              </p>

                              <p className="mt-0.5 text-xs font-medium text-[#0B1F3A]">
                                {item.designFileName ||
                                  item.designName ||
                                  "Custom design"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* CUSTOMER NOTES */}

                        {(item?.customerRequirements ||
                          item?.customerNotes ||
                          item?.notes) && (
                          <div className="mt-3 border-t border-[#DCE7F2] pt-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5E6B7A]">
                              Requirements
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#0B1F3A]">
                              {item?.customerRequirements ||
                                item?.customerNotes ||
                                item?.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  PRICE BREAKDOWN
              ================================================= */}

              <div className="mt-6 space-y-3 border-t border-[#DCE7F2] pt-5">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5E6B7A]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#0B1F3A]">
                    ₹{formatPrice(calculatedSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5E6B7A]">
                    Shipping
                  </span>

                  <span className="font-medium text-[#0078ED]">
                    {shippingFee === 0
                      ? "Free"
                      : `₹${formatPrice(shippingFee)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5E6B7A]">
                    GST / Taxes
                  </span>

                  <span className="font-medium text-[#0B1F3A]">
                    ₹{formatPrice(tax)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#DCE7F2] pt-4">
                  <span className="text-base font-bold text-[#0B1F3A]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#0078ED]">
                    ₹{formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* =================================================
                  PLACE ORDER
              ================================================= */}

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0078ED] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#012467] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-[#5E6B7A]">
                By placing this order, you confirm that your
                delivery details and customized product
                configuration are correct.
              </p>
            </section>

            {/* =================================================
                TRUST INFO
            ================================================= */}

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-[#DCE7F2] bg-white p-4 text-center shadow-sm">

              <div>
                <div className="text-lg">🔒</div>
                <p className="mt-1 text-[10px] font-medium text-[#5E6B7A]">
                  Secure Order
                </p>
              </div>

              <div>
                <div className="text-lg">📦</div>
                <p className="mt-1 text-[10px] font-medium text-[#5E6B7A]">
                  Packed Carefully
                </p>
              </div>

              <div>
                <div className="text-lg">🚚</div>
                <p className="mt-1 text-[10px] font-medium text-[#5E6B7A]">
                  Reliable Delivery
                </p>
              </div>

            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
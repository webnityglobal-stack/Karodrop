import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

const PRIMARY = "#0078ED";
const NAVY = "#012467";
const LIGHT_BLUE = "#EAF4FF";
const SOFT_BLUE = "#F5FAFF";
const BORDER = "#DCE7F2";
const TEXT = "#0B1F3A";
const MUTED = "#5E6B7A";

const PRINT_CATEGORIES = [
  "tshirts",
  "t-shirt",
  "tshirt",
];

export default function Cart() {
  const {
    items,
    updateQty,
    removeItem,
    subtotal,
    shipping,
    tax,
    total,
  } = useCart();

  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const getItemId = (item) => {
    return item.cartItemId || item._id;
  };

  const getQuantity = (item) => {
    return Number(
      item.qty || item.quantity || 1
    );
  };

  const getUnitPrice = (item) => {
    return Number(
      item.unitPrice ?? item.price ?? 0
    );
  };

  const getItemTotal = (item) => {
    return (
      getUnitPrice(item) *
      getQuantity(item)
    );
  };

  const isPrintProduct = (item) => {
    const category = String(
      item.category || ""
    ).toLowerCase();

    return PRINT_CATEGORIES.includes(
      category
    );
  };

  const getCategoryLabel = (category) => {
    if (!category) return "";

    const value = String(category)
      .toLowerCase()
      .trim();

    if (
      value === "tshirts" ||
      value === "t-shirt" ||
      value === "tshirt"
    ) {
      return "T-Shirts";
    }

    if (value === "jewellery") {
      return "Jewellery";
    }

    if (value === "handicrafts") {
      return "Handicrafts";
    }

    if (value === "idols") {
      return "Idols";
    }

    return category;
  };

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (items.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F5FAFF]">
        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#EAF4FF]
            opacity-80
            blur-[120px]
          "
        />

        <div
          className="
            relative
            mx-auto
            flex
            min-h-[70vh]
            w-full
            max-w-[1440px]
            items-center
            justify-center
            px-4
            py-20
            sm:px-6
            lg:px-10
          "
        >
          <div className="mx-auto max-w-md text-center">
            {/* Icon */}

            <div
              className="
                mx-auto
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                bg-white
                text-3xl
                shadow-sm
              "
              style={{
                borderColor: BORDER,
              }}
            >
              🛒
            </div>

            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: PRIMARY,
              }}
            >
              Karodrop Shopping
            </p>

            <h1
              className="
                font-display
                mb-4
                text-3xl
                text-[#0B1F3A]
                sm:text-4xl
              "
            >
              Your Cart is Empty
            </h1>

            <p
              className="
                mb-8
                text-sm
                leading-6
              "
              style={{
                color: MUTED,
              }}
            >
              Your customized products will appear
              here. Choose a product and create your
              order to get started.
            </p>

            <Link
              to="/"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
              "
              style={{
                backgroundColor: PRIMARY,
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     CART PAGE
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5FAFF]">
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          h-[550px]
          w-[550px]
          rounded-full
          bg-[#EAF4FF]
          opacity-80
          blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1440px]
          px-4
          py-8
          sm:px-6
          sm:py-12
          lg:px-10
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-10">
          <p
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
            "
            style={{
              color: PRIMARY,
            }}
          >
            Karodrop Shopping
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1
                className="
                  font-display
                  text-3xl
                  text-[#0B1F3A]
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Your Cart
              </h1>

              <p
                className="mt-3 text-sm"
                style={{
                  color: MUTED,
                }}
              >
                Review your customized products before
                checkout.
              </p>
            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                border
                bg-white
                px-4
                py-2
                text-xs
                font-semibold
              "
              style={{
                borderColor: BORDER,
                color: NAVY,
              }}
            >
              {items.length}{" "}
              {items.length === 1
                ? "Product"
                : "Products"}
            </div>
          </div>
        </div>

        {/* ===================================================
            CART LAYOUT
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-3
            lg:gap-12
          "
        >
          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section className="lg:col-span-2">
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                bg-white
                shadow-sm
              "
              style={{
                borderColor: BORDER,
              }}
            >
              {/* Header */}

              <div
                className="
                  border-b
                  px-5
                  py-5
                  sm:px-7
                "
                style={{
                  borderColor: BORDER,
                }}
              >
                <h2
                  className="
                    text-base
                    font-semibold
                  "
                  style={{
                    color: TEXT,
                  }}
                >
                  Customized Products
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: MUTED,
                  }}
                >
                  Review your product configuration,
                  quantity and customization details.
                </p>
              </div>

              {/* Product List */}

              <div>
                {items.map((item) => {
                  const itemId =
                    getItemId(item);

                  const quantity =
                    getQuantity(item);

                  const unitPrice =
                    getUnitPrice(item);

                  const itemTotal =
                    getItemTotal(item);

                  const printProduct =
                    isPrintProduct(item);

                  return (
                    <div
                      key={itemId}
                      className="
                        border-b
                        p-5
                        last:border-b-0
                        sm:p-7
                      "
                      style={{
                        borderColor: BORDER,
                      }}
                    >
                      <div className="flex flex-col gap-6">
                        {/* =================================================
                            PRODUCT MAIN
                        ================================================= */}

                        <div className="flex gap-4 sm:gap-6">
                          {/* Image */}

                          <Link
                            to={
                              item.slug
                                ? `/product/${item.slug}`
                                : "#"
                            }
                            className="shrink-0"
                          >
                            <div
                              className="
                                h-24
                                w-24
                                overflow-hidden
                                rounded-xl
                                bg-[#EAF4FF]
                                sm:h-32
                                sm:w-32
                              "
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={
                                    item.productName ||
                                    item.title ||
                                    "Product"
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-500
                                    hover:scale-105
                                  "
                                />
                              ) : (
                                <div
                                  className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    text-xs
                                  "
                                  style={{
                                    color: MUTED,
                                  }}
                                >
                                  No image
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Main Details */}

                          <div className="min-w-0 flex-1">
                            <Link
                              to={
                                item.slug
                                  ? `/product/${item.slug}`
                                  : "#"
                              }
                            >
                              <h3
                                className="
                                  text-sm
                                  font-semibold
                                  transition-colors
                                  hover:text-[#0078ED]
                                  sm:text-base
                                "
                                style={{
                                  color: TEXT,
                                }}
                              >
                                {item.productName ||
                                  item.title ||
                                  "Product"}
                              </h3>
                            </Link>

                            {item.category && (
                              <p
                                className="
                                  mt-1
                                  text-xs
                                "
                                style={{
                                  color: MUTED,
                                }}
                              >
                                {getCategoryLabel(
                                  item.category
                                )}
                              </p>
                            )}

                            {/* Brand */}

                            {item.brandName && (
                              <div className="mt-3">
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                  "
                                  style={{
                                    color: MUTED,
                                  }}
                                >
                                  Brand
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                  "
                                  style={{
                                    color: NAVY,
                                  }}
                                >
                                  {item.brandName}
                                </p>
                              </div>
                            )}

                            {/* Unit Price */}

                            <p
                              className="
                                mt-3
                                text-sm
                                font-bold
                              "
                              style={{
                                color: PRIMARY,
                              }}
                            >
                              {formatPrice(unitPrice)}
                              <span
                                className="
                                  ml-1
                                  text-[11px]
                                  font-normal
                                "
                                style={{
                                  color: MUTED,
                                }}
                              >
                                / unit
                              </span>
                            </p>
                          </div>

                          {/* Desktop Total */}

                          <div className="hidden text-right sm:block">
                            <p
                              className="
                                text-xs
                              "
                              style={{
                                color: MUTED,
                              }}
                            >
                              Item Total
                            </p>

                            <p
                              className="
                                mt-1
                                text-lg
                                font-bold
                              "
                              style={{
                                color: TEXT,
                              }}
                            >
                              {formatPrice(itemTotal)}
                            </p>
                          </div>
                        </div>

                        {/* =================================================
                            CONFIGURATION
                        ================================================= */}

                        <div
                          className="
                            rounded-2xl
                            border
                            bg-[#F5FAFF]
                            p-4
                            sm:p-5
                          "
                          style={{
                            borderColor: BORDER,
                          }}
                        >
                          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p
                                className="
                                  text-sm
                                  font-bold
                                "
                                style={{
                                  color: NAVY,
                                }}
                              >
                                Product Configuration
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                "
                                style={{
                                  color: MUTED,
                                }}
                              >
                                Your selected customization
                                details.
                              </p>
                            </div>

                            <span
                              className="
                                rounded-full
                                bg-white
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                              "
                              style={{
                                color: PRIMARY,
                              }}
                            >
                              Configured
                            </span>
                          </div>

                          {/* Configuration Grid */}

                          <div
                            className="
                              grid
                              grid-cols-2
                              gap-x-5
                              gap-y-5
                              sm:grid-cols-4
                            "
                          >
                            {/* Brand */}

                            {item.brandName && (
                              <div>
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                  "
                                  style={{
                                    color: MUTED,
                                  }}
                                >
                                  Brand
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                  "
                                  style={{
                                    color: TEXT,
                                  }}
                                >
                                  {item.brandName}
                                </p>
                              </div>
                            )}

                            {/* Color */}

                            {printProduct &&
                              item.color && (
                                <div>
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-wide
                                    "
                                    style={{
                                      color: MUTED,
                                    }}
                                  >
                                    Color
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      font-semibold
                                    "
                                    style={{
                                      color: TEXT,
                                    }}
                                  >
                                    {item.color}
                                  </p>
                                </div>
                              )}

                            {/* Size */}

                            {printProduct &&
                              item.size && (
                                <div>
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-wide
                                    "
                                    style={{
                                      color: MUTED,
                                    }}
                                  >
                                    Size
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      font-semibold
                                    "
                                    style={{
                                      color: TEXT,
                                    }}
                                  >
                                    {item.size}
                                  </p>
                                </div>
                              )}

                            {/* Printing Method */}

                            {printProduct &&
                              item.printingMethod && (
                                <div>
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-wide
                                    "
                                    style={{
                                      color: MUTED,
                                    }}
                                  >
                                    Printing Method
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      font-semibold
                                    "
                                    style={{
                                      color: TEXT,
                                    }}
                                  >
                                    {item.printingMethod}
                                  </p>
                                </div>
                              )}

                            {/* Placement */}

                            {printProduct &&
                              item.printingPosition && (
                                <div>
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-wide
                                    "
                                    style={{
                                      color: MUTED,
                                    }}
                                  >
                                    Placement
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      font-semibold
                                    "
                                    style={{
                                      color: TEXT,
                                    }}
                                  >
                                    {item.printingPosition}
                                  </p>
                                </div>
                              )}

                            {/* Quantity */}

                            <div>
                              <p
                                className="
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wide
                                "
                                style={{
                                  color: MUTED,
                                }}
                              >
                                Quantity
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-sm
                                  font-semibold
                                "
                                style={{
                                  color: TEXT,
                                }}
                              >
                                {quantity}
                              </p>
                            </div>
                          </div>

                          {/* =================================================
                              DESIGN
                          ================================================= */}

                          {printProduct && (
                            <div
                              className="
                                mt-6
                                border-t
                                pt-5
                              "
                              style={{
                                borderColor: BORDER,
                              }}
                            >
                              <p
                                className="
                                  mb-3
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wide
                                "
                                style={{
                                  color: MUTED,
                                }}
                              >
                                Customer Design
                              </p>

                              <div className="flex items-center gap-4">
                                {/* Preview */}

                                <div
                                  className="
                                    h-16
                                    w-16
                                    shrink-0
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    bg-white
                                  "
                                  style={{
                                    borderColor: BORDER,
                                  }}
                                >
                                  {item.designImage ? (
                                    <img
                                      src={
                                        item.designImage
                                      }
                                      alt="Customer design"
                                      className="
                                        h-full
                                        w-full
                                        object-contain
                                      "
                                    />
                                  ) : (
                                    <div
                                      className="
                                        flex
                                        h-full
                                        w-full
                                        items-center
                                        justify-center
                                        text-[10px]
                                        text-center
                                      "
                                      style={{
                                        color: MUTED,
                                      }}
                                    >
                                      No Design
                                    </div>
                                  )}
                                </div>

                                {/* Name */}

                                <div className="min-w-0">
                                  <p
                                    className="
                                      text-sm
                                      font-semibold
                                    "
                                    style={{
                                      color: TEXT,
                                    }}
                                  >
                                    {item.designName ||
                                      item.designFileName ||
                                      "Customer Design"}
                                  </p>

                                  {item.designFileName &&
                                    item.designName !==
                                      item.designFileName && (
                                      <p
                                        className="
                                          mt-1
                                          truncate
                                          text-xs
                                        "
                                        style={{
                                          color: MUTED,
                                        }}
                                      >
                                        {
                                          item.designFileName
                                        }
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* =================================================
                              REQUIREMENTS
                          ================================================= */}

                          {item.customerNotes &&
                            String(
                              item.customerNotes
                            ).trim() && (
                              <div
                                className="
                                  mt-6
                                  border-t
                                  pt-5
                                "
                                style={{
                                  borderColor: BORDER,
                                }}
                              >
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                  "
                                  style={{
                                    color: MUTED,
                                  }}
                                >
                                  Customer Requirements
                                </p>

                                <p
                                  className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-6
                                  "
                                  style={{
                                    color: TEXT,
                                  }}
                                >
                                  {item.customerNotes}
                                </p>
                              </div>
                            )}
                        </div>

                        {/* =================================================
                            ACTION ROW
                        ================================================= */}

                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            border-t
                            pt-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                          style={{
                            borderColor: BORDER,
                          }}
                        >
                          {/* Quantity */}

                          <div className="flex items-center gap-3">
                            <span
                              className="
                                text-xs
                                font-medium
                              "
                              style={{
                                color: MUTED,
                              }}
                            >
                              Quantity
                            </span>

                            <div
                              className="
                                inline-flex
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                bg-white
                              "
                              style={{
                                borderColor: BORDER,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(
                                    itemId,
                                    Math.max(
                                      1,
                                      quantity - 1
                                    )
                                  )
                                }
                                disabled={
                                  quantity <= 1
                                }
                                aria-label="Decrease quantity"
                                className="
                                  h-9
                                  w-9
                                  text-lg
                                  transition-colors
                                  hover:bg-[#EAF4FF]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                                style={{
                                  color: NAVY,
                                }}
                              >
                                −
                              </button>

                              <span
                                className="
                                  flex
                                  h-9
                                  w-10
                                  items-center
                                  justify-center
                                  border-x
                                  text-sm
                                  font-semibold
                                "
                                style={{
                                  borderColor: BORDER,
                                  color: TEXT,
                                }}
                              >
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(
                                    itemId,
                                    quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                                className="
                                  h-9
                                  w-9
                                  text-lg
                                  transition-colors
                                  hover:bg-[#EAF4FF]
                                "
                                style={{
                                  color: NAVY,
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Actions */}

                          <div className="flex items-center gap-5">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/design-request?edit=${encodeURIComponent(
                                    itemId
                                  )}`
                                )
                              }
                              className="
                                text-xs
                                font-semibold
                                transition-colors
                                hover:underline
                              "
                              style={{
                                color: PRIMARY,
                              }}
                            >
                              Edit Configuration
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(itemId)
                              }
                              className="
                                text-xs
                                font-medium
                                text-red-500
                                transition-colors
                                hover:text-red-700
                              "
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Mobile Total */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            sm:hidden
                          "
                        >
                          <span
                            className="text-xs"
                            style={{
                              color: MUTED,
                            }}
                          >
                            Item Total
                          </span>

                          <span
                            className="
                              text-base
                              font-bold
                            "
                            style={{
                              color: TEXT,
                            }}
                          >
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Shopping */}

            <Link
              to="/"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                transition-all
                hover:gap-3
              "
              style={{
                color: PRIMARY,
              }}
            >
              ← Continue Shopping
            </Link>
          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:col-span-1">
            <div
              className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
                sm:p-7
                lg:sticky
                lg:top-28
              "
              style={{
                borderColor: BORDER,
              }}
            >
              <p
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                "
                style={{
                  color: PRIMARY,
                }}
              >
                Order Summary
              </p>

              <h2
                className="
                  font-display
                  mb-7
                  text-2xl
                "
                style={{
                  color: TEXT,
                }}
              >
                Your Order
              </h2>

              {/* Subtotal */}

              <div className="mb-4 flex justify-between text-sm">
                <span
                  style={{
                    color: MUTED,
                  }}
                >
                  Subtotal
                </span>

                <span
                  className="font-semibold"
                  style={{
                    color: TEXT,
                  }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}

              <div className="mb-4 flex justify-between text-sm">
                <span
                  style={{
                    color: MUTED,
                  }}
                >
                  Shipping
                </span>

                <span
                  className="font-semibold"
                  style={{
                    color:
                      Number(shipping || 0) === 0
                        ? PRIMARY
                        : TEXT,
                  }}
                >
                  {Number(shipping || 0) === 0
                    ? "Free"
                    : formatPrice(shipping)}
                </span>
              </div>

              {/* Tax */}

              <div className="mb-5 flex justify-between text-sm">
                <span
                  style={{
                    color: MUTED,
                  }}
                >
                  Taxes / GST
                </span>

                <span
                  className="font-medium"
                  style={{
                    color: Number(tax || 0)
                      ? TEXT
                      : MUTED,
                  }}
                >
                  {Number(tax || 0)
                    ? formatPrice(tax)
                    : "Calculated at checkout"}
                </span>
              </div>

              {/* Total */}

              <div
                className="
                  mb-6
                  border-t
                  pt-5
                "
                style={{
                  borderColor: BORDER,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-semibold"
                    style={{
                      color: TEXT,
                    }}
                  >
                    Total
                  </span>

                  <span
                    className="text-xl font-bold"
                    style={{
                      color: PRIMARY,
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-[11px]
                    leading-5
                  "
                  style={{
                    color: MUTED,
                  }}
                >
                  Final shipping charges and applicable
                  taxes will be confirmed during checkout.
                </p>
              </div>

              {/* Checkout */}

              <button
                type="button"
                onClick={() =>
                  navigate("/checkout")
                }
                className="
                  w-full
                  rounded-xl
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
                style={{
                  backgroundColor: PRIMARY,
                }}
              >
                Proceed to Checkout →
              </button>

              {/* Trust */}

              <div
                className="
                  mt-7
                  space-y-4
                  border-t
                  pt-6
                "
                style={{
                  borderColor: BORDER,
                }}
              >
                {/* Secure */}

                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#EAF4FF]
                      text-sm
                    "
                  >
                    🔒
                  </div>

                  <div>
                    <p
                      className="
                        text-xs
                        font-semibold
                      "
                      style={{
                        color: TEXT,
                      }}
                    >
                      Secure Checkout
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        leading-5
                      "
                      style={{
                        color: MUTED,
                      }}
                    >
                      Your information is protected.
                    </p>
                  </div>
                </div>

                {/* Production */}

                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#EAF4FF]
                      text-sm
                    "
                  >
                    🎨
                  </div>

                  <div>
                    <p
                      className="
                        text-xs
                        font-semibold
                      "
                      style={{
                        color: TEXT,
                      }}
                    >
                      Custom Production
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        leading-5
                      "
                      style={{
                        color: MUTED,
                      }}
                    >
                      Your selected configuration is used
                      for production.
                    </p>
                  </div>
                </div>

                {/* Shipping */}

                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#EAF4FF]
                      text-sm
                    "
                  >
                    🚚
                  </div>

                  <div>
                    <p
                      className="
                        text-xs
                        font-semibold
                      "
                      style={{
                        color: TEXT,
                      }}
                    >
                      Reliable Shipping
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        leading-5
                      "
                      style={{
                        color: MUTED,
                      }}
                    >
                      We carefully process and dispatch
                      your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ===================================================
            DROPSHIPPING INFORMATION
        =================================================== */}

        <section className="mt-20 sm:mt-24">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              p-7
              text-white
              sm:p-10
            "
            style={{
              backgroundColor: NAVY,
            }}
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-60
                w-60
                rounded-full
                opacity-20
                blur-3xl
              "
              style={{
                backgroundColor: PRIMARY,
              }}
            />

            <div className="relative max-w-3xl">
              <p
                className="
                  mb-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#EAF4FF]
                "
              >
                For Store Owners
              </p>

              <h2
                className="
                  font-display
                  mb-3
                  text-2xl
                  sm:text-3xl
                "
              >
                Selling through your own store?
              </h2>

              <p
                className="
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/75
                "
              >
                Connect your store with Karodrop and let
                us handle product customization, production,
                packaging and shipping for your customers.
              </p>

              <Link
                to="/creator-store"
                className="
                  mt-6
                  inline-flex
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                "
                style={{
                  color: NAVY,
                }}
              >
                Explore Dropshipping →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
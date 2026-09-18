import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();

  const orderNumber = location.state?.orderNumber;
  const total = location.state?.total;

  return (
    <main className="relative min-h-[75vh] overflow-hidden bg-[#F5FAFF] flex items-center justify-center px-4 py-20">
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

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
          pointer-events-none
          absolute
          -top-40
          -right-40
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#EAF4FF]
          opacity-60
          blur-[120px]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* SUCCESS ICON */}

        <div
          className="
            mx-auto
            mb-7
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-white
            border
            border-[#DCE7F2]
            shadow-sm
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[#0078ED]
              text-white
              text-2xl
              font-semibold
            "
          >
            ✓
          </div>
        </div>

        {/* SMALL LABEL */}

        <p
          className="
            mb-3
            text-xs
            font-semibold
            tracking-[0.25em]
            text-[#0078ED]
            uppercase
          "
        >
          Order Confirmed
        </p>

        {/* HEADING */}

        <h1
          className="
            font-display
            text-4xl
            sm:text-5xl
            text-[#0B1F3A]
            mb-5
          "
        >
          Your order has been placed!
        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            mx-auto
            max-w-lg
            text-sm
            sm:text-base
            leading-7
            text-[#5E6B7A]
            mb-8
          "
        >
          Thank you for shopping with Karodrop. We've received
          your order successfully and will process it shortly.
        </p>

        {/* =====================================================
            ORDER INFORMATION
        ===================================================== */}

        {(orderNumber || total) && (
          <div
            className="
              mx-auto
              mb-6
              max-w-md
              rounded-2xl
              border
              border-[#DCE7F2]
              bg-white
              px-6
              py-5
              shadow-sm
            "
          >
            <div className="grid grid-cols-2 gap-4 text-left">

              {/* ORDER NUMBER */}

              <div>
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.12em]
                    font-semibold
                    text-[#5E6B7A]
                    mb-1
                  "
                >
                  Order Number
                </p>

                <p
                  className="
                    text-sm
                    font-bold
                    text-[#0B1F3A]
                    break-all
                  "
                >
                  {orderNumber || "Confirmed"}
                </p>
              </div>

              {/* TOTAL */}

              <div className="text-right">
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.12em]
                    font-semibold
                    text-[#5E6B7A]
                    mb-1
                  "
                >
                  Order Total
                </p>

                <p
                  className="
                    text-sm
                    font-bold
                    text-[#0078ED]
                  "
                >
                  ₹{Number(total || 0).toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            COD INFO
        ===================================================== */}

        <div
          className="
            mx-auto
            mb-9
            max-w-md
            rounded-2xl
            border
            border-[#DCE7F2]
            bg-white
            px-6
            py-5
            text-left
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#EAF4FF]
                text-xl
              "
            >
              💵
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-semibold
                  text-[#0B1F3A]
                  mb-1
                "
              >
                Cash on Delivery
              </h3>

              <p
                className="
                  text-xs
                  leading-5
                  text-[#5E6B7A]
                "
              >
                Please keep the order amount ready. You can pay
                in cash when your package arrives.
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            ORDER BENEFITS
        ===================================================== */}

        <div
          className="
            mb-9
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
            sm:gap-8
            text-xs
            text-[#5E6B7A]
          "
        >
          <span className="flex items-center justify-center gap-1.5">
            <span>📦</span>
            Carefully Packed
          </span>

          <span className="flex items-center justify-center gap-1.5">
            <span>🚚</span>
            Reliable Shipping
          </span>

          <span className="flex items-center justify-center gap-1.5">
            <span className="text-[#0078ED]">✓</span>
            Order Confirmed
          </span>
        </div>

        {/* =====================================================
            CTA BUTTONS
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-3
          "
        >

          {/* VIEW ORDERS */}

          <Link
            to="/orders"
            className="
              inline-flex
              items-center
              justify-center
              min-w-[150px]
              bg-[#0078ED]
              text-white
              px-7
              py-3.5
              text-sm
              font-semibold
              rounded-xl
              hover:bg-[#012467]
              transition-colors
            "
          >
            View Orders
            <span className="ml-2">
              →
            </span>
          </Link>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              min-w-[150px]
              bg-white
              text-[#0B1F3A]
              border
              border-[#DCE7F2]
              px-7
              py-3.5
              text-sm
              font-semibold
              rounded-xl
              hover:border-[#0078ED]
              hover:text-[#0078ED]
              transition-colors
            "
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </main>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="mt-24 bg-[#012467] text-white">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">

          {/* =================================================
              BRAND
          ================================================== */}
          <div className="lg:pr-8">

            <Link
              to="/"
              className="mb-4 inline-block text-3xl font-semibold tracking-wide text-white transition hover:text-[#EAF4FF]"
            >
              Karodrop
            </Link>

            <p className="max-w-sm text-sm leading-6 text-white/65">
              Discover products worth selling and loving — from fashion to
              handcrafted treasures, all in one place.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#012467]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="18"
                    height="18"
                    x="3"
                    y="3"
                    rx="5"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#012467]"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v4h4v-4h3.2l.8-4H13V9c0-.7.3-1 1-1z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#012467]"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white hover:text-[#012467]"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-1.5 0-3.2.4-4.6l1.1-4.6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.3-2 3.3-4.9 0-2.6-1.9-4.4-4.6-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.3 1.9.8 2.4.1.1.1.2.1.4l-.3 1.2c-.1.4-.4.5-.8.3-1.4-.7-2.3-2.8-2.3-4.5 0-3.7 2.7-7.1 7.7-7.1 4 0 7.1 2.9 7.1 6.7 0 4-2.5 7.2-6 7.2-1.2 0-2.4-.6-2.8-1.4l-.7 2.8c-.3 1.4-1.1 3.1-1.6 4.1.6.2 1.3.3 2 .3a9 9 0 1 0 0-18Z" />
                </svg>
              </a>

            </div>
          </div>

          {/* =================================================
              SHOP
          ================================================== */}
          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/50">
              Shop
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/category/new-products"
                  className="text-white/70 transition hover:text-white"
                >
                  New Products
                </Link>
              </li>

              <li>
                <Link
                  to="/category/best-sellers"
                  className="text-white/70 transition hover:text-white"
                >
                  Best Sellers
                </Link>
              </li>

              <li>
                <Link
                  to="/category/tshirts"
                  className="text-white/70 transition hover:text-white"
                >
                  T-Shirts
                </Link>
              </li>

              <li>
                <Link
                  to="/category/handicrafts"
                  className="text-white/70 transition hover:text-white"
                >
                  Handicrafts
                </Link>
              </li>

              <li>
                <Link
                  to="/category/jewellery"
                  className="text-white/70 transition hover:text-white"
                >
                  Jewellery
                </Link>
              </li>

              <li>
                <Link
                  to="/category/idols"
                  className="text-white/70 transition hover:text-white"
                >
                  Idols
                </Link>
              </li>

            </ul>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================== */}
          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/50">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/"
                  className="text-white/70 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/category/all"
                  className="text-white/70 transition hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/creator-store"
                  className="text-white/70 transition hover:text-white"
                >
                  Creator Store
                </Link>
              </li>

              <li>
                <Link
                  to="/track-order"
                  className="text-white/70 transition hover:text-white"
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  to="/my-orders"
                  className="text-white/70 transition hover:text-white"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-white/70 transition hover:text-white"
                >
                  Wishlist
                </Link>
              </li>

            </ul>
          </div>

          {/* =================================================
              NEWSLETTER
          ================================================== */}
          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/50">
              Stay in the Loop
            </h3>

            <p className="mb-5 text-sm leading-6 text-white/65">
              Get updates about new products, latest collections and special
              offers.
            </p>

            {subscribed ? (

              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-medium">
                  You're subscribed! ✓
                </p>

                <p className="mt-1 text-xs text-white/55">
                  Thanks for joining the Karodrop community.
                </p>
              </div>

            ) : (

              <form
                onSubmit={handleSubscribe}
                className="space-y-3"
              >

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/40
                    focus:border-[#0087F5]
                    focus:ring-2
                    focus:ring-[#0087F5]/20
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    rounded-lg
                    bg-white
                    py-3
                    text-sm
                    font-semibold
                    text-[#012467]
                    transition
                    hover:bg-[#EAF4FF]
                  "
                >
                  Subscribe
                </button>

              </form>

            )}

          </div>
        </div>

        {/* ===================================================
            TRUST FEATURES
        ==================================================== */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 md:grid-cols-4">

          {/* COD */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#EAF4FF]">
              ✓
            </div>

            <div>
              <p className="text-xs font-medium">
                Cash on Delivery
              </p>

              <p className="text-[11px] text-white/45">
                Available
              </p>
            </div>

          </div>

          {/* Secure Checkout */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#EAF4FF]">
              ✓
            </div>

            <div>
              <p className="text-xs font-medium">
                Secure Checkout
              </p>

              <p className="text-[11px] text-white/45">
                Safe & protected
              </p>
            </div>

          </div>

          {/* Returns */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#EAF4FF]">
              ✓
            </div>

            <div>
              <p className="text-xs font-medium">
                Easy Returns
              </p>

              <p className="text-[11px] text-white/45">
                Simple process
              </p>
            </div>

          </div>

          {/* Shipping */}
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#EAF4FF]">
              ✓
            </div>

            <div>
              <p className="text-xs font-medium">
                Reliable Shipping
              </p>

              <p className="text-[11px] text-white/45">
                Delivered with care
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}
      <div className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <p className="text-center text-xs text-white/45 md:text-left">
              © {new Date().getFullYear()} Karodrop. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">

              <Link
                to="/privacy-policy"
                className="text-white/45 transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-white/45 transition hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/shipping-policy"
                className="text-white/45 transition hover:text-white"
              >
                Shipping Policy
              </Link>

              <Link
                to="/refund-policy"
                className="text-white/45 transition hover:text-white"
              >
                Refund Policy
              </Link>

            </div>

          </div>

        </div>
      </div>

    </footer>
  );
}
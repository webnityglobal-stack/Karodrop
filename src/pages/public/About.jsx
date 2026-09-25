import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="bg-white text-[#0B1F3A]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#F5FAFF]">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#0078ED]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#0087F5]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">

          <div className="max-w-3xl">

            <span className="inline-flex rounded-full border border-[#0078ED]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0078ED]">
              About Karodrop
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#012467] sm:text-5xl md:text-6xl">
              Build your business.
              <span className="block text-[#0078ED]">
                We handle the dropshipping.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#5E6B7A] sm:text-lg">
              Karodrop is a dropshipping platform designed to make online
              selling simpler. Discover products, add them to your store,
              receive orders and grow your business without managing
              traditional inventory.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
              >
                Explore Products
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-[#DCE7F2] bg-white px-6 py-3 text-sm font-semibold text-[#012467] transition hover:border-[#0078ED] hover:text-[#0078ED]"
              >
                How It Works
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-[#0078ED]">
              What is Karodrop?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#012467] sm:text-4xl">
              A simpler way to start selling online
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Starting an online business can involve sourcing products,
              maintaining inventory, packing orders and coordinating
              deliveries. Karodrop brings the product-selling process
              together in one platform so sellers can focus more on
              discovering products, building their stores and reaching
              customers.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              With a dropshipping model, you can sell products without
              keeping every product in your own inventory. When a customer
              places an order, the order can move through the fulfillment
              process while you focus on growing your business.
            </p>

          </div>

          <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-8 sm:p-10">

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4FF] text-xl text-[#0078ED]">
                  🛍️
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#012467]">
                  Product Discovery
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6B7A]">
                  Find products you can explore and sell.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4FF] text-xl text-[#0078ED]">
                  📦
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#012467]">
                  Order Fulfillment
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6B7A]">
                  Move customer orders through the fulfillment process.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4FF] text-xl text-[#0078ED]">
                  🚚
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#012467]">
                  Shipping Support
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6B7A]">
                  Keep shipping and order movement organized.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4FF] text-xl text-[#0078ED]">
                  📈
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#012467]">
                  Business Growth
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6B7A]">
                  Spend more time growing your online business.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          HOW KARODROP WORKS
      ====================================================== */}
      <section className="bg-[#F5FAFF]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-[#0078ED]">
              The Karodrop Model
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#012467] sm:text-4xl">
              From product discovery to customer delivery
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#5E6B7A]">
              Karodrop is built around a straightforward dropshipping
              workflow.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">

            {/* Step 1 */}
            <div className="relative rounded-2xl border border-[#DCE7F2] bg-white p-6">

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0078ED] text-sm font-bold text-white">
                01
              </span>

              <h3 className="mt-5 text-lg font-bold text-[#012467]">
                Discover
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                Explore products and identify items that fit your store
                and customers.
              </p>

            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-[#DCE7F2] bg-white p-6">

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0078ED] text-sm font-bold text-white">
                02
              </span>

              <h3 className="mt-5 text-lg font-bold text-[#012467]">
                Sell
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                Add products to your selling channel and present them to
                your customers.
              </p>

            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-[#DCE7F2] bg-white p-6">

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0078ED] text-sm font-bold text-white">
                03
              </span>

              <h3 className="mt-5 text-lg font-bold text-[#012467]">
                Order
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                When customers place orders, the order enters the
                fulfillment workflow.
              </p>

            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-[#DCE7F2] bg-white p-6">

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0078ED] text-sm font-bold text-white">
                04
              </span>

              <h3 className="mt-5 text-lg font-bold text-[#012467]">
                Deliver
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                Products move through fulfillment and shipping toward the
                customer.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          WHY KARODROP
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-[#0078ED]">
              Built For Sellers
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#012467] sm:text-4xl">
              Focus on your business, not on storing products
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Dropshipping can reduce the need to purchase and store large
              quantities of inventory upfront. Karodrop is designed to help
              sellers organize the product and order journey from one place.
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex items-center rounded-lg bg-[#012467] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0078ED]"
            >
              Start Selling
            </Link>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-2xl">📦</span>
              <h3 className="mt-4 font-bold text-[#012467]">
                Less Inventory Pressure
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                A dropshipping model can reduce the need for sellers to
                maintain their own product stock.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-2xl">🌐</span>
              <h3 className="mt-4 font-bold text-[#012467]">
                Sell Online
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Build your online product catalog and reach customers
                through your selling channels.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-2xl">⚡</span>
              <h3 className="mt-4 font-bold text-[#012467]">
                Simple Workflow
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Keep product discovery, orders and fulfillment connected
                through one workflow.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-2xl">🚀</span>
              <h3 className="mt-4 font-bold text-[#012467]">
                Grow With Your Store
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Test products, understand what your customers want and
                build your store over time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          WHO CAN USE KARODROP
      ====================================================== */}
      <section className="bg-[#012467] text-white">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-[#8CC8FF]">
              Made For Modern Sellers
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Start where you are and build from there.
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">
              Whether you're exploring ecommerce for the first time or
              already selling online, Karodrop is designed around the
              everyday workflow of product-based businesses.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">🧑‍💻</div>
              <h3 className="mt-5 text-lg font-bold">
                New Entrepreneurs
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Explore ecommerce and start building your first online
                product business.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">🛒</div>
              <h3 className="mt-5 text-lg font-bold">
                Online Sellers
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Expand your catalog and explore additional products for
                your existing store.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">✨</div>
              <h3 className="mt-5 text-lg font-bold">
                Creators
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Turn your audience and product ideas into an online
                selling opportunity.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl bg-[#EAF4FF] px-6 py-12 text-center sm:px-12">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#0078ED]">
            Your Store Starts Here
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold text-[#012467] sm:text-4xl">
            Ready to explore dropshipping with Karodrop?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#5E6B7A]">
            Explore products, understand the workflow and take the next
            step toward building your online store.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg bg-[#0078ED] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
            >
              Explore Products
            </Link>

            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-[#C8DDF1] bg-white px-7 py-3 text-sm font-semibold text-[#012467] transition hover:border-[#0078ED] hover:text-[#0078ED]"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
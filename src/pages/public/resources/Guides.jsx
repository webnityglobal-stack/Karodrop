import React from "react";
import { Link } from "react-router-dom";

const guides = [
  {
    number: "01",
    title: "Choose Your Niche",
    description:
      "Start by choosing a focused product category that you understand and can build a clear customer audience around.",
    topics: [
      "Understand your target customer",
      "Explore different product categories",
      "Study customer demand",
      "Identify a focused niche",
    ],
  },
  {
    number: "02",
    title: "Find the Right Products",
    description:
      "Learn how to evaluate products before adding them to your online store.",
    topics: [
      "Check product demand",
      "Compare product pricing",
      "Review product quality",
      "Consider competition",
    ],
  },
  {
    number: "03",
    title: "Build Your Store",
    description:
      "Create a professional storefront where customers can easily discover products and place orders.",
    topics: [
      "Organize your products",
      "Create clear product listings",
      "Add product images",
      "Make navigation simple",
    ],
  },
  {
    number: "04",
    title: "Set Your Pricing",
    description:
      "Understand how product cost, selling price and other business expenses affect your margins.",
    topics: [
      "Understand product cost",
      "Set a suitable selling price",
      "Consider platform expenses",
      "Plan your profit margin",
    ],
  },
  {
    number: "05",
    title: "Create Better Product Listings",
    description:
      "Give customers the information they need to understand your product and make a buying decision.",
    topics: [
      "Write clear product titles",
      "Create useful descriptions",
      "Use quality images",
      "Highlight important features",
    ],
  },
  {
    number: "06",
    title: "Get Your First Orders",
    description:
      "Prepare your store for customers and use practical methods to start generating your first sales.",
    topics: [
      "Promote your products",
      "Use social media",
      "Build customer trust",
      "Improve your buying experience",
    ],
  },
  {
    number: "07",
    title: "Understand Fulfillment",
    description:
      "Learn what happens after a customer places an order and how fulfillment connects your store with delivery.",
    topics: [
      "Receive customer orders",
      "Process the order",
      "Prepare products for dispatch",
      "Track delivery",
    ],
  },
  {
    number: "08",
    title: "Manage Customer Experience",
    description:
      "Build trust by keeping customers informed and providing a smooth experience before and after purchase.",
    topics: [
      "Communicate order updates",
      "Handle customer questions",
      "Manage returns and issues",
      "Build customer trust",
    ],
  },
  {
    number: "09",
    title: "Grow Your Store",
    description:
      "Once your store starts getting traction, focus on improving products, customers and overall business performance.",
    topics: [
      "Track your sales",
      "Identify popular products",
      "Improve your listings",
      "Build repeat customers",
    ],
  },
];

const quickSteps = [
  {
    title: "Choose",
    text: "Find a niche and products that fit your target customers.",
    icon: "⌕",
  },
  {
    title: "Build",
    text: "Create a professional store with clear product information.",
    icon: "▣",
  },
  {
    title: "Sell",
    text: "Promote your products and start connecting with customers.",
    icon: "↗",
  },
  {
    title: "Fulfill",
    text: "Process orders and move products through fulfillment and delivery.",
    icon: "□",
  },
  {
    title: "Grow",
    text: "Use your results to improve your store and expand your business.",
    icon: "↑",
  },
];

function Guides() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">

        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10 lg:py-24">

          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#5E6B7A]">

            <Link
              to="/"
              className="transition hover:text-[#0078ED]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/resources"
              className="transition hover:text-[#0078ED]"
            >
              Resources
            </Link>

            <span>/</span>

            <span className="font-medium text-[#0B1F3A]">
              Guides & Tutorials
            </span>

          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">

            {/* Left */}
            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
                KaroDrop Guides
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
                Your step-by-step guide to{" "}
                <span className="text-[#0078ED]">
                  dropshipping
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
                Learn the essential steps of building an online selling
                business, from choosing your niche and products to getting
                orders, fulfillment and growing your store.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#guides"
                  className="
                    inline-flex items-center justify-center
                    rounded-full bg-[#0078ED]
                    px-7 py-3.5
                    text-sm font-semibold text-white
                    transition hover:bg-[#012467]
                  "
                >
                  Explore Guides
                  <span className="ml-2">↓</span>
                </a>

                <Link
                  to="/resources/faqs"
                  className="
                    inline-flex items-center justify-center
                    rounded-full border border-[#DCE7F2]
                    bg-white px-7 py-3.5
                    text-sm font-semibold text-[#0B1F3A]
                    transition hover:border-[#0078ED]
                    hover:text-[#0078ED]
                  "
                >
                  View FAQs
                </Link>

              </div>

            </div>

            {/* Right visual */}
            <div className="rounded-3xl border border-[#DCE7F2] bg-[#EAF4FF] p-5 sm:p-7">

              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                      Seller Journey
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#0B1F3A]">
                      From idea to store
                    </h2>
                  </div>

                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-xl bg-[#0078ED]
                      text-xl text-white
                    "
                  >
                    ↗
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  {quickSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="
                        flex items-center gap-3
                        rounded-xl border
                        border-[#DCE7F2]
                        bg-[#F5FAFF]
                        px-4 py-3
                      "
                    >

                      <div
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg bg-white
                          text-[#0078ED]
                          shadow-sm
                        "
                      >
                        {step.icon}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#0B1F3A]">
                            {step.title}
                          </span>

                          <span className="text-[10px] font-semibold text-[#8A98A8]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs leading-5 text-[#6B7A8B]">
                          {step.text}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="max-w-3xl">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Start Here
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Everything you need to build your foundation
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5E6B7A] sm:text-base">
            Dropshipping is more than adding products to a website. A
            successful store needs the right products, clear positioning,
            thoughtful pricing, a reliable fulfillment process and a
            customer experience people can trust.
          </p>

        </div>

      </section>

      {/* =====================================================
          GUIDES
      ====================================================== */}
      <section
        id="guides"
        className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 md:pb-20 lg:px-10"
      >

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {guides.map((guide) => (
            <article
              key={guide.number}
              className="
                group rounded-3xl
                border border-[#DCE7F2]
                bg-white p-6
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-lg
                sm:p-8
              "
            >

              {/* Header */}
              <div className="flex items-start gap-5">

                <div
                  className="
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-xl bg-[#EAF4FF]
                    text-sm font-bold text-[#0078ED]
                    transition
                    group-hover:bg-[#0078ED]
                    group-hover:text-white
                  "
                >
                  {guide.number}
                </div>

                <div className="min-w-0">

                  <h3 className="text-xl font-semibold text-[#0B1F3A] sm:text-2xl">
                    {guide.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                    {guide.description}
                  </p>

                </div>

              </div>

              {/* Topics */}
              <div className="mt-7 border-t border-[#E8EFF5] pt-6">

                <p className="mb-4 text-xs font-semibold uppercase tracking-[1.5px] text-[#7A8795]">
                  What you'll learn
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  {guide.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-start gap-2"
                    >

                      <span
                        className="
                          mt-0.5 flex h-5 w-5
                          shrink-0 items-center justify-center
                          rounded-full bg-[#EAF4FF]
                          text-[11px] font-bold text-[#0078ED]
                        "
                      >
                        ✓
                      </span>

                      <span className="text-sm leading-5 text-[#4F6072]">
                        {topic}
                      </span>

                    </div>
                  ))}

                </div>

              </div>

              {/* Bottom */}
              <div className="mt-7 flex items-center justify-between border-t border-[#E8EFF5] pt-5">

                <span className="text-xs font-medium text-[#8A98A8]">
                  KaroDrop Seller Guide
                </span>

                <span className="text-sm font-semibold text-[#0078ED] transition group-hover:translate-x-1">
                  Learn more →
                </span>

              </div>

            </article>
          ))}

        </div>

      </section>

      {/* =====================================================
          DROPSHIPPING WORKFLOW
      ====================================================== */}
      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">

            {/* Text */}
            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                The Big Picture
              </p>

              <h2 className="text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">
                How a dropshipping order moves
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">
                Understanding the complete journey helps you make better
                decisions when building your store and preparing for
                customers.
              </p>

            </div>

            {/* Workflow */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[
                {
                  number: "01",
                  title: "Product",
                  text: "Select products for your store.",
                },
                {
                  number: "02",
                  title: "Store",
                  text: "Present products to customers.",
                },
                {
                  number: "03",
                  title: "Order",
                  text: "Customer places an order.",
                },
                {
                  number: "04",
                  title: "Processing",
                  text: "Order moves into fulfillment.",
                },
                {
                  number: "05",
                  title: "Delivery",
                  text: "Product reaches the customer.",
                },
                {
                  number: "06",
                  title: "Experience",
                  text: "Support the customer after purchase.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="
                    rounded-2xl
                    border border-[#DCE7F2]
                    bg-[#F5FAFF]
                    p-5
                  "
                >

                  <span className="text-xs font-bold text-[#0078ED]">
                    {item.number}
                  </span>

                  <h3 className="mt-3 text-base font-semibold text-[#0B1F3A]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#5E6B7A]">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Keep Learning
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Have questions about dropshipping?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Find quick answers to common questions about products, orders,
            fulfillment, payments and selling with KaroDrop.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/resources/faqs"
              className="
                inline-flex items-center justify-center
                rounded-full bg-white
                px-7 py-3.5
                text-sm font-semibold text-[#012467]
                transition hover:bg-[#EAF4FF]
              "
            >
              Browse FAQs
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/resources/help-center"
              className="
                inline-flex items-center justify-center
                rounded-full
                border border-white/20
                px-7 py-3.5
                text-sm font-semibold text-white
                transition
                hover:border-white
                hover:bg-white/10
              "
            >
              Visit Help Center
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Guides;
import React from "react";
import { Link } from "react-router-dom";

const resources = [
  {
    title: "Blog",
    description:
      "Explore e-commerce trends, dropshipping insights, product ideas and business strategies.",
    icon: "✦",
    link: "/resources/blog",
    label: "Explore Blog",
  },
  {
    title: "Guides & Tutorials",
    description:
      "Learn how to start, manage and grow your online selling journey with practical guides.",
    icon: "▣",
    link: "/resources/guides",
    label: "View Guides",
  },
  {
    title: "Selling Tips",
    description:
      "Discover practical tips for choosing products, creating listings and increasing sales.",
    icon: "↗",
    link: "/resources/selling-tips",
    label: "Learn Selling Tips",
  },
  {
    title: "FAQs",
    description:
      "Find quick answers about products, orders, payments, shipping and selling with KaroDrop.",
    icon: "?",
    link: "/resources/faqs",
    label: "Browse FAQs",
  },
  {
    title: "Help Center",
    description:
      "Need assistance? Find helpful information for your account, orders and selling journey.",
    icon: "◉",
    link: "/resources/help-center",
    label: "Visit Help Center",
  },
];

const topics = [
  "Getting Started",
  "Finding Products",
  "Building Your Store",
  "Getting Your First Order",
];

function Resources() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs text-[#5E6B7A]">
            <Link
              to="/"
              className="transition hover:text-[#0078ED]"
            >
              Home
            </Link>

            <span className="text-[#AAB8C7]">/</span>

            <span className="font-medium text-[#0B1F3A]">
              Resources
            </span>
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
              KaroDrop Resources
            </p>

            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
              Everything you need to{" "}
              <span className="text-[#0078ED]">
                sell smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
              Learn, discover and grow with KaroDrop. Explore practical
              guides, selling tips, helpful answers and resources designed
              to make your online selling journey easier.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/resources/guides"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-[#0078ED] px-7 py-3.5
                  text-sm font-semibold text-white
                  shadow-sm transition hover:bg-[#012467]
                "
              >
                Explore Guides
                <span className="ml-2">→</span>
              </Link>

              <Link
                to="/resources/help-center"
                className="
                  inline-flex items-center justify-center
                  rounded-full border border-[#DCE7F2]
                  bg-white px-7 py-3.5
                  text-sm font-semibold text-[#0B1F3A]
                  transition hover:border-[#0078ED]
                  hover:text-[#0078ED]
                "
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCE CARDS */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Explore Resources
          </p>

          <h2 className="font-display text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Learn at your own pace
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#5E6B7A] sm:text-base">
            Whether you're just getting started or looking to grow your
            store, find the information you need in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.title}
              to={resource.link}
              className="
                group flex min-h-[250px] flex-col
                rounded-2xl border border-[#DCE7F2]
                bg-white p-7 shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-lg
              "
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-xl bg-[#EAF4FF]
                  text-xl font-semibold text-[#0078ED]
                  transition
                  group-hover:bg-[#0078ED]
                  group-hover:text-white
                "
              >
                {resource.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#0B1F3A]">
                {resource.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                {resource.description}
              </p>

              <div className="mt-auto pt-6">
                <span className="inline-flex items-center text-sm font-semibold text-[#0078ED]">
                  {resource.label}

                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GETTING STARTED */}
      <section className="border-y border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                New to KaroDrop?
              </p>

              <h2 className="font-display text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
                Start your selling journey with confidence.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
                Starting an online business can feel overwhelming. Our
                resources break the process into simple, practical steps
                so you can move forward with clarity.
              </p>

              <Link
                to="/resources/guides"
                className="
                  mt-7 inline-flex items-center
                  rounded-full bg-[#012467]
                  px-6 py-3 text-sm font-semibold text-white
                  transition hover:bg-[#0078ED]
                "
              >
                Start With Our Guides
                <span className="ml-2">→</span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map((topic, index) => (
                <Link
                  key={topic}
                  to="/resources/guides"
                  className="
                    group rounded-xl border border-[#DCE7F2]
                    bg-[#F5FAFF] p-5
                    transition hover:border-[#0078ED]
                    hover:bg-white
                  "
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="
                        flex h-9 w-9 shrink-0 items-center
                        justify-center rounded-full
                        bg-[#EAF4FF]
                        text-sm font-semibold text-[#0078ED]
                        group-hover:bg-[#0078ED]
                        group-hover:text-white
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-semibold text-[#0B1F3A]">
                      {topic}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SELL SMARTER */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Built for Online Sellers
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Learn faster. Sell better. Grow your business.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            From your first product selection to growing your online store,
            KaroDrop resources are here to help you make better decisions
            at every step.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/products"
              className="
                inline-flex items-center justify-center
                rounded-full bg-white px-7 py-3.5
                text-sm font-semibold text-[#012467]
                transition hover:bg-[#EAF4FF]
              "
            >
              Explore Products
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/signup"
              className="
                inline-flex items-center justify-center
                rounded-full border border-white/20
                px-7 py-3.5 text-sm font-semibold text-white
                transition hover:border-white hover:bg-white/10
              "
            >
              Start Selling
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default Resources;
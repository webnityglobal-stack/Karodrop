import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I add a new product?",
    answer:
      "Go to Products from the seller sidebar and click Add Product. Enter your product details, pricing, inventory and images, then save the product.",
  },
  {
    question: "How can I manage my orders?",
    answer:
      "Open Orders from your seller panel. You can search orders, filter them by status and review customer and product information.",
  },
  {
    question: "When will I receive my payout?",
    answer:
      "Payouts are processed according to your seller payout schedule. You can check your payout history and available balance from the Payouts section.",
  },
  {
    question: "How can I update my store information?",
    answer:
      "Open My Store from the seller sidebar. You can update your store name, URL, description, email and phone number.",
  },
  {
    question: "How can I update my seller profile?",
    answer:
      "Open Settings to manage your seller account preferences and notification settings.",
  },
  {
    question: "What should I do if an order has a problem?",
    answer:
      "Open the relevant order from the Orders section and review its details. If the issue cannot be resolved, contact Karodrop seller support.",
  },
];

const topics = [
  {
    icon: "🛍",
    title: "Products",
    description: "Add, edit and manage your products.",
    link: "/seller/products",
  },
  {
    icon: "📦",
    title: "Orders",
    description: "Manage customer orders and order status.",
    link: "/seller/orders",
  },
  {
    icon: "💰",
    title: "Payouts",
    description: "View earnings and payout information.",
    link: "/seller/payouts",
  },
  {
    icon: "🏪",
    title: "My Store",
    description: "Manage your store information.",
    link: "/seller/store",
  },
];

export default function SellerHelp() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqs.filter((faq) => {
    const searchText = search.toLowerCase();

    return (
      faq.question.toLowerCase().includes(searchText) ||
      faq.answer.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
          Seller Support
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
          Help & Support
        </h1>

        <p className="mt-1 text-sm text-[#5E6B7A]">
          Find answers, manage common seller issues and contact Karodrop
          support.
        </p>
      </div>

      {/* =====================================================
          SUPPORT HERO
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0078ED] to-[#012467] p-6 text-white sm:p-8">

        <div className="max-w-2xl">

          <p className="text-sm font-medium text-blue-100">
            Seller Support Center
          </p>

          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            How can we help you?
          </h2>

          <p className="mt-2 text-sm leading-6 text-blue-100">
            Search our seller help resources or browse common topics below.
          </p>

          {/* Search */}
          <div className="mt-6">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your question..."
              className="
                w-full
                rounded-xl
                border
                border-white/20
                bg-white
                px-4
                py-3.5
                text-sm
                text-[#0B1F3A]
                outline-none
                placeholder:text-[#7A8795]
              "
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          QUICK TOPICS
      ====================================================== */}

      <div>

        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Browse Help Topics
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Quickly find help for different areas of your seller account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {topics.map((topic) => (
            <Link
              key={topic.title}
              to={topic.link}
              className="
                rounded-2xl
                border
                border-[#DCE7F2]
                bg-white
                p-5
                transition
                hover:-translate-y-0.5
                hover:border-[#0078ED]
                hover:shadow-sm
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl">
                {topic.icon}
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#0B1F3A]">
                {topic.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                {topic.description}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#0078ED]">
                Open Section →
              </p>

            </Link>
          ))}

        </div>

      </div>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Find quick answers to common seller questions.
          </p>

        </div>

        <div className="divide-y divide-[#DCE7F2]">

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question}>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-5
                      text-left
                      transition
                      hover:bg-[#F5FAFF]
                      sm:px-6
                    "
                  >

                    <span className="text-sm font-semibold text-[#0B1F3A]">
                      {faq.question}
                    </span>

                    <span
                      className={`
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EAF4FF]
                        text-[#0078ED]
                        transition-transform
                        ${isOpen ? "rotate-45" : ""}
                      `}
                    >
                      +
                    </span>

                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6">

                      <div className="rounded-xl bg-[#F5FAFF] p-4">

                        <p className="text-sm leading-6 text-[#5E6B7A]">
                          {faq.answer}
                        </p>

                      </div>

                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center sm:px-6">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5FAFF] text-2xl">
                🔍
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[#0B1F3A]">
                No results found
              </h3>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Try searching with different keywords.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-semibold text-[#0078ED] hover:underline"
              >
                Clear Search
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          CONTACT SUPPORT
      ====================================================== */}

      <div className="grid gap-5 md:grid-cols-2">

        {/* Contact Support */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl">
            💬
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">
            Still need help?
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            If you cannot find the answer you're looking for, contact our
            seller support team.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "mailto:support@karodrop.com?subject=Seller Support Request";
            }}
            className="
              mt-5
              rounded-xl
              bg-[#0078ED]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#012467]
            "
          >
            Contact Support
          </button>

        </div>

        {/* Support Information */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl">
            🕘
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">
            Seller Support
          </h3>

          <div className="mt-4 space-y-3">

            <div>
              <p className="text-xs text-[#5E6B7A]">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                support@karodrop.com
              </p>
            </div>

            <div>
              <p className="text-xs text-[#5E6B7A]">
                Support Hours
              </p>

              <p className="mt-1 text-sm font-medium text-[#0B1F3A]">
                Monday – Saturday
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                10:00 AM – 6:00 PM
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SELLER HELP NOTE
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

        <div className="flex gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0078ED]">
            ℹ
          </div>

          <div>

            <h3 className="text-sm font-semibold text-[#0B1F3A]">
              Before contacting support
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
              Please keep your order ID, product information or relevant
              account details ready. This helps the support team resolve
              your issue faster.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
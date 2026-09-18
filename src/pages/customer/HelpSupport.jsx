import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Go to Orders from your customer panel. Open the required order to view its current status, tracking information and delivery details.",
  },
  {
    question: "How can I submit my own design?",
    answer:
      "Select a product, click Create Product and complete the customization process by selecting your brand, design, printing details and quantity.",
  },
  {
    question: "Can I use different designs for different products?",
    answer:
      "Yes. You can configure each product separately with its own design, printing details, brand and quantity.",
  },
  {
    question: "How can I raise a delivery issue?",
    answer:
      "Open Orders, select the relevant order and use the Need Help option to raise an issue related to delivery or your order.",
  },
  {
    question: "Can I have multiple brands?",
    answer:
      "Yes. You can create and manage multiple brands from the My Brands section of your customer panel.",
  },
  {
    question: "Can I edit my product configuration?",
    answer:
      "If the configured item is still in your cart, use Edit Configuration to update its details before checkout.",
  },
];

const supportOptions = [
  {
    icon: "📦",
    title: "Order & Delivery",
    description: "Track your order or get help with delivery-related issues.",
    action: "View My Orders",
    link: "/orders",
  },
  {
    icon: "🎨",
    title: "Design Help",
    description: "Need help with your design, printing or customization?",
    action: "View Designs",
    link: "/designs",
  },
  {
    icon: "🔄",
    title: "Return & Replacement",
    description: "Get assistance with damaged, incorrect or replacement orders.",
    action: "Get Order Help",
    link: "/orders",
  },
  {
    icon: "💳",
    title: "Payment Help",
    description: "Questions about payment, checkout or your order amount?",
    action: "Go to Checkout",
    link: "/cart",
  },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* Header */}
      <section className="bg-white border-b border-[#DCE7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#0078ED] mb-2">
              CUSTOMER SUPPORT
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Help & Support
            </h1>

            <p className="mt-3 text-[#5E6B7A] text-base sm:text-lg">
              Find answers to common questions or get help with your orders,
              designs and account.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Support */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold">How can we help?</h2>
            <p className="text-sm text-[#5E6B7A] mt-1">
              Choose a category to get quick assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {supportOptions.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#DCE7F2] rounded-2xl p-5 hover:border-[#0078ED] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-2xl">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg mt-4">{item.title}</h3>

                <p className="text-sm text-[#5E6B7A] mt-2 min-h-[42px]">
                  {item.description}
                </p>

                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
                >
                  {item.action}
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-[#5E6B7A] mt-1">
              Quick answers to common Karodrop questions.
            </p>
          </div>

          <div className="bg-white border border-[#DCE7F2] rounded-2xl overflow-hidden">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className={`border-b border-[#DCE7F2] last:border-b-0 ${
                    isOpen ? "bg-[#F5FAFF]" : "bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-5 hover:bg-[#F5FAFF] transition"
                  >
                    <span className="font-semibold text-[#0B1F3A]">
                      {faq.question}
                    </span>

                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full bg-[#EAF4FF] text-[#0078ED] flex items-center justify-center font-bold transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-6 text-[#5E6B7A] max-w-4xl">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mt-10">
          <div className="bg-[#012467] rounded-2xl px-6 py-8 sm:px-8 sm:py-9 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-[#8FC7FF] text-sm font-semibold mb-2">
                  NEED MORE HELP?
                </p>

                <h2 className="text-2xl font-bold">
                  Our support team is here for you.
                </h2>

                <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-2xl">
                  If you cannot find the answer you're looking for, contact our
                  support team and share your order or design details.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:support@karodrop.com"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-[#012467] font-semibold text-sm hover:bg-[#EAF4FF] transition"
                >
                  Email Support
                </a>

                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom links */}
        <section className="mt-8 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <Link
              to="/profile"
              className="text-[#5E6B7A] hover:text-[#0078ED]"
            >
              Account & Profile
            </Link>

            <Link
              to="/settings"
              className="text-[#5E6B7A] hover:text-[#0078ED]"
            >
              Settings
            </Link>

            <Link
              to="/addresses"
              className="text-[#5E6B7A] hover:text-[#0078ED]"
            >
              Addresses
            </Link>

            <Link
              to="/my-brands"
              className="text-[#5E6B7A] hover:text-[#0078ED]"
            >
              My Brands
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
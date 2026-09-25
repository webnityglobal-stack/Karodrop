import React from "react";
import { Link } from "react-router-dom";

const articles = [
  {
    category: "Dropshipping",
    title: "What Is Dropshipping and How Does It Work?",
    description:
      "Understand the dropshipping model, from selecting products and receiving orders to fulfillment and customer delivery.",
    readTime: "5 min read",
  },
  {
    category: "Getting Started",
    title: "How to Start a Dropshipping Business",
    description:
      "A practical introduction to choosing a niche, finding products, setting up your store and preparing for your first order.",
    readTime: "7 min read",
  },
  {
    category: "Product Research",
    title: "How to Choose Products for Your Online Store",
    description:
      "Learn what to consider when selecting products, including customer demand, pricing, competition and product quality.",
    readTime: "6 min read",
  },
  {
    category: "Selling",
    title: "How to Create Product Listings That Convert",
    description:
      "Improve your product pages with clear titles, useful descriptions, quality images and information customers actually need.",
    readTime: "5 min read",
  },
  {
    category: "Ecommerce",
    title: "How to Get Your First Dropshipping Order",
    description:
      "Explore practical ways to prepare your store, promote your products and create a better buying experience for new customers.",
    readTime: "6 min read",
  },
  {
    category: "Fulfillment",
    title: "Understanding Product Fulfillment in Dropshipping",
    description:
      "Learn how orders move from your store to processing, production, packaging and delivery after a customer places an order.",
    readTime: "5 min read",
  },
  {
    category: "Branding",
    title: "Why Branding Matters for Dropshipping Stores",
    description:
      "Build a recognizable store by creating consistent product presentation, messaging and customer experiences.",
    readTime: "6 min read",
  },
  {
    category: "Growth",
    title: "How to Grow Your Online Store Step by Step",
    description:
      "Understand the key areas to improve as your store grows, from product selection and customer experience to repeat sales.",
    readTime: "7 min read",
  },
  {
    category: "Print on Demand",
    title: "Getting Started With Print on Demand",
    description:
      "Learn how custom designs can be turned into products without keeping traditional inventory for every design.",
    readTime: "6 min read",
  },
];

function Blog() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10 lg:py-24">

          {/* BREADCRUMB */}
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
              Blog
            </span>
          </div>

          {/* HERO CONTENT */}
          <div className="max-w-4xl">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
              KaroDrop Blog
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
              Ideas and insights to{" "}
              <span className="text-[#0078ED]">
                sell smarter
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
              Explore practical dropshipping and ecommerce insights to help
              you choose better products, understand fulfillment, improve
              your store and build a stronger online selling business.
            </p>

          </div>
        </div>
      </section>

      {/* FEATURED TOPIC */}
      <section className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">

        <div
          className="
            overflow-hidden rounded-3xl
            border border-[#DCE7F2]
            bg-[#EAF4FF]
          "
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

            {/* LEFT */}
            <div className="p-7 sm:p-10 lg:p-14">

              <span
                className="
                  inline-flex rounded-full
                  border border-[#B9D9F5]
                  bg-white px-4 py-2
                  text-xs font-semibold
                  text-[#0078ED]
                "
              >
                Featured Topic
              </span>

              <h2 className="mt-6 text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">
                Build your dropshipping journey with the right foundation
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
                Successful online selling starts with understanding the
                basics. Learn how product selection, store setup, pricing,
                fulfillment and customer experience work together.
              </p>

              <Link
                to="/resources/guides"
                className="
                  mt-7 inline-flex items-center
                  rounded-full bg-[#0078ED]
                  px-6 py-3
                  text-sm font-semibold text-white
                  transition hover:bg-[#012467]
                "
              >
                Explore Seller Guides
                <span className="ml-2">→</span>
              </Link>

            </div>

            {/* RIGHT VISUAL */}
            <div className="flex min-h-[300px] items-center justify-center bg-[#DCEEFF] p-8 lg:min-h-[380px]">

              <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white p-6 shadow-xl">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex h-14 w-14 shrink-0
                      items-center justify-center
                      rounded-2xl bg-[#0078ED]
                      text-2xl text-white
                    "
                  >
                    📦
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
                      KaroDrop
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-[#0B1F3A]">
                      Dropshipping Workflow
                    </h3>
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  {[
                    "Choose products",
                    "Create your store",
                    "Receive customer orders",
                    "Fulfill and deliver",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="
                        flex items-center gap-3
                        rounded-xl bg-[#F5FAFF]
                        px-4 py-3
                      "
                    >
                      <span
                        className="
                          flex h-7 w-7 shrink-0
                          items-center justify-center
                          rounded-full bg-[#EAF4FF]
                          text-xs font-bold text-[#0078ED]
                        "
                      >
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-[#0B1F3A]">
                        {step}
                      </span>
                    </div>
                  ))}

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="mb-10">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Latest Articles
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Learn more about online selling
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
            Practical topics for new sellers, growing businesses and anyone
            exploring the world of dropshipping and ecommerce.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {articles.map((article) => (
            <article
              key={article.title}
              className="
                group flex min-h-[360px]
                flex-col overflow-hidden
                rounded-2xl border
                border-[#DCE7F2]
                bg-white
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-lg
              "
            >

              {/* CARD VISUAL */}
              <div
                className="
                  flex h-40
                  items-center justify-center
                  bg-[#EAF4FF]
                "
              >
                <div
                  className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-2xl bg-white
                    text-2xl text-[#0078ED]
                    shadow-sm
                    transition
                    group-hover:scale-105
                  "
                >
                  📘
                </div>
              </div>

              {/* CARD CONTENT */}
              <div className="flex flex-1 flex-col p-6">

                <div className="flex items-center justify-between gap-3">

                  <span className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
                    {article.category}
                  </span>

                  <span className="whitespace-nowrap text-xs text-[#7A8795]">
                    {article.readTime}
                  </span>

                </div>

                <h3 className="mt-4 text-xl font-semibold leading-snug text-[#0B1F3A]">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                  {article.description}
                </p>

                <button
                  type="button"
                  className="
                    mt-auto pt-6
                    text-left text-sm
                    font-semibold text-[#0078ED]
                    transition
                    hover:text-[#012467]
                  "
                >
                  Read Article →
                </button>

              </div>
            </article>
          ))}

        </div>
      </section>

      {/* SELLER JOURNEY */}
      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                Seller Journey
              </p>

              <h2 className="text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">
                From your first product to your next customer
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">
                Every online store starts somewhere. Learn the key stages of
                building a dropshipping business and understand what to focus
                on as you move forward.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {[
                {
                  number: "01",
                  title: "Choose",
                  text: "Explore products and identify opportunities for your store.",
                },
                {
                  number: "02",
                  title: "Build",
                  text: "Create a clear and professional shopping experience.",
                },
                {
                  number: "03",
                  title: "Sell",
                  text: "Promote your products and connect with customers.",
                },
                {
                  number: "04",
                  title: "Grow",
                  text: "Improve your store using customer and sales insights.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="
                    rounded-2xl
                    border border-[#DCE7F2]
                    bg-[#F5FAFF]
                    p-6
                  "
                >
                  <span className="text-sm font-bold text-[#0078ED]">
                    {item.number}
                  </span>

                  <h3 className="mt-3 text-lg font-semibold text-[#0B1F3A]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Keep Learning
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to learn more about dropshipping?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Explore our step-by-step guides for practical information about
            products, stores, orders, fulfillment and growing your business.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/resources/guides"
              className="
                inline-flex items-center justify-center
                rounded-full bg-white
                px-7 py-3.5
                text-sm font-semibold text-[#012467]
                transition hover:bg-[#EAF4FF]
              "
            >
              Explore Guides
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/resources/faqs"
              className="
                inline-flex items-center justify-center
                rounded-full
                border border-white/20
                px-7 py-3.5
                text-sm font-semibold text-white
                transition hover:border-white
                hover:bg-white/10
              "
            >
              View FAQs
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Blog;
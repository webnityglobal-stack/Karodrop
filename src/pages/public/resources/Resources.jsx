import React from "react";
import { Link } from "react-router-dom";

const resourceCards = [
  {
    icon: "📝",
    title: "Blog",
    description:
      "Explore useful articles about dropshipping, product selection, online selling and building your store",
    link: "/resources/blog",
    linkText: "Read the Blog",
  },
  {
    icon: "📚",
    title: "Guides & Tutorials",
    description:
      "Follow practical step-by-step guides to understand dropshipping and build your seller journey",
    link: "/resources/guides",
    linkText: "Explore Guides",
  },
  {
    icon: "💡",
    title: "Selling Tips",
    description:
      "Discover practical tips for product listings, pricing, customer trust, promotion and store growth",
    link: "/resources/selling-tips",
    linkText: "View Selling Tips",
  },
  {
    icon: "❓",
    title: "FAQs",
    description:
      "Find quick answers to common questions about products, orders, fulfillment, selling and KaroDrop",
    link: "/resources/faqs",
    linkText: "Browse FAQs",
  },
  {
    icon: "💬",
    title: "Help Center",
    description:
      "Find helpful information by topic and get guidance for common dropshipping questions",
    link: "/resources/help-center",
    linkText: "Visit Help Center",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Learn",
    description:
      "Understand the basics of dropshipping and how an online selling business works",
  },
  {
    number: "02",
    title: "Choose",
    description:
      "Learn how to select a niche and products that fit your target customers",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Create your store, improve product listings and prepare your business for customers",
  },
  {
    number: "04",
    title: "Sell",
    description:
      "Use practical selling strategies to reach customers and generate your first orders",
  },
  {
    number: "05",
    title: "Grow",
    description:
      "Use customer feedback and sales insights to improve and grow your store",
  },
];

function Resources() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#012467]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0078ED]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#0087F5]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-4xl text-center">

            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 sm:text-sm">
              KaroDrop Resources
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Everything you need to{" "}
              <span className="text-[#8CC8FF]">
                build and grow
              </span>{" "}
              your dropshipping business
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Learn the fundamentals, discover practical strategies and find
              helpful answers for every stage of your dropshipping journey
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/resources/guides"
                className="inline-flex items-center justify-center rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0078ED]/20 transition hover:bg-[#0068CF]"
              >
                Start With Guides
              </Link>

              <Link
                to="/resources/faqs"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Browse FAQs
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* RESOURCE INTRO */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-12">

          {/* Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0078ED]">
              Explore KaroDrop
            </span>

            <h2 className="mt-2.5 text-2xl font-bold leading-tight text-[#0B1F3A] sm:text-3xl lg:text-4xl">
              Learn at your own pace
            </h2>

            <p className="mt-3.5 text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Starting a dropshipping business can feel overwhelming when
              there are many things to understand. KaroDrop Resources brings
              useful information together in one place so you can learn,
              explore and take the next step with more clarity
            </p>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Whether you are learning the basics, looking for selling ideas
              or trying to solve a common question, choose the resource that
              matches what you need right now
            </p>

            <Link
              to="/resources/help-center"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0078ED] transition hover:text-[#0068CF]"
            >
              Need help finding something?
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Journey Visual */}
          <div className="relative">
            <div className="rounded-2xl bg-[#012467] p-4 shadow-xl sm:p-5">

              <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:p-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0078ED] text-xl">
                    🚀
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
                      Your seller journey
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                      Learn. Build. Sell. Grow.
                    </h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Learn", "Understand the basics"],
                    ["Build", "Create your store"],
                    ["Sell", "Reach your customers"],
                    ["Grow", "Improve your business"],
                  ].map(([title, text], index) => (
                    <div
                      key={title}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-[#8CC8FF]">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {title}
                        </p>

                        <p className="mt-0.5 text-xs text-blue-200">
                          {text}
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

      {/* RESOURCE CARDS */}
      <section className="border-y border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0078ED]">
              Resource Library
            </span>

            <h2 className="mt-2.5 text-2xl font-bold text-[#0B1F3A] sm:text-3xl lg:text-4xl">
              Find the right resource
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Choose from articles, guides, practical tips, frequently asked
              questions and help resources
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceCards.map((resource) => (
              <Link
                key={resource.title}
                to={resource.link}
                className="group flex h-full flex-col rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#9CCDF7] hover:bg-white hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl">
                    {resource.icon}
                  </div>

                  <span className="text-lg text-[#0078ED] transition-transform group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="mt-4 text-lg font-bold text-[#0B1F3A] transition group-hover:text-[#0078ED]">
                  {resource.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                  {resource.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0078ED]">
                  {resource.linkText}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* SELLER JOURNEY */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0078ED]">
            Your Journey
          </span>

          <h2 className="mt-2.5 text-2xl font-bold text-[#0B1F3A] sm:text-3xl lg:text-4xl">
            From learning to growing
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#5E6B7A] sm:text-base">
            Use KaroDrop Resources as a reference throughout your seller
            journey
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {journeySteps.map((step, index) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-[#DCE7F2] bg-white p-5 transition hover:border-[#B9D9F5] hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF] text-xs font-bold text-[#0078ED]">
                {step.number}
              </div>

              <h3 className="mt-3 text-lg font-bold text-[#0B1F3A]">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                {step.description}
              </p>

              {index !== journeySteps.length - 1 && (
                <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg font-bold text-[#0078ED] lg:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* FEATURED GUIDES */}
      <section className="bg-[#EAF4FF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

            {/* Left */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0078ED]">
                Start Here
              </span>

              <h2 className="mt-2.5 text-2xl font-bold leading-tight text-[#0B1F3A] sm:text-3xl lg:text-4xl">
                Building your dropshipping foundation
              </h2>

              <p className="mt-3.5 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
                Before focusing on sales, it helps to understand the
                fundamentals. Learn how to choose a niche, select products,
                create better listings and prepare your store for customers
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to="/resources/guides"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0068CF]"
                >
                  Explore Guides
                </Link>

                <Link
                  to="/resources/blog"
                  className="inline-flex items-center justify-center rounded-xl border border-[#BFD8EE] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
                >
                  Read Articles
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-md sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0078ED]">
                Recommended starting points
              </p>

              <div className="mt-4 space-y-3">

                <Link
                  to="/resources/guides"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#DCE7F2] p-4 transition hover:border-[#9CCDF7] hover:bg-[#F8FBFF]"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      Choose Your Niche
                    </h3>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Understand who you want to sell to
                    </p>
                  </div>

                  <span className="shrink-0 text-[#0078ED] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/resources/guides"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#DCE7F2] p-4 transition hover:border-[#9CCDF7] hover:bg-[#F8FBFF]"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      Find the Right Products
                    </h3>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Learn what makes a product suitable
                    </p>
                  </div>

                  <span className="shrink-0 text-[#0078ED] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/resources/selling-tips"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#DCE7F2] p-4 transition hover:border-[#9CCDF7] hover:bg-[#F8FBFF]"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      Improve Your Selling
                    </h3>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Use practical ideas to improve your store
                    </p>
                  </div>

                  <span className="shrink-0 text-[#0078ED] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#012467] px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-12">

          <span className="text-2xl">🚀</span>

          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to take the next step?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Explore the resources that match your current stage and keep
            building your dropshipping knowledge step by step
          </p>

          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">

            <Link
              to="/resources/guides"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#012467] transition hover:bg-[#EAF4FF]"
            >
              Explore Guides
            </Link>

            <Link
              to="/resources/help-center"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Visit Help Center
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Resources;
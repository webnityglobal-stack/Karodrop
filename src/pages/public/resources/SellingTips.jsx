import React from "react";
import { Link } from "react-router-dom";

const tips = [
  {
    number: "01",
    category: "Product Selection",
    title: "Choose products with a clear customer need",
    description:
      "Before adding a product to your store, understand who needs it and what problem it can solve. A clear customer need gives your product a stronger reason to be purchased.",
    action: "Research your customer",
  },
  {
    number: "02",
    category: "Product Research",
    title: "Do not add products just because they are trending",
    description:
      "Trends can change quickly. Look beyond popularity and consider product quality, customer demand, competition, pricing and whether the product fits your store.",
    action: "Evaluate the full opportunity",
  },
  {
    number: "03",
    category: "Pricing",
    title: "Price for both customers and your business",
    description:
      "Your selling price should make sense to customers while leaving enough room to cover your product cost and other business expenses.",
    action: "Understand your margins",
  },
  {
    number: "04",
    category: "Product Listings",
    title: "Write product titles that are easy to understand",
    description:
      "Keep product titles clear and relevant. Customers should quickly understand what the product is without having to read a long paragraph.",
    action: "Keep titles simple",
  },
  {
    number: "05",
    category: "Product Listings",
    title: "Use product descriptions to answer customer questions",
    description:
      "A useful description should explain the product, important features, available options and information that can help customers make a confident decision.",
    action: "Write for the buyer",
  },
  {
    number: "06",
    category: "Store Experience",
    title: "Keep your store simple to navigate",
    description:
      "Customers should be able to discover products, understand their options and move toward checkout without unnecessary steps or confusion.",
    action: "Make buying easier",
  },
  {
    number: "07",
    category: "Product Images",
    title: "Show products clearly",
    description:
      "Good product visuals help customers understand what they are buying. Use clear images that show the product from useful angles and highlight important details.",
    action: "Improve product presentation",
  },
  {
    number: "08",
    category: "Marketing",
    title: "Promote products where your customers spend time",
    description:
      "Instead of trying every marketing channel at once, understand your target audience and focus on platforms where they are most likely to discover your products.",
    action: "Know your audience",
  },
  {
    number: "09",
    category: "Social Media",
    title: "Create useful content instead of only selling",
    description:
      "Product demonstrations, tips, comparisons and educational content can help people understand your products before they are ready to buy.",
    action: "Build useful content",
  },
  {
    number: "10",
    category: "Customer Trust",
    title: "Be clear about orders and delivery",
    description:
      "Set realistic expectations around order processing, shipping and delivery. Clear information helps reduce confusion and creates a better customer experience.",
    action: "Communicate clearly",
  },
  {
    number: "11",
    category: "Customer Service",
    title: "Respond to customer questions quickly",
    description:
      "Helpful and timely communication can make customers feel supported and can prevent small questions from becoming larger problems.",
    action: "Stay responsive",
  },
  {
    number: "12",
    category: "Growth",
    title: "Use your sales data to improve your store",
    description:
      "Look at which products receive attention, which products generate orders and where customers drop off. Use these observations to make informed improvements.",
    action: "Learn from your results",
  },
];

const principles = [
  {
    title: "Know your customer",
    description:
      "Understand who you are selling to before deciding what and how to sell.",
    icon: "◎",
  },
  {
    title: "Focus on value",
    description:
      "Show customers why a product is useful instead of relying only on price.",
    icon: "◆",
  },
  {
    title: "Build trust",
    description:
      "Clear information and reliable communication create a stronger shopping experience.",
    icon: "✓",
  },
  {
    title: "Keep improving",
    description:
      "Use customer feedback and store performance to make better decisions over time.",
    icon: "↗",
  },
];

function SellingTips() {
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
              Selling Tips
            </span>

          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-center">

            {/* Hero Content */}
            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
                KaroDrop Selling Tips
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
                Practical tips to{" "}
                <span className="text-[#0078ED]">
                  sell better
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
                Simple and practical ideas to help you choose better
                products, improve your store, reach customers and build a
                stronger dropshipping business.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#tips"
                  className="
                    inline-flex items-center justify-center
                    rounded-full bg-[#0078ED]
                    px-7 py-3.5
                    text-sm font-semibold text-white
                    transition hover:bg-[#012467]
                  "
                >
                  Explore Tips
                  <span className="ml-2">↓</span>
                </a>

                <Link
                  to="/resources/guides"
                  className="
                    inline-flex items-center justify-center
                    rounded-full border border-[#DCE7F2]
                    bg-white px-7 py-3.5
                    text-sm font-semibold text-[#0B1F3A]
                    transition hover:border-[#0078ED]
                    hover:text-[#0078ED]
                  "
                >
                  View Guides
                </Link>

              </div>

            </div>

            {/* Hero Visual */}
            <div className="rounded-3xl border border-[#DCE7F2] bg-[#EAF4FF] p-5 sm:p-7">

              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                      Seller Checklist
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#0B1F3A]">
                      Sell with confidence
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
                    ✓
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  {[
                    "Choose useful products",
                    "Create clear listings",
                    "Build customer trust",
                    "Promote consistently",
                    "Learn from your results",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="
                        flex items-center gap-3
                        rounded-xl bg-[#F5FAFF]
                        px-4 py-3
                      "
                    >

                      <span
                        className="
                          flex h-8 w-8 shrink-0
                          items-center justify-center
                          rounded-full bg-[#EAF4FF]
                          text-xs font-bold text-[#0078ED]
                        "
                      >
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-[#0B1F3A]">
                        {item}
                      </span>

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
            Smart Selling
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Small improvements can make a big difference
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5E6B7A] sm:text-base">
            Growing an online store is a continuous process. Instead of
            trying to change everything at once, focus on the areas that
            directly affect product discovery, customer confidence,
            purchases and long-term growth.
          </p>

        </div>

      </section>

      {/* =====================================================
          QUICK PRINCIPLES
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 md:pb-20 lg:px-10">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {principles.map((principle) => (
            <div
              key={principle.title}
              className="
                rounded-2xl
                border border-[#DCE7F2]
                bg-white p-6
                shadow-sm
              "
            >

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl bg-[#EAF4FF]
                  text-lg font-semibold text-[#0078ED]
                "
              >
                {principle.icon}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                {principle.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                {principle.description}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          TIPS
      ====================================================== */}
      <section
        id="tips"
        className="border-y border-[#DCE7F2] bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

          <div className="mb-10">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Seller Tips
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Practical ideas for your store
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Work through these tips one area at a time and use the ones
              that are most relevant to your current stage of selling.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {tips.map((tip) => (
              <article
                key={tip.number}
                className="
                  group rounded-2xl
                  border border-[#DCE7F2]
                  bg-[#F5FAFF]
                  p-6
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#B9D9F5]
                  hover:bg-white
                  hover:shadow-md
                  sm:p-7
                "
              >

                <div className="flex gap-5">

                  <div
                    className="
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-xl bg-white
                      text-xs font-bold text-[#0078ED]
                      shadow-sm
                      transition
                      group-hover:bg-[#0078ED]
                      group-hover:text-white
                    "
                  >
                    {tip.number}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#0078ED]">
                      {tip.category}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold leading-snug text-[#0B1F3A]">
                      {tip.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                      {tip.description}
                    </p>

                    <div className="mt-5 border-t border-[#DCE7F2] pt-4">

                      <span className="text-sm font-semibold text-[#0078ED]">
                        {tip.action}
                        <span className="ml-2 transition group-hover:ml-3">
                          →
                        </span>
                      </span>

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          SELLING FLOW
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Keep It Simple
            </p>

            <h2 className="text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">
              A simple approach to better selling
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              You do not need to improve everything at the same time.
              Focus on one part of your selling journey, measure what
              changes and keep improving from there.
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {[
              {
                number: "01",
                title: "Find",
                text: "Find products and customers worth focusing on.",
              },
              {
                number: "02",
                title: "Present",
                text: "Make your products easy to understand and discover.",
              },
              {
                number: "03",
                title: "Promote",
                text: "Reach potential customers through relevant channels.",
              },
              {
                number: "04",
                title: "Improve",
                text: "Use results and feedback to improve your store.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="
                  rounded-2xl
                  border border-[#DCE7F2]
                  bg-white p-6
                  shadow-sm
                "
              >

                <span className="text-xs font-bold text-[#0078ED]">
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

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 md:pb-20 lg:px-10">

        <div className="rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Build Better
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to take the next step?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Use our step-by-step guides to learn more about products,
            store setup, orders, fulfillment and growing your business.
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
              to="/resources/help-center"
              className="
                inline-flex items-center justify-center
                rounded-full border border-white/20
                px-7 py-3.5
                text-sm font-semibold text-white
                transition hover:border-white
                hover:bg-white/10
              "
            >
              Get Help
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default SellingTips;
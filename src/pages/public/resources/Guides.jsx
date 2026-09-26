import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   GUIDE DATA
========================================================= */

const guides = [
  {
    number: "01",
    category: "Getting Started",
    title: "How to Choose a Dropshipping Niche",
    shortTitle: "Choose Your Niche",
    description:
      "Learn how to choose a focused product category, understand your target customer and build a clear direction for your online store.",
    topics: [
      "Understand your target customer",
      "Explore different product categories",
      "Study customer demand",
      "Identify a focused niche",
    ],
    keywords:
      "dropshipping niche how to choose niche ecommerce niche online business",
  },

  {
    number: "02",
    category: "Products",
    title: "How to Find the Right Dropshipping Products",
    shortTitle: "Find the Right Products",
    description:
      "Learn how to research and evaluate products before adding them to your online store.",
    topics: [
      "Check product demand",
      "Compare product pricing",
      "Review product quality",
      "Consider competition",
    ],
    keywords:
      "dropshipping products product research products to sell online ecommerce products",
  },

  {
    number: "03",
    category: "Store Setup",
    title: "How to Build an Online Store for Dropshipping",
    shortTitle: "Build Your Store",
    description:
      "Create a professional online storefront where customers can discover products, understand listings and place orders.",
    topics: [
      "Organize your products",
      "Create clear product listings",
      "Add useful product images",
      "Make navigation simple",
    ],
    keywords:
      "build dropshipping store online store ecommerce website store setup",
  },

  {
    number: "04",
    category: "Pricing",
    title: "How to Price Dropshipping Products",
    shortTitle: "Set Your Pricing",
    description:
      "Understand product cost, selling price and relevant business expenses so you can make more informed pricing decisions.",
    topics: [
      "Understand product cost",
      "Set a suitable selling price",
      "Consider business expenses",
      "Plan your profit margin",
    ],
    keywords:
      "dropshipping pricing product pricing profit margin ecommerce pricing",
  },

  {
    number: "05",
    category: "Selling",
    title: "How to Create Better Ecommerce Product Listings",
    shortTitle: "Create Better Listings",
    description:
      "Give customers the information they need through clear titles, useful descriptions, quality images and important product details.",
    topics: [
      "Write clear product titles",
      "Create useful descriptions",
      "Use quality images",
      "Highlight important features",
    ],
    keywords:
      "product listing ecommerce product description dropshipping listing SEO",
  },

  {
    number: "06",
    category: "Selling",
    title: "How to Get Your First Dropshipping Orders",
    shortTitle: "Get Your First Orders",
    description:
      "Prepare your store for customers and explore practical ways to promote products and start generating your first sales.",
    topics: [
      "Prepare your online store",
      "Promote your products",
      "Use social media",
      "Build customer trust",
    ],
    keywords:
      "first dropshipping order first ecommerce sale how to get orders online selling",
  },

  {
    number: "07",
    category: "Fulfillment",
    title: "How Dropshipping Order Fulfillment Works",
    shortTitle: "Understand Fulfillment",
    description:
      "Understand what happens after a customer places an order and how order processing connects your store with fulfillment and delivery.",
    topics: [
      "Receive customer orders",
      "Process the order",
      "Prepare products for dispatch",
      "Track delivery",
    ],
    keywords:
      "dropshipping fulfillment order fulfillment ecommerce shipping order process",
  },

  {
    number: "08",
    category: "Customer Experience",
    title: "How to Manage the Ecommerce Customer Experience",
    shortTitle: "Manage Customer Experience",
    description:
      "Build customer trust by keeping buyers informed and creating a smooth experience before and after purchase.",
    topics: [
      "Communicate order updates",
      "Handle customer questions",
      "Manage returns and issues",
      "Build customer trust",
    ],
    keywords:
      "ecommerce customer experience dropshipping customer service customer trust",
  },

  {
    number: "09",
    category: "Growth",
    title: "How to Grow a Dropshipping Store",
    shortTitle: "Grow Your Store",
    description:
      "Once your store starts getting traction, focus on improving products, customer experience, marketing and overall business performance.",
    topics: [
      "Track your sales",
      "Identify popular products",
      "Improve your listings",
      "Build repeat customers",
    ],
    keywords:
      "how to grow dropshipping store ecommerce growth online business selling",
  },
];

/* =========================================================
   QUICK JOURNEY
========================================================= */

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

/* =========================================================
   CATEGORIES
========================================================= */

const guideCategories = [
  "All Guides",
  "Getting Started",
  "Products",
  "Store Setup",
  "Pricing",
  "Selling",
  "Fulfillment",
  "Growth",
];

/* =========================================================
   SEO
========================================================= */

const SEO_TITLE = "Dropshipping Guides & Tutorials | KaroDrop";

const SEO_DESCRIPTION =
  "Learn how to start dropshipping, choose products, build an online store, set pricing, get your first orders, manage fulfillment and grow your ecommerce business with KaroDrop guides.";

/* =========================================================
   COMPONENT
========================================================= */

function Guides() {
  const [activeCategory, setActiveCategory] =
    useState("All Guides");

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================================
     SEO META + STRUCTURED DATA
  ========================================================= */

  useEffect(() => {
    document.title = SEO_TITLE;

    const upsertMeta = (name, content) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    upsertMeta("description", SEO_DESCRIPTION);

    upsertMeta(
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    /* Canonical */

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      `${window.location.origin}/resources/guides`
    );

    /* =======================================================
       ITEM LIST STRUCTURED DATA
    ======================================================= */

    const existingSchema = document.getElementById(
      "karodrop-guides-schema"
    );

    if (existingSchema) {
      existingSchema.remove();
    }

    const guideSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "KaroDrop Dropshipping Guides",
      description: SEO_DESCRIPTION,
      url: `${window.location.origin}/resources/guides`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: guides.map((guide, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guide.title,
        })),
      },
    };

    const script = document.createElement("script");

    script.id = "karodrop-guides-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(guideSchema);

    document.head.appendChild(script);

    return () => {
      const schema = document.getElementById(
        "karodrop-guides-schema"
      );

      if (schema) {
        schema.remove();
      }
    };
  }, []);

  /* =========================================================
     FILTER GUIDES
  ========================================================= */

  const filteredGuides = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return guides.filter((guide) => {
      const categoryMatch =
        activeCategory === "All Guides" ||
        guide.category === activeCategory;

      if (!normalizedSearch) {
        return categoryMatch;
      }

      const searchableText = `
        ${guide.title}
        ${guide.shortTitle}
        ${guide.description}
        ${guide.category}
        ${guide.topics.join(" ")}
        ${guide.keywords}
      `.toLowerCase();

      return (
        categoryMatch &&
        searchableText.includes(normalizedSearch)
      );
    });
  }, [activeCategory, searchTerm]);

  /* =========================================================
     SCROLL TO GUIDES
  ========================================================= */

  const scrollToGuides = () => {
    document
      .getElementById("guides")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">

        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 md:py-20 lg:px-10 lg:py-24">

          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#5E6B7A]"
          >

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

          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">

            {/* Hero Content */}

            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
                KaroDrop Guides
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
                Practical guides to{" "}
                <span className="text-[#0078ED]">
                  start and grow dropshipping
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
                Learn how to choose a dropshipping niche,
                research products, build an online store,
                set pricing, get orders, understand fulfillment
                and grow your ecommerce business.
              </p>

              {/* Search */}

              <div className="mt-8 max-w-2xl">

                <label
                  htmlFor="guide-search"
                  className="sr-only"
                >
                  Search dropshipping guides
                </label>

                <div className="relative">

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#7A8999]"
                  >
                    ⌕
                  </span>

                  <input
                    id="guide-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search guides, products, pricing, fulfillment..."
                    className="
                      w-full rounded-2xl
                      border border-[#DCE7F2]
                      bg-white
                      py-4 pl-12 pr-12
                      text-sm text-[#0B1F3A]
                      outline-none
                      placeholder:text-[#8A98A8]
                      transition
                      focus:border-[#0078ED]
                      focus:ring-4
                      focus:ring-[#0078ED]/10
                      sm:text-base
                    "
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Clear guide search"
                      className="
                        absolute right-4 top-1/2
                        flex h-8 w-8
                        -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        bg-[#EAF4FF]
                        text-sm font-semibold
                        text-[#0078ED]
                        transition
                        hover:bg-[#D9ECFF]
                      "
                    >
                      ×
                    </button>
                  )}

                </div>

                <p className="mt-3 text-xs text-[#7A8999] sm:text-sm">
                  Search by topic, guide title or keyword
                </p>

              </div>

              {/* Buttons */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={scrollToGuides}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-[#0078ED]
                    px-7 py-3.5
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-[#012467]
                  "
                >
                  Explore Guides
                  <span className="ml-2">↓</span>
                </button>

                <Link
                  to="/resources/faqs"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border border-[#DCE7F2]
                    bg-white
                    px-7 py-3.5
                    text-sm font-semibold
                    text-[#0B1F3A]
                    transition
                    hover:border-[#0078ED]
                    hover:text-[#0078ED]
                  "
                >
                  View FAQs
                </Link>

              </div>

            </div>

            {/* Seller Journey */}

            <div className="rounded-3xl border border-[#DCE7F2] bg-[#EAF4FF] p-4 sm:p-7">

              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between gap-4">

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
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-[#0078ED]
                      text-lg
                      text-white
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
                        rounded-xl
                        border border-[#DCE7F2]
                        bg-[#F5FAFF]
                        px-4 py-3
                      "
                    >

                      <div
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-white
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
          SEO INTRO
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 md:py-16 lg:px-10">

        <div className="max-w-4xl">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Dropshipping Learning Hub
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Learn dropshipping step by step
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5E6B7A] sm:text-base">
            Starting an online selling business involves more than
            adding products to a website. You need to understand your
            niche, research products, create useful product listings,
            consider pricing, prepare for orders and build a customer
            experience people can trust. These KaroDrop guides break
            the process into practical topics so you can learn each
            part of the dropshipping journey.
          </p>

        </div>

      </section>

      {/* =====================================================
          CATEGORY FILTER
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-10">

        <div className="flex gap-2 overflow-x-auto pb-3">

          {guideCategories.map((category) => {

            const active =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-5 py-2.5
                  text-sm font-semibold
                  transition
                  ${
                    active
                      ? "bg-[#0078ED] text-white shadow-sm"
                      : "border border-[#DCE7F2] bg-white text-[#5E6B7A] hover:border-[#0078ED] hover:text-[#0078ED]"
                  }
                `}
              >
                {category}
              </button>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          GUIDE GRID
      ====================================================== */}

      <section
        id="guides"
        aria-labelledby="guides-heading"
        className="mx-auto max-w-[1440px] scroll-mt-10 px-4 pb-14 sm:px-6 md:pb-20 lg:px-10"
      >

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2
              id="guides-heading"
              className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl"
            >
              Dropshipping guides & tutorials
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
              Practical topics for new and growing online sellers.
            </p>

          </div>

          <span className="text-sm font-medium text-[#7A8999]">
            {filteredGuides.length}{" "}
            {filteredGuides.length === 1
              ? "guide"
              : "guides"}
          </span>

        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {filteredGuides.map((guide) => (

            <article
              key={guide.number}
              className="
                group
                overflow-hidden
                rounded-3xl
                border border-[#DCE7F2]
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-lg
                sm:p-7
              "
            >

              {/* Top */}

              <div className="flex items-start gap-4 sm:gap-5">

                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#EAF4FF]
                    text-sm font-bold
                    text-[#0078ED]
                    transition
                    group-hover:bg-[#0078ED]
                    group-hover:text-white
                    sm:h-12 sm:w-12
                  "
                >
                  {guide.number}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span
                      className="
                        rounded-full
                        bg-[#F5FAFF]
                        px-3 py-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1px]
                        text-[#0078ED]
                      "
                    >
                      {guide.category}
                    </span>

                  </div>

                  <h3 className="text-xl font-semibold leading-tight text-[#0B1F3A] sm:text-2xl">
                    {guide.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
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
                          mt-0.5
                          flex h-5 w-5
                          shrink-0
                          items-center justify-center
                          rounded-full
                          bg-[#EAF4FF]
                          text-[11px]
                          font-bold
                          text-[#0078ED]
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

              {/* Footer */}

              <div className="mt-7 flex flex-col gap-3 border-t border-[#E8EFF5] pt-5 sm:flex-row sm:items-center sm:justify-between">

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

        {/* No Result */}

        {filteredGuides.length === 0 && (

          <div
            className="
              rounded-3xl
              border border-dashed border-[#BFD4E8]
              bg-white
              px-6 py-14
              text-center
            "
          >

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FF] text-xl text-[#0078ED]">
              ⌕
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#0B1F3A]">
              No matching guides found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#5E6B7A]">
              Try searching for dropshipping, products,
              pricing, orders, fulfillment or selling.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Guides");
              }}
              className="
                mt-6
                rounded-full
                bg-[#0078ED]
                px-6 py-3
                text-sm font-semibold
                text-white
                transition
                hover:bg-[#006ACF]
              "
            >
              View All Guides
            </button>

          </div>

        )}

      </section>

      {/* =====================================================
          LONG-TAIL TOPICS
      ====================================================== */}

      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">

          <div className="mb-10 max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Popular Learning Topics
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              What do you want to learn?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Explore practical topics around starting a dropshipping
              business, finding products, getting orders and growing
              an online store.
            </p>

          </div>

          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">

            {[
              "How to start dropshipping in India",
              "How to choose dropshipping products",
              "How to choose a profitable niche",
              "How to build a dropshipping store",
              "How to price dropshipping products",
              "How to get your first online order",
              "How does dropshipping fulfillment work?",
              "How to grow an ecommerce store",
            ].map((topic) => (

              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSearchTerm(topic);
                  setActiveCategory("All Guides");

                  setTimeout(() => {
                    document
                      .getElementById("guides")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 50);
                }}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-5
                  border-b border-[#E8EFF5]
                  py-4
                  text-left
                "
              >

                <span className="text-sm font-medium leading-6 text-[#405166] transition group-hover:text-[#0078ED] sm:text-base">
                  {topic}
                </span>

                <span className="shrink-0 text-[#0078ED] transition group-hover:translate-x-1">
                  →
                </span>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          DROPSHIPPING WORKFLOW
      ====================================================== */}

      <section className="bg-[#F5FAFF]">

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
                Understanding the complete ecommerce order journey
                helps you make better decisions when building your
                store and preparing for customers.
              </p>

              <Link
                to="/resources/faqs"
                className="
                  mt-6
                  inline-flex
                  items-center
                  text-sm
                  font-semibold
                  text-[#0078ED]
                  transition
                  hover:text-[#012467]
                "
              >
                Read common questions
                <span className="ml-2">→</span>
              </Link>

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
                    bg-white
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
          INTERNAL RESOURCE LINKS
      ====================================================== */}

      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">

          <div className="mb-10 text-center">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Continue Learning
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Explore more KaroDrop resources
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Continue learning with KaroDrop FAQs, articles and
              support resources.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Blog */}

            <Link
              to="/resources/blog"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-[#F5FAFF]
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:bg-white
                hover:shadow-md
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
                ◫
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                KaroDrop Blog
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Read practical articles about dropshipping,
                ecommerce and online selling.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                Read Blog →
              </span>

            </Link>

            {/* FAQs */}

            <Link
              to="/resources/faqs"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-[#F5FAFF]
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:bg-white
                hover:shadow-md
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
                ?
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Frequently Asked Questions
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Find answers about products, orders,
                fulfillment, selling and pricing.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                Browse FAQs →
              </span>

            </Link>

            {/* Help Center */}

            <Link
              to="/resources/help-center"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-[#F5FAFF]
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:bg-white
                hover:shadow-md
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
                ?
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Help Center
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Get help with common account, order,
                product and selling questions.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                Visit Help Center →
              </span>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="overflow-hidden rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Keep Learning
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to build your online selling business?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Explore more KaroDrop resources to understand
            products, selling, fulfillment and ecommerce growth.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/resources/blog"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-white
                px-7 py-3.5
                text-sm font-semibold
                text-[#012467]
                transition
                hover:bg-[#EAF4FF]
              "
            >
              Read Blog
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/resources/faqs"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border border-white/20
                px-7 py-3.5
                text-sm font-semibold
                text-white
                transition
                hover:border-white
                hover:bg-white/10
              "
            >
              Browse FAQs
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Guides;
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   SEO ARTICLE DATA
========================================================= */

const articles = [
  {
    id: "what-is-dropshipping",
    category: "Dropshipping",
    title: "What Is Dropshipping and How Does It Work?",
    description:
      "Learn how dropshipping works in India, from choosing products and receiving customer orders to fulfillment, shipping and delivery.",
    readTime: "5 min read",
    keywords: [
      "what is dropshipping",
      "how does dropshipping work",
      "dropshipping in India",
      "dropshipping business",
    ],
  },
  {
    id: "start-dropshipping-business",
    category: "Getting Started",
    title: "How to Start a Dropshipping Business in India",
    description:
      "Learn how to start a dropshipping business in India, choose a niche, select products, create your store and prepare for your first order.",
    readTime: "7 min read",
    keywords: [
      "start dropshipping business India",
      "how to start dropshipping",
      "dropshipping business India",
      "start online business",
    ],
  },
  {
    id: "choose-dropshipping-products",
    category: "Product Research",
    title: "How to Choose Products for Your Dropshipping Store",
    description:
      "Understand how to choose products for an online store by considering customer demand, pricing, competition, quality and selling potential.",
    readTime: "6 min read",
    keywords: [
      "best dropshipping products",
      "choose dropshipping products",
      "product research",
      "dropshipping product ideas",
    ],
  },
  {
    id: "product-listing-guide",
    category: "Selling",
    title: "How to Create Product Listings That Convert",
    description:
      "Learn how to create better product listings with clear titles, useful descriptions, product images, pricing and customer-focused information.",
    readTime: "5 min read",
    keywords: [
      "product listing",
      "ecommerce product description",
      "product listing optimization",
      "online store products",
    ],
  },
  {
    id: "first-dropshipping-order",
    category: "Ecommerce",
    title: "How to Get Your First Dropshipping Order",
    description:
      "Explore practical steps to prepare your store, promote products and create a smooth buying experience for your first customers.",
    readTime: "6 min read",
    keywords: [
      "first dropshipping order",
      "get first ecommerce order",
      "dropshipping sales",
      "sell products online",
    ],
  },
  {
    id: "dropshipping-fulfillment",
    category: "Fulfillment",
    title: "Understanding Dropshipping Fulfillment and Shipping",
    description:
      "Understand what happens after a customer places an order, including processing, production, packaging, fulfillment and delivery.",
    readTime: "5 min read",
    keywords: [
      "dropshipping fulfillment",
      "dropshipping shipping",
      "order fulfillment",
      "fulfillment India",
    ],
  },
  {
    id: "dropshipping-branding",
    category: "Branding",
    title: "Why Branding Matters for a Dropshipping Store",
    description:
      "Learn how consistent branding, product presentation, messaging and customer experience can help build a recognizable online store.",
    readTime: "6 min read",
    keywords: [
      "dropshipping branding",
      "build ecommerce brand",
      "online store branding",
      "private branding",
    ],
  },
  {
    id: "grow-online-store",
    category: "Growth",
    title: "How to Grow Your Online Store Step by Step",
    description:
      "Learn what to improve as your ecommerce store grows, including product selection, customer experience, marketing and repeat sales.",
    readTime: "7 min read",
    keywords: [
      "grow online store",
      "ecommerce growth",
      "grow dropshipping business",
      "online selling strategies",
    ],
  },
  {
    id: "print-on-demand-india",
    category: "Print on Demand",
    title: "Print on Demand in India: A Beginner's Guide",
    description:
      "Understand how print on demand works, how custom designs become products and how sellers can build an online business without traditional inventory.",
    readTime: "6 min read",
    keywords: [
      "print on demand India",
      "POD India",
      "print on demand business",
      "custom products India",
    ],
  },
];

/* =========================================================
   SEO FAQ DATA
========================================================= */

const seoQuestions = [
  {
    question: "Is dropshipping a good way to start an online business?",
    answer:
      "Dropshipping can be a practical ecommerce model for people who want to test products without managing traditional inventory themselves. Sellers still need to research products, understand their customers, create a useful store and manage the customer experience.",
  },
  {
    question: "How can I start dropshipping in India?",
    answer:
      "Start by choosing a focused niche, researching products, understanding your target customers, preparing product listings and setting up your online store. You should also understand pricing, order processing, fulfillment, shipping and customer support before accepting orders.",
  },
  {
    question: "What products can I sell through dropshipping?",
    answer:
      "The right products depend on your target audience, demand, pricing, competition and product quality. Product research should focus on whether customers have a clear reason to buy and whether the product can be presented effectively online.",
  },
  {
    question: "What is print on demand?",
    answer:
      "Print on demand is a fulfillment model where products can be produced with a customer's selected design after an order is placed. It is commonly used for customized products and allows sellers to build product collections around their designs.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* =========================================================
   BLOG PAGE
========================================================= */

function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =======================================================
     SEO META + BLOGPOSTING STRUCTURED DATA
  ======================================================= */

  useEffect(() => {
    const title =
      "Dropshipping Blog India | Ecommerce & Print on Demand Guides | KaroDrop";

    const description =
      "Learn dropshipping in India with practical guides on product research, ecommerce, print on demand, fulfillment, branding and online selling.";

    document.title = title;

    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("description", description);

    setMeta(
      "keywords",
      "dropshipping India, dropshipping business India, how to start dropshipping, dropshipping supplier India, print on demand India, ecommerce business, online selling, dropshipping fulfillment"
    );

    setMeta(
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    /* -------------------------------------------------------
       Open Graph
    ------------------------------------------------------- */

    const setProperty = (property, content) => {
      let element = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", window.location.href);

    /* -------------------------------------------------------
       BlogPosting / CollectionPage structured data
    ------------------------------------------------------- */

    const schemaId = "karodrop-blog-schema";

    const existingSchema = document.getElementById(schemaId);

    if (existingSchema) {
      existingSchema.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "KaroDrop Blog",
      description,
      url: window.location.href,
      publisher: {
        "@type": "Organization",
        name: "KaroDrop",
      },
      blogPost: articles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        keywords: article.keywords.join(", "),
        author: {
          "@type": "Organization",
          name: "KaroDrop",
        },
        publisher: {
          "@type": "Organization",
          name: "KaroDrop",
        },
      })),
    };

    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      const currentSchema =
        document.getElementById(schemaId);

      if (currentSchema) {
        currentSchema.remove();
      }
    };
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        articles.map((article) => article.category)
      ),
    ];
  }, []);

  /* =======================================================
     FILTER ARTICLES
  ======================================================= */

  const filteredArticles = useMemo(() => {
    const query = normalizeText(searchQuery);

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      const searchableText = normalizeText(
        [
          article.title,
          article.description,
          article.category,
          ...article.keywords,
        ].join(" ")
      );

      return searchableText.includes(query);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* =====================================================
          SEO HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">

        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#EAF4FF] blur-[110px]" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10 lg:py-24">

          {/* BREADCRUMB */}

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
              Blog
            </span>

          </nav>

          <div className="max-w-5xl">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
              KaroDrop Blog
            </p>

            {/* IMPORTANT PRIMARY H1 */}

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">

              Dropshipping in India:{" "}

              <span className="text-[#0078ED]">
                Guides, Tips & Insights
              </span>

            </h1>

            <p className="mt-6 max-w-4xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">

              Learn how to start and grow a dropshipping business
              with practical information about product research,
              ecommerce, print on demand, fulfillment, branding,
              online selling and customer experience.

            </p>

            {/* PRIMARY SEO TOPICS */}

            <div className="mt-8 flex flex-wrap gap-2">

              {[
                "Dropshipping India",
                "Start Dropshipping",
                "Product Research",
                "Print on Demand",
                "Ecommerce",
                "Online Selling",
              ].map((keyword) => (
                <span
                  key={keyword}
                  className="
                    rounded-full
                    border border-[#DCE7F2]
                    bg-[#F5FAFF]
                    px-4
                    py-2
                    text-xs
                    font-medium
                    text-[#0B1F3A]
                  "
                >
                  {keyword}
                </span>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SEARCH BLOG
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 lg:px-10">

        <div
          className="
            rounded-2xl
            border border-[#DCE7F2]
            bg-white
            p-4
            shadow-sm
            sm:p-5
          "
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div
              className="
                flex
                min-h-[50px]
                flex-1
                items-center
                gap-3
                rounded-xl
                border
                border-[#DCE7F2]
                bg-[#F5FAFF]
                px-4
                focus-within:border-[#0078ED]
                focus-within:bg-white
              "
            >

              <svg
                className="h-5 w-5 shrink-0 text-[#5E6B7A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-4-4" />
              </svg>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search dropshipping, ecommerce, products..."
                aria-label="Search KaroDrop blog"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  text-[#0B1F3A]
                  outline-none
                  placeholder:text-[#7A8795]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-lg text-[#5E6B7A] hover:text-[#0078ED]"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

            {/* CATEGORY FILTER */}

            <div className="flex flex-wrap gap-2">

              {categories.map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    rounded-full
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    transition
                    ${
                      selectedCategory === category
                        ? "bg-[#0078ED] text-white"
                        : "border border-[#DCE7F2] bg-white text-[#0B1F3A] hover:border-[#0078ED] hover:text-[#0078ED]"
                    }
                  `}
                >
                  {category}
                </button>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURED TOPIC
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 pt-12 sm:px-6 md:pt-16 lg:px-10">

        <div
          className="
            overflow-hidden
            rounded-3xl
            border border-[#DCE7F2]
            bg-[#EAF4FF]
          "
        >

          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

            <div className="p-7 sm:p-10 lg:p-14">

              <span
                className="
                  inline-flex
                  rounded-full
                  border border-[#B9D9F5]
                  bg-white
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-[#0078ED]
                "
              >
                Featured Guide
              </span>

              <h2 className="mt-6 text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">

                How to Start a Dropshipping Business in India

              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">

                Starting an online business requires more than
                simply adding products to a store. Learn how to
                choose a niche, research products, prepare your
                store, understand fulfillment and create a better
                customer experience.

              </p>

              <div className="mt-6 flex flex-wrap gap-2">

                {[
                  "Dropshipping India",
                  "Product Research",
                  "Online Store",
                  "Order Fulfillment",
                ].map((item) => (

                  <span
                    key={item}
                    className="
                      rounded-full
                      bg-white
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-[#0078ED]
                    "
                  >
                    {item}
                  </span>

                ))}

              </div>

              <Link
                to="/resources/guides"
                className="
                  mt-7
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#0078ED]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#012467]
                "
              >
                Explore Seller Guides
                <span className="ml-2">→</span>
              </Link>

            </div>

            <div
              className="
                flex
                min-h-[320px]
                items-center
                justify-center
                bg-[#DCEEFF]
                p-8
                lg:min-h-[400px]
              "
            >

              <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white p-6 shadow-xl">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#0078ED]
                      text-2xl
                      text-white
                    "
                  >
                    📦
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
                      KaroDrop
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-[#0B1F3A]">
                      Seller Journey
                    </h3>

                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  {[
                    "Choose products",
                    "Build your store",
                    "Receive orders",
                    "Fulfill and deliver",
                  ].map((step, index) => (

                    <div
                      key={step}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-[#F5FAFF]
                        px-4
                        py-3
                      "
                    >

                      <span
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EAF4FF]
                          text-xs
                          font-bold
                          text-[#0078ED]
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

      {/* =====================================================
          SEO CONTENT INTRO
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 md:pt-20 lg:px-10">

        <div className="max-w-4xl">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Dropshipping Resources
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">

            Practical dropshipping and ecommerce knowledge

          </h2>

          <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">

            Whether you are learning how dropshipping works,
            researching products for an online store or looking
            for ways to improve your ecommerce business, the
            KaroDrop Blog brings together practical topics for
            different stages of the seller journey.

          </p>

          <p className="mt-4 text-sm leading-7 text-[#5E6B7A] sm:text-base">

            Explore guides about starting a dropshipping business
            in India, product research, product listings, order
            fulfillment, print on demand, branding, customer
            experience and online store growth.

          </p>

        </div>

      </section>

      {/* =====================================================
          ARTICLE GRID
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="mb-10">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Latest Articles
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Learn about dropshipping and online selling
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5E6B7A] sm:text-base">

            Explore practical topics covering dropshipping,
            ecommerce, product research, fulfillment, print on
            demand, branding and growing an online store.

          </p>

        </div>

        {/* RESULT COUNT */}

        <div className="mb-5 text-sm text-[#5E6B7A]">

          Showing{" "}
          <span className="font-semibold text-[#0B1F3A]">
            {filteredArticles.length}
          </span>{" "}
          {filteredArticles.length === 1
            ? "article"
            : "articles"}

        </div>

        {filteredArticles.length > 0 ? (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredArticles.map((article) => (

              <article
                key={article.id}
                className="
                  group
                  flex
                  min-h-[390px]
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#B9D9F5]
                  hover:shadow-lg
                "
              >

                {/* CARD VISUAL */}

                <div
                  className="
                    flex
                    h-40
                    items-center
                    justify-center
                    bg-[#EAF4FF]
                  "
                >

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-2xl
                      shadow-sm
                      transition
                      group-hover:scale-105
                    "
                  >
                    📘
                  </div>

                </div>

                {/* CONTENT */}

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

                  {/* KEYWORDS */}

                  <div className="mt-4 flex flex-wrap gap-1.5">

                    {article.keywords
                      .slice(0, 2)
                      .map((keyword) => (

                        <span
                          key={keyword}
                          className="
                            rounded-full
                            bg-[#F5FAFF]
                            px-2.5
                            py-1
                            text-[10px]
                            font-medium
                            text-[#5E6B7A]
                          "
                        >
                          {keyword}
                        </span>

                      ))}

                  </div>

                  {/* GUIDE LINK */}

                  <Link
                    to="/resources/guides"
                    className="
                      mt-auto
                      pt-6
                      text-left
                      text-sm
                      font-semibold
                      text-[#0078ED]
                      transition
                      hover:text-[#012467]
                    "
                  >
                    Read Guide →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div
            className="
              rounded-2xl
              border
              border-[#DCE7F2]
              bg-white
              px-6
              py-16
              text-center
            "
          >

            <div className="text-4xl">
              🔍
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[#0B1F3A]">
              No articles found
            </h3>

            <p className="mt-2 text-sm text-[#5E6B7A]">
              Try another dropshipping or ecommerce keyword.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="
                mt-5
                rounded-full
                bg-[#0078ED]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-[#012467]
              "
            >
              View All Articles
            </button>

          </div>

        )}

      </section>

      {/* =====================================================
          SEARCH INTENT SECTION
      ===================================================== */}

      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

          <div className="max-w-4xl">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Learn Before You Sell
            </p>

            <h2 className="text-3xl font-semibold leading-tight text-[#0B1F3A] sm:text-4xl">

              Answers to common dropshipping questions

            </h2>

            <p className="mt-5 text-sm leading-7 text-[#5E6B7A] sm:text-base">

              New sellers often have questions about products,
              fulfillment, online stores and getting their first
              customers. Start with the answers below and explore
              the detailed KaroDrop resources for more information.

            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">

            {seoQuestions.map((item) => (

              <article
                key={item.question}
                className="
                  rounded-2xl
                  border
                  border-[#DCE7F2]
                  bg-[#F5FAFF]
                  p-6
                "
              >

                <h3 className="text-lg font-semibold leading-snug text-[#0B1F3A]">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                  {item.answer}
                </p>

              </article>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          INTERNAL RESOURCE LINKS
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div className="grid gap-5 md:grid-cols-3">

          <Link
            to="/resources/guides"
            className="
              rounded-2xl
              border border-[#DCE7F2]
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:border-[#0078ED]
              hover:shadow-lg
            "
          >

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
              Guides
            </p>

            <h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">
              Step-by-step seller guides
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
              Learn how to choose products, build your store,
              understand orders and grow your business.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-[#0078ED]">
              Explore Guides →
            </span>

          </Link>

          <Link
            to="/resources/selling-tips"
            className="
              rounded-2xl
              border border-[#DCE7F2]
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:border-[#0078ED]
              hover:shadow-lg
            "
          >

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
              Selling Tips
            </p>

            <h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">
              Practical ecommerce selling tips
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
              Explore practical ideas for product presentation,
              customer experience and online selling.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-[#0078ED]">
              View Selling Tips →
            </span>

          </Link>

          <Link
            to="/resources/faqs"
            className="
              rounded-2xl
              border border-[#DCE7F2]
              bg-white
              p-7
              transition
              hover:-translate-y-1
              hover:border-[#0078ED]
              hover:shadow-lg
            "
          >

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0078ED]">
              FAQs
            </p>

            <h3 className="mt-3 text-xl font-semibold text-[#0B1F3A]">
              Frequently asked questions
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
              Find quick answers about products, orders,
              fulfillment, selling and getting started.
            </p>

            <span className="mt-5 inline-block text-sm font-semibold text-[#0078ED]">
              View FAQs →
            </span>

          </Link>

        </div>

      </section>

      {/* =====================================================
          SELLER JOURNEY
      ===================================================== */}

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

                Build your knowledge step by step. Start with
                product research, create a useful store, understand
                fulfillment and keep improving the customer experience.

              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {[
                {
                  number: "01",
                  title: "Choose",
                  text: "Research products and understand your target customer.",
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

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">

        <div
          className="
            rounded-3xl
            bg-[#012467]
            px-6
            py-12
            text-center
            sm:px-10
            lg:px-16
            lg:py-16
          "
        >

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            Keep Learning
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">

            Build your dropshipping knowledge with KaroDrop

          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">

            Explore seller guides, selling tips and frequently
            asked questions to understand the next step in your
            online selling journey.

          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/resources/guides"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-white
                px-7
                py-3.5
                text-sm
                font-semibold
                text-[#012467]
                transition
                hover:bg-[#EAF4FF]
              "
            >
              Explore Guides
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/resources/faqs"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                transition
                hover:border-white
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
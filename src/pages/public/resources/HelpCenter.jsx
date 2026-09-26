import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
/* =========================================================
   HELP CATEGORIES
\========================================================= */
const helpCategories = [
  {
    icon: "📦",
    title: "Orders",
    description:
      "Get help with customer orders, order status, order processing and common order questions.",
    topics: [
      "Order status",
      "How customer orders work",
      "Order processing",
      "Delayed orders",
      "Order updates",
    ],
    keywords: [
      "orders",
      "order status",
      "customer order",
      "order process",
      "delayed order",
      "dropshipping order",
    ],
  },
  {
    icon: "🛍️",
    title: "Products",
    description:
      "Learn how to choose dropshipping products, research product demand and create better product listings.",
    topics: [
      "Choose products",
      "Product research",
      "Product demand",
      "Product listings",
      "Product images",
    ],
    keywords: [
      "dropshipping products",
      "product research",
      "best products for dropshipping",
      "choose products",
      "product listings",
      "online store products",
    ],
  },
  {
    icon: "🚚",
    title: "Shipping & Fulfillment",
    description:
      "Understand dropshipping fulfillment, shipping, delivery, tracking and the journey after an order.",
    topics: [
      "Order fulfillment",
      "Shipping process",
      "Delivery",
      "Order tracking",
      "Delayed delivery",
    ],
    keywords: [
      "dropshipping fulfillment",
      "order fulfillment",
      "shipping",
      "delivery",
      "order tracking",
      "dropshipping shipping",
    ],
  },
  {
    icon: "💳",
    title: "Payments & Pricing",
    description:
      "Understand product costs, selling prices, profit margins and important pricing considerations.",
    topics: [
      "Product pricing",
      "Product cost",
      "Profit margin",
      "Selling price",
      "Business expenses",
    ],
    keywords: [
      "dropshipping pricing",
      "product pricing",
      "profit margin",
      "selling price",
      "product cost",
      "ecommerce pricing",
    ],
  },
  {
    icon: "👤",
    title: "Account",
    description:
      "Find general guidance about your KaroDrop seller account, profile and account-related questions.",
    topics: [
      "Account setup",
      "Seller profile",
      "Account information",
      "Account help",
    ],
    keywords: [
      "KaroDrop account",
      "seller account",
      "account setup",
      "seller profile",
      "account help",
    ],
  },
  {
    icon: "📈",
    title: "Selling & Growth",
    description:
      "Learn practical ways to start selling online, get your first order and grow your dropshipping store.",
    topics: [
      "Start dropshipping",
      "Get first order",
      "Product promotion",
      "Customer trust",
      "Grow your store",
    ],
    keywords: [
      "how to start dropshipping",
      "dropshipping business in India",
      "online selling",
      "first dropshipping order",
      "grow dropshipping store",
      "ecommerce business",
    ],
  },
];
/* =========================================================
   POPULAR HELP TOPICS
\========================================================= */
const popularTopics = [
  {
    title: "How do I start a dropshipping business in India?",
    description:
      "Understand the basic steps involved in choosing a niche, researching products, building an online store and preparing to sell.",
    keywords: [
      "start dropshipping",
      "dropshipping business in India",
      "how to start dropshipping",
      "online business",
    ],
    link: "/resources/guides",
  },
  {
    title: "How do I choose products for dropshipping?",
    description:
      "Learn how customer demand, product quality, pricing, competition and your target niche can influence product selection.",
    keywords: [
      "choose dropshipping products",
      "product research",
      "dropshipping products",
      "product selection",
    ],
    link: "/resources/selling-tips",
  },
  {
    title: "What is dropshipping order fulfillment?",
    description:
      "Understand what happens after a customer places an order and how processing, dispatch and delivery fit into the fulfillment journey.",
    keywords: [
      "dropshipping fulfillment",
      "order fulfillment",
      "shipping",
      "delivery",
    ],
    link: "/resources/guides",
  },
  {
    title: "How can I improve my product listings?",
    description:
      "Use clear product titles, useful descriptions, relevant information and quality visuals to make your online listings easier to understand.",
    keywords: [
      "product listings",
      "online store",
      "product descriptions",
      "product images",
    ],
    link: "/resources/selling-tips",
  },
  {
    title: "How can I get my first dropshipping order?",
    description:
      "Prepare your store, choose a focused niche, build customer trust and promote products through channels relevant to your audience.",
    keywords: [
      "first dropshipping order",
      "first order",
      "online selling",
      "sell online",
    ],
    link: "/resources/blog",
  },
  {
    title: "How can I grow my dropshipping store?",
    description:
      "Improve product selection, product listings, marketing, customer experience and fulfillment based on what you learn from your store.",
    keywords: [
      "grow dropshipping store",
      "dropshipping business",
      "online store growth",
      "ecommerce growth",
    ],
    link: "/resources/blog",
  },
  {
    title: "What should I know about dropshipping shipping and delivery?",
    description:
      "Learn why realistic delivery information, tracking and customer communication matter when managing an online selling business.",
    keywords: [
      "dropshipping shipping",
      "shipping and delivery",
      "order tracking",
      "delivery information",
    ],
    link: "/resources/faqs",
  },
  {
    title: "What is a profit margin in dropshipping?",
    description:
      "Understand how product cost, selling price and relevant business expenses affect the potential margin on a sale.",
    keywords: [
      "profit margin",
      "dropshipping profit",
      "product cost",
      "selling price",
    ],
    link: "/resources/faqs",
  },
];
/* =========================================================
   FAQ CONTENT FOR SEO + USERS
\========================================================= */
const seoFaqs = [
  {
    question: "What is dropshipping?",
    answer:
      "Dropshipping is an ecommerce business model where a seller can offer products to customers without keeping traditional inventory at their own location for every product. Orders then move through the relevant fulfillment and delivery process.",
  },
  {
    question: "How do I start dropshipping?",
    answer:
      "Start by selecting a focused niche, researching products, understanding your target customers, creating useful product listings and preparing an online store. You can then promote relevant products and work toward your first customer orders.",
  },
  {
    question: "How do I choose dropshipping products?",
    answer:
      "Consider customer demand, product quality, pricing, competition, usefulness and how well a product fits your chosen niche. Product research can help you understand customer expectations before adding products to your store.",
  },
  {
    question: "What is dropshipping fulfillment?",
    answer:
      "Dropshipping fulfillment refers to the process through which an order is processed after a customer purchases a product and then moves through preparation, dispatch and delivery.",
  },
  {
    question: "How can I get my first dropshipping order?",
    answer:
      "Prepare your store and product listings first. Then promote products through channels that match your target customers, while focusing on clear information, customer trust and a smooth buying experience.",
  },
  {
    question: "How can I grow an online dropshipping store?",
    answer:
      "Review your product selection, listings, marketing, customer experience and fulfillment process regularly. Use what you learn from your store to improve the areas that have the greatest effect on your business.",
  },
];
/* =========================================================
   QUICK RESOURCE LINKS
\========================================================= */
const quickLinks = [
  {
    icon: "📚",
    title: "Guides & Tutorials",
    description:
      "Follow step-by-step guidance for starting and building a dropshipping business.",
    link: "/resources/guides",
  },
  {
    icon: "💡",
    title: "Selling Tips",
    description:
      "Explore practical ideas for products, listings, promotion and customer experience.",
    link: "/resources/selling-tips",
  },
  {
    icon: "❓",
    title: "FAQs",
    description:
      "Find quick answers about dropshipping products, orders, fulfillment and selling.",
    link: "/resources/faqs",
  },
  {
    icon: "📝",
    title: "KaroDrop Blog",
    description:
      "Read useful articles about dropshipping, ecommerce and online selling.",
    link: "/resources/blog",
  },
];
/* =========================================================
   COMPONENT
\========================================================= */
function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  /* =======================================================
     SEO META + STRUCTURED DATA
  ======================================================= */
  useEffect(() => {
    const pageTitle =
      "Dropshipping Help Center | Products, Orders & Selling | KaroDrop";
    const pageDescription =
      "Find answers about dropshipping, products, product research, order fulfillment, shipping, pricing, online selling and growing your ecommerce business with KaroDrop.";
    document.title = pageTitle;
    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    const setProperty = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    setMeta("description", pageDescription);
    setMeta(
      "robots",
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    );
    setProperty("og:title", pageTitle);
    setProperty("og:description", pageDescription);
    setProperty("og:type", "website");
    /* Canonical */
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      `${window.location.origin}/resources/help-center`
    );
    /* WebPage Schema */
    const pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description: pageDescription,
      url: `${window.location.origin}/resources/help-center`,
    };
    let schemaScript = document.getElementById("karodrop-help-page-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "karodrop-help-page-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(pageSchema);
    /* Breadcrumb Schema */
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${window.location.origin}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resources",
          item: `${window.location.origin}/resources`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Help Center",
          item: `${window.location.origin}/resources/help-center`,
        },
      ],
    };
    let breadcrumbScript = document.getElementById(
      "karodrop-help-breadcrumb-schema"
    );
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.id = "karodrop-help-breadcrumb-schema";
      breadcrumbScript.type = "application/ld+json";
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    return () => {
      const existingSchema = document.getElementById("karodrop-help-page-schema");
      const existingBreadcrumb = document.getElementById(
        "karodrop-help-breadcrumb-schema"
      );
      if (existingSchema) existingSchema.remove();
      if (existingBreadcrumb) existingBreadcrumb.remove();
    };
  }, []);
  /* =======================================================
     SEARCH
  ======================================================= */
  const normalizedSearch = search.toLowerCase().trim();
  const filteredTopics = useMemo(() => {
    if (!normalizedSearch) {
      return popularTopics;
    }
    return popularTopics.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch]);
  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) {
      return helpCategories;
    }
    return helpCategories.filter((category) => {
      const searchableText = [
        category.title,
        category.description,
        ...category.topics,
        ...category.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch]);
  const hasResults =
    filteredTopics.length > 0 || filteredCategories.length > 0;
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#012467]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#0078ED]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#0087F5]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0078ED]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-10 lg:px-10 lg:py-16">
          {/* Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs text-blue-100/70 lg:justify-start">
            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/resources"
              className="transition hover:text-white"
            >
              Resources
            </Link>
            <span>/</span>
            <span className="font-medium text-white">
              Help Center
            </span>
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[2px] text-[#B9DDFF] sm:text-sm">
              KaroDrop Help Center
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Dropshipping Help Center for
              <span className="block text-[#8FC9FF]">
                Products, Orders & Selling
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base lg:text-lg">
              Find practical answers about dropshipping, product research,
              online selling, order fulfillment, shipping, pricing and growing
              your ecommerce business with KaroDrop
            </p>
            {/* Search */}
            <div className="mx-auto mt-6 max-w-3xl">
              <div className="flex items-center rounded-2xl bg-white p-2 shadow-2xl">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center text-xl text-[#5E6B7A]">
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dropshipping, products, orders, shipping..."
                  aria-label="Search KaroDrop Help Center"
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#0B1F3A] outline-none sm:text-base"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mr-1 shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0078ED] sm:px-4 sm:text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  "dropshipping",
                  "products",
                  "order fulfillment",
                  "first order",
                  "shipping",
                ].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => setSearch(keyword)}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-blue-100 transition hover:bg-white/15 hover:text-white"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =========================================================
          SEARCH RESULT SUMMARY
      ========================================================= */}
      {search && (
        <section className="border-b border-[#DCE7F2] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#5E6B7A]">
                Search results for{" "}
                <span className="font-semibold text-[#0B1F3A]">
                  "{search}"
                </span>
              </p>
              <p className="text-xs font-medium text-[#8A98A8]">
                {filteredTopics.length + filteredCategories.length} relevant
                result
                {filteredTopics.length + filteredCategories.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        </section>
      )}
      {/* =========================================================
          HELP CATEGORIES
      ========================================================= */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-10 lg:px-10">
        <div className="mb-7 text-center">
          <span className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Browse Help Topics
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            What do you need help with?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
            Explore practical help for starting a dropshipping business,
            choosing products, managing orders and improving your online store
          </p>
        </div>
        {filteredCategories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => {
              const originalIndex = helpCategories.findIndex(
                (item) => item.title === category.title
              );
              const isOpen = openCategory === originalIndex;
              return (
                <div
                  key={category.title}
                  className={`overflow-hidden rounded-3xl border bg-white transition duration-300 ${
                    isOpen
                      ? "border-[#9CCDF7] shadow-lg"
                      : "border-[#DCE7F2] hover:-translate-y-1 hover:border-[#B9D9F5] hover:shadow-xl"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategory(isOpen ? null : originalIndex)
                    }
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-2xl">
                        {category.icon}
                      </div>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5FAFF] text-xl text-[#0078ED] transition-transform ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[#0B1F3A]">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                      {category.description}
                    </p>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-[#DCE7F2] bg-[#F8FBFF] px-5 pb-5 pt-4 sm:px-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[1.5px] text-[#0078ED]">
                          Popular topics
                        </p>
                        <div className="space-y-2">
                          {category.topics.map((topic) => (
                            <div
                              key={topic}
                              className="flex items-start gap-2 text-sm text-[#0B1F3A]"
                            >
                              <span className="mt-0.5 text-[#0078ED]">
                                ✓
                              </span>
                              <span>
                                {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>
      {/* =========================================================
          POPULAR HELP TOPICS
      ========================================================= */}
      <section className="border-y border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-10 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
                Search-Friendly Answers
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
                Popular dropshipping help topics
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
                Find answers to common questions about starting a dropshipping
                business, products, orders, fulfillment and online selling
              </p>
            </div>
            {search && (
              <p className="shrink-0 text-sm font-medium text-[#5E6B7A]">
                {filteredTopics.length} topic
                {filteredTopics.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
          {filteredTopics.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {filteredTopics.map((topic) => (
                <Link
                  key={topic.title}
                  to={topic.link}
                  className="group rounded-3xl border border-[#DCE7F2] bg-[#F8FBFF] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#9CCDF7] hover:bg-white hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                      ?
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold leading-6 text-[#0B1F3A] transition group-hover:text-[#0078ED] sm:text-lg">
                        {topic.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                        {topic.description}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#0078ED]">
                        Read more
                        <span className="ml-2 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-[#DCE7F2] bg-[#F8FBFF] px-6 py-10 text-center">
              <div className="text-4xl">
                🔎
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#0B1F3A]">
                No matching help topic found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5E6B7A]">
                Try another keyword such as dropshipping, products, orders,
                shipping or selling
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0068CF]"
              >
                View all topics
              </button>
            </div>
          )}
        </div>
      </section>
      {/* =========================================================
          SEO FAQ SECTION
      ========================================================= */}
      <section className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 md:py-10">
        <div className="mb-7 text-center">
          <span className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Common Questions
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Dropshipping questions answered
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
            Quick answers to common questions about dropshipping, products,
            fulfillment and online selling
          </p>
        </div>
        <div className="space-y-2">
          {seoFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isOpen
                    ? "border-[#9CCDF7] shadow-sm"
                    : "border-[#DCE7F2]"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <h3 className="text-base font-semibold leading-6 text-[#0B1F3A] sm:text-lg">
                    {faq.question}
                  </h3>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-lg text-[#0078ED] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-[#E8EFF5] px-5 pb-5 pt-4 sm:px-6">
                      <p className="text-sm leading-7 text-[#5E6B7A] sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {/* =========================================================
          QUICK RESOURCE LINKS
      ========================================================= */}
      <section className="border-y border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-10 lg:px-10">
          <div className="mb-7 text-center">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Explore KaroDrop Resources
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              More ways to learn
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Explore guides, selling tips, FAQs and blog articles to learn
              more about dropshipping and online selling
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className="group rounded-3xl border border-[#DCE7F2] bg-[#F8FBFF] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#9CCDF7] hover:bg-white hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-2xl">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#0B1F3A] transition group-hover:text-[#0078ED]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#0078ED]">
                  Explore
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* =========================================================
          SUPPORT CTA
      ========================================================= */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:py-10 lg:px-10">
        <div className="overflow-hidden rounded-3xl bg-[#012467] px-6 py-10 text-center sm:px-10 lg:px-16 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <span className="text-3xl">
              💬
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
              KaroDrop Support
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Still need help?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Explore the KaroDrop FAQs, guides and selling resources for more
              information about your dropshipping journey
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/resources/faqs"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#012467] transition hover:bg-[#EAF4FF]"
              >
                Visit FAQs
              </Link>
              <Link
                to="/resources/guides"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Explore Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default HelpCenter;

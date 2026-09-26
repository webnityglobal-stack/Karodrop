import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   FAQ CATEGORIES
========================================================= */

const faqCategories = [
  "All Questions",
  "Getting Started",
  "Products",
  "Orders & Fulfillment",
  "Selling",
  "Payments",
];

/* =========================================================
   FAQ DATA
   Natural SEO / Long-tail search questions
========================================================= */

const faqs = [
  {
    category: "Getting Started",
    question: "What is KaroDrop?",
    answer:
      "KaroDrop is a dropshipping platform designed to help sellers discover products, build their online business and manage the selling journey without needing to handle traditional inventory for every product.",
    keywords:
      "KaroDrop dropshipping platform dropshipping business online selling ecommerce",
  },
  {
    category: "Getting Started",
    question: "What is dropshipping?",
    answer:
      "Dropshipping is an ecommerce model where a seller can offer products to customers without keeping traditional inventory at their own location. When a customer places an order, the product moves through the fulfillment process and is delivered to the customer.",
    keywords:
      "what is dropshipping dropshipping meaning dropshipping business ecommerce",
  },
  {
    category: "Getting Started",
    question: "How does dropshipping work?",
    answer:
      "In a typical dropshipping business, a seller selects products, publishes them in an online store and promotes them to customers. When an order is received, the product moves through the applicable order processing and fulfillment steps before delivery.",
    keywords:
      "how does dropshipping work dropshipping process online store fulfillment",
  },
  {
    category: "Getting Started",
    question: "How do I start a dropshipping business?",
    answer:
      "Start by choosing a niche, researching products, understanding your target customers and creating clear product listings. Once your store is prepared, you can begin promoting products and accepting customer orders.",
    keywords:
      "how to start dropshipping how to start dropshipping business online business",
  },
  {
    category: "Getting Started",
    question: "How do I start dropshipping in India?",
    answer:
      "To start dropshipping in India, begin by selecting a suitable niche, researching products and customers, understanding your costs and creating an online selling setup. Before selling, make sure your product information, pricing, delivery expectations and customer support process are clear.",
    keywords:
      "dropshipping in India start dropshipping business India ecommerce India",
  },
  {
    category: "Getting Started",
    question: "Do I need a physical store to start selling?",
    answer:
      "No. Dropshipping is primarily an online selling model. You can build an online storefront and present products to customers without operating a traditional physical retail store.",
    keywords:
      "online store physical shop dropshipping online business ecommerce",
  },
  {
    category: "Getting Started",
    question: "How many products should I add to my store?",
    answer:
      "There is no fixed number that works for every seller. It is usually better to begin with products that fit your niche and target customer rather than adding a large number of unrelated products.",
    keywords:
      "how many products online store dropshipping product selection ecommerce",
  },
  {
    category: "Getting Started",
    question: "How much does it cost to start a dropshipping business?",
    answer:
      "The cost of starting a dropshipping business depends on the tools, store setup, marketing, product research and other services you choose. Review your expected expenses before starting and create a budget that fits your business.",
    keywords:
      "dropshipping cost cost to start dropshipping dropshipping business investment",
  },

  /* ===================================================== */

  {
    category: "Products",
    question: "How should I choose products for my store?",
    answer:
      "Consider customer demand, product quality, selling price, competition, usefulness and how well the product fits your chosen niche. Research the product before adding it to your store.",
    keywords:
      "how to choose dropshipping products product research product selection",
  },
  {
    category: "Products",
    question: "What makes a product suitable for dropshipping?",
    answer:
      "A suitable product should have a clear customer use case, reasonable pricing potential and reliable fulfillment possibilities. Product quality and customer expectations should also be considered before selling.",
    keywords:
      "best dropshipping product product selection dropshipping products",
  },
  {
    category: "Products",
    question: "Should I sell trending products?",
    answer:
      "Trending products can create opportunities, but trends can change quickly. Evaluate the product's actual customer demand, competition, pricing and quality instead of relying only on its popularity.",
    keywords:
      "trending dropshipping products winning products product trends ecommerce",
  },
  {
    category: "Products",
    question: "Why is product research important?",
    answer:
      "Product research helps you understand whether customers may be interested in a product and whether it fits your business. It can also help you understand competition, pricing and potential customer expectations.",
    keywords:
      "dropshipping product research ecommerce product research online selling",
  },
  {
    category: "Products",
    question: "How important are product images?",
    answer:
      "Product images are an important part of an online listing because customers cannot physically examine the product before purchasing. Clear and useful images can help customers understand what they are considering.",
    keywords:
      "product images ecommerce product listing dropshipping store images",
  },
  {
    category: "Products",
    question: "How should I write a dropshipping product description?",
    answer:
      "Use a clear product title and explain the product's important features, use cases, specifications and relevant information. Write for customers rather than simply filling the description with search keywords.",
    keywords:
      "product description dropshipping product listing ecommerce SEO product description",
  },
  {
    category: "Products",
    question: "How can I find products to sell online?",
    answer:
      "Start with a specific niche and research products based on customer needs, demand, competition, pricing and product quality. Compare potential products before deciding what fits your store.",
    keywords:
      "products to sell online dropshipping products product ideas ecommerce",
  },

  /* ===================================================== */

  {
    category: "Orders & Fulfillment",
    question: "What happens after a customer places an order?",
    answer:
      "After an order is placed, the order moves through the relevant processing and fulfillment steps. The product is prepared for dispatch and then moves toward delivery to the customer.",
    keywords:
      "dropshipping order process order fulfillment ecommerce orders",
  },
  {
    category: "Orders & Fulfillment",
    question: "What is order fulfillment?",
    answer:
      "Order fulfillment is the process of preparing an order after purchase and moving it through processing, packaging or production where applicable, dispatch and delivery.",
    keywords:
      "what is order fulfillment ecommerce fulfillment dropshipping fulfillment",
  },
  {
    category: "Orders & Fulfillment",
    question: "How does dropshipping order fulfillment work?",
    answer:
      "Dropshipping fulfillment generally involves processing the customer order, preparing the product for dispatch and moving the shipment through delivery. The exact process can vary depending on the fulfillment setup and shipping service.",
    keywords:
      "dropshipping fulfillment how fulfillment works order processing shipping",
  },
  {
    category: "Orders & Fulfillment",
    question: "Can customers track their orders?",
    answer:
      "Order tracking depends on the shipping and fulfillment process associated with the order. Where tracking information is available, it can be used to follow the shipment's progress.",
    keywords:
      "order tracking ecommerce dropshipping shipment tracking delivery tracking",
  },
  {
    category: "Orders & Fulfillment",
    question: "What should I do if an order is delayed?",
    answer:
      "First, check the available order and shipping information. Keep the customer informed about the latest status and provide any available tracking or delivery information.",
    keywords:
      "dropshipping order delayed delivery issue ecommerce customer support",
  },
  {
    category: "Orders & Fulfillment",
    question: "Why is clear delivery information important?",
    answer:
      "Customers want to know when they can expect their purchase. Providing clear and realistic delivery information helps set expectations and can reduce confusion after an order is placed.",
    keywords:
      "dropshipping delivery ecommerce shipping delivery information customer experience",
  },

  /* ===================================================== */

  {
    category: "Selling",
    question: "How can I improve my product listings?",
    answer:
      "Use clear product titles, useful descriptions, quality images and important product information. Focus on answering the questions a customer is likely to have before purchasing.",
    keywords:
      "improve product listings ecommerce product listing tips dropshipping",
  },
  {
    category: "Selling",
    question: "How can I get my first dropshipping order?",
    answer:
      "Start by making sure your store and product listings are ready. Then promote products through channels that match your target customers, such as relevant social media platforms and other marketing channels.",
    keywords:
      "how to get first dropshipping order first ecommerce sale first online order",
  },
  {
    category: "Selling",
    question: "How can I promote my dropshipping store?",
    answer:
      "Choose marketing channels that match your target audience and product. You can explore relevant social media, content, search and other marketing methods while measuring which activities bring useful traffic and customers.",
    keywords:
      "promote dropshipping store dropshipping marketing ecommerce marketing online selling",
  },
  {
    category: "Selling",
    question: "Should I focus on one niche?",
    answer:
      "A focused niche can make it easier to understand your target customer and create a consistent store experience. You can expand into related products as your business develops.",
    keywords:
      "dropshipping niche ecommerce niche choose niche online store",
  },
  {
    category: "Selling",
    question: "How can I build customer trust?",
    answer:
      "Keep product information clear, communicate order and delivery expectations honestly, provide helpful customer support and create a consistent shopping experience.",
    keywords:
      "build customer trust ecommerce dropshipping customer experience online store",
  },
  {
    category: "Selling",
    question: "How can I grow my dropshipping store?",
    answer:
      "Focus on improving the areas that affect your business most, such as product selection, listings, marketing, customer experience and fulfillment. Review your results regularly and make improvements based on what you learn.",
    keywords:
      "grow dropshipping store ecommerce growth online business selling tips",
  },
  {
    category: "Selling",
    question: "How can SEO help my online store?",
    answer:
      "SEO can help search engines understand your pages and can make relevant pages discoverable for people searching for products, information and solutions related to your business. Useful content and clear page structure are important parts of an SEO strategy.",
    keywords:
      "ecommerce SEO dropshipping SEO online store SEO search engine optimization",
  },

  /* ===================================================== */

  {
    category: "Payments",
    question: "How should I think about product pricing?",
    answer:
      "Your selling price should take the product cost and relevant business expenses into account while remaining reasonable for your target customer and market.",
    keywords:
      "dropshipping pricing ecommerce pricing product price online selling",
  },
  {
    category: "Payments",
    question: "What is a profit margin?",
    answer:
      "Profit margin represents the portion of your selling revenue that remains after relevant costs are considered. Understanding your costs helps you make better pricing decisions.",
    keywords:
      "profit margin dropshipping ecommerce profit online business pricing",
  },
  {
    category: "Payments",
    question: "Why should I calculate my costs before setting a price?",
    answer:
      "Knowing your costs helps you avoid pricing a product too low and gives you a clearer view of the potential financial outcome of each sale.",
    keywords:
      "dropshipping costs product pricing ecommerce costs profit calculation",
  },
  {
    category: "Payments",
    question: "What costs should I consider when pricing products?",
    answer:
      "Consider relevant product, fulfillment, shipping, marketing, platform and other business expenses applicable to your selling setup. Understanding the complete cost structure helps you evaluate your pricing.",
    keywords:
      "dropshipping costs shipping marketing product cost ecommerce expenses",
  },
];

/* =========================================================
   SEO CONSTANTS
========================================================= */

const SEO_TITLE = "Dropshipping FAQs | KaroDrop";

const SEO_DESCRIPTION =
  "Find answers about dropshipping, starting a dropshipping business in India, product research, order fulfillment, ecommerce selling, pricing and growing an online store with KaroDrop.";

/* =========================================================
   COMPONENT
========================================================= */

function FAQs() {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================================
     SEO META + STRUCTURED DATA
  ========================================================= */

  useEffect(() => {
    document.title = SEO_TITLE;

    const upsertMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);

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
      `${window.location.origin}/resources/faqs`
    );

    /* -------------------------------------------------------
       FAQPage JSON-LD
    ------------------------------------------------------- */

    const existingSchema = document.getElementById(
      "karodrop-faq-schema"
    );

    if (existingSchema) {
      existingSchema.remove();
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const script = document.createElement("script");

    script.id = "karodrop-faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);

    document.head.appendChild(script);

    return () => {
      const schema = document.getElementById(
        "karodrop-faq-schema"
      );

      if (schema) {
        schema.remove();
      }
    };
  }, []);

  /* =========================================================
     FILTER + SEARCH
  ========================================================= */

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return faqs.filter((faq) => {
      const categoryMatch =
        activeCategory === "All Questions" ||
        faq.category === activeCategory;

      if (!normalizedSearch) {
        return categoryMatch;
      }

      const searchableText = `
        ${faq.question}
        ${faq.answer}
        ${faq.category}
        ${faq.keywords}
      `.toLowerCase();

      return (
        categoryMatch &&
        searchableText.includes(normalizedSearch)
      );
    });
  }, [activeCategory, searchTerm]);

  const toggleFaq = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setOpenIndex(null);
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
              FAQs
            </span>

          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-center">

            {/* Hero Content */}

            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
                KaroDrop FAQs
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
                Dropshipping FAQs for{" "}
                <span className="text-[#0078ED]">
                  online sellers
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
                Find practical answers about dropshipping, starting
                an online store, product research, order fulfillment,
                ecommerce selling, pricing and growing your business.
              </p>

              {/* Search Bar */}

              <div className="mt-8 max-w-2xl">

                <label
                  htmlFor="faq-search"
                  className="sr-only"
                >
                  Search frequently asked questions
                </label>

                <div className="relative">

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#7A8999]"
                  >
                    ⌕
                  </span>

                  <input
                    id="faq-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setOpenIndex(null);
                    }}
                    placeholder="Search dropshipping, products, orders, pricing..."
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
                      sm:py-4.5 sm:text-base
                    "
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear FAQ search"
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
                  Search by question, topic or keyword
                </p>

              </div>

            </div>

            {/* Hero Visual */}

            <div className="flex justify-center lg:justify-end">

              <div
                className="
                  flex h-52 w-52
                  items-center justify-center
                  rounded-full bg-[#EAF4FF]
                  sm:h-64 sm:w-64
                  lg:h-72 lg:w-72
                "
              >

                <div
                  className="
                    flex h-32 w-32
                    items-center justify-center
                    rounded-full bg-white
                    text-5xl font-semibold
                    text-[#0078ED]
                    shadow-lg
                    sm:h-40 sm:w-40
                    sm:text-6xl
                  "
                >
                  ?
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SEO TOPIC INTRO
      ====================================================== */}

      <section className="bg-[#F5FAFF]">

        <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 md:py-16">

          <div className="rounded-3xl border border-[#DCE7F2] bg-white p-6 sm:p-8 lg:p-10">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Dropshipping Knowledge Hub
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl">
              Learn how to start and grow an online selling business
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Whether you are learning what dropshipping means,
              researching products to sell online, understanding
              order fulfillment or planning your first ecommerce
              store, these frequently asked questions cover common
              topics that new and growing sellers need to understand.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">

              {[
                "Dropshipping",
                "Dropshipping in India",
                "Product Research",
                "Online Store",
                "Order Fulfillment",
                "Ecommerce Selling",
                "Product Pricing",
                "Online Business",
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setSearchTerm(keyword)}
                  className="
                    rounded-full
                    border border-[#DCE7F2]
                    bg-[#F5FAFF]
                    px-4 py-2
                    text-xs font-medium
                    text-[#526274]
                    transition
                    hover:border-[#9CCDF7]
                    hover:bg-[#EAF4FF]
                    hover:text-[#0078ED]
                    sm:text-sm
                  "
                >
                  {keyword}
                </button>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ CONTENT
      ====================================================== */}

      <section
        aria-labelledby="faq-heading"
        className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 md:py-20"
      >

        {/* Category Filter */}

        <div className="mb-10">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Browse By Topic
          </p>

          <div
            className="
              flex gap-2
              overflow-x-auto
              pb-3
              scrollbar-thin
            "
          >

            {faqCategories.map((category) => {

              const isActive =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`
                    whitespace-nowrap
                    rounded-full
                    px-5 py-2.5
                    text-sm font-semibold
                    transition
                    ${
                      isActive
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

        </div>

        {/* Heading + Result Count */}

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2
              id="faq-heading"
              className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl"
            >
              Frequently asked questions
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
              Find answers to common questions about dropshipping,
              products, orders, selling and payments.
            </p>

          </div>

          <p className="shrink-0 text-sm font-medium text-[#7A8999]">
            {filteredFaqs.length}{" "}
            {filteredFaqs.length === 1
              ? "question"
              : "questions"}
          </p>

        </div>

        {/* FAQ LIST */}

        <div className="space-y-3">

          {filteredFaqs.map((faq, index) => {

            const isOpen = openIndex === index;

            return (
              <article
                key={faq.question}
                className={`
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  transition
                  ${
                    isOpen
                      ? "border-[#9CCDF7] shadow-sm"
                      : "border-[#DCE7F2]"
                  }
                `}
              >

                {/* QUESTION */}

                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="
                    flex w-full
                    items-center justify-between
                    gap-5
                    px-4 py-5
                    text-left
                    sm:px-6 sm:py-6
                  "
                  aria-expanded={isOpen}
                >

                  <div className="flex min-w-0 items-start gap-4">

                    <span
                      className={`
                        mt-0.5
                        flex h-8 w-8
                        shrink-0
                        items-center justify-center
                        rounded-lg
                        text-sm font-bold
                        ${
                          isOpen
                            ? "bg-[#0078ED] text-white"
                            : "bg-[#EAF4FF] text-[#0078ED]"
                        }
                      `}
                    >
                      ?
                    </span>

                    <div className="min-w-0">

                      <h3 className="text-base font-semibold leading-6 text-[#0B1F3A] sm:text-lg">
                        {faq.question}
                      </h3>

                      <span className="mt-1 block text-xs font-medium text-[#8A98A8]">
                        {faq.category}
                      </span>

                    </div>

                  </div>

                  <span
                    className={`
                      flex h-8 w-8
                      shrink-0
                      items-center justify-center
                      rounded-full
                      text-lg font-medium
                      transition-transform duration-300
                      ${
                        isOpen
                          ? "rotate-45 bg-[#EAF4FF] text-[#0078ED]"
                          : "bg-[#F5FAFF] text-[#5E6B7A]"
                      }
                    `}
                  >
                    +
                  </span>

                </button>

                {/* ANSWER */}

                <div
                  className={`
                    grid transition-all duration-300
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >

                  <div className="min-h-0 overflow-hidden">

                    <div className="border-t border-[#E8EFF5] px-5 pb-6 pt-5 sm:px-6">

                      <p className="max-w-3xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
                        {faq.answer}
                      </p>

                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

        {/* No Search Results */}

        {filteredFaqs.length === 0 && (
          <div
            className="
              mt-5
              rounded-2xl
              border border-dashed border-[#BFD4E8]
              bg-white
              px-6 py-12
              text-center
            "
          >

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FF] text-xl text-[#0078ED]">
              ?
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#0B1F3A]">
              No matching questions found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#5E6B7A]">
              Try another keyword such as dropshipping,
              products, orders, selling or pricing.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All Questions");
                setOpenIndex(null);
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
              View All Questions
            </button>

          </div>
        )}

      </section>

      {/* =====================================================
          LONG-TAIL SEARCH TOPICS
      ====================================================== */}

      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">

          <div className="mb-10 max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Helpful Topics
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              More questions sellers often search for
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5E6B7A] sm:text-base">
              Explore common ecommerce and dropshipping topics
              related to products, customers, fulfillment and
              growing an online store.
            </p>

          </div>

          <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">

            {[
              "How to start dropshipping in India",
              "How to choose products for dropshipping",
              "How to get your first dropshipping order",
              "How does dropshipping order fulfillment work?",
              "How to improve ecommerce product listings",
              "How to promote a dropshipping store",
              "How to calculate dropshipping product pricing",
              "How to build trust with online customers",
            ].map((topic) => (

              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSearchTerm(topic);
                  setActiveCategory("All Questions");
                  setOpenIndex(null);

                  window.scrollTo({
                    top:
                      document.getElementById(
                        "faq-heading"
                      )?.offsetTop - 100 || 0,
                    behavior: "smooth",
                  });
                }}
                className="
                  group
                  flex items-center justify-between
                  gap-5
                  border-b border-[#E8EFF5]
                  py-4
                  text-left
                "
              >

                <span className="text-sm font-medium leading-6 text-[#405166] transition group-hover:text-[#0078ED] sm:text-base">
                  {topic}
                </span>

                <span className="shrink-0 text-[#0078ED] transition-transform group-hover:translate-x-1">
                  →
                </span>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ANSWERS / INTERNAL LINKS
      ====================================================== */}

      <section className="bg-[#F5FAFF]">

        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">

          <div className="mb-10 text-center">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Need More Help?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Explore more KaroDrop resources
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Learn more about building your store, improving
              your selling strategy and managing your dropshipping
              journey.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Guides */}

            <Link
              to="/resources/guides"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-white
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-md
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
                ▣
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Guides & Tutorials
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Follow step-by-step guides for starting and
                growing your online selling business.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                Explore Guides →
              </span>

            </Link>

            {/* Selling Tips */}

            <Link
              to="/resources/selling-tips"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-white
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
                hover:shadow-md
              "
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
                ↗
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Selling Tips
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Discover practical ideas for products, listings,
                marketing and customer experience.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                View Selling Tips →
              </span>

            </Link>

            {/* Help Center */}

            <Link
              to="/resources/help-center"
              className="
                group
                rounded-2xl
                border border-[#DCE7F2]
                bg-white
                p-6
                transition
                hover:-translate-y-1
                hover:border-[#B9D9F5]
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
                Find help with common account, order, product
                and selling related questions.
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
            KaroDrop Support
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Still have a question?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            If you cannot find the information you need,
            explore the Help Center for additional support
            resources.
          </p>

          <Link
            to="/resources/help-center"
            className="
              mt-8
              inline-flex items-center
              rounded-full
              bg-white
              px-7 py-3.5
              text-sm font-semibold
              text-[#012467]
              transition
              hover:bg-[#EAF4FF]
            "
          >
            Visit Help Center
            <span className="ml-2">→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default FAQs;
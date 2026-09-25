import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqCategories = [
  "All Questions",
  "Getting Started",
  "Products",
  "Orders & Fulfillment",
  "Selling",
  "Payments",
];

const faqs = [
  {
    category: "Getting Started",
    question: "What is KaroDrop?",
    answer:
      "KaroDrop is a dropshipping platform designed to help sellers discover products, build their online business and manage the selling journey without needing to handle traditional inventory for every product.",
  },
  {
    category: "Getting Started",
    question: "What is dropshipping?",
    answer:
      "Dropshipping is an ecommerce model where a seller can offer products to customers without keeping traditional inventory at their own location. When a customer places an order, the product moves through the fulfillment process and is delivered to the customer.",
  },
  {
    category: "Getting Started",
    question: "How do I get started with dropshipping?",
    answer:
      "Start by choosing a niche, researching products, understanding your target customers and creating clear product listings. Once your store is prepared, you can begin promoting products and accepting customer orders.",
  },
  {
    category: "Getting Started",
    question: "Do I need a physical store to start selling?",
    answer:
      "No. Dropshipping is primarily an online selling model. You can build an online storefront and present products to customers without operating a traditional physical retail store.",
  },
  {
    category: "Getting Started",
    question: "How many products should I add to my store?",
    answer:
      "There is no fixed number that works for every seller. It is usually better to begin with products that fit your niche and target customer rather than adding a large number of unrelated products.",
  },

  {
    category: "Products",
    question: "How should I choose products for my store?",
    answer:
      "Consider customer demand, product quality, selling price, competition, usefulness and how well the product fits your chosen niche. Research the product before adding it to your store.",
  },
  {
    category: "Products",
    question: "What makes a product suitable for dropshipping?",
    answer:
      "A suitable product should have a clear customer use case, reasonable pricing potential and reliable fulfillment possibilities. Product quality and customer expectations should also be considered before selling.",
  },
  {
    category: "Products",
    question: "Should I sell trending products?",
    answer:
      "Trending products can create opportunities, but trends can change quickly. Evaluate the product's actual customer demand, competition, pricing and quality instead of relying only on its popularity.",
  },
  {
    category: "Products",
    question: "Why is product research important?",
    answer:
      "Product research helps you understand whether customers may be interested in a product and whether it fits your business. It can also help you understand competition, pricing and potential customer expectations.",
  },
  {
    category: "Products",
    question: "How important are product images?",
    answer:
      "Product images are an important part of an online listing because customers cannot physically examine the product before purchasing. Clear and useful images can help customers understand what they are considering.",
  },

  {
    category: "Orders & Fulfillment",
    question: "What happens after a customer places an order?",
    answer:
      "After an order is placed, the order moves through the relevant processing and fulfillment steps. The product is prepared for dispatch and then moves toward delivery to the customer.",
  },
  {
    category: "Orders & Fulfillment",
    question: "What is order fulfillment?",
    answer:
      "Order fulfillment is the process of preparing an order after purchase and moving it through processing, packaging or production where applicable, dispatch and delivery.",
  },
  {
    category: "Orders & Fulfillment",
    question: "Can customers track their orders?",
    answer:
      "Order tracking depends on the shipping and fulfillment process associated with the order. Where tracking information is available, it can be used to follow the shipment's progress.",
  },
  {
    category: "Orders & Fulfillment",
    question: "What should I do if an order is delayed?",
    answer:
      "First, check the available order and shipping information. Keep the customer informed about the latest status and provide any available tracking or delivery information.",
  },
  {
    category: "Orders & Fulfillment",
    question: "Why is clear delivery information important?",
    answer:
      "Customers want to know when they can expect their purchase. Providing clear and realistic delivery information helps set expectations and can reduce confusion after an order is placed.",
  },

  {
    category: "Selling",
    question: "How can I improve my product listings?",
    answer:
      "Use clear product titles, useful descriptions, quality images and important product information. Focus on answering the questions a customer is likely to have before purchasing.",
  },
  {
    category: "Selling",
    question: "How can I get my first order?",
    answer:
      "Start by making sure your store and product listings are ready. Then promote products through channels that match your target customers, such as relevant social media platforms and other marketing channels.",
  },
  {
    category: "Selling",
    question: "Should I focus on one niche?",
    answer:
      "A focused niche can make it easier to understand your target customer and create a consistent store experience. You can expand into related products as your business develops.",
  },
  {
    category: "Selling",
    question: "How can I build customer trust?",
    answer:
      "Keep product information clear, communicate order and delivery expectations honestly, provide helpful customer support and create a consistent shopping experience.",
  },
  {
    category: "Selling",
    question: "How can I grow my dropshipping store?",
    answer:
      "Focus on improving the areas that affect your business most, such as product selection, listings, marketing, customer experience and fulfillment. Review your results regularly and make improvements based on what you learn.",
  },

  {
    category: "Payments",
    question: "How should I think about product pricing?",
    answer:
      "Your selling price should take the product cost and relevant business expenses into account while remaining reasonable for your target customer and market.",
  },
  {
    category: "Payments",
    question: "What is a profit margin?",
    answer:
      "Profit margin represents the portion of your selling revenue that remains after relevant costs are considered. Understanding your costs helps you make better pricing decisions.",
  },
  {
    category: "Payments",
    question: "Why should I calculate my costs before setting a price?",
    answer:
      "Knowing your costs helps you avoid pricing a product too low and gives you a clearer view of the potential financial outcome of each sale.",
  },
];

function FAQs() {
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs =
    activeCategory === "All Questions"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

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
              FAQs
            </span>

          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-center">

            {/* Hero Content */}
            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
                KaroDrop FAQs
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl">
                Answers to your{" "}
                <span className="text-[#0078ED]">
                  selling questions
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base lg:text-lg">
                Find answers to common questions about dropshipping,
                products, orders, fulfillment, selling and growing your
                online business with KaroDrop.
              </p>

            </div>

            {/* Hero Visual */}
            <div className="flex justify-center lg:justify-end">

              <div
                className="
                  flex h-56 w-56
                  items-center justify-center
                  rounded-full bg-[#EAF4FF]
                  sm:h-64 sm:w-64
                "
              >

                <div
                  className="
                    flex h-36 w-36
                    items-center justify-center
                    rounded-full bg-white
                    text-5xl font-semibold
                    text-[#0078ED]
                    shadow-lg
                    sm:h-40 sm:w-40
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
          FAQ CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 md:py-20">

        {/* Category Filter */}
        <div className="mb-10">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
            Browse By Topic
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">

            {faqCategories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`
                    whitespace-nowrap rounded-full
                    px-5 py-2.5 text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-[#0078ED] text-white"
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

        {/* Heading */}
        <div className="mb-8">

          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
            Select a question to view the answer.
          </p>

        </div>

        {/* FAQ LIST */}
        <div className="space-y-3">

          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  overflow-hidden rounded-2xl
                  border bg-white
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
                    gap-5 px-5 py-5
                    text-left sm:px-6 sm:py-6
                  "
                  aria-expanded={isOpen}
                >

                  <div className="flex min-w-0 items-start gap-4">

                    <span
                      className={`
                        mt-0.5 flex h-8 w-8
                        shrink-0 items-center justify-center
                        rounded-lg text-sm font-bold
                        ${
                          isOpen
                            ? "bg-[#0078ED] text-white"
                            : "bg-[#EAF4FF] text-[#0078ED]"
                        }
                      `}
                    >
                      ?
                    </span>

                    <div>

                      <p className="text-base font-semibold leading-6 text-[#0B1F3A] sm:text-lg">
                        {faq.question}
                      </p>

                      <span className="mt-1 block text-xs font-medium text-[#8A98A8]">
                        {faq.category}
                      </span>

                    </div>

                  </div>

                  <span
                    className={`
                      flex h-8 w-8
                      shrink-0 items-center justify-center
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

              </div>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          QUICK ANSWERS
      ====================================================== */}
      <section className="border-y border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">

          <div className="mb-10 text-center">

            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#0078ED]">
              Need More Help?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl">
              Explore more KaroDrop resources
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
              Learn more about building your store, improving your selling
              strategy and managing your dropshipping journey.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <Link
              to="/resources/guides"
              className="
                group rounded-2xl
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

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl bg-[#EAF4FF]
                  text-lg text-[#0078ED]
                "
              >
                ▣
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Guides & Tutorials
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Follow step-by-step guides for starting and growing your
                online selling business.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                Explore Guides →
              </span>

            </Link>

            <Link
              to="/resources/selling-tips"
              className="
                group rounded-2xl
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

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl bg-[#EAF4FF]
                  text-lg text-[#0078ED]
                "
              >
                ↗
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Selling Tips
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Discover practical ideas for products, listings, marketing
                and customer experience.
              </p>

              <span className="mt-5 block text-sm font-semibold text-[#0078ED]">
                View Selling Tips →
              </span>

            </Link>

            <Link
              to="/resources/help-center"
              className="
                group rounded-2xl
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

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl bg-[#EAF4FF]
                  text-lg text-[#0078ED]
                "
              >
                ?
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0B1F3A]">
                Help Center
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Find help with common account, order, product and selling
                related questions.
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

        <div className="rounded-3xl bg-[#012467] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">

          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8FC9FF]">
            KaroDrop Support
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Still have a question?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            If you cannot find the information you need, visit the Help
            Center for more support resources.
          </p>

          <Link
            to="/resources/help-center"
            className="
              mt-8 inline-flex items-center
              rounded-full bg-white
              px-7 py-3.5
              text-sm font-semibold text-[#012467]
              transition hover:bg-[#EAF4FF]
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
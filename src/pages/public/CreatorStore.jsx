import React from "react";
import { Link } from "react-router-dom";
import  useProducts  from "../../useProducts.js";

export default function CreatorStore() {
  const { products = [], loading } = useProducts();

  // Existing products — first 3 products will be used in preview
  const previewProducts = products.slice(0, 3);
  const catalogueProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Background glows */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#EAF4FF]
            opacity-80
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#F0F7FF]
            opacity-80
            blur-3xl
          "
        />

        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">

          <div
            className="
              grid
              min-h-[650px]
              items-center
              gap-14
              py-
              lg:grid-cols-2
              lg:gap-16
              lg:py-20
            "
          >

            {/* ================= LEFT ================= */}

            <div className="relative z-10 max-w-[650px]">

              <p
                className="
                  mb-6
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#0078ED]
                "
              >
                CREATOR STORE
              </p>

              <h1
                className="
                  font-display
                  text-[46px]
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.02em]
                  text-[#012467]
                  sm:text-[56px]
                  lg:text-[64px]
                "
              >
                Build Your Own

                <span className="block text-[#0078ED]">
                  Online Store
                </span>
              </h1>

              <p
                className="
                  mt-7
                  max-w-[610px]
                  text-[17px]
                  leading-8
                  text-[#5E6B7A]
                  sm:text-[18px]
                "
              >
                Start selling without managing inventory, packaging or
                shipping. Choose products, create your store and let us
                handle fulfillment.
              </p>

              {/* Small workflow line */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-2
                  text-xs
                  font-medium
                  text-[#5E6B7A]
                "
              >
                <span>Choose Products</span>

                <span className="text-[#0078ED]">→</span>

                <span>Create Store</span>

                <span className="text-[#0078ED]">→</span>

                <span>Start Selling</span>

                <span className="text-[#0078ED]">→</span>

                <span>We Fulfill</span>
              </div>

              {/* Buttons */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/create-store"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-[#0078ED]
                    px-8
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_10px_25px_rgba(0,120,237,0.20)]
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#012467]
                    hover:shadow-[0_15px_30px_rgba(1,36,103,0.20)]
                  "
                >
                  Create Your Store

                  <span className="ml-2 text-base">
                    →
                  </span>
                </Link>

                <Link
                  to="/category/all"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#DCE7F2]
                    bg-white
                    px-8
                    py-4
                    text-sm
                    font-semibold
                    text-[#012467]
                    transition
                    duration-200
                    hover:border-[#0078ED]
                    hover:bg-[#F5FAFF]
                    hover:text-[#0078ED]
                  "
                >
                  Explore Products
                </Link>

              </div>

            </div>


            {/* ================= RIGHT STORE PREVIEW ================= */}

            <div className="relative z-10">

              {/* Blue glow behind browser */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[500px]
                  w-[500px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#EAF4FF]
                  opacity-90
                  blur-[90px]
                "
              />

              {/* Browser window */}

              <div
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-[680px]
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#DCE7F2]
                  bg-white
                  shadow-[0_30px_80px_rgba(1,36,103,0.12)]
                "
              >

                {/* Browser top bar */}

                <div
                  className="
                    flex
                    h-[60px]
                    items-center
                    gap-2
                    border-b
                    border-[#DCE7F2]
                    px-5
                  "
                >

                  <span className="h-3 w-3 rounded-full bg-[#DCE7F2]" />
                  <span className="h-3 w-3 rounded-full bg-[#DCE7F2]" />
                  <span className="h-3 w-3 rounded-full bg-[#DCE7F2]" />

                  <div
                    className="
                      ml-4
                      flex
                      h-8
                      flex-1
                      items-center
                      rounded-lg
                      bg-[#F5FAFF]
                      px-4
                      text-[11px]
                      text-[#7B8794]
                    "
                  >
                    yourstore.karodrop.com
                  </div>

                </div>


                {/* Store content */}

                <div className="p-6 sm:p-8">

                  {/* Store navbar */}

                  <div className="flex items-center justify-between">

                    <div>

                      <h3
                        className="
                          font-display
                          text-[22px]
                          font-semibold
                          text-[#012467]
                        "
                      >
                        Your Brand
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[0.18em]
                          text-[#8A97A8]
                        "
                      >
                        YOUR STORE
                      </p>

                    </div>

                    <div
                      className="
                        hidden
                        items-center
                        gap-5
                        text-[11px]
                        text-[#5E6B7A]
                        sm:flex
                      "
                    >
                      <span>Home</span>
                      <span>Shop</span>
                      <span>About</span>
                    </div>

                  </div>


                  {/* Store Hero */}

                  <div
                    className="
                      mt-7
                      rounded-[15px]
                      bg-[#EAF4FF]
                      px-5
                      py-9
                      text-center
                      sm:py-10
                    "
                  >

                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.25em]
                        text-[#0078ED]
                      "
                    >
                      NEW COLLECTION
                    </p>

                    <h4
                      className="
                        mt-3
                        font-display
                        text-[25px]
                        font-semibold
                        text-[#012467]
                        sm:text-[29px]
                      "
                    >
                      Discover Your Style
                    </h4>

                    <button
                      type="button"
                      className="
                        mt-5
                        rounded-full
                        bg-[#0078ED]
                        px-6
                        py-2.5
                        text-[10px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#012467]
                      "
                    >
                      Shop Now
                    </button>

                  </div>


                  {/* Actual Products */}

                  <div className="mt-6 grid grid-cols-3 gap-3">

                    {loading
                      ? [1, 2, 3].map((item) => (
                          <div key={item}>

                            <div
                              className="
                                aspect-square
                                animate-pulse
                                rounded-xl
                                bg-[#EAF4FF]
                              "
                            />

                            <div
                              className="
                                mt-2
                                h-3
                                w-3/4
                                animate-pulse
                                rounded
                                bg-[#DCE7F2]
                              "
                            />

                          </div>
                        ))
                      : previewProducts.map((product) => (
                          <div
                            key={
                              product._id ||
                              product.id ||
                              product.slug
                            }
                          >

                            <div
                              className="
                                aspect-square
                                overflow-hidden
                                rounded-xl
                                bg-[#EAF4FF]
                              "
                            >

                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <div className="h-full w-full bg-[#EAF4FF]" />
                              )}

                            </div>

                            <p
                              className="
                                mt-2
                                truncate
                                text-[10px]
                                font-medium
                                text-[#3E4C60]
                              "
                            >
                              {product.title}
                            </p>

                          </div>
                        ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className="
          border-y
          border-[#DCE7F2]
          bg-[#F5FAFF]
        "
      >

        <div className="mx-auto max-w-[1250px] px-6 py-20 sm:px-8">

          <div className="mx-auto max-w-[650px] text-center">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.23em]
                text-[#0078ED]
              "
            >
              HOW IT WORKS
            </p>

            <h2
              className="
                mt-3
                font-display
                text-3xl
                font-semibold
                text-[#012467]
                sm:text-4xl
              "
            >
              Start Selling in Four Simple Steps
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-[#5E6B7A]
              "
            >
              From choosing products to fulfilling orders, Karodrop keeps
              the process simple.
            </p>

          </div>


          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Create Your Store",
                text: "Set up your store with your brand name and basic details.",
              },
              {
                number: "02",
                title: "Choose Products",
                text: "Select products from our ready-to-sell catalogue.",
              },
              {
                number: "03",
                title: "Start Selling",
                text: "Add products to your store and start reaching customers.",
              },
              {
                number: "04",
                title: "We Fulfill",
                text: "We handle packaging and shipping when you receive an order.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="
                  rounded-2xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  p-7
                  transition
                  duration-200
                  hover:-translate-y-1
                  hover:border-[#BFDDF7]
                  hover:shadow-[0_15px_40px_rgba(1,36,103,0.08)]
                "
              >

                <span
                  className="
                    text-xs
                    font-bold
                    tracking-widest
                    text-[#0078ED]
                  "
                >
                  {step.number}
                </span>

                <h3
                  className="
                    mt-5
                    font-display
                    text-xl
                    font-semibold
                    text-[#0B1F3A]
                  "
                >
                  {step.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-[#5E6B7A]
                  "
                >
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          SELL WITHOUT INVENTORY
      ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-[1250px] px-6 py-20 sm:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.23em]
                  text-[#0078ED]
                "
              >
                SELL WITHOUT INVENTORY
              </p>

              <h2
                className="
                  mt-3
                  font-display
                  text-3xl
                  font-semibold
                  leading-tight
                  text-[#012467]
                  sm:text-4xl
                "
              >
                You Focus on Your Brand.

                <span className="block text-[#0078ED]">
                  We Handle Fulfillment.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-[#5E6B7A]
                "
              >
                You don't need to store products or manage every shipment.
                When your customer places an order, Karodrop takes care of
                the fulfillment process.
              </p>

            </div>


            {/* RIGHT PROCESS */}

            <div
              className="
                rounded-2xl
                border
                border-[#DCE7F2]
                bg-[#F5FAFF]
                p-7
                sm:p-9
              "
            >

              <div className="space-y-6">

                {[
                  {
                    number: "1",
                    title: "Customer Orders",
                    text: "A customer buys a product from your store.",
                  },
                  {
                    number: "2",
                    title: "Order Reaches Karodrop",
                    text: "The order is received for fulfillment.",
                  },
                  {
                    number: "3",
                    title: "We Pack",
                    text: "The product is prepared and packaged.",
                  },
                  {
                    number: "4",
                    title: "We Ship",
                    text: "The order is shipped to your customer.",
                  },
                ].map((item) => (

                  <div
                    key={item.number}
                    className="flex items-start gap-4"
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
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
                      {item.number}
                    </div>

                    <div>

                      <h3
                        className="
                          text-sm
                          font-semibold
                          text-[#0B1F3A]
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-[#5E6B7A]
                        "
                      >
                        {item.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT YOU GET
      ===================================================== */}

      <section
        className="
          border-y
          border-[#DCE7F2]
          bg-[#F5FAFF]
        "
      >

        <div className="mx-auto max-w-[1250px] px-6 py-20 sm:px-8">

          <div className="text-center">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.23em]
                text-[#0078ED]
              "
            >
              WHAT YOU GET
            </p>

            <h2
              className="
                mt-3
                font-display
                text-3xl
                font-semibold
                text-[#012467]
                sm:text-4xl
              "
            >
              Everything You Need to Start
            </h2>

          </div>


          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                title: "Your Own Store",
                text: "Create a storefront built around your own brand.",
              },
              {
                title: "Product Catalogue",
                text: "Access products that are ready to add to your store.",
              },
              {
                title: "No Inventory",
                text: "Start selling without keeping products in your own space.",
              },
              {
                title: "Easy Store Setup",
                text: "Set up your store without complicated technical work.",
              },
              {
                title: "Fulfillment Support",
                text: "We take care of packing and shipping your orders.",
              },
              {
                title: "Mobile Friendly",
                text: "Give your customers a smooth shopping experience on every device.",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="
                  rounded-2xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  p-7
                  transition
                  hover:-translate-y-1
                  hover:border-[#BFDDF7]
                  hover:shadow-[0_12px_35px_rgba(1,36,103,0.07)]
                "
              >

                <div
                  className="
                    mb-5
                    h-2
                    w-10
                    rounded-full
                    bg-[#0078ED]
                  "
                />

                <h3
                  className="
                    font-display
                    text-xl
                    font-semibold
                    text-[#0B1F3A]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-[#5E6B7A]
                  "
                >
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT CATALOGUE
      ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-[1250px] px-6 py-20 sm:px-8">

          <div
            className="
              flex
              flex-col
              justify-between
              gap-5
              sm:flex-row
              sm:items-end
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.23em]
                  text-[#0078ED]
                "
              >
                PRODUCT CATALOGUE
              </p>

              <h2
                className="
                  mt-3
                  font-display
                  text-3xl
                  font-semibold
                  text-[#012467]
                  sm:text-4xl
                "
              >
                Choose Products for Your Store
              </h2>

            </div>

            <Link
              to="/category/all"
              className="
                text-sm
                font-semibold
                text-[#0078ED]
                transition-colors
                hover:text-[#012467]
                hover:underline
              "
            >
              View All Products →
            </Link>

          </div>


          {/* Actual products */}

          {loading ? (

            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (

                <div key={item}>

                  <div
                    className="
                      aspect-square
                      animate-pulse
                      rounded-2xl
                      bg-[#EAF4FF]
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-4
                      w-3/4
                      animate-pulse
                      rounded
                      bg-[#DCE7F2]
                    "
                  />

                  <div
                    className="
                      mt-2
                      h-4
                      w-1/4
                      animate-pulse
                      rounded
                      bg-[#EAF4FF]
                    "
                  />

                </div>

              ))}

            </div>

          ) : catalogueProducts.length > 0 ? (

            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">

              {catalogueProducts.map((product) => (

                <Link
                  key={
                    product._id ||
                    product.id ||
                    product.slug
                  }
                  to={`/product/${product.slug}`}
                  className="group"
                >

                  <div
                    className="
                      aspect-square
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#DCE7F2]
                      bg-[#EAF4FF]
                    "
                  >

                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    )}

                  </div>

                  <h3
                    className="
                      mt-3
                      line-clamp-1
                      text-sm
                      font-semibold
                      text-[#0B1F3A]
                      transition-colors
                      group-hover:text-[#0078ED]
                    "
                  >
                    {product.title}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-[#0078ED]
                    "
                  >
                    ₹{product.price}
                  </p>

                </Link>

              ))}

            </div>

          ) : (

            <div
              className="
                mt-10
                rounded-2xl
                border
                border-dashed
                border-[#DCE7F2]
                bg-[#F5FAFF]
                p-12
                text-center
              "
            >

              <p className="text-sm text-[#5E6B7A]">
                Products will appear here once your catalogue is available.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#012467]">

        {/* Subtle CTA glow */}

        <div className="relative overflow-hidden">

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[400px]
              w-[400px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#0078ED]
              opacity-20
              blur-[100px]
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-[900px]
              px-6
              py-20
              text-center
              sm:px-8
              lg:py-24
            "
          >

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-[#7FC3FF]
              "
            >
              START SELLING
            </p>

            <h2
              className="
                mt-4
                font-display
                text-3xl
                font-semibold
                text-white
                sm:text-5xl
              "
            >
              Ready to Build Your Store?
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-white/70
              "
            >
              Create your store, choose your products and start building
              your online brand with Karodrop.
            </p>

            <Link
              to="/create-store"
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-[#0078ED]
                px-8
                py-4
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(0,120,237,0.25)]
                transition
                hover:bg-white
                hover:text-[#012467]
              "
            >
              Create Your Store

              <span className="ml-2">
                →
              </span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
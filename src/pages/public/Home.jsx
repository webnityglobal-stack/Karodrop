import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard.jsx";
import useProducts from "../../useProducts.js";

const categoryTiles = [
  {
    label: "T-Shirts",
    slug: "tshirts",
    img: "/images/T-Shirts.png",
  },
  {
    label: "Handicrafts",
    slug: "handicrafts",
    img: "/images/Handicrafts.png",
  },
  {
    label: "Jewellery",
    slug: "jewellery",
    img: "/images/Jewellery.png",
  },
  {
    label: "Idols",
    slug: "idols",
    img: "/images/Idols.png",
  },
];

export default function Home() {
  const { products, loading } = useProducts({});
  console.log("PRODUCTS:", products);

  return (
    <main className="w-full overflow-hidden bg-[#F5FAFF] text-[#0B1F3A]">

      {/* ==================================================
          DROPSHIPPING HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Soft blue background glow */}
        <div
          className="
            pointer-events-none
            absolute
            -bottom-[280px]
            -left-[180px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#EAF4FF]
            opacity-80
            blur-[120px]
          "
        />

        {/* Top-right subtle glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-[180px]
            -top-[180px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#EAF4FF]
            opacity-70
            blur-[120px]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[650px]
            w-full
            max-w-[1500px]
            items-center
            px-6
            py-14
            sm:px-8
            lg:px-10
            xl:px-12
            lg:py-10
          "
        >

          {/* ================= LEFT CONTENT ================= */}

          <div className="relative z-10 w-full lg:w-[48%]">

            {/* Small heading */}

            <p
              className="
                mb-5
                text-[20px]
                font-bold
                tracking-[3px]
                text-[#0078ED]
                sm:text-[20px]
                lg:text-[20px]
              "
            >
              START YOUR ONLINE BUSINESS
            </p>

            {/* Main heading */}

            <h1
              className="
                font-serif
                text-[48px]
                font-medium
                leading-[0.94]
                tracking-[-1.5px]
                text-[#012467]
                sm:text-[60px]
                lg:text-[72px]
                xl:text-[82px]
              "
            >
              Drop Shipping

              <span
                className="
                  mt-2
                  block
                  text-[#0078ED]
                "
              >
                Made Simple
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-[540px]
                text-[16px]
                leading-[1.55]
                text-[#5E6B7A]
                sm:text-[17px]
                lg:text-[19px]
              "
            >
              We handle storage, packaging &amp; shipping —
              <br className="hidden sm:block" />
              You focus on growing your brand.
            </p>

            {/* ================= BENEFITS ================= */}

            <div
              className="
                mt-7
                grid
                w-full
                max-w-[690px]
                grid-cols-2
                overflow-hidden
                rounded-[16px]
                border
                border-[#DCE7F2]
                bg-white
                shadow-[0_8px_30px_rgba(1,36,103,0.06)]
                lg:grid-cols-4
              "
            >

              {/* No Inventory */}

              <div
                className="
                  flex
                  min-h-[115px]
                  flex-col
                  items-center
                  justify-center
                  border-b
                  border-[#DCE7F2]
                  px-3
                  text-center
                  lg:min-h-[135px]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <div className="text-[28px]">📦</div>

                <div
                  className="
                    mt-2
                    text-[13px]
                    font-bold
                    text-[#0B1F3A]
                    sm:text-[14px]
                  "
                >
                  No Inventory
                </div>

                <div
                  className="
                    text-[12px]
                    text-[#5E6B7A]
                    sm:text-[13px]
                  "
                >
                  Required
                </div>
              </div>

              {/* Low Investment */}

              <div
                className="
                  flex
                  min-h-[115px]
                  flex-col
                  items-center
                  justify-center
                  border-b
                  border-[#DCE7F2]
                  px-3
                  text-center
                  lg:min-h-[135px]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EAF4FF]
                    text-[21px]
                    font-bold
                    text-[#0078ED]
                  "
                >
                  ₹
                </div>

                <div
                  className="
                    mt-2
                    text-[13px]
                    font-bold
                    text-[#0B1F3A]
                    sm:text-[14px]
                  "
                >
                  Zero Investment
                </div>

                <div
                  className="
                    text-[12px]
                    text-[#5E6B7A]
                    sm:text-[13px]
                  "
                >
                  High Returns
                </div>
              </div>

              {/* Shipping */}

              <div
                className="
                  flex
                  min-h-[115px]
                  flex-col
                  items-center
                  justify-center
                  border-r
                  border-[#DCE7F2]
                  px-3
                  text-center
                  lg:min-h-[135px]
                "
              >
                <div className="text-[28px]">🚚</div>

                <div
                  className="
                    mt-2
                    text-[13px]
                    font-bold
                    text-[#0B1F3A]
                    sm:text-[14px]
                  "
                >
                  Fast &amp; Reliable
                </div>

                <div
                  className="
                    text-[12px]
                    text-[#5E6B7A]
                    sm:text-[13px]
                  "
                >
                  Shipping
                </div>
              </div>

              {/* Support */}

              <div
                className="
                  flex
                  min-h-[115px]
                  flex-col
                  items-center
                  justify-center
                  px-3
                  text-center
                  lg:min-h-[135px]
                "
              >
                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EAF4FF]
                    text-[20px]
                    font-bold
                    text-[#0078ED]
                  "
                >
                  ✓
                </div>

                <div
                  className="
                    mt-2
                    text-[13px]
                    font-bold
                    text-[#0B1F3A]
                    sm:text-[14px]
                  "
                >
                  24/7 Support
                </div>

                <div
                  className="
                    text-[12px]
                    text-[#5E6B7A]
                    sm:text-[13px]
                  "
                >
                  For You
                </div>
              </div>

            </div>

            {/* ================= BUTTON ================= */}

            <Link
              to="/login"
              className="
                mt-7
                inline-flex
                h-[60px]
                w-full
                max-w-[340px]
                items-center
                justify-center
                gap-5
                rounded-[10px]
                bg-[#0078ED]
                px-6
                text-[15px]
                font-bold
                text-white
                shadow-[0_10px_22px_rgba(0,120,237,0.20)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#012467]
                hover:shadow-[0_15px_30px_rgba(1,36,103,0.25)]
              "
            >
              <span>Start Dropshipping Now</span>

              <span className="text-[24px] font-normal">
                →
              </span>
            </Link>

          </div>


          {/* ================= RIGHT IMAGE ================= */}

          <div
            className="
              relative
              hidden
              w-full
              items-center
              justify-center
              lg:flex
              lg:w-[52%]
            "
          >

            {/* Soft glow behind hero image */}

            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-1/2
                h-[470px]
                w-[470px]
                -translate-y-1/2
                rounded-full
                bg-[#EAF4FF]
                opacity-80
                blur-[90px]
              "
            />

            {/* Secondary blue glow */}

            <div
              className="
                pointer-events-none
                absolute
                right-[8%]
                top-[25%]
                h-[220px]
                w-[220px]
                rounded-full
                bg-[#DCEEFF]
                opacity-60
                blur-[70px]
              "
            />

            <img
              src="/images/KaroDropshipping-hero.png"
              alt="Karodrop Dropshipping"
              className="
                relative
                z-10
                h-auto
                w-full
                max-w-[640px]
                object-contain
                drop-shadow-[0_20px_35px_rgba(1,36,103,0.08)]
              "
            />

          </div>

        </div>

      </section>


      {/* ==================================================
          MOBILE HERO IMAGE
      ================================================== */}

      <div
        className="
          relative
          flex
          min-h-[280px]
          items-center
          justify-center
          overflow-hidden
          bg-[#F5FAFF]
          px-0
          lg:hidden
        "
      >

        {/* Mobile image glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#EAF4FF]
            opacity-80
            blur-[85px]
          "
        />

        <img
          src="/images/KaroDropshipping-hero.png"
          alt="Karodrop Dropshipping"
          className="
            relative
            z-10
            h-auto
            w-full
            max-w-[560px]
            object-contain
            drop-shadow-[0_15px_30px_rgba(1,36,103,0.08)]
          "
        />

      </div>


      {/* ==================================================
          CATEGORY SECTION
      ================================================== */}

      <section
        className="
          bg-[#F5FAFF]
          px-6
          py-20
          sm:px-8
          lg:py-24
        "
      >

        {/* Section Heading */}

        <div className="mb-12 text-center">

          <p
            className="
              mb-3
              text-[12px]
              font-bold
              tracking-[3px]
              text-[#0078ED]
            "
          >
            EXPLORE COLLECTIONS
          </p>

          <h2
            className="
              font-serif
              text-[38px]
              font-medium
              text-[#012467]
              sm:text-[45px]
              lg:text-[48px]
            "
          >
            Shop By Category
          </h2>

          <p
            className="
              mt-3
              text-[15px]
              text-[#5E6B7A]
              sm:text-[17px]
            "
          >
            Handpicked collections just for you
          </p>

        </div>


        {/* Category Grid */}

        <div
          className="
            mx-auto
            grid
            max-w-[1300px]
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {categoryTiles.map((category) => (

            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="
                group
                overflow-hidden
                rounded-[15px]
                border
                border-[#DCE7F2]
                bg-white
                shadow-[0_8px_25px_rgba(1,36,103,0.05)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#BFDDF7]
                hover:shadow-[0_15px_35px_rgba(1,36,103,0.10)]
              "
            >

              <div
                className="
                  relative
                  h-[280px]
                  overflow-hidden
                  bg-[#EAF4FF]
                  sm:h-[300px]
                "
              >

                <img
                  src={category.img}
                  alt={category.label}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                {/* Dark Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#012467]/75
                    via-[#012467]/10
                    to-transparent
                  "
                />

                {/* Category Name */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-6
                    font-serif
                    text-[25px]
                    text-white
                  "
                >
                  {category.label}
                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* ==================================================
          FEATURED PRODUCTS
      ================================================== */}

      <section
        className="
          bg-white
          px-6
          py-20
          sm:px-8
          lg:py-24
        "
      >

        {/* Heading */}

        <div
          className="
            mx-auto
            mb-10
            flex
            max-w-[1300px]
            flex-col
            items-start
            justify-between
            gap-5
            sm:flex-row
            sm:items-end
          "
        >

          <div>

            <p
              className="
                mb-2
                text-[12px]
                font-bold
                tracking-[3px]
                text-[#0078ED]
              "
            >
              OUR COLLECTION
            </p>

            <h2
              className="
                font-serif
                text-[36px]
                font-medium
                text-[#012467]
                sm:text-[43px]
                lg:text-[45px]
              "
            >
              Featured Products
            </h2>

            <p
              className="
                mt-2
                text-[15px]
                text-[#5E6B7A]
              "
            >
              Trending products ready for your store
            </p>

          </div>


          <Link
            to="/category/all"
            className="
              font-semibold
              text-[#0078ED]
              transition-colors
              hover:text-[#012467]
            "
          >
            View All →
          </Link>

        </div>


        {/* Products */}

        {loading ? (

          <div
            className="
              mx-auto
              grid
              max-w-[1300px]
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="
                  h-[400px]
                  rounded-xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  p-5
                "
              >

                <div
                  className="
                    h-[280px]
                    animate-pulse
                    rounded-lg
                    bg-[#EAF4FF]
                  "
                />

                <div
                  className="
                    mt-5
                    h-4
                    w-[70%]
                    animate-pulse
                    rounded-full
                    bg-[#DCE7F2]
                  "
                />

                <div
                  className="
                    mt-3
                    h-3
                    w-[40%]
                    animate-pulse
                    rounded-full
                    bg-[#EAF4FF]
                  "
                />

              </div>

            ))}

          </div>

        ) : (

          <div
            className="
              mx-auto
              grid
              max-w-[1300px]
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {products?.slice(0, 8).map((product) => (

              <ProductCard
                key={product.id || product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </section>

    </main>
  );
}
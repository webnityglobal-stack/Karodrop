import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import  useProducts  from "../../useProducts.js";

/* =========================================================
   NORMALIZE SEARCH TEXT
========================================================= */

const normalizeText = (value = "") => {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]+/g, " ")
    .replace(/\bt[\s-]*shirts?\b/g, "tshirt")
    .replace(/\bshirts?\b/g, "tshirt")
    .replace(/\b(jewelry|jewellery)\b/g, "jewellery")
    .replace(/\s+/g, " ")
    .trim();
};

/* =========================================================
   SEARCH MATCH
========================================================= */

const productMatchesSearch = (product, query) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return false;

  const searchableText = normalizeText(
    [
      product.title,
      product.category,
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const queryWords = normalizedQuery
    .split(" ")
    .filter(Boolean);

  const textWords = searchableText
    .split(" ")
    .filter(Boolean);

  return queryWords.every((queryWord) =>
    textWords.some(
      (textWord) =>
        textWord === queryWord ||
        textWord.startsWith(queryWord) ||
        queryWord.startsWith(textWord)
    )
  );
};

export default function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const { products = [], loading } = useProducts();

  const results = products.filter((product) =>
    productMatchesSearch(product, query)
  );

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F5FAFF]
        px-4
        py-10
        sm:px-6
        sm:py-12
        lg:px-10
      "
    >

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#EAF4FF]
          opacity-80
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -top-40
          -right-40
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#EAF4FF]
          opacity-60
          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1440px]
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <p
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#0078ED]
            "
          >
            Search
          </p>

          <h1
            className="
              font-display
              text-3xl
              text-[#0B1F3A]
              sm:text-4xl
            "
          >
            Search Results
          </h1>

          {query && (
            <p
              className="
                mt-3
                text-sm
                text-[#5E6B7A]
              "
            >
              Showing results for{" "}

              <span
                className="
                  font-semibold
                  text-[#0B1F3A]
                "
              >
                "{query}"
              </span>
            </p>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div
            className="
              grid
              grid-cols-2
              gap-x-4
              gap-y-8
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-x-5
              lg:gap-y-10
            "
          >

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (

                <div key={item}>

                  {/* Image Skeleton */}

                  <div
                    className="
                      aspect-square
                      animate-pulse
                      rounded-2xl
                      border
                      border-[#DCE7F2]
                      bg-white
                    "
                  />

                  {/* Title Skeleton */}

                  <div
                    className="
                      mt-4
                      h-4
                      w-3/4
                      animate-pulse
                      rounded
                      bg-white
                    "
                  />

                  {/* Price Skeleton */}

                  <div
                    className="
                      mt-2
                      h-4
                      w-1/3
                      animate-pulse
                      rounded
                      bg-white
                    "
                  />

                </div>

              )
            )}

          </div>

        ) : results.length === 0 ? (

          /* =================================================
             NO RESULTS
          ================================================= */

          <div
            className="
              mx-auto
              max-w-xl
              rounded-2xl
              border
              border-[#DCE7F2]
              bg-white
              p-10
              sm:p-12
              text-center
              shadow-sm
            "
          >

            {/* Search Icon */}

            <div
              className="
                mx-auto
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#EAF4FF]
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8 text-[#0078ED]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path
                  strokeLinecap="round"
                  d="m20 20-4-4"
                />
              </svg>

            </div>

            <h2
              className="
                mb-3
                font-display
                text-2xl
                text-[#0B1F3A]
              "
            >
              No Products Found
            </h2>

            <p
              className="
                mx-auto
                mb-7
                max-w-md
                text-sm
                leading-6
                text-[#5E6B7A]
              "
            >
              We couldn't find any products matching your
              search. Try another product name or category.
            </p>

            <Link
              to="/category/all"
              className="
                inline-flex
                items-center
                rounded-xl
                bg-[#0078ED]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-[#012467]
              "
            >
              Browse Products
              <span className="ml-2">
                →
              </span>
            </Link>

          </div>

        ) : (

          /* =================================================
             RESULTS
          ================================================= */

          <>

            {/* Results Count */}

            <div
              className="
                mb-6
                flex
                items-center
                justify-between
              "
            >

              <p
                className="
                  text-sm
                  text-[#5E6B7A]
                "
              >
                <span
                  className="
                    font-semibold
                    text-[#0B1F3A]
                  "
                >
                  {results.length}
                </span>{" "}

                {results.length === 1
                  ? "product"
                  : "products"}{" "}

                found
              </p>

            </div>

            {/* Product Grid */}

            <div
              className="
                grid
                grid-cols-2
                gap-x-4
                gap-y-8
                md:grid-cols-3
                lg:grid-cols-4
                lg:gap-x-5
                lg:gap-y-10
              "
            >

              {results.map((product) => (

                <Link
                  key={product._id || product.id}
                  to={`/product/${product.slug}`}
                  className="group"
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div
                    className="
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-2xl
                      bg-[#EAF4FF]
                      border
                      border-[#DCE7F2]
                    "
                  >

                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                  </div>

                  {/* =================================================
                      PRODUCT INFO
                  ================================================= */}

                  <div className="pt-4">

                    <h3
                      className="
                        text-sm
                        leading-snug
                        text-[#0B1F3A]
                        transition-colors
                        group-hover:text-[#0078ED]
                      "
                    >
                      {product.title}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        font-semibold
                        text-[#0078ED]
                      "
                    >
                      ₹{product.price}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </>

        )}

      </div>
    </main>
  );
}
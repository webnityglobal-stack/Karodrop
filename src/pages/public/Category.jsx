import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard.jsx";
import  useProducts from "../../useProducts.js";

const categories = [
  { label: "All Products", slug: "all" },
  { label: "New Products", slug: "new-products" },
  { label: "Best Sellers", slug: "best-sellers" },
  { label: "T-Shirts", slug: "tshirts" },
  { label: "Handicrafts", slug: "handicrafts" },
  { label: "Jewellery", slug: "jewellery" },
  { label: "Idols", slug: "idols" },
];

const titles = {
  all: "All Products",
  "new-products": "New Products",
  "best-sellers": "Best Sellers",
  tshirts: "T-Shirts",
  handicrafts: "Handicrafts",
  jewellery: "Jewellery",
  idols: "Idols",
};

const descriptions = {
  all: "Explore our complete collection of products ready for your online store.",

  "new-products":
    "Discover the latest products added to the Karodrop collection.",

  "best-sellers":
    "Explore products that are trending and loved by customers.",

  tshirts:
    "Discover stylish and comfortable T-Shirts made for your store.",

  handicrafts:
    "Bring traditional craftsmanship and unique handmade products to your online store.",

  jewellery:
    "Discover beautiful jewellery pieces your customers will love.",

  idols:
    "Explore handcrafted idols and spiritual pieces for your store.",
};

export default function Category() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("featured");

  /*
   * Fetch all products first.
   *
   * We filter New Products / Best Sellers on the frontend
   * so these routes work even before the backend supports
   * special category queries.
   */
  const { products, loading } = useProducts({});

  const currentSlug = slug || "all";

  const title = titles[currentSlug] || "Our Collection";

  const description =
    descriptions[currentSlug] ||
    "Discover quality products ready to sell through your online store.";

  /*
   * Filter products according to URL.
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Normal category
    if (
      currentSlug !== "all" &&
      currentSlug !== "new-products" &&
      currentSlug !== "best-sellers"
    ) {
      result = result.filter(
        (product) =>
          String(product.category || "").toLowerCase() ===
          currentSlug.toLowerCase()
      );
    }

    // New Products
    if (currentSlug === "new-products") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
    }

    // Best Sellers
    if (currentSlug === "best-sellers") {
      result.sort((a, b) => {
        const salesA = Number(a.salesCount || a.soldCount || 0);
        const salesB = Number(b.salesCount || b.soldCount || 0);

        return salesB - salesA;
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortBy === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
    }

    if (sortBy === "featured") {
      result.sort(
        (a, b) => Number(b.isFeatured || false) - Number(a.isFeatured || false)
      );
    }

    return result;
  }, [products, currentSlug, sortBy]);

  return (
    <main className="min-h-screen bg-[#F5FAFF]">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#DCE7F2] bg-white">

        {/* Background blue glow */}
        <div className="pointer-events-none absolute -left-40 -top-32 h-80 w-80 rounded-full bg-[#EAF4FF] opacity-90 blur-[100px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-72 w-72 rounded-full bg-[#EAF4FF] opacity-70 blur-[100px]" />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">

          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-[#5E6B7A]">

            <Link
              to="/"
              className="transition-colors hover:text-[#0078ED]"
            >
              Home
            </Link>

            <span className="text-[#AAB8C7]">/</span>

            <span className="font-medium text-[#0B1F3A]">
              {title}
            </span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[#0078ED]">
              Karodrop Collection
            </p>

            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#0B1F3A] sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5E6B7A] sm:text-base">
              {description}
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS SECTION
      ====================================================== */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">

        {/* ===================================================
            CATEGORY NAVIGATION
        ==================================================== */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-hide">

          <div className="flex min-w-max gap-2">

            {categories.map((category) => {
              const active = category.slug === currentSlug;

              return (
                <Link
                  key={category.label}
                  to={`/category/${category.slug}`}
                  className={`
                    whitespace-nowrap
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      active
                        ? "border-[#0078ED] bg-[#0078ED] text-white shadow-sm"
                        : "border-[#DCE7F2] bg-white text-[#0B1F3A] hover:border-[#0078ED] hover:text-[#0078ED]"
                    }
                  `}
                >
                  {category.label}
                </Link>
              );
            })}

          </div>
        </div>

        {/* ===================================================
            COUNT + SORT
        ==================================================== */}
        {!loading && filteredProducts.length > 0 && (

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Product count */}
            <div>
              <p className="text-sm text-[#5E6B7A]">
                Showing{" "}
                <span className="font-semibold text-[#0B1F3A]">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">

              <label
                htmlFor="sort-products"
                className="hidden text-sm text-[#5E6B7A] sm:block"
              >
                Sort by
              </label>

              <select
                id="sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  rounded-full
                  border
                  border-[#DCE7F2]
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                  outline-none
                  transition
                  hover:border-[#0078ED]
                  focus:border-[#0078ED]
                  focus:ring-2
                  focus:ring-[#0078ED]/10
                "
              >
                <option value="featured">
                  Featured
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>
              </select>

            </div>

          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}
        {loading ? (

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (

              <div
                key={item}
                className="animate-pulse"
              >

                <div className="aspect-square rounded-xl bg-[#EAF0F6]" />

                <div className="mt-4 h-4 w-3/4 rounded bg-[#EAF0F6]" />

                <div className="mt-2 h-4 w-1/3 rounded bg-[#EAF0F6]" />

              </div>

            ))}

          </div>

        ) : filteredProducts.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================== */

          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-dashed border-[#C9D8E7] bg-white px-6 text-center">

            <div className="max-w-md">

              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4FF] text-2xl">
                🛍️
              </div>

              <h2 className="font-display text-2xl font-semibold text-[#0B1F3A]">
                No products found
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                There are no products available in this collection right now.
                Please explore our other collections.
              </p>

              <Link
                to="/category/all"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-[#0078ED]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:bg-[#012467]
                "
              >
                Explore All Products
              </Link>

            </div>

          </div>

        ) : (

          /* =================================================
             PRODUCTS GRID
          ================================================== */

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-12">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product._id || product.id}
                product={product}
              />

            ))}

          </div>

        )}

      </section>

    </main>
  );
}
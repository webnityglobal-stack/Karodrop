import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../useProducts";

const categories = [
  { key: "all", label: "All Products" },
  { key: "tshirts", label: "T-Shirts" },
  { key: "handicrafts", label: "Handicrafts" },
  { key: "jewellery", label: "Jewellery" },
  { key: "idols", label: "Idols" },
];

function getProductImage(product) {
  if (product?.images?.length) {
    return product.images[0];
  }

  if (product?.image) {
    return product.image;
  }

  return "/images/products/black-t-shirt.png";
}

function getProductName(product) {
  return product?.title || product?.name || "Product";
}

function formatCategory(category) {
  if (!category) return "Product";

  return category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProductPrice(product) {
  const price = Number(product?.price);

  return Number.isFinite(price) ? price : 0;
}

function getComparePrice(product) {
  const price = Number(product?.compareAtPrice);

  return Number.isFinite(price) ? price : 0;
}

export default function Products() {
  const {
    products = [],
    loading = false,
    error = null,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = getProductName(product).toLowerCase();

      const category = String(product?.category || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        category.includes(searchText);

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("all");
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#0078ED]">
                Product Catalogue
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Explore Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5E6B7A] sm:text-base">
                Choose a product for your brand and create your custom
                product with your own design.
              </p>
            </div>

            <Link
              to="/design-request"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
            >
              Create Custom Product
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        {/* =================================================
            SEARCH + CATEGORY
        ================================================== */}
        <div className="rounded-xl border border-[#DCE7F2] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A8795]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] pl-10 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#8A96A3] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-[#0078ED] text-white"
                        : "bg-[#F5FAFF] text-[#425466] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================
            RESULT HEADER
        ================================================== */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">
              {activeCategory === "all"
                ? "All Products"
                : formatCategory(activeCategory)}
            </h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {(search || activeCategory !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* =================================================
            LOADING
        ================================================== */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#DCE7F2] bg-white"
              >
                <div className="aspect-square animate-pulse bg-[#EAF4FF]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-[#EAF4FF]" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#EAF4FF]" />

                  <div className="h-10 animate-pulse rounded bg-[#EAF4FF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}
        {!loading && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="font-semibold text-red-800">
              Unable to load products
            </h3>

            <p className="mt-1 text-sm text-red-700">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================== */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const productName = getProductName(product);

                  const image = getProductImage(product);

                  const category = formatCategory(product?.category);

                  const price = getProductPrice(product);

                  const comparePrice = getComparePrice(product);

                  const productSlug =
                    product?.slug ||
                    product?._id ||
                    product?.id;

                  return (
                    <article
                      key={
                        product?._id ||
                        product?.id ||
                        product?.slug ||
                        productName
                      }
                      className="group overflow-hidden rounded-xl border border-[#DCE7F2] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#BFD8F0] hover:shadow-md"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/product/${productSlug}`}
                        className="relative block aspect-square overflow-hidden bg-[#F5FAFF]"
                      >
                        <img
                          src={image}
                          alt={productName}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "/images/products/black-t-shirt.png";
                          }}
                        />

                        {product?.isFeatured && (
                          <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#0078ED] shadow-sm">
                            Featured
                          </span>
                        )}
                      </Link>

                      {/* Product Content */}
                      <div className="p-4">
                        <p className="text-xs font-medium text-[#0078ED]">
                          {category}
                        </p>

                        <Link
                          to={`/product/${productSlug}`}
                          className="mt-1 block"
                        >
                          <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-[#0B1F3A] transition hover:text-[#0078ED]">
                            {productName}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-lg font-bold text-[#0B1F3A]">
                            ₹{price.toLocaleString("en-IN")}
                          </span>

                          {comparePrice > price && (
                            <span className="text-sm text-[#8A96A3] line-through">
                              ₹{comparePrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* View Product */}
                        <Link
                          to={`/product/${productSlug}`}
                          className="mt-4 flex h-10 w-full items-center justify-center rounded-lg border border-[#0078ED] text-sm font-semibold text-[#0078ED] transition hover:bg-[#0078ED] hover:text-white"
                        >
                          View Product
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* =================================================
                 EMPTY STATE
              ================================================== */
              <div className="mt-8 rounded-xl border border-[#DCE7F2] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FF]">
                  <svg
                    className="h-6 w-6 text-[#0078ED]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-[#0B1F3A]">
                  No products found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5E6B7A]">
                  Try another search term or choose a different category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012467]"
                >
                  View All Products
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
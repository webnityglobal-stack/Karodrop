import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProducts from "../../useProducts";

/* =========================================================
   Helpers
========================================================= */

function getProductImage(product) {
  if (product?.images?.length) return product.images[0];
  if (product?.image) return product.image;

  return "/images/products/black-t-shirt.png";
}

function getProductName(product) {
  return product?.title || product?.name || "Product";
}

function formatCategory(category) {
  if (!category) return "Product";

  return String(category)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* =========================================================
   Icons
========================================================= */

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-4 w-4 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8z" />
    </svg>
  );
}

function TruckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </svg>
  );
}

/* =========================================================
   Loading Skeleton
========================================================= */

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-[#EAF4FF]" />

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] xl:gap-12">
          <div className="aspect-square animate-pulse rounded-3xl border border-[#DCE7F2] bg-white" />

          <div className="rounded-3xl border border-[#DCE7F2] bg-white p-6 sm:p-8">
            <div className="h-5 w-28 animate-pulse rounded bg-[#EAF4FF]" />
            <div className="mt-4 h-10 w-4/5 animate-pulse rounded bg-[#EAF4FF]" />
            <div className="mt-5 h-6 w-36 animate-pulse rounded bg-[#EAF4FF]" />

            <div className="mt-8 h-20 animate-pulse rounded-2xl bg-[#F5FAFF]" />
            <div className="mt-6 h-20 animate-pulse rounded-2xl bg-[#F5FAFF]" />
            <div className="mt-6 h-20 animate-pulse rounded-2xl bg-[#F5FAFF]" />

            <div className="mt-8 h-14 animate-pulse rounded-xl bg-[#EAF4FF]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Main Component
========================================================= */

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    products = [],
    loading,
    error,
  } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);

  /*
   * These are the actual product configuration selections.
   */
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrinting, setSelectedPrinting] = useState("");

  const product = useMemo(() => {
    return products.find(
      (item) => String(item?.slug) === String(slug)
    );
  }, [products, slug]);

  /* =========================================================
     Product Data
  ========================================================= */

  const productName = getProductName(product);
  const category = formatCategory(product?.category);

  const images = product?.images?.length
    ? product.images
    : [getProductImage(product)];

  const activeImage = images[selectedImage] || images[0];

  const price = Number(product?.price || 0);
  const comparePrice = Number(product?.compareAtPrice || 0);
  const rating = Number(product?.rating || 0);
  const reviewCount = Number(product?.reviewCount || 0);

  const colors = Array.isArray(product?.colors)
    ? product.colors
    : [];

  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : [];

  const printingOptions = Array.isArray(product?.printingOptions)
    ? product.printingOptions
    : [];

  const highlights = Array.isArray(product?.highlights)
    ? product.highlights
    : [];

  /*
   * When product changes:
   * - first color gets selected automatically if available
   * - first size gets selected automatically if available
   * - first printing option gets selected automatically if available
   *
   * This is especially useful for products that have only one option.
   */
  useEffect(() => {
    setSelectedImage(0);

    setSelectedColor(colors.length > 0 ? colors[0] : "");
    setSelectedSize(sizes.length > 0 ? sizes[0] : "");
    setSelectedPrinting(
      printingOptions.length > 0 ? printingOptions[0] : ""
    );
  }, [
    product?.slug,
    colors.length,
    sizes.length,
    printingOptions.length,
  ]);

  /* =========================================================
     Create Product
  ========================================================= */

  const handleCreateProduct = () => {
    if (!product) return;

    /*
     * Product is already fixed.
     *
     * We only send the selected configuration to the
     * customization page.
     */
    const params = new URLSearchParams();

    params.set("product", product.slug);

    if (selectedColor) {
      params.set("color", selectedColor);
    }

    if (selectedSize) {
      params.set("size", selectedSize);
    }

    if (selectedPrinting) {
      params.set("printingMethod", selectedPrinting);
    }

    navigate(`/design-request?${params.toString()}`);
  };

  /*
   * Required selections:
   *
   * If a product has color options, one must be selected.
   * If a product has size options, one must be selected.
   * If a product has printing options, one must be selected.
   */
  const configurationComplete =
    (!colors.length || selectedColor) &&
    (!sizes.length || selectedSize) &&
    (!printingOptions.length || selectedPrinting);

  /* =========================================================
     Loading
  ========================================================= */

  if (loading) {
    return <ProductSkeleton />;
  }

  /* =========================================================
     Error
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-7 w-7 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#0B1F3A]">
            Unable to load product
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Something went wrong while loading this product.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#012467]"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     Product Not Found
  ========================================================= */

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#DCE7F2] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4FF]">
            <svg
              className="h-7 w-7 text-[#0078ED]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#0B1F3A]">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            The product you're looking for doesn't exist or is no longer
            available.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#012467]"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF]">

      {/* =====================================================
          Breadcrumb
      ====================================================== */}

      <div className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/products"
              className="font-semibold text-[#0078ED] transition hover:text-[#012467]"
            >
              Products
            </Link>

            <span className="text-[#A7B3C0]">/</span>

            <span className="text-[#5E6B7A]">
              {category}
            </span>

            <span className="text-[#A7B3C0]">/</span>

            <span className="truncate font-medium text-[#0B1F3A]">
              {productName}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ===================================================
            Back Button
        ==================================================== */}

        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5E6B7A] transition hover:text-[#0078ED]"
        >
          <ChevronLeftIcon />
          Back to Products
        </Link>

        {/* ===================================================
            Main Product Area
        ==================================================== */}

        <div className="grid gap-7 lg:grid-cols-[1fr_0.92fr] xl:gap-10">

          {/* =================================================
              LEFT — IMAGE AREA
          ================================================== */}

          <section>

            <div className="overflow-hidden rounded-3xl border border-[#DCE7F2] bg-white shadow-[0_12px_40px_rgba(1,36,103,0.06)]">

              {/* Main Image */}

              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#F5FAFF]">

                {/* Category Badge */}

                <div className="absolute left-5 top-5 z-10 rounded-full border border-[#DCE7F2] bg-white px-3.5 py-2 text-xs font-bold text-[#0078ED] shadow-sm">
                  {category}
                </div>

                {/* Featured */}

                {product.isFeatured && (
                  <div className="absolute right-5 top-5 z-10 rounded-full bg-[#0078ED] px-3.5 py-2 text-xs font-bold text-white shadow-sm">
                    Featured
                  </div>
                )}

                <img
                  src={activeImage}
                  alt={productName}
                  className="h-full w-full object-contain p-8 transition duration-500 hover:scale-[1.02] sm:p-12 lg:p-16"
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/products/black-t-shirt.png";
                  }}
                />
              </div>
            </div>

            {/* =================================================
                Image Gallery
            ================================================== */}

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition ${
                      selectedImage === index
                        ? "border-[#0078ED] ring-4 ring-[#0078ED]/10"
                        : "border-[#DCE7F2] hover:border-[#AFCBE5]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="h-full w-full object-contain p-2"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/images/products/black-t-shirt.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* =================================================
                Trust Information
            ================================================== */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE7F2] bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                  <ShieldIcon />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#0B1F3A]">
                    Quality Checked
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#7A8795]">
                    Ready for fulfillment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE7F2] bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                  <TruckIcon />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#0B1F3A]">
                    Fast Fulfillment
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#7A8795]">
                    Production & delivery
                  </p>
                </div>
              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT — PRODUCT DETAILS + CONFIGURATION
          ================================================== */}

          <section>

            <div className="rounded-3xl border border-[#DCE7F2] bg-white shadow-[0_12px_40px_rgba(1,36,103,0.06)] lg:sticky lg:top-24">

              <div className="p-5 sm:p-7">

                {/* =================================================
                    Category + Availability
                ================================================== */}

                <div className="flex items-center justify-between gap-4">

                  <span className="inline-flex rounded-full bg-[#EAF4FF] px-3 py-1.5 text-xs font-bold text-[#0078ED]">
                    {category}
                  </span>

                  <div
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      product.available
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        product.available
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {product.available
                      ? "Available"
                      : "Currently unavailable"}
                  </div>

                </div>

                {/* =================================================
                    Product Name
                ================================================== */}

                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0B1F3A] sm:text-4xl">
                  {productName}
                </h1>

                {/* =================================================
                    Rating
                ================================================== */}

                <div className="mt-4 flex flex-wrap items-center gap-3">

                  <div className="flex items-center gap-2 rounded-lg bg-[#FFF7E6] px-3 py-1.5">
                    <span className="text-sm font-bold text-[#9A6900]">
                      {rating.toFixed(1)}
                    </span>

                    <span className="text-[#F4B400]">
                      <StarIcon />
                    </span>
                  </div>

                  <span className="text-sm text-[#5E6B7A]">
                    {reviewCount.toLocaleString("en-IN")} reviews
                  </span>

                </div>

                {/* =================================================
                    Price
                ================================================== */}

                <div className="mt-5 border-b border-[#DCE7F2] pb-6">

                  <div className="flex flex-wrap items-end gap-3">

                    <span className="text-3xl font-extrabold text-[#0B1F3A]">
                      ₹{price.toLocaleString("en-IN")}
                    </span>

                    {comparePrice > price && (
                      <>
                        <span className="mb-0.5 text-base text-[#8A96A3] line-through">
                          ₹{comparePrice.toLocaleString("en-IN")}
                        </span>

                        <span className="mb-0.5 rounded-md bg-[#EAF4FF] px-2.5 py-1 text-xs font-bold text-[#0078ED]">
                          Save ₹
                          {(comparePrice - price).toLocaleString("en-IN")}
                        </span>
                      </>
                    )}

                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#7A8795]">
                    Base product price. Final pricing can depend on
                    customization and quantity.
                  </p>

                </div>

                {/* =================================================
                    CONFIGURATION HEADER
                ================================================== */}

                <div className="mt-6 rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0078ED] shadow-sm">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3v18" />
                        <path d="M3 12h18" />
                        <path d="M5 5l14 14" />
                        <path d="m19 5-14 14" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#0B1F3A]">
                        Configure this product
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                        Select the product options before creating your
                        customized product.
                      </p>
                    </div>

                  </div>

                </div>

                {/* =================================================
                    COLOR SELECTION
                ================================================== */}

                {colors.length > 0 && (
                  <div className="mt-6">

                    <div className="flex items-center justify-between">

                      <div>
                        <h2 className="text-sm font-bold text-[#0B1F3A]">
                          Color
                        </h2>

                        <p className="mt-1 text-xs text-[#7A8795]">
                          Selected:{" "}
                          <span className="font-semibold text-[#0B1F3A]">
                            {selectedColor || "Choose a color"}
                          </span>
                        </p>
                      </div>

                      <span className="text-xs font-medium text-[#8A96A3]">
                        {colors.length} options
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2.5">

                      {colors.map((color) => {
                        const isSelected = selectedColor === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={`relative rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                              isSelected
                                ? "border-[#0078ED] bg-[#EAF4FF] text-[#0078ED] ring-2 ring-[#0078ED]/10"
                                : "border-[#DCE7F2] bg-white text-[#425466] hover:border-[#0078ED] hover:text-[#0078ED]"
                            }`}
                          >
                            {color}

                            {isSelected && (
                              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0078ED] text-white">
                                <CheckIcon className="h-3 w-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

                {/* =================================================
                    SIZE SELECTION
                ================================================== */}

                {sizes.length > 0 && (
                  <div className="mt-7">

                    <div className="flex items-center justify-between">

                      <div>
                        <h2 className="text-sm font-bold text-[#0B1F3A]">
                          Size
                        </h2>

                        <p className="mt-1 text-xs text-[#7A8795]">
                          Selected:{" "}
                          <span className="font-semibold text-[#0B1F3A]">
                            {selectedSize || "Choose a size"}
                          </span>
                        </p>
                      </div>

                      <span className="text-xs font-medium text-[#8A96A3]">
                        {sizes.length} options
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2.5">

                      {sizes.map((size) => {
                        const isSelected = selectedSize === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-14 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition ${
                              isSelected
                                ? "border-[#0078ED] bg-[#0078ED] text-white shadow-[0_5px_14px_rgba(0,120,237,0.18)]"
                                : "border-[#DCE7F2] bg-white text-[#425466] hover:border-[#0078ED] hover:text-[#0078ED]"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

                {/* =================================================
                    PRINTING METHOD
                ================================================== */}

                {printingOptions.length > 0 && (
                  <div className="mt-7">

                    <div className="flex items-center justify-between">

                      <div>
                        <h2 className="text-sm font-bold text-[#0B1F3A]">
                          Printing Method
                        </h2>

                        <p className="mt-1 text-xs text-[#7A8795]">
                          Selected:{" "}
                          <span className="font-semibold text-[#0B1F3A]">
                            {selectedPrinting || "Choose a method"}
                          </span>
                        </p>
                      </div>

                      <span className="text-xs font-medium text-[#8A96A3]">
                        {printingOptions.length} options
                      </span>

                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2.5">

                      {printingOptions.map((method) => {
                        const isSelected = selectedPrinting === method;

                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedPrinting(method)}
                            className={`relative rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                              isSelected
                                ? "border-[#0078ED] bg-[#EAF4FF] text-[#0078ED] ring-2 ring-[#0078ED]/10"
                                : "border-[#DCE7F2] bg-white text-[#425466] hover:border-[#0078ED] hover:text-[#0078ED]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">

                              <span>{method}</span>

                              {isSelected && (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0078ED] text-white">
                                  <CheckIcon className="h-3 w-3" />
                                </span>
                              )}

                            </div>

                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

                {/* =================================================
                    SELECTED CONFIGURATION SUMMARY
                ================================================== */}

                <div className="mt-7 rounded-2xl border border-[#DCE7F2] bg-white">

                  <div className="border-b border-[#DCE7F2] px-4 py-3.5">
                    <p className="text-sm font-bold text-[#0B1F3A]">
                      Your configuration
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-[#DCE7F2]">

                    <div className="bg-[#F5FAFF] px-4 py-3.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A96A3]">
                        Color
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {selectedColor || "—"}
                      </p>
                    </div>

                    <div className="bg-[#F5FAFF] px-4 py-3.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A96A3]">
                        Size
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {selectedSize || "—"}
                      </p>
                    </div>

                    <div className="col-span-2 bg-[#F5FAFF] px-4 py-3.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#8A96A3]">
                        Printing
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                        {selectedPrinting || "—"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <div className="mt-7 border-t border-[#DCE7F2] pt-7">

                  <h2 className="text-sm font-bold text-[#0B1F3A]">
                    About this product
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#5E6B7A]">
                    {product.description ||
                      "A quality product ready for your custom product setup."}
                  </p>

                </div>

                {/* =================================================
                    PRODUCT HIGHLIGHTS
                ================================================== */}

                {highlights.length > 0 && (
                  <div className="mt-7">

                    <h2 className="text-sm font-bold text-[#0B1F3A]">
                      Product Highlights
                    </h2>

                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">

                      {highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                            <CheckIcon className="h-3 w-3" />
                          </span>

                          <span className="text-sm leading-5 text-[#5E6B7A]">
                            {highlight}
                          </span>
                        </li>
                      ))}

                    </ul>

                  </div>
                )}

                {/* =================================================
                    DELIVERY
                ================================================== */}

                <div className="mt-7">

                  <h2 className="text-sm font-bold text-[#0B1F3A]">
                    Production & Delivery
                  </h2>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl bg-[#F5FAFF] p-4">

                      <div className="flex items-center gap-2 text-[#0078ED]">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3v18" />
                          <path d="M5 8h14" />
                          <path d="M5 16h14" />
                        </svg>

                        <span className="text-sm font-bold text-[#0B1F3A]">
                          Production
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#5E6B7A]">
                        {product.productionTime ||
                          "2–4 business days"}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-[#F5FAFF] p-4">

                      <div className="flex items-center gap-2 text-[#0078ED]">
                        <TruckIcon />

                        <span className="text-sm font-bold text-[#0B1F3A]">
                          Delivery
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#5E6B7A]">
                        {product.deliveryTime ||
                          "3–7 business days"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CREATE PRODUCT FOOTER
              ================================================== */}

              <div className="border-t border-[#DCE7F2] bg-[#F5FAFF] p-5 sm:p-7">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0078ED] shadow-sm">
                    <ImageIcon />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0B1F3A]">
                      Ready to create your product?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                      Your product and selected options are saved.
                      Next, add your brand, design, print position and
                      quantity.
                    </p>
                  </div>

                </div>

                {/* Selected Options Mini Summary */}

                <div className="mt-4 flex flex-wrap gap-2">

                  {selectedColor && (
                    <span className="rounded-lg border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-semibold text-[#425466]">
                      {selectedColor}
                    </span>
                  )}

                  {selectedSize && (
                    <span className="rounded-lg border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-semibold text-[#425466]">
                      Size: {selectedSize}
                    </span>
                  )}

                  {selectedPrinting && (
                    <span className="rounded-lg border border-[#DCE7F2] bg-white px-3 py-1.5 text-xs font-semibold text-[#425466]">
                      {selectedPrinting}
                    </span>
                  )}

                </div>

                {/* CTA */}

                <button
                  type="button"
                  onClick={handleCreateProduct}
                  disabled={!product.available || !configurationComplete}
                  className="group mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-6 text-sm font-bold text-white shadow-[0_8px_22px_rgba(0,120,237,0.22)] transition hover:bg-[#012467] hover:shadow-[0_10px_28px_rgba(1,36,103,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create Product

                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </button>

                {!configurationComplete && (
                  <p className="mt-3 text-center text-xs font-medium text-[#D97706]">
                    Please select all available product options first.
                  </p>
                )}

                {configurationComplete && (
                  <p className="mt-3 text-center text-[11px] text-[#7A8795]">
                    Next: Brand → Design → Print Position → Quantity →
                    Review
                  </p>
                )}

              </div>

            </div>

          </section>
        </div>

        {/* =====================================================
            Bottom Information
        ====================================================== */}

        <section className="mt-8 grid gap-4 md:grid-cols-3">

          {/* Quality */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                <ShieldIcon />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">
                  Quality Assured
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                  Products are prepared and checked before fulfillment.
                </p>
              </div>

            </div>

          </div>

          {/* Custom Branding */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="M8 10h8" />
                  <path d="M8 14h5" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">
                  Custom Branding
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                  Add your own brand and design during product creation.
                </p>
              </div>

            </div>

          </div>

          {/* Fulfillment */}

          <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
                <TruckIcon />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">
                  Fulfillment Ready
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                  Configure your product before adding it to your
                  fulfillment cart.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const WISHLIST_STORAGE_PREFIX = "karodrop-wishlist";

/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem("karodrop-user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

/* =========================================================
   GET USER-SPECIFIC WISHLIST KEY
========================================================= */

function getWishlistKey() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  if (user._id) {
    return `${WISHLIST_STORAGE_PREFIX}-${user._id}`;
  }

  if (user.id) {
    return `${WISHLIST_STORAGE_PREFIX}-${user.id}`;
  }

  if (user.email) {
    return `${WISHLIST_STORAGE_PREFIX}-${user.email.toLowerCase()}`;
  }

  return null;
}

/* =========================================================
   GET SAVED WISHLIST
========================================================= */

function getSavedWishlist() {
  try {
    const wishlistKey = getWishlistKey();

    if (!wishlistKey) {
      return [];
    }

    const saved = localStorage.getItem(wishlistKey);

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/* =========================================================
   GET PRODUCT IMAGE
========================================================= */

function getProductImage(product) {
  if (!product) {
    return "";
  }

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }

    if (firstImage?.src) {
      return firstImage.src;
    }

    if (firstImage?.path) {
      return firstImage.path;
    }
  }

  if (typeof product.image === "string") {
    return product.image;
  }

  if (typeof product.imageUrl === "string") {
    return product.imageUrl;
  }

  return "";
}

/* =========================================================
   FALLBACK IMAGE
========================================================= */

const FALLBACK_IMAGE =
  "/images/placeholder-product.png";

/* =========================================================
   PRODUCT CARD
========================================================= */

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const productId =
    product?._id || product?.id;

  const productSlug =
    product?.slug || productId;

  /* =========================================================
     PRODUCT IMAGE
  ========================================================= */

  const productImage =
    getProductImage(product);

  const [imageSrc, setImageSrc] =
    useState(
      productImage || FALLBACK_IMAGE
    );

  /* =========================================================
     WISHLIST STATE
  ========================================================= */

  const [wishlisted, setWishlisted] =
    useState(() => {
      const saved = getSavedWishlist();

      return saved.includes(productId);
    });

  /* =========================================================
     UPDATE IMAGE
  ========================================================= */

  useEffect(() => {
    setImageSrc(
      productImage || FALLBACK_IMAGE
    );
  }, [productImage]);

  /* =========================================================
     UPDATE WISHLIST
  ========================================================= */

  useEffect(() => {
    const loadWishlistState = () => {
      const saved = getSavedWishlist();

      setWishlisted(
        saved.includes(productId)
      );
    };

    window.addEventListener(
      "userChanged",
      loadWishlistState
    );

    window.addEventListener(
      "wishlistUpdated",
      loadWishlistState
    );

    window.addEventListener(
      "storage",
      loadWishlistState
    );

    return () => {
      window.removeEventListener(
        "userChanged",
        loadWishlistState
      );

      window.removeEventListener(
        "wishlistUpdated",
        loadWishlistState
      );

      window.removeEventListener(
        "storage",
        loadWishlistState
      );
    };
  }, [productId]);

  /* =========================================================
     CHECK LOGIN
  ========================================================= */

  const isLoggedIn = () => {
    const savedUser =
      localStorage.getItem(
        "karodrop-user"
      );

    if (!savedUser) {
      return false;
    }

    try {
      JSON.parse(savedUser);
      return true;
    } catch {
      return false;
    }
  };

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const discount =
    product?.compareAtPrice &&
    Number(product.compareAtPrice) >
      Number(product.price)
      ? Math.round(
          ((Number(product.compareAtPrice) -
            Number(product.price)) /
            Number(product.compareAtPrice)) *
            100
        )
      : null;

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  const rating = Number(
    product?.rating || 0
  );

  const reviewCount = Number(
    product?.reviewCount ||
      product?.reviews ||
      0
  );

  const price = Number(
    product?.price || 0
  );

  const compareAtPrice = Number(
    product?.compareAtPrice || 0
  );

  /* =========================================================
     CUSTOMIZE PRODUCT
  ========================================================= */

  const handleCustomize = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    navigate(`/product/${productSlug}`);
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const handleWishlist = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const wishlistKey =
        getWishlistKey();

      if (!wishlistKey) {
        navigate("/login");
        return;
      }

      const saved =
        getSavedWishlist();

      let updatedWishlist;

      if (saved.includes(productId)) {
        updatedWishlist =
          saved.filter(
            (id) => id !== productId
          );

        setWishlisted(false);
      } else {
        updatedWishlist = [
          ...saved,
          productId,
        ];

        setWishlisted(true);
      }

      localStorage.setItem(
        wishlistKey,
        JSON.stringify(
          updatedWishlist
        )
      );

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error(
        "Unable to update wishlist:",
        error
      );
    }
  };

  return (
    <div className="group flex h-full flex-col">

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className="
          relative
          aspect-square
          overflow-hidden
          rounded-2xl
          bg-[#EAF4FF]
        "
      >
        <Link
          to={`/product/${productSlug}`}
          className="block h-full"
        >
          <img
            src={imageSrc}
            alt={
              product?.title ||
              product?.name ||
              "Product"
            }
            onError={() => {
              if (
                imageSrc !== FALLBACK_IMAGE
              ) {
                setImageSrc(
                  FALLBACK_IMAGE
                );
              }
            }}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* DISCOUNT */}

        {discount && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-md
              bg-[#012467]
              px-2.5
              py-1
              text-[11px]
              font-bold
              text-white
              shadow-sm
            "
          >
            {discount}% OFF
          </span>
        )}

        {/* WISHLIST */}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            absolute
            right-3
            top-3
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/95
            shadow-md
            backdrop-blur
            transition-all
            duration-200
            hover:scale-105
            hover:shadow-lg
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`
              h-5
              w-5
              transition-all
              ${
                wishlisted
                  ? "fill-[#0078ED] text-[#0078ED]"
                  : "fill-none text-[#012467]"
              }
            `}
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="
                M20.84 4.61
                a5.5 5.5 0 0 0-7.78 0
                L12 5.67
                l-1.06-1.06
                a5.5 5.5 0 0 0-7.78 7.78
                L12 21.23
                l8.84-8.84
                a5.5 5.5 0 0 0 0-7.78
                0-7.78Z
              "
            />
          </svg>
        </button>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="flex flex-1 flex-col pt-4">

        {/* PRODUCT NAME */}

        <Link
          to={`/product/${productSlug}`}
        >
          <h3
            className="
              min-h-[42px]
              font-body
              text-sm
              font-medium
              leading-snug
              text-[#0B1F3A]
              transition-colors
              hover:text-[#0078ED]
            "
          >
            {product?.title ||
              product?.name ||
              "Product"}
          </h3>
        </Link>

        {/* ===================================================
            RATING + REVIEWS
        =================================================== */}

        {rating > 0 && (
          <div className="mt-2 flex items-center gap-2">

            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-[#0B1F3A]">
                {rating.toFixed(1)}
              </span>

              <span className="text-sm text-[#F4B400]">
                ★
              </span>
            </div>

            {reviewCount > 0 && (
              <>
                <span className="text-[#DCE7F2]">
                  |
                </span>

                <span className="text-xs text-[#5E6B7A]">
                  {reviewCount.toLocaleString(
                    "en-IN"
                  )}{" "}
                  reviews
                </span>
              </>
            )}
          </div>
        )}

        {/* ===================================================
            PRICE
        =================================================== */}

        <div className="mt-2 flex items-baseline gap-2">

          <span
            className="
              text-lg
              font-bold
              text-[#0078ED]
            "
          >
            ₹{price.toLocaleString("en-IN")}
          </span>

          {compareAtPrice > price && (
            <span
              className="
                text-xs
                text-[#5E6B7A]
                line-through
              "
            >
              ₹
              {compareAtPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          )}
        </div>

        {/* ===================================================
            CUSTOMIZE BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={handleCustomize}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#0078ED]
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-[#012467]
            hover:shadow-md
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20h9"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
            />
          </svg>

          Customize Your Order
        </button>

      </div>
    </div>
  );
}
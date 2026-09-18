import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../../useProducts.js";
import { useCart } from "../../context/CartContext.jsx";

const WISHLIST_STORAGE_PREFIX = "karodrop-wishlist";

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

function getProductImage(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }

    if (firstImage?.image) {
      return firstImage.image;
    }
  }

  if (product?.image) {
    return product.image;
  }

  if (product?.imageUrl) {
    return product.imageUrl;
  }

  return "/images/placeholder-product.png";
}

export default function Wishlist() {
  const navigate = useNavigate();

  const { products, loading } = useProducts();
  const { addItem } = useCart();

  const [wishlistIds, setWishlistIds] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const loadWishlist = () => {
      setWishlistIds(getSavedWishlist());
    };

    loadWishlist();

    window.addEventListener("storage", loadWishlist);
    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("userChanged", loadWishlist);

    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("userChanged", loadWishlist);
    };
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistIds.filter(
      (id) => String(id) !== String(productId)
    );

    setWishlistIds(updatedWishlist);

    const wishlistKey = getWishlistKey();

    if (wishlistKey) {
      localStorage.setItem(
        wishlistKey,
        JSON.stringify(updatedWishlist)
      );
    }

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = (product) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    addItem(product, 1);

    const productId = product._id || product.id;

    setAddedProduct(productId);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  };

  const wishlistProducts = products.filter((product) => {
    const productId = product._id || product.id;

    return wishlistIds.some(
      (id) => String(id) === String(productId)
    );
  });

  return (
    <main className="relative min-h-screen bg-[#F5FAFF] overflow-hidden">
      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-40
          w-[500px]
          h-[500px]
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
          w-[450px]
          h-[450px]
          rounded-full
          bg-[#EAF4FF]
          opacity-60
          blur-[120px]
        "
      />

      <div
        className="
          relative
          max-w-[1440px]
          mx-auto
          px-4
          sm:px-6
          lg:px-10
          py-10
          sm:py-14
        "
      >
        <div className="mb-10">
          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[#0078ED]
              font-semibold
              mb-3
            "
          >
            Your Favorites
          </p>

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-end
              sm:justify-between
              gap-4
            "
          >
            <div>
              <h1
                className="
                  font-display
                  text-4xl
                  sm:text-5xl
                  text-[#0B1F3A]
                "
              >
                Wishlist
              </h1>

              <p
                className="
                  text-sm
                  text-[#5E6B7A]
                  mt-3
                "
              >
                Products you've saved for later.
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  w-fit
                  rounded-full
                  bg-[#EAF4FF]
                  border
                  border-[#DCE7F2]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[#0078ED]
                "
              >
                {wishlistProducts.length}{" "}
                {wishlistProducts.length === 1
                  ? "product"
                  : "products"}
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div
            className="
              bg-white
              border
              border-[#DCE7F2]
              rounded-2xl
              py-20
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-4
                h-9
                w-9
                rounded-full
                border-2
                border-[#DCE7F2]
                border-t-[#0078ED]
                animate-spin
              "
            />

            <p className="text-sm text-[#5E6B7A]">
              Loading wishlist...
            </p>
          </div>
        )}

        {!loading && wishlistProducts.length === 0 && (
          <div
            className="
              bg-white
              border
              border-[#DCE7F2]
              rounded-2xl
              px-6
              py-20
              text-center
              shadow-sm
            "
          >
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
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </div>

            <h2
              className="
                font-display
                text-2xl
                text-[#0B1F3A]
                mb-2
              "
            >
              Your Wishlist is Empty
            </h2>

            <p
              className="
                text-sm
                text-[#5E6B7A]
                max-w-md
                mx-auto
                mb-7
              "
            >
              Save products you love and come back to them anytime.
            </p>

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                justify-center
                bg-[#0078ED]
                text-white
                px-6
                py-3
                rounded-xl
                text-sm
                font-semibold
                hover:bg-[#012467]
                transition-colors
              "
            >
              Explore Products
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}

        {!loading && wishlistProducts.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-5
              gap-y-10
            "
          >
            {wishlistProducts.map((product) => {
              const productId = product._id || product.id;
              const image = getProductImage(product);

              const discount =
                product.compareAtPrice &&
                product.compareAtPrice > product.price
                  ? Math.round(
                      ((product.compareAtPrice - product.price) /
                        product.compareAtPrice) *
                        100
                    )
                  : null;

              return (
                <div
                  key={productId}
                  className="group"
                >
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
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={image}
                        alt={product.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        onError={(event) => {
                          if (
                            event.currentTarget.src.includes(
                              "placeholder-product.png"
                            )
                          ) {
                            return;
                          }

                          event.currentTarget.src =
                            "/images/placeholder-product.png";
                        }}
                      />
                    </Link>

                    {discount && (
                      <span
                        className="
                          absolute
                          top-3
                          left-3
                          bg-[#012467]
                          text-white
                          text-xs
                          font-semibold
                          px-2.5
                          py-1
                          rounded-lg
                        "
                      >
                        {discount}% OFF
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(productId)
                      }
                      aria-label="Remove from wishlist"
                      className="
                        absolute
                        top-3
                        right-3
                        h-10
                        w-10
                        rounded-full
                        bg-white/95
                        border
                        border-[#DCE7F2]
                        shadow-sm
                        flex
                        items-center
                        justify-center
                        hover:scale-105
                        hover:bg-[#EAF4FF]
                        transition-all
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="
                          h-5
                          w-5
                          fill-[#0078ED]
                          text-[#0078ED]
                        "
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="pt-4">
                    <Link to={`/product/${product.slug}`}>
                      <h3
                        className="
                          text-sm
                          leading-snug
                          text-[#0B1F3A]
                          hover:text-[#0078ED]
                          transition-colors
                        "
                      >
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        className="
                          font-semibold
                          text-[#0078ED]
                        "
                      >
                        ₹{product.price}
                      </span>

                      {product.compareAtPrice && (
                        <span
                          className="
                            text-xs
                            text-[#5E6B7A]
                            line-through
                          "
                        >
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      className={`
                        mt-4
                        w-full
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition-all
                        ${
                          addedProduct === productId
                            ? "bg-[#012467] text-white"
                            : "bg-[#0078ED] text-white hover:bg-[#012467]"
                        }
                      `}
                    >
                      {addedProduct === productId
                        ? "✓ Added to Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
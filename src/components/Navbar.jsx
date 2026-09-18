import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import useProducts from "../useProducts.js";

/* =========================================================
   KARODROP COLORS
========================================================= */

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  lightBlue: "#EAF4FF",
  veryLightBlue: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
};


/* =========================================================
   SEARCH NORMALIZATION
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
   SEARCH MATCHING
========================================================= */

const productMatchesSearch = (product, query) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return false;

  const searchableText = normalizeText(
    [product.title, product.category, product.description]
      .filter(Boolean)
      .join(" ")
  );

  const queryWords = normalizedQuery.split(" ").filter(Boolean);
  const textWords = searchableText.split(" ").filter(Boolean);

  return queryWords.every((queryWord) =>
    textWords.some(
      (textWord) =>
        textWord === queryWord ||
        textWord.startsWith(queryWord) ||
        queryWord.startsWith(textWord)
    )
  );
};


/* =========================================================
   PRODUCTS MENU
========================================================= */

const productMenu = [
  {
    label: "New Products",
    to: "/category/new-products",
    category: "new-products",
  },
  {
    label: "Best Sellers",
    to: "/category/best-sellers",
    category: "best-sellers",
  },
  {
    label: "T-Shirts",
    to: "/category/tshirts",
    category: "tshirts",
  },
  {
    label: "Handicrafts",
    to: "/category/handicrafts",
    category: "handicrafts",
  },
  {
    label: "Jewellery",
    to: "/category/jewellery",
    category: "jewellery",
  },
  {
    label: "Idols",
    to: "/category/idols",
    category: "idols",
  },
];


/* =========================================================
   HOW IT WORKS
========================================================= */

const howItWorksMenu = [
  {
    label: "Print on Demand India",
    to: "/how-it-works#print-on-demand",
  },
  {
    label: "Dropshipping",
    to: "/how-it-works#dropshipping",
  },
  {
    label: "POD Fulfillment",
    to: "/how-it-works#pod-fulfillment",
  },
  {
    label: "Dropshipping Process",
    to: "/how-it-works#dropshipping-process",
  },
  {
    label: "Bulk Printing",
    to: "/how-it-works#bulk-printing",
  },
  {
    label: "Custom Branding",
    to: "/how-it-works#custom-branding",
  },
  {
    label: "Start a Clothing Brand",
    to: "/how-it-works#start-clothing-brand",
  },
];


/* =========================================================
   RESOURCES
========================================================= */

const resourcesMenu = [
  {
    label: "Blog",
    to: "/resources",
  },
  {
    label: "FAQs",
    to: "/resources",
  },
  {
    label: "Guides",
    to: "/resources",
  },
  {
    label: "Selling Tips",
    to: "/resources",
  },
  {
    label: "Help Center",
    to: "/resources",
  },
];


/* =========================================================
   CATEGORY PRODUCTS
========================================================= */

const getCategoryProducts = (products, category) => {
  if (!products?.length) return [];

  if (category === "new-products") {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 9);
  }

  if (category === "best-sellers") {
    return [...products]
      .sort(
        (a, b) =>
          Number(b.salesCount || 0) -
          Number(a.salesCount || 0)
      )
      .slice(0, 9);
  }

  if (category === "all") {
    return products.slice(0, 9);
  }

  return products
    .filter((product) => {
      const productCategory = normalizeText(
        product.category || ""
      );

      return (
        productCategory === normalizeText(category) ||
        productCategory.includes(normalizeText(category))
      );
    })
    .slice(0, 9);
};


/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [selectedProductMenu, setSelectedProductMenu] =
    useState("New Products");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const {
    products = [],
    loading: productsLoading,
  } = useProducts();


  /* =========================================================
     LOAD WISHLIST COUNT
  ========================================================= */

  useEffect(() => {
    const loadCurrentUser = () => {
      try {
        const savedUser = localStorage.getItem("karodrop-user");
        setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    loadCurrentUser();

    window.addEventListener("userChanged", loadCurrentUser);
    window.addEventListener("storage", loadCurrentUser);

    return () => {
      window.removeEventListener("userChanged", loadCurrentUser);
      window.removeEventListener("storage", loadCurrentUser);
    };
  }, []);


  /* =========================================================
     LOAD USER-SPECIFIC WISHLIST COUNT
  ========================================================= */

  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        if (!currentUser) {
          setWishlistCount(0);
          return;
        }

        const userId =
          currentUser._id ||
          currentUser.id ||
          currentUser.email?.toLowerCase();

        if (!userId) {
          setWishlistCount(0);
          return;
        }

        const saved =
          JSON.parse(
            localStorage.getItem(`karodrop-wishlist-${userId}`)
          ) || [];

        setWishlistCount(saved.length);
      } catch {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );

    window.addEventListener(
      "storage",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistCount
      );

      window.removeEventListener(
        "storage",
        updateWishlistCount
      );
    };
  }, [currentUser]);


  /* =========================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleProfileOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleProfileOutside);

    return () => {
      document.removeEventListener("mousedown", handleProfileOutside);
    };
  }, []);


  /* =========================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  /* =========================================================
     SEARCH RESULTS
  ========================================================= */

  const searchResults = searchText.trim()
    ? products
        .filter((product) =>
          productMatchesSearch(product, searchText)
        )
        .slice(0, 5)
    : [];


  /* =========================================================
     SEARCH SUBMIT
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    setSearchOpen(false);
    setOpen(false);
    setActiveMenu(null);

    navigate(
      `/search?q=${encodeURIComponent(query)}`
    );
  };


  /* =========================================================
     POPULAR SEARCH
  ========================================================= */

  const handlePopularSearch = (query) => {
    setSearchText(query);
  };


  /* =========================================================
     CLOSE SEARCH
  ========================================================= */

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };


  /* =========================================================
     CLOSE ALL MENUS
  ========================================================= */

  const closeMenus = () => {
    setActiveMenu(null);
    setOpen(false);
    setProfileOpen(false);
  };


  /* =========================================================
     SELECTED PRODUCT CATEGORY
  ========================================================= */

  const selectedMenu = productMenu.find(
    (item) => item.label === selectedProductMenu
  );

  const selectedProducts = getCategoryProducts(
    products,
    selectedMenu?.category || "all"
  );


  /* =========================================================
     FEATURED PRODUCTS
  ========================================================= */

  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 4);


  return (
    <header
      className="
        sticky
        top-0
        z-[100]
        w-full
        bg-white
        shadow-[0_2px_8px_rgba(1,36,103,0.04)]
      "
    >

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="relative w-full">

        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-12">

          <div
            className="
              flex
              h-[80px]
              w-full
              items-center
              justify-between
              gap-4
            "
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              onClick={closeMenus}
              className="
                flex
                h-full
                shrink-0
                items-center
              "
            >

              <div
                className="
                  flex
                  h-[58px]
                  w-[145px]
                  items-center
                  justify-center
                  sm:w-[150px]
                "
              >

                <img
                  src="/images/Karodrop-logo.png"
                  alt="Karodrop"
                  className="
                    block
                    h-full
                    w-full
                    object-contain
                  "
                />

              </div>

            </Link>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                h-full
                items-center
                gap-7
                lg:flex
                xl:gap-9
              "
            >

              {/* =================================================
                  HOME
              ================================================= */}

              <NavLink
                to="/"
                onMouseEnter={() => setActiveMenu(null)}
                className={({ isActive }) =>
                  `
                    relative
                    flex
                    h-full
                    items-center
                    whitespace-nowrap
                    text-[15px]
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "text-[#0078ED]"
                        : "text-[#0B1F3A] hover:text-[#0078ED]"
                    }
                  `
                }
              >
                Home

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-[2px]
                    bg-[#0078ED]
                    opacity-0
                  "
                />

              </NavLink>


              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  h-full
                  items-center
                "
                onMouseEnter={() => {
                  setActiveMenu("products");

                  if (!selectedProductMenu) {
                    setSelectedProductMenu("New Products");
                  }
                }}
                onMouseLeave={() => setActiveMenu(null)}
              >

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                    text-[15px]
                    font-medium
                    text-[#0B1F3A]
                    transition-colors
                    hover:text-[#0078ED]
                  "
                >

                  Products

                  <svg
                    className={`
                      h-4
                      w-4
                      transition-transform
                      ${
                        activeMenu === "products"
                          ? "rotate-180"
                          : ""
                      }
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </button>


                {/* PRODUCTS MEGA MENU */}

                {activeMenu === "products" && (
                  <div
                    className="
                      fixed
                      left-0
                      right-0
                      top-[80px]
                      z-[110]
                      w-full
                      border-t
                      border-[#DCE7F2]
                      bg-white
                      shadow-[0_18px_50px_rgba(1,36,103,0.13)]
                    "
                  >

                    <div className="mx-auto w-full max-w-[1600px]">

                      <div className="flex min-h-[500px]">

                        {/* LEFT SIDEBAR */}

                        <div
                          className="
                            w-[270px]
                            shrink-0
                            border-r
                            border-[#DCE7F2]
                            bg-[#F5FAFF]
                            px-5
                            py-7
                            xl:w-[310px]
                            xl:px-6
                          "
                        >

                          {productMenu.map((item) => {

                            const isSelected =
                              selectedProductMenu === item.label;

                            return (
                              <Link
                                key={item.label}
                                to={item.to}
                                onMouseEnter={() =>
                                  setSelectedProductMenu(
                                    item.label
                                  )
                                }
                                onClick={closeMenus}
                                className={`
                                  mb-1
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-lg
                                  px-4
                                  py-3.5
                                  text-[15px]
                                  transition-all
                                  ${
                                    isSelected
                                      ? "bg-white text-[#0078ED] shadow-sm"
                                      : "text-[#0B1F3A] hover:bg-white hover:text-[#0078ED]"
                                  }
                                `}
                              >

                                <span className="font-medium">
                                  {item.label}
                                </span>

                                <span
                                  className={`
                                    text-lg
                                    transition-transform
                                    ${
                                      isSelected
                                        ? "translate-x-1 text-[#0078ED]"
                                        : "text-[#5E6B7A]"
                                    }
                                  `}
                                >
                                  →
                                </span>

                              </Link>
                            );

                          })}

                        </div>


                        {/* RIGHT SIDE */}

                        <div className="min-w-0 flex-1 px-7 py-7 xl:px-10">

                          <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-[22px] font-semibold text-[#0B1F3A]">
                              {selectedProductMenu}
                            </h2>

                            <Link
                              to={
                                selectedMenu?.to ||
                                "/category/all"
                              }
                              onClick={closeMenus}
                              className="
                                text-sm
                                font-medium
                                text-[#0078ED]
                                hover:text-[#012467]
                                hover:underline
                              "
                            >
                              View all →
                            </Link>

                          </div>


                          {/* PRODUCT LIST */}

                          {productsLoading ? (

                            <div className="grid grid-cols-3 gap-x-8 gap-y-5">

                              {Array.from({
                                length: 6,
                              }).map((_, index) => (

                                <div
                                  key={index}
                                  className="
                                    h-6
                                    animate-pulse
                                    rounded
                                    bg-[#EAF4FF]
                                  "
                                />

                              ))}

                            </div>

                          ) : selectedProducts.length > 0 ? (

                            <div
                              className="
                                grid
                                grid-cols-1
                                gap-x-8
                                gap-y-5
                                md:grid-cols-2
                                xl:grid-cols-3
                              "
                            >

                              {selectedProducts.map(
                                (product) => (

                                  <Link
                                    key={
                                      product._id ||
                                      product.id ||
                                      product.slug
                                    }
                                    to={`/product/${product.slug}`}
                                    onClick={closeMenus}
                                    className="
                                      text-[14px]
                                      text-[#0B1F3A]
                                      transition-colors
                                      hover:text-[#0078ED]
                                    "
                                  >

                                    <span className="line-clamp-2">
                                      {product.title}
                                    </span>

                                  </Link>

                                )
                              )}

                            </div>

                          ) : (

                            <div className="py-8 text-sm text-[#5E6B7A]">
                              No products available in this category.
                            </div>

                          )}


                          {/* DIVIDER */}

                          <div className="my-8 border-t border-[#DCE7F2]" />


                          {/* FEATURED */}

                          <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-[20px] font-semibold text-[#0B1F3A]">
                              Featured Products
                            </h2>

                            <Link
                              to="/category/all"
                              onClick={closeMenus}
                              className="
                                text-sm
                                font-medium
                                text-[#0078ED]
                                hover:text-[#012467]
                                hover:underline
                              "
                            >
                              View all →
                            </Link>

                          </div>


                          <div
                            className="
                              grid
                              grid-cols-2
                              gap-4
                              md:grid-cols-4
                              xl:gap-5
                            "
                          >

                            {featuredProducts.map(
                              (product) => (

                                <Link
                                  key={
                                    product._id ||
                                    product.id ||
                                    product.slug
                                  }
                                  to={`/product/${product.slug}`}
                                  onClick={closeMenus}
                                  className="group block"
                                >

                                  <div
                                    className="
                                      aspect-[1.15/1]
                                      overflow-hidden
                                      rounded-xl
                                      bg-[#EAF4FF]
                                    "
                                  >

                                    <img
                                      src={
                                        product.images?.[0]
                                      }
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


                                  <div className="pt-2">

                                    <p
                                      className="
                                        line-clamp-1
                                        text-sm
                                        font-medium
                                        text-[#0B1F3A]
                                      "
                                    >
                                      {product.title}
                                    </p>

                                    <p
                                      className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-[#0078ED]
                                      "
                                    >
                                      ₹{product.price}
                                    </p>

                                  </div>

                                </Link>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>


              {/* =================================================
                  HOW IT WORKS
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  h-full
                  items-center
                "
                onMouseEnter={() =>
                  setActiveMenu("how")
                }
                onMouseLeave={() =>
                  setActiveMenu(null)
                }
              >

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                    text-[15px]
                    font-medium
                    text-[#0B1F3A]
                    transition-colors
                    hover:text-[#0078ED]
                  "
                >

                  How It Works

                  <svg
                    className={`
                      h-4
                      w-4
                      transition-transform
                      ${
                        activeMenu === "how"
                          ? "rotate-180"
                          : ""
                      }
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path
                      d="m6 9 6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                </button>


                {activeMenu === "how" && (

                  <div
                    className="
                      absolute
                      left-1/2
                      top-[80px]
                      z-[110]
                      w-[285px]
                      -translate-x-1/2
                      overflow-hidden
                      rounded-b-xl
                      border
                      border-[#DCE7F2]
                      bg-white
                      shadow-[0_18px_45px_rgba(1,36,103,0.14)]
                    "
                  >

                    <div className="py-3">

                      {howItWorksMenu.map((item) => (

                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeMenus}
                          className="
                            block
                            px-5
                            py-2.5
                            text-[14px]
                            text-[#0B1F3A]
                            transition-colors
                            hover:bg-[#F5FAFF]
                            hover:text-[#0078ED]
                          "
                        >
                          {item.label}
                        </Link>

                      ))}

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  RESOURCES
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  h-full
                  items-center
                "
                onMouseEnter={() =>
                  setActiveMenu("resources")
                }
                onMouseLeave={() =>
                  setActiveMenu(null)
                }
              >

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                    text-[15px]
                    font-medium
                    text-[#0B1F3A]
                    transition-colors
                    hover:text-[#0078ED]
                  "
                >

                  Resources

                  <svg
                    className={`
                      h-4
                      w-4
                      transition-transform
                      ${
                        activeMenu === "resources"
                          ? "rotate-180"
                          : ""
                      }
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path
                      d="m6 9 6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                  </svg>

                </button>


                {activeMenu === "resources" && (

                  <div
                    className="
                      absolute
                      left-1/2
                      top-[80px]
                      z-[110]
                      w-[230px]
                      -translate-x-1/2
                      overflow-hidden
                      rounded-b-xl
                      border
                      border-[#DCE7F2]
                      bg-white
                      shadow-[0_18px_45px_rgba(1,36,103,0.14)]
                    "
                  >

                    <div className="py-3">

                      {resourcesMenu.map((item) => (

                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeMenus}
                          className="
                            block
                            px-5
                            py-2.5
                            text-[14px]
                            text-[#0B1F3A]
                            transition-colors
                            hover:bg-[#F5FAFF]
                            hover:text-[#0078ED]
                          "
                        >
                          {item.label}
                        </Link>

                      ))}

                    </div>

                  </div>

                )}

              </div>


              {/* =================================================
                  CREATOR STORE
              ================================================= */}

              <NavLink
                to="/creator-store"
                onMouseEnter={() =>
                  setActiveMenu(null)
                }
                className={({ isActive }) =>
                  `
                    whitespace-nowrap
                    text-[15px]
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "text-[#0078ED]"
                        : "text-[#0B1F3A] hover:text-[#0078ED]"
                    }
                  `
                }
              >
                Creator Store
              </NavLink>

            </nav>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-3
                sm:gap-4
                lg:gap-5
              "
            >

              {/* SEARCH */}

              <button
                type="button"
                aria-label="Search"
                onClick={() => {
                  setSearchOpen(true);
                  setOpen(false);
                  setActiveMenu(null);
                }}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-[#0B1F3A]
                  transition-colors
                  hover:text-[#0078ED]
                "
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-4-4" />

                </svg>

              </button>


              {/* WISHLIST */}

              <Link
                to="/wishlist"
                onClick={() => {
                  setSearchOpen(false);
                  setActiveMenu(null);
                  setOpen(false);
                }}
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-[#0B1F3A]
                  transition-colors
                  hover:text-[#0078ED]
                "
                aria-label="Wishlist"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                  />

                </svg>


                {wishlistCount > 0 && (

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#0078ED]
                      px-1
                      text-[10px]
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>

                )}

              </Link>


              {/* AUTH / PROFILE */}

              {currentUser ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((prev) => !prev);
                      setSearchOpen(false);
                      setActiveMenu(null);
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#DCE7F2]
                      bg-white
                      py-1.5
                      pl-1.5
                      pr-3
                      text-[#0B1F3A]
                      transition
                      hover:border-[#0078ED]
                      hover:bg-[#F5FAFF]
                    "
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#EAF4FF] text-sm font-semibold text-[#0078ED]">
                      {currentUser.profileImage ? (
                        <img
                          src={currentUser.profileImage}
                          alt={currentUser.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (currentUser.name || currentUser.email || "U")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </span>

                    <span className="hidden max-w-[110px] truncate text-sm font-medium sm:block">
                      {currentUser.name || "Account"}
                    </span>

                    <svg
                      className={`h-4 w-4 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[130] w-[290px] overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-[0_18px_50px_rgba(1,36,103,0.16)]">
                      <div className="border-b border-[#DCE7F2] bg-[#F5FAFF] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EAF4FF] text-base font-semibold text-[#0078ED]">
                            {currentUser.profileImage ? (
                              <img
                                src={currentUser.profileImage}
                                alt={currentUser.name || "Profile"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (currentUser.name || currentUser.email || "U")
                                .charAt(0)
                                .toUpperCase()
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                              {currentUser.name || "My Account"}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[#5E6B7A]">
                              {currentUser.email || "Welcome back"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {[
                          ["Dashboard", "/account"],
                          ["My Orders", "/orders"],
                          ["My Brands", "/brands"],
                          ["Designs", "/designs"],
                          ["Addresses", "/addresses"],
                          ["Wishlist", "/wishlist"],
                          ["Notifications", "/notifications"],
                          ["Settings", "/settings"],
                          ["Help & Support", "/how-it-works#help-support"],
                          ["Contact Support", "/how-it-works#contact-support"],
                          ["FAQs", "/resources"],
                        ].map(([label, to]) => (
                          <Link
                            key={label}
                            to={to}
                            onClick={closeMenus}
                            className="flex items-center rounded-lg px-3 py-2.5 text-sm text-[#0B1F3A] transition hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                          >
                            {label}
                          </Link>
                        ))}

                        <div className="my-1 border-t border-[#DCE7F2]" />

                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("karodrop-user");
                            setCurrentUser(null);
                            setProfileOpen(false);
                            setOpen(false);
                            setActiveMenu(null);
                            window.dispatchEvent(new Event("userChanged"));
                            navigate("/");
                          }}
                          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0B1F3A] transition hover:bg-red-50 hover:text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* LOGIN */}
                  <Link
                    to="/login"
                    className="
                      hidden
                      whitespace-nowrap
                      text-sm
                      font-medium
                      text-[#0B1F3A]
                      transition-colors
                      hover:text-[#0078ED]
                      sm:block
                    "
                  >
                    Login
                  </Link>

                  {/* SIGN UP */}
                  <Link
                    to="/signup"
                    className="
                      hidden
                      whitespace-nowrap
                      rounded-full
                      bg-[#0078ED]
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-[#012467]
                      sm:block
                    "
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* NOTIFICATIONS */}

              {currentUser && (
                <Link
                  to="/notifications"
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveMenu(null);
                    setOpen(false);
                    setProfileOpen(false);
                  }}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-[#0B1F3A]
                    transition-colors
                    hover:text-[#0078ED]
                  "
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454 1.31A8.967 8.967 0 0 1 12 21.75a8.967 8.967 0 0 1-8.31-3.358 23.85 23.85 0 0 0 5.454-1.31m5.714 0a24.255 24.255 0 0 1-1.714-1.294 8.967 8.967 0 0 1-3.144-6.938V8.25a3.75 3.75 0 1 1 7.5 0v.6a8.967 8.967 0 0 1-3.144 6.938c-.565.49-1.14.92-1.714 1.294Zm-1.714-12a2.25 2.25 0 1 0-4.5 0v.6a8.967 8.967 0 0 0 3.144 6.938c.565.49 1.14.92 1.714 1.294m0-8.832V3.75"
                    />
                  </svg>
                </Link>
              )}

              {/* CART */}

              <Link
                to="/cart"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-[#0B1F3A]
                  transition-colors
                  hover:text-[#0078ED]
                "
                aria-label="Cart"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />

                  <circle
                    cx="10"
                    cy="20"
                    r="1"
                  />

                  <circle
                    cx="18"
                    cy="20"
                    r="1"
                  />

                </svg>


                {count > 0 && (

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#0078ED]
                      px-1
                      text-[10px]
                      text-white
                    "
                  >
                    {count}
                  </span>

                )}

              </Link>


              {/* MOBILE MENU */}

              <button
                type="button"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-2xl
                  leading-none
                  text-[#0B1F3A]
                  transition-colors
                  hover:text-[#0078ED]
                  lg:hidden
                "
                onClick={() => {
                  setOpen(!open);
                  setSearchOpen(false);
                  setActiveMenu(null);
                }}
                aria-label="Toggle menu"
              >
                {open ? "×" : "☰"}
              </button>

            </div>

          </div>


          {/* =====================================================
              SEARCH DROPDOWN
          ====================================================== */}

          {searchOpen && (

            <div
              ref={searchRef}
              className="
                absolute
                left-0
                right-0
                top-[80px]
                z-[120]
                border-t
                border-[#DCE7F2]
                bg-white
                shadow-[0_18px_45px_rgba(1,36,103,0.12)]
              "
            >

              <div
                className="
                  mx-auto
                  w-full
                  max-w-[1100px]
                  px-4
                  py-5
                  sm:px-6
                  lg:px-8
                "
              >

                <form onSubmit={handleSearch}>

                  <div
                    className="
                      flex
                      h-[54px]
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#DCE7F2]
                      bg-[#F5FAFF]
                      px-4
                      transition
                      focus-within:border-[#0078ED]
                      focus-within:bg-white
                    "
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 shrink-0 text-[#5E6B7A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >

                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                      />

                      <path d="m20 20-4-4" />

                    </svg>


                    <input
                      autoFocus
                      type="search"
                      value={searchText}
                      onChange={(e) =>
                        setSearchText(e.target.value)
                      }
                      placeholder="Search products, categories..."
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-sm
                        text-[#0B1F3A]
                        outline-none
                        placeholder:text-[#5E6B7A]
                      "
                    />


                    {searchText && (

                      <button
                        type="button"
                        onClick={() =>
                          setSearchText("")
                        }
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-[#5E6B7A]
                          hover:bg-[#EAF4FF]
                          hover:text-[#0B1F3A]
                        "
                      >
                        ×
                      </button>

                    )}


                    <button
                      type="submit"
                      className="
                        hidden
                        shrink-0
                        rounded-lg
                        bg-[#0078ED]
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-[#012467]
                        sm:block
                      "
                    >
                      Search
                    </button>

                  </div>

                </form>


                {/* SEARCH CONTENT */}

                <div className="mt-5">

                  {!searchText.trim() && (

                    <div>

                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5E6B7A]">
                        Popular searches
                      </p>


                      <div className="flex flex-wrap gap-2">

                        {[
                          "T-Shirts",
                          "Handicrafts",
                          "Jewellery",
                          "Idols",
                        ].map((item) => (

                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              handlePopularSearch(item)
                            }
                            className="
                              rounded-full
                              border
                              border-[#DCE7F2]
                              bg-white
                              px-4
                              py-2
                              text-sm
                              text-[#0B1F3A]
                              transition
                              hover:border-[#0078ED]
                              hover:text-[#0078ED]
                            "
                          >
                            {item}
                          </button>

                        ))}

                      </div>

                    </div>

                  )}


                  {searchText.trim() && (

                    <div>

                      {productsLoading ? (

                        <div className="py-5 text-sm text-[#5E6B7A]">
                          Searching products...
                        </div>

                      ) : searchResults.length > 0 ? (

                        <>

                          <div className="mb-3 flex items-center justify-between">

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E6B7A]">
                              Products
                            </p>

                            <button
                              type="button"
                              onClick={handleSearch}
                              className="
                                text-xs
                                font-medium
                                text-[#0078ED]
                                hover:text-[#012467]
                                hover:underline
                              "
                            >
                              View all results →
                            </button>

                          </div>


                          <div className="divide-y divide-[#DCE7F2]">

                            {searchResults.map(
                              (product) => (

                                <Link
                                  key={
                                    product._id ||
                                    product.id
                                  }
                                  to={`/product/${product.slug}`}
                                  onClick={closeSearch}
                                  className="
                                    flex
                                    items-center
                                    gap-4
                                    py-3
                                    transition
                                    hover:bg-[#F5FAFF]
                                  "
                                >

                                  <div
                                    className="
                                      h-14
                                      w-14
                                      shrink-0
                                      overflow-hidden
                                      rounded-lg
                                      bg-[#EAF4FF]
                                    "
                                  >

                                    <img
                                      src={
                                        product.images?.[0]
                                      }
                                      alt={product.title}
                                      className="
                                        h-full
                                        w-full
                                        object-cover
                                      "
                                    />

                                  </div>


                                  <div className="min-w-0 flex-1">

                                    <p
                                      className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-[#0B1F3A]
                                      "
                                    >
                                      {product.title}
                                    </p>

                                    <p
                                      className="
                                        mt-1
                                        text-xs
                                        text-[#5E6B7A]
                                      "
                                    >
                                      {product.category ||
                                        "Product"}
                                    </p>

                                  </div>


                                  <div
                                    className="
                                      shrink-0
                                      text-sm
                                      font-medium
                                      text-[#0078ED]
                                    "
                                  >
                                    ₹{product.price}
                                  </div>

                                </Link>

                              )
                            )}

                          </div>


                          <button
                            type="button"
                            onClick={handleSearch}
                            className="
                              mt-4
                              w-full
                              rounded-lg
                              border
                              border-[#DCE7F2]
                              py-3
                              text-sm
                              font-medium
                              text-[#0B1F3A]
                              transition
                              hover:border-[#0078ED]
                              hover:text-[#0078ED]
                            "
                          >
                            View all results →
                          </button>

                        </>

                      ) : (

                        <div className="py-6 text-center">

                          <div
                            className="
                              mx-auto
                              mb-3
                              flex
                              h-12
                              w-12
                              items-center
                              justify-center
                              rounded-full
                              bg-[#EAF4FF]
                              text-xl
                            "
                          >
                            🔍
                          </div>

                          <p className="text-sm font-medium text-[#0B1F3A]">
                            No products found
                          </p>

                          <p className="mt-1 text-xs text-[#5E6B7A]">
                            Try another product name or category.
                          </p>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {open && (

        <div className="w-full border-t border-[#DCE7F2] bg-white lg:hidden">

          <div className="px-5 py-4">

            {/* HOME */}

            <Link
              to="/"
              onClick={closeMenus}
              className="
                block
                py-3
                text-sm
                font-medium
                text-[#0B1F3A]
                hover:text-[#0078ED]
              "
            >
              Home
            </Link>


            {/* PRODUCTS */}

            <div className="border-t border-[#DCE7F2]">

              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === "mobile-products"
                      ? null
                      : "mobile-products"
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-3
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                "
              >

                Products

                <span>
                  {activeMenu === "mobile-products"
                    ? "−"
                    : "+"}
                </span>

              </button>


              {activeMenu === "mobile-products" && (

                <div className="pb-3 pl-3">

                  {productMenu.map((item) => (

                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMenus}
                      className="
                        block
                        py-2
                        text-sm
                        text-[#5E6B7A]
                        hover:text-[#0078ED]
                      "
                    >
                      {item.label}
                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* HOW IT WORKS */}

            <div className="border-t border-[#DCE7F2]">

              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === "mobile-how"
                      ? null
                      : "mobile-how"
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-3
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                "
              >

                How It Works

                <span>
                  {activeMenu === "mobile-how"
                    ? "−"
                    : "+"}
                </span>

              </button>


              {activeMenu === "mobile-how" && (

                <div className="pb-3 pl-3">

                  {howItWorksMenu.map((item) => (

                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMenus}
                      className="
                        block
                        py-2
                        text-sm
                        text-[#5E6B7A]
                        hover:text-[#0078ED]
                      "
                    >
                      {item.label}
                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* RESOURCES */}

            <div className="border-t border-[#DCE7F2]">

              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === "mobile-resources"
                      ? null
                      : "mobile-resources"
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  py-3
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                "
              >

                Resources

                <span>
                  {activeMenu === "mobile-resources"
                    ? "−"
                    : "+"}
                </span>

              </button>


              {activeMenu === "mobile-resources" && (

                <div className="pb-3 pl-3">

                  {resourcesMenu.map((item) => (

                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMenus}
                      className="
                        block
                        py-2
                        text-sm
                        text-[#5E6B7A]
                        hover:text-[#0078ED]
                      "
                    >
                      {item.label}
                    </Link>

                  ))}

                </div>

              )}

            </div>


            {/* CREATOR STORE */}

            <div className="border-t border-[#DCE7F2]">

              <Link
                to="/creator-store"
                onClick={closeMenus}
                className="
                  block
                  py-3
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                  hover:text-[#0078ED]
                "
              >
                Creator Store
              </Link>

            </div>


            {/* WISHLIST */}

            <div className="border-t border-[#DCE7F2]">

              <Link
                to="/wishlist"
                onClick={closeMenus}
                className="
                  flex
                  items-center
                  justify-between
                  py-3
                  text-sm
                  font-medium
                  text-[#0B1F3A]
                  hover:text-[#0078ED]
                "
              >

                <span className="flex items-center gap-2">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                    />

                  </svg>

                  Wishlist

                </span>


                {wishlistCount > 0 && (

                  <span
                    className="
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#0078ED]
                      px-1.5
                      text-[10px]
                      text-white
                    "
                  >
                    {wishlistCount}
                  </span>

                )}

              </Link>

            </div>


            {/* AUTH / PROFILE */}

            {currentUser ? (
              <div className="mt-1 border-t border-[#DCE7F2] pt-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#F5FAFF] p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EAF4FF] text-sm font-semibold text-[#0078ED]">
                    {currentUser.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (currentUser.name || currentUser.email || "U")
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                      {currentUser.name || "My Account"}
                    </p>
                    <p className="truncate text-xs text-[#5E6B7A]">
                      {currentUser.email || ""}
                    </p>
                  </div>
                </div>

                <Link to="/account" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Dashboard</Link>
                <Link to="/orders" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">My Orders</Link>
                <Link to="/brands" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">My Brands</Link>
                <Link to="/designs" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Designs</Link>
                <Link to="/addresses" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Addresses</Link>
                <Link to="/wishlist" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Wishlist</Link>
                <Link to="/notifications" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Notifications</Link>
                <Link to="/settings" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Settings</Link>
                <Link to="/how-it-works#help-support" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Help & Support</Link>
                <Link to="/resources" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">Contact Support</Link>
                <Link to="/resources" onClick={closeMenus} className="block py-2.5 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]">FAQs</Link>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("karodrop-user");
                    setCurrentUser(null);
                    setOpen(false);
                    setActiveMenu(null);
                    window.dispatchEvent(new Event("userChanged"));
                    navigate("/");
                  }}
                  className="mt-2 w-full border-t border-[#DCE7F2] pt-4 text-left text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-1 flex gap-3 border-t border-[#DCE7F2] pt-4">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="rounded-lg px-1 py-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0078ED]"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenus}
                  className="rounded-full bg-[#0078ED] px-4 py-2 text-sm text-white transition hover:bg-[#012467]"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>

        </div>

      )}

    </header>
  );
}
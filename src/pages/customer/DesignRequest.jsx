import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import sampleProducts from "../../data/sampleProducts";
import { useCart } from "../../context/CartContext";
import TshirtViewer from "../../components/TshirtViewer";

const PRINT_CATEGORIES = ["tshirts", "t-shirt", "tshirt"];

const PLACEMENTS = [
  "Front",
  "Back",
  "Left Chest",
  "Right Chest",
  "Left Shoulder",
  "Right Shoulder",
];

const normalizeCategory = (category = "") =>
  String(category)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

const isPrintProduct = (product) => {
  const category = normalizeCategory(product?.category);
  return PRINT_CATEGORIES.includes(category);
};

const getUser = () => {
  try {
    const raw =
      localStorage.getItem("karodrop-user") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserKey = () => {
  const user = getUser();

  return (
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.email ||
    user?.username ||
    "guest"
  );
};

const getBrands = () => {
  const possibleKeys = [
    `karodrop-brands-${String(getUserKey()).toLowerCase()}`,
    "karodrop-brands",
    "myBrands",
    "brands",
  ];

  for (const key of possibleKeys) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue checking other keys.
    }
  }

  return [];
};

const getProductColorValue = (colorName) => {
  const color = String(colorName || "").toLowerCase();

  const colorMap = {
    black: "#111111",
    white: "#ffffff",
    navy: "#012467",
    "navy blue": "#012467",
    "royal blue": "#4169e1",
    grey: "#9ca3af",
    gray: "#9ca3af",
    beige: "#d8c3a5",
    charcoal: "#36454f",
    "olive green": "#708238",
    "dark brown": "#4b2e1f",
    brown: "#795548",
    terracotta: "#c56a4a",
    "natural wood": "#b88952",
    "natural bamboo": "#c9a66b",
    "oxidised silver": "#777777",
    gold: "#d4af37",
    red: "#dc2626",
    green: "#16a34a",
    multicolor: "#8b5cf6",
    whiteivory: "#fffff0",
    ivory: "#fffff0",
    "antique gold": "#b08d27",
    brass: "#b5a642",
    "marble finish": "#f2f2f2",
  };

  return colorMap[color] || "#ffffff";
};

const createConfigurationKey = ({
  product,
  brandId,
  color,
  size,
  designId,
  designName,
  designImage,
  printingMethod,
  printingPosition,
}) => {
  return JSON.stringify({
    productId: product?._id || product?.id || "",
    productSlug: product?.slug || "",
    brandId: brandId || "",
    color: color || "",
    size: size || "",
    designId: designId || "",
    designName: designName || "",
    designImage: designImage || "",
    printingMethod: printingMethod || "",
    printingPosition: printingPosition || "",
  });
};

export default function DesignRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const productSlug = queryParams.get("product") || "";

  const product = useMemo(() => {
    return sampleProducts.find(
      (item) =>
        String(item.slug || "").toLowerCase() ===
        String(productSlug || "").toLowerCase()
    );
  }, [productSlug]);

  const printProduct = useMemo(
    () => isPrintProduct(product),
    [product]
  );

  const brands = useMemo(() => getBrands(), []);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [printingMethod, setPrintingMethod] = useState("");
  const [placement, setPlacement] = useState("Front");

  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /*
    ------------------------------------------------------------
    Product defaults
    ------------------------------------------------------------
  */

  useEffect(() => {
    if (!product) return;

    if (printProduct) {
      const queryColor = queryParams.get("color");
      const querySize = queryParams.get("size");
      const queryPrinting = queryParams.get("printing");

      setSelectedColor(
        queryColor ||
          product.colors?.[0] ||
          ""
      );

      setSelectedSize(
        querySize ||
          product.sizes?.[0] ||
          ""
      );

      setPrintingMethod(
        queryPrinting ||
          product.printingOptions?.find(
            (item) =>
              String(item).toLowerCase() !== "not applicable"
          ) ||
          ""
      );
    } else {
      setSelectedColor("");
      setSelectedSize("");
      setPrintingMethod("");
      setPlacement("Front");
    }
  }, [product, printProduct, queryParams]);

  /*
    ------------------------------------------------------------
    If only one brand exists, select it automatically.
    ------------------------------------------------------------
  */

  useEffect(() => {
    if (brands.length === 1) {
      const brand = brands[0];

      setSelectedBrand(
        brand?._id ||
          brand?.id ||
          brand?.brandId ||
          brand?.name ||
          ""
      );
    }
  }, [brands]);

  /*
    ------------------------------------------------------------
    File preview
    ------------------------------------------------------------
  */

  useEffect(() => {
    if (!designFile) {
      setDesignPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(designFile);

    setDesignPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [designFile]);

  /*
    ------------------------------------------------------------
    Selected brand
    ------------------------------------------------------------
  */

  const selectedBrandData = useMemo(() => {
    return brands.find((brand) => {
      const id =
        brand?._id ||
        brand?.id ||
        brand?.brandId ||
        brand?.name ||
        "";

      return String(id) === String(selectedBrand);
    });
  }, [brands, selectedBrand]);

  /*
    ------------------------------------------------------------
    Design upload
    ------------------------------------------------------------
  */

  const handleDesignUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a PNG, JPG, JPEG or WEBP design file."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Design file size should be less than 10 MB.");

      event.target.value = "";
      return;
    }

    setDesignFile(file);
  };

  /*
    ------------------------------------------------------------
    Validation
    ------------------------------------------------------------
  */

  const validateStep = (step) => {
    setError("");

    if (step === 1) {
      if (!selectedBrand) {
        setError("Please select a brand before continuing.");
        return false;
      }
    }

    /*
      IMPORTANT:
      Design validation is ONLY for T-shirts / printable products.
      Jewellery, Handicrafts and Idols do NOT require a design.
    */
    if (step === 2 && printProduct) {
      if (!designFile) {
        setError(
          "Please upload your design to continue."
        );

        return false;
      }

      if (!printingMethod) {
        setError(
          "Please select a printing method."
        );

        return false;
      }

      if (!selectedColor) {
        setError(
          "Please select a product color."
        );

        return false;
      }

      if (!selectedSize) {
        setError(
          "Please select a product size."
        );

        return false;
      }

      if (!placement) {
        setError(
          "Please select a printing placement."
        );

        return false;
      }
    }

    if (step === 3) {
      if (!quantity || Number(quantity) < 1) {
        setError(
          "Quantity should be at least 1."
        );

        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;

    setCurrentStep((step) => step + 1);
  };

  const goBack = () => {
    setError("");
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  /*
    ------------------------------------------------------------
    Add to cart
    ------------------------------------------------------------
  */

  const handleAddToCart = () => {
    setError("");
    setSuccessMessage("");

    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (printProduct && !validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    const brandName =
      selectedBrandData?.name ||
      selectedBrandData?.brandName ||
      "My Brand";

    const brandId =
      selectedBrandData?._id ||
      selectedBrandData?.id ||
      selectedBrandData?.brandId ||
      selectedBrand ||
      "";

    const designId = designFile
      ? `upload-${Date.now()}`
      : "";

    const configurationKey = createConfigurationKey({
      product,
      brandId,
      color: printProduct ? selectedColor : "",
      size: printProduct ? selectedSize : "",
      designId,
      designName: designFile?.name || "",
      designImage: designPreview || "",
      printingMethod: printProduct
        ? printingMethod
        : "",
      printingPosition: printProduct
        ? placement
        : "",
    });

    addItem(
      product,
      Number(quantity),
      {
        productId:
          product?._id ||
          product?.id ||
          "",

        productName:
          product?.title ||
          product?.name ||
          "Product",

        slug: product?.slug || "",

        category:
          product?.category ||
          "",

        image:
          product?.image ||
          product?.images?.[0] ||
          "",

        unitPrice:
          Number(product?.price) || 0,

        price:
          Number(product?.price) || 0,

        brandId,
        brandName,

        brandLogo:
          selectedBrandData?.logo ||
          selectedBrandData?.brandLogo ||
          "",

        /*
          Non-print products:
          no color, size, design or printing data.
        */
        color: printProduct
          ? selectedColor
          : "",

        size: printProduct
          ? selectedSize
          : "",

        designType: printProduct
          ? "Uploaded Design"
          : "",

        designId,

        designName:
          printProduct
            ? designFile?.name || ""
            : "",

        designFileName:
          printProduct
            ? designFile?.name || ""
            : "",

        designImage:
          printProduct
            ? designPreview || ""
            : "",

        printingPosition:
          printProduct
            ? placement
            : "",

        /*
          CartContext currently stores printingOptions.
          We keep the selected printing method here as well.
        */
        printingOptions:
          printProduct && printingMethod
            ? [printingMethod]
            : [],

        printingMethod:
          printProduct
            ? printingMethod
            : "",

        notes,
        customerNotes: notes,

        productionTime:
          product?.productionTime || "",

        deliveryTime:
          product?.deliveryTime || "",

        configurationKey,
      }
    );

    setSuccessMessage(
      "Product added to cart successfully."
    );

    setTimeout(() => {
      navigate("/cart");
    }, 700);
  };

  /*
    ------------------------------------------------------------
    Product not found
    ------------------------------------------------------------
  */

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#DCE7F2] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Product not found
          </h1>

          <p className="mt-3 text-sm text-[#5E6B7A]">
            The product you are trying to customize
            could not be found.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  /*
    ------------------------------------------------------------
    Steps
    ------------------------------------------------------------
  */

  const steps = printProduct
    ? [
        {
          number: 1,
          title: "Brand",
          description: "Choose your brand",
        },
        {
          number: 2,
          title: "Design",
          description: "Customize product",
        },
        {
          number: 3,
          title: "Quantity",
          description: "Choose quantity",
        },
        {
          number: 4,
          title: "Requirements",
          description: "Add instructions",
        },
        {
          number: 5,
          title: "Review",
          description: "Check your order",
        },
      ]
    : [
        {
          number: 1,
          title: "Brand",
          description: "Choose your brand",
        },
        {
          number: 2,
          title: "Quantity",
          description: "Choose quantity",
        },
        {
          number: 3,
          title: "Requirements",
          description: "Add instructions",
        },
        {
          number: 4,
          title: "Review",
          description: "Check your order",
        },
      ];

  /*
    ------------------------------------------------------------
    Map visual step to actual state step
    ------------------------------------------------------------
  */

  const getActualStep = () => {
    return currentStep;
  };

  const actualStep = getActualStep();

  /*
    ------------------------------------------------------------
    Selected product image
    ------------------------------------------------------------
  */

  const productImage =
    product?.image ||
    product?.images?.[0] ||
    "";

  /*
    ------------------------------------------------------------
    Review step
    ------------------------------------------------------------
  */

  const reviewStep = printProduct ? 5 : 4;

  /*
    ------------------------------------------------------------
    Render
    ------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#F5FAFF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">

        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#5E6B7A]">
          <Link
            to="/products"
            className="transition hover:text-[#0078ED]"
          >
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/product/${product.slug}`}
            className="transition hover:text-[#0078ED]"
          >
            {product.title || product.name}
          </Link>

          <span>/</span>

          <span className="font-medium text-[#0B1F3A]">
            Customize
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#0078ED]">
            Create Product
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1F3A] sm:text-4xl">
            Customize your product
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5E6B7A]">
            Configure your selected product, add your brand,
            design and quantity, then add it to your cart.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* -------------------------------------------------
              Sidebar
          -------------------------------------------------- */}

          <aside className="h-fit rounded-3xl border border-[#DCE7F2] bg-white p-4 shadow-sm">
            <div className="mb-5 border-b border-[#DCE7F2] pb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                Selected Product
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#F5FAFF]">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={
                        product.title ||
                        product.name
                      }
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#5E6B7A]">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold text-[#0B1F3A]">
                    {product.title || product.name}
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0078ED]">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((step) => {
                const active =
                  actualStep === step.number;

                const completed =
                  actualStep > step.number;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => {
                      if (
                        step.number < actualStep
                      ) {
                        setError("");
                        setCurrentStep(
                          step.number
                        );
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                      active
                        ? "bg-[#EAF4FF]"
                        : completed
                        ? "hover:bg-[#F5FAFF]"
                        : "cursor-default"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        active
                          ? "bg-[#0078ED] text-white"
                          : completed
                          ? "bg-[#012467] text-white"
                          : "bg-[#F1F5F9] text-[#5E6B7A]"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : step.number}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          active
                            ? "text-[#0078ED]"
                            : "text-[#0B1F3A]"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p className="mt-0.5 text-xs text-[#5E6B7A]">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* -------------------------------------------------
              Main content
          -------------------------------------------------- */}

          <main className="min-w-0">

            {/* =================================================
                STEP 1 — BRAND
            ================================================= */}

            {actualStep === 1 && (
              <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                <div className="border-b border-[#DCE7F2] pb-5">
                  <p className="text-sm font-semibold text-[#0078ED]">
                    Step 1
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                    Select your brand
                  </h2>

                  <p className="mt-2 text-sm text-[#5E6B7A]">
                    Choose the brand under which this
                    product will be created.
                  </p>
                </div>

                {brands.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-[#BFD2E5] bg-[#F5FAFF] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl">
                      🏷️
                    </div>

                    <h3 className="mt-4 text-base font-bold text-[#0B1F3A]">
                      No brand found
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                      Create a brand first before adding
                      a customized product.
                    </p>

                    <Link
                      to="/my-brands"
                      className="mt-5 inline-flex rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                    >
                      Create Brand
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {brands.map((brand, index) => {
                      const brandId =
                        brand?._id ||
                        brand?.id ||
                        brand?.brandId ||
                        brand?.name ||
                        `brand-${index}`;

                      const brandName =
                        brand?.name ||
                        brand?.brandName ||
                        "My Brand";

                      const selected =
                        String(selectedBrand) ===
                        String(brandId);

                      return (
                        <button
                          key={brandId}
                          type="button"
                          onClick={() =>
                            setSelectedBrand(
                              brandId
                            )
                          }
                          className={`rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-[#0078ED] bg-[#EAF4FF] ring-2 ring-[#0078ED]/10"
                              : "border-[#DCE7F2] bg-white hover:border-[#8DBCE5] hover:bg-[#F5FAFF]"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                              {brand?.logo ||
                              brand?.brandLogo ? (
                                <img
                                  src={
                                    brand.logo ||
                                    brand.brandLogo
                                  }
                                  alt={brandName}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <span className="text-lg font-bold text-[#0078ED]">
                                  {brandName
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-[#0B1F3A]">
                                {brandName}
                              </p>

                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                {selected
                                  ? "Selected"
                                  : "Use this brand"}
                              </p>
                            </div>

                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-[#0078ED] bg-[#0078ED] text-white"
                                  : "border-[#C5D4E3]"
                              }`}
                            >
                              {selected && (
                                <span className="text-xs">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-7 flex justify-end">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={brands.length === 0}
                    className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012467] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* =================================================
                STEP 2 — DESIGN / CONFIGURATION
            ================================================= */}

            {actualStep === 2 &&
              printProduct && (
                <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                  <div className="border-b border-[#DCE7F2] pb-5">
                    <p className="text-sm font-semibold text-[#0078ED]">
                      Step 2
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                      Customize your T-shirt
                    </h2>

                    <p className="mt-2 text-sm text-[#5E6B7A]">
                      Add your design and select how it
                      should be printed on the selected
                      product.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-7 xl:grid-cols-[minmax(0,1fr)_430px]">

                    {/* Left controls */}
                    <div className="space-y-7">

                      {/* Product options */}
                      <div>
                        <h3 className="text-sm font-bold text-[#0B1F3A]">
                          Product options
                        </h3>

                        {/* Color */}
                        {product.colors?.length > 0 && (
                          <div className="mt-4">
                            <label className="text-sm font-semibold text-[#0B1F3A]">
                              Color
                            </label>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {product.colors.map(
                                (color) => {
                                  const selected =
                                    selectedColor ===
                                    color;

                                  return (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() =>
                                        setSelectedColor(
                                          color
                                        )
                                      }
                                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                                        selected
                                          ? "border-[#0078ED] bg-[#EAF4FF] font-semibold text-[#0078ED]"
                                          : "border-[#DCE7F2] text-[#0B1F3A] hover:border-[#8DBCE5]"
                                      }`}
                                    >
                                      <span
                                        className="h-4 w-4 rounded-full border border-black/10"
                                        style={{
                                          backgroundColor:
                                            getProductColorValue(
                                              color
                                            ),
                                        }}
                                      />

                                      {color}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}

                        {/* Size */}
                        {product.sizes?.length > 0 && (
                          <div className="mt-5">
                            <label className="text-sm font-semibold text-[#0B1F3A]">
                              Size
                            </label>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {product.sizes.map(
                                (size) => {
                                  const selected =
                                    selectedSize ===
                                    size;

                                  return (
                                    <button
                                      key={size}
                                      type="button"
                                      onClick={() =>
                                        setSelectedSize(
                                          size
                                        )
                                      }
                                      className={`min-w-14 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                        selected
                                          ? "border-[#0078ED] bg-[#0078ED] text-white"
                                          : "border-[#DCE7F2] text-[#0B1F3A] hover:border-[#8DBCE5]"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Design upload */}
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-bold text-[#0B1F3A]">
                              Your design
                            </h3>

                            <p className="mt-1 text-xs text-[#5E6B7A]">
                              PNG, JPG, JPEG or WEBP · Max
                              10 MB
                            </p>
                          </div>

                          {designFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setDesignFile(null);
                                setDesignPreview("");
                              }}
                              className="text-xs font-semibold text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#BFD2E5] bg-[#F5FAFF] px-5 py-7 text-center transition hover:border-[#0078ED] hover:bg-[#EAF4FF]">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={
                              handleDesignUpload
                            }
                            className="hidden"
                          />

                          {designFile ? (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                                {designPreview && (
                                  <img
                                    src={
                                      designPreview
                                    }
                                    alt="Design preview"
                                    className="h-full w-full object-contain"
                                  />
                                )}
                              </div>

                              <p className="mt-3 text-sm font-semibold text-[#0B1F3A]">
                                {designFile.name}
                              </p>

                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                Click to replace design
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                                ↑
                              </div>

                              <p className="mt-3 text-sm font-semibold text-[#0B1F3A]">
                                Upload your design
                              </p>

                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                Click to browse files
                              </p>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Printing method */}
                      {product.printingOptions?.length >
                        0 && (
                        <div>
                          <h3 className="text-sm font-bold text-[#0B1F3A]">
                            Printing method
                          </h3>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {product.printingOptions
                              .filter(
                                (option) =>
                                  String(
                                    option
                                  ).toLowerCase() !==
                                  "not applicable"
                              )
                              .map((option) => {
                                const selected =
                                  printingMethod ===
                                  option;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                      setPrintingMethod(
                                        option
                                      )
                                    }
                                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                                      selected
                                        ? "border-[#0078ED] bg-[#EAF4FF] font-semibold text-[#0078ED]"
                                        : "border-[#DCE7F2] text-[#0B1F3A] hover:border-[#8DBCE5]"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Placement */}
                      <div>
                        <div>
                          <h3 className="text-sm font-bold text-[#0B1F3A]">
                            Printing placement
                          </h3>

                          <p className="mt-1 text-xs text-[#5E6B7A]">
                            Select where your design should
                            appear.
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {PLACEMENTS.map(
                            (item) => {
                              const selected =
                                placement === item;

                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    setPlacement(
                                      item
                                    )
                                  }
                                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                                    selected
                                      ? "border-[#0078ED] bg-[#0078ED] text-white shadow-sm"
                                      : "border-[#DCE7F2] bg-white text-[#0B1F3A] hover:border-[#8DBCE5] hover:bg-[#F5FAFF]"
                                  }`}
                                >
                                  {item}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3D Viewer */}
                    <div className="xl:sticky xl:top-6 xl:h-fit">
                      <TshirtViewer
                        modelPath="/models/tshirt.glb"
                        designImage={
                          designPreview
                        }
                        placement={placement}
                        productColor={getProductColorValue(
                          selectedColor
                        )}
                      />

                      <div className="mt-3 rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3">
                        <p className="text-xs leading-5 text-[#5E6B7A]">
                          <span className="font-semibold text-[#0B1F3A]">
                            Preview:
                          </span>{" "}
                          {placement} placement
                          {selectedColor
                            ? ` · ${selectedColor}`
                            : ""}
                          {selectedSize
                            ? ` · ${selectedSize}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5FAFF]"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                    >
                      Continue
                    </button>
                  </div>
                </section>
              )}

            {/* =================================================
                STEP 2 — QUANTITY FOR NON PRINT PRODUCTS
            ================================================= */}

            {actualStep === 2 &&
              !printProduct && (
                <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                  <p className="text-sm font-semibold text-[#0078ED]">
                    Step 2
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                    Choose quantity
                  </h2>

                  <p className="mt-2 text-sm text-[#5E6B7A]">
                    Select how many units you want for this
                    product.
                  </p>

                  <div className="mt-8 max-w-sm">
                    <label className="text-sm font-semibold text-[#0B1F3A]">
                      Quantity
                    </label>

                    <div className="mt-3 flex items-center rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((value) =>
                            Math.max(
                              1,
                              Number(value) - 1
                            )
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-semibold text-[#0B1F3A] shadow-sm"
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            Math.max(
                              1,
                              Number(
                                event.target.value
                              ) || 1
                            )
                          )
                        }
                        className="w-full bg-transparent text-center text-lg font-bold text-[#0B1F3A] outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            (value) =>
                              Number(value) + 1
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078ED] text-lg font-semibold text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A]"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#012467]"
                    >
                      Continue
                    </button>
                  </div>
                </section>
              )}

            {/* =================================================
                STEP 3 — QUANTITY FOR PRINT PRODUCTS
            ================================================= */}

            {actualStep === 3 &&
              printProduct && (
                <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                  <p className="text-sm font-semibold text-[#0078ED]">
                    Step 3
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                    Choose quantity
                  </h2>

                  <p className="mt-2 text-sm text-[#5E6B7A]">
                    Enter the number of customized units
                    you want.
                  </p>

                  <div className="mt-8 max-w-sm">
                    <label className="text-sm font-semibold text-[#0B1F3A]">
                      Quantity
                    </label>

                    <div className="mt-3 flex items-center rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((value) =>
                            Math.max(
                              1,
                              Number(value) - 1
                            )
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-semibold text-[#0B1F3A] shadow-sm"
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            Math.max(
                              1,
                              Number(
                                event.target.value
                              ) || 1
                            )
                          )
                        }
                        className="w-full bg-transparent text-center text-lg font-bold text-[#0B1F3A] outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            (value) =>
                              Number(value) + 1
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0078ED] text-lg font-semibold text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#F5FAFF] p-5">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-[#5E6B7A]">
                        Unit price
                      </span>

                      <span className="font-semibold text-[#0B1F3A]">
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between gap-4 border-t border-[#DCE7F2] pt-3 text-sm">
                      <span className="font-semibold text-[#0B1F3A]">
                        Estimated subtotal
                      </span>

                      <span className="font-bold text-[#0078ED]">
                        ₹
                        {(
                          Number(
                            product.price || 0
                          ) *
                          Number(quantity || 1)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A]"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#012467]"
                    >
                      Continue
                    </button>
                  </div>
                </section>
              )}

            {/* =================================================
                REQUIREMENTS
            ================================================= */}

            {actualStep ===
              (printProduct ? 4 : 3) && (
              <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                <p className="text-sm font-semibold text-[#0078ED]">
                  Step {printProduct ? 4 : 3}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                  Customer requirements
                </h2>

                <p className="mt-2 text-sm text-[#5E6B7A]">
                  Add any special instructions for your
                  order.
                </p>

                <div className="mt-7">
                  <label className="text-sm font-semibold text-[#0B1F3A]">
                    Requirements / Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    rows={7}
                    placeholder={
                      printProduct
                        ? "Example: Keep the design centered, use the original colors, no changes to artwork..."
                        : "Example: Special packaging, size preference, or any other requirement..."
                    }
                    className="mt-3 w-full resize-none rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#8A97A6] focus:border-[#0078ED] focus:bg-white focus:ring-4 focus:ring-[#0078ED]/10"
                  />
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#012467]"
                  >
                    Review Product
                  </button>
                </div>
              </section>
            )}

            {/* =================================================
                REVIEW
            ================================================= */}

            {actualStep === reviewStep && (
              <section className="rounded-3xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-7">
                <div className="border-b border-[#DCE7F2] pb-5">
                  <p className="text-sm font-semibold text-[#0078ED]">
                    Step {reviewStep}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0B1F3A]">
                    Review your product
                  </h2>

                  <p className="mt-2 text-sm text-[#5E6B7A]">
                    Check your configuration before adding
                    it to your cart.
                  </p>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

                  {/* Summary */}
                  <div className="space-y-4">

                    <div className="rounded-2xl border border-[#DCE7F2] p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                        Product
                      </p>

                      <div className="mt-4 flex gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F5FAFF]">
                          <img
                            src={productImage}
                            alt={
                              product.title ||
                              product.name
                            }
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div>
                          <h3 className="font-bold text-[#0B1F3A]">
                            {product.title ||
                              product.name}
                          </h3>

                          <p className="mt-1 text-sm text-[#5E6B7A]">
                            {product.category}
                          </p>

                          <p className="mt-2 text-lg font-bold text-[#0078ED]">
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[#DCE7F2] p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                          Brand
                        </p>

                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {selectedBrandData?.name ||
                            selectedBrandData?.brandName ||
                            "My Brand"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#DCE7F2] p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                          Quantity
                        </p>

                        <p className="mt-2 font-semibold text-[#0B1F3A]">
                          {quantity}
                        </p>
                      </div>
                    </div>

                    {printProduct && (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-[#DCE7F2] p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                              Color
                            </p>

                            <p className="mt-2 font-semibold text-[#0B1F3A]">
                              {selectedColor}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[#DCE7F2] p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                              Size
                            </p>

                            <p className="mt-2 font-semibold text-[#0B1F3A]">
                              {selectedSize}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[#DCE7F2] p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                              Printing
                            </p>

                            <p className="mt-2 font-semibold text-[#0B1F3A]">
                              {printingMethod}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-[#DCE7F2] p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                              Placement
                            </p>

                            <p className="mt-2 font-semibold text-[#0B1F3A]">
                              {placement}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#DCE7F2] p-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                            Design
                          </p>

                          <div className="mt-4 flex items-center gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-xl bg-[#F5FAFF]">
                              {designPreview ? (
                                <img
                                  src={
                                    designPreview
                                  }
                                  alt="Uploaded design"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-[#5E6B7A]">
                                  No design
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-[#0B1F3A]">
                                {designFile?.name ||
                                  "Uploaded Design"}
                              </p>

                              <p className="mt-1 text-xs text-[#5E6B7A]">
                                {placement} placement
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {notes && (
                      <div className="rounded-2xl border border-[#DCE7F2] p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#5E6B7A]">
                          Requirements
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#0B1F3A]">
                          {notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="h-fit rounded-3xl bg-[#012467] p-6 text-white">
                    <p className="text-sm font-medium text-white/70">
                      Order summary
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-white/70">
                          Unit price
                        </span>

                        <span>
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-white/70">
                          Quantity
                        </span>

                        <span>{quantity}</span>
                      </div>

                      <div className="border-t border-white/15 pt-4">
                        <div className="flex justify-between gap-4">
                          <span className="font-semibold">
                            Subtotal
                          </span>

                          <span className="text-xl font-bold">
                            ₹
                            {(
                              Number(
                                product.price || 0
                              ) *
                              Number(
                                quantity || 1
                              )
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-xs leading-5 text-white/60">
                      Shipping, taxes and final payable
                      amount will be calculated at checkout.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-6 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-xl border border-[#DCE7F2] bg-white px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5FAFF]"
                  >
                    Back & Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="rounded-xl bg-[#0078ED] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#012467]"
                  >
                    Add to Cart
                  </button>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
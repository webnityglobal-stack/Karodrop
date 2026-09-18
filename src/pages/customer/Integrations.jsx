import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../useProducts.js";

const STORES_KEY = "karodrop-integrations";
const MAPPINGS_KEY = "karodrop-product-mappings";
const BRANDS_KEY = "karodrop-brands";
const DESIGNS_KEY = "karodrop-design-requests";

const initialStores = [
  {
    id: "shopify",
    name: "Shopify",
    description:
      "Connect your Shopify store and automatically send orders to Karodrop for processing and fulfillment.",
    icon: "S",
    status: "Not Connected",
    connected: false,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description:
      "Connect your WooCommerce store and manage product orders through Karodrop fulfillment.",
    icon: "W",
    status: "Not Connected",
    connected: false,
  },
  {
    id: "custom-api",
    name: "Custom API",
    description:
      "Connect your own website or custom ecommerce platform using the Karodrop API.",
    icon: "API",
    status: "Coming Soon",
    connected: false,
    comingSoon: true,
  },
];

const getCurrentUser = () => {
  try {
    const saved =
      localStorage.getItem("karodrop-user") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load current user:", error);
    return null;
  }
};

const getUserIdentifier = (user) => {
  return String(user?.id || user?._id || user?.email || "").toLowerCase();
};

const isOwnedByCurrentUser = (item, user) => {
  const currentIdentifier = getUserIdentifier(user);

  if (!currentIdentifier) return false;

  const itemIdentifier = String(
    item?.customerId ||
      item?.userId ||
      item?.customerEmail ||
      item?.email ||
      item?.user?.id ||
      item?.user?._id ||
      item?.user?.email ||
      ""
  ).toLowerCase();

  return itemIdentifier === currentIdentifier;
};

const Integrations = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const { products, loading: productsLoading } = useProducts();

  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORES_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load integrations:", error);
    }

    return initialStores;
  });

  const [mappings, setMappings] = useState(() => {
    try {
      const saved = localStorage.getItem(MAPPINGS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load product mappings:", error);
    }

    return [];
  });

  const [brands] = useState(() => {
    try {
      const saved = localStorage.getItem(BRANDS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
    }

    return [];
  });

  const [designs] = useState(() => {
    try {
      const saved = localStorage.getItem(DESIGNS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load designs:", error);
    }

    return [];
  });

  const [selectedStore, setSelectedStore] = useState(null);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [editingMappingId, setEditingMappingId] = useState(null);
  const [mappingError, setMappingError] = useState("");

  const [mappingForm, setMappingForm] = useState({
    storeId: "",
    storeProductName: "",
    storeProductId: "",
    productId: "",
    brandId: "",
    designId: "",
    color: "",
    size: "",
    printingMethod: "",
  });

  const updateStores = (updatedStores) => {
    setStores(updatedStores);

    try {
      localStorage.setItem(STORES_KEY, JSON.stringify(updatedStores));
    } catch (error) {
      console.error("Failed to save integrations:", error);
    }
  };

  const updateMappings = (updatedMappings) => {
    setMappings(updatedMappings);

    try {
      localStorage.setItem(
        MAPPINGS_KEY,
        JSON.stringify(updatedMappings)
      );
    } catch (error) {
      console.error("Failed to save product mappings:", error);
    }
  };

  const customerBrands = useMemo(() => {
    return brands.filter((brand) => isOwnedByCurrentUser(brand, currentUser));
  }, [brands, currentUser]);

  const customerDesigns = useMemo(() => {
    return designs.filter((design) =>
      isOwnedByCurrentUser(design, currentUser)
    );
  }, [designs, currentUser]);

  const customerMappings = useMemo(() => {
    return mappings.filter((mapping) =>
      isOwnedByCurrentUser(mapping, currentUser)
    );
  }, [mappings, currentUser]);

  const connectedStores = stores.filter((store) => store.connected).length;

  const connectedStoreOptions = stores.filter(
    (store) => store.connected && !store.comingSoon
  );

  const selectedProduct = useMemo(() => {
    return products.find(
      (product) =>
        String(product?._id || product?.id || product?.slug) ===
        String(mappingForm.productId)
    );
  }, [products, mappingForm.productId]);

  const selectedBrand = useMemo(() => {
    return customerBrands.find(
      (brand) => String(brand?.id || brand?._id) === String(mappingForm.brandId)
    );
  }, [customerBrands, mappingForm.brandId]);

  const selectedDesign = useMemo(() => {
    return customerDesigns.find(
      (design) =>
        String(design?.id || design?._id || design?.requestId) ===
        String(mappingForm.designId)
    );
  }, [customerDesigns, mappingForm.designId]);

  const availableColors = selectedProduct?.colors || [];
  const availableSizes = selectedProduct?.sizes || [];
  const availablePrintingOptions = selectedProduct?.printingOptions || [];

  const handleConnect = (storeId) => {
    const store = stores.find((item) => item.id === storeId);

    if (!store || store.comingSoon) {
      return;
    }

    setSelectedStore(store);
  };

  const handleDemoConnect = () => {
    if (!selectedStore) return;

    const updatedStores = stores.map((store) =>
      store.id === selectedStore.id
        ? {
            ...store,
            connected: true,
            status: "Connected",
            storeUrl:
              store.id === "shopify"
                ? "https://your-store.myshopify.com"
                : "https://yourstore.com",
          }
        : store
    );

    updateStores(updatedStores);

    const updatedStore = updatedStores.find(
      (store) => store.id === selectedStore.id
    );

    setSelectedStore(updatedStore);
  };

  const handleDisconnect = (storeId) => {
    const updatedStores = stores.map((store) =>
      store.id === storeId
        ? {
            ...store,
            connected: false,
            status: "Not Connected",
            storeUrl: "",
          }
        : store
    );

    updateStores(updatedStores);
  };

  const openAddMapping = () => {
    setEditingMappingId(null);
    setMappingError("");

    const firstConnectedStore = connectedStoreOptions[0];

    setMappingForm({
      storeId: firstConnectedStore?.id || "",
      storeProductName: "",
      storeProductId: "",
      productId: "",
      brandId: "",
      designId: "",
      color: "",
      size: "",
      printingMethod: "",
    });

    setMappingModalOpen(true);
  };

  const openEditMapping = (mapping) => {
    setEditingMappingId(mapping.id);
    setMappingError("");

    setMappingForm({
      storeId: mapping.storeId || "",
      storeProductName: mapping.storeProductName || "",
      storeProductId: mapping.storeProductId || "",
      productId: mapping.productId || "",
      brandId: mapping.brandId || "",
      designId: mapping.designId || "",
      color: mapping.color || "",
      size: mapping.size || "",
      printingMethod: mapping.printingMethod || "",
    });

    setMappingModalOpen(true);
  };

  const closeMappingModal = () => {
    setMappingModalOpen(false);
    setEditingMappingId(null);
    setMappingError("");
  };

  const handleMappingFormChange = (event) => {
    const { name, value } = event.target;

    setMappingForm((previous) => {
      const next = {
        ...previous,
        [name]: value,
      };

      if (name === "productId") {
        next.color = "";
        next.size = "";
        next.printingMethod = "";
        next.designId = "";
      }

      return next;
    });

    setMappingError("");
  };

  const handleSaveMapping = (event) => {
    event.preventDefault();

    if (!currentUser) {
      setMappingError("Please login to manage product mappings.");
      return;
    }

    if (!mappingForm.storeId) {
      setMappingError("Please select a connected store.");
      return;
    }

    if (!mappingForm.storeProductName.trim()) {
      setMappingError("Please enter your store product name.");
      return;
    }

    if (!mappingForm.productId) {
      setMappingError("Please select a Karodrop product.");
      return;
    }

    if (!mappingForm.brandId) {
      setMappingError("Please select a brand.");
      return;
    }

    if (!mappingForm.color) {
      setMappingError("Please select a color.");
      return;
    }

    if (!mappingForm.size) {
      setMappingError("Please select a size.");
      return;
    }

    if (
      availablePrintingOptions.length > 0 &&
      !mappingForm.printingMethod
    ) {
      setMappingError("Please select a printing option.");
      return;
    }

    const store = stores.find(
      (item) => item.id === mappingForm.storeId
    );

    const product = products.find(
      (item) =>
        String(item?._id || item?.id || item?.slug) ===
        String(mappingForm.productId)
    );

    const brand = customerBrands.find(
      (item) =>
        String(item?.id || item?._id) ===
        String(mappingForm.brandId)
    );

    const design = customerDesigns.find(
      (item) =>
        String(item?.id || item?._id || item?.requestId) ===
        String(mappingForm.designId)
    );

    const existingMapping = customerMappings.find(
      (mapping) =>
        mapping.id !== editingMappingId &&
        mapping.storeId === mappingForm.storeId &&
        String(mapping.storeProductName).trim().toLowerCase() ===
          mappingForm.storeProductName.trim().toLowerCase()
    );

    if (existingMapping) {
      setMappingError(
        "This store product is already mapped. You can edit the existing mapping."
      );
      return;
    }

    const mappingData = {
      id:
        editingMappingId ||
        `mapping-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      customerId:
        currentUser?.id ||
        currentUser?._id ||
        currentUser?.email ||
        "",

      customerEmail: currentUser?.email || "",

      storeId: mappingForm.storeId,
      storeName: store?.name || mappingForm.storeId,

      storeProductName: mappingForm.storeProductName.trim(),
      storeProductId: mappingForm.storeProductId.trim(),

      productId:
        product?._id || product?.id || product?.slug || mappingForm.productId,

      productName: product?.title || product?.name || "Karodrop Product",
      productSlug: product?.slug || "",

      productImage:
        product?.images?.[0] ||
        product?.image ||
        "",

      brandId:
        brand?.id ||
        brand?._id ||
        mappingForm.brandId,

      brandName:
        brand?.name ||
        brand?.brandName ||
        "Brand",

      designId:
        design?.id ||
        design?._id ||
        design?.requestId ||
        mappingForm.designId ||
        "",

      designName:
        design?.designName ||
        design?.fileName ||
        design?.designFileName ||
        "No design selected",

      designImage:
        design?.designImage ||
        design?.image ||
        "",

      color: mappingForm.color,
      size: mappingForm.size,
      printingMethod: mappingForm.printingMethod,

      status: "Mapped",

      updatedAt: new Date().toISOString(),
      createdAt:
        editingMappingId
          ? customerMappings.find(
              (item) => item.id === editingMappingId
            )?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
    };

    if (editingMappingId) {
      const updatedMappings = mappings.map((mapping) =>
        mapping.id === editingMappingId
          ? mappingData
          : mapping
      );

      updateMappings(updatedMappings);
    } else {
      updateMappings([...mappings, mappingData]);
    }

    closeMappingModal();
  };

  const handleDeleteMapping = (mappingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product mapping?"
    );

    if (!confirmed) return;

    const updatedMappings = mappings.filter(
      (mapping) => mapping.id !== mappingId
    );

    updateMappings(updatedMappings);
  };

  const getStoreName = (storeId) => {
    return (
      stores.find((store) => store.id === storeId)?.name ||
      storeId ||
      "Store"
    );
  };

  const getBrandName = (brandId) => {
    return (
      customerBrands.find(
        (brand) =>
          String(brand?.id || brand?._id) === String(brandId)
      )?.name ||
      customerBrands.find(
        (brand) =>
          String(brand?.id || brand?._id) === String(brandId)
      )?.brandName ||
      "Brand"
    );
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#0B1F3A]">
      {/* Header */}
      <header className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="flex items-center gap-2 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
              >
                ← Dashboard
              </Link>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
              Integrations
            </h1>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              Connect your online store and send orders to Karodrop.
            </p>
          </div>

          <div className="hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3 sm:block">
            <p className="text-xs font-medium text-[#5E6B7A]">
              Connected Stores
            </p>

            <p className="mt-1 text-xl font-bold text-[#0078ED]">
              {connectedStores}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Intro */}
        <section className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold text-[#0078ED]">
                Store Integration
              </span>

              <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                Manage your ecommerce stores from Karodrop
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                Connect your store, map your products and let Karodrop handle
                printing, fulfillment and shipping when orders are received.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-[#F5FAFF] px-3 py-3 text-center">
                <p className="text-lg font-bold text-[#0078ED]">01</p>
                <p className="mt-1 text-[11px] font-medium text-[#5E6B7A]">
                  Connect
                </p>
              </div>

              <div className="rounded-xl bg-[#F5FAFF] px-3 py-3 text-center">
                <p className="text-lg font-bold text-[#0078ED]">02</p>
                <p className="mt-1 text-[11px] font-medium text-[#5E6B7A]">
                  Map
                </p>
              </div>

              <div className="rounded-xl bg-[#F5FAFF] px-3 py-3 text-center">
                <p className="text-lg font-bold text-[#0078ED]">03</p>
                <p className="mt-1 text-[11px] font-medium text-[#5E6B7A]">
                  Fulfill
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Store cards */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Available Integrations</h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              Connect the platform where you sell your products.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg font-bold text-[#0078ED]">
                    {store.icon}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      store.connected
                        ? "bg-green-50 text-green-700"
                        : store.comingSoon
                        ? "bg-gray-100 text-gray-600"
                        : "bg-[#F5FAFF] text-[#5E6B7A]"
                    }`}
                  >
                    {store.status}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {store.name}
                </h3>

                <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#5E6B7A]">
                  {store.description}
                </p>

                {store.connected && store.storeUrl && (
                  <div className="mt-4 rounded-xl bg-[#F5FAFF] p-3">
                    <p className="text-xs font-medium text-[#5E6B7A]">
                      Connected Store
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-[#0B1F3A]">
                      {store.storeUrl}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex gap-2">
                  {store.connected ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConnect(store.id)}
                        className="flex-1 rounded-xl border border-[#DCE7F2] px-4 py-2.5 text-sm font-semibold text-[#0078ED] transition hover:bg-[#F5FAFF]"
                      >
                        Manage
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDisconnect(store.id)}
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={store.comingSoon}
                      onClick={() => handleConnect(store.id)}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        store.comingSoon
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-[#0078ED] text-white hover:bg-[#012467]"
                      }`}
                    >
                      {store.comingSoon
                        ? "Coming Soon"
                        : "Connect Store"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product mapping */}
        <section className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Product Mapping
              </h2>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Connect your store products with Karodrop products, brands and
                designs.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddMapping}
              disabled={connectedStoreOptions.length === 0}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                connectedStoreOptions.length === 0
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-[#0078ED] text-white hover:bg-[#012467]"
              }`}
            >
              + Add Mapping
            </button>
          </div>

          {connectedStoreOptions.length === 0 && (
            <div className="mt-5 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <p className="text-sm font-medium text-[#0B1F3A]">
                Connect a store first
              </p>

              <p className="mt-1 text-sm leading-6 text-[#5E6B7A]">
                Product mapping becomes available after you connect Shopify or
                WooCommerce.
              </p>
            </div>
          )}

          {customerMappings.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[#DCE7F2] bg-[#F5FAFF] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">
                🔗
              </div>

              <h3 className="mt-3 font-semibold">
                No product mappings yet
              </h3>

              <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-[#5E6B7A]">
                Once your store is connected, you can map each store product to
                a Karodrop product, brand and design.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {customerMappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#EAF4FF] px-2.5 py-1 text-xs font-semibold text-[#0078ED]">
                          {mapping.storeName}
                        </span>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {mapping.status}
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-base font-bold">
                        {mapping.storeProductName}
                      </h3>
                    </div>

                    {mapping.productImage && (
                      <img
                        src={mapping.productImage}
                        alt={mapping.productName}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#DCE7F2] bg-white p-4">
                    <p className="text-xs font-medium text-[#5E6B7A]">
                      Karodrop Product
                    </p>

                    <p className="mt-1 font-semibold">
                      {mapping.productName}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-[#5E6B7A]">Brand</p>
                        <p className="mt-1 font-medium">
                          {mapping.brandName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#5E6B7A]">Design</p>
                        <p className="mt-1 truncate font-medium">
                          {mapping.designName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#5E6B7A]">Color</p>
                        <p className="mt-1 font-medium">
                          {mapping.color}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#5E6B7A]">Size</p>
                        <p className="mt-1 font-medium">
                          {mapping.size}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-[#5E6B7A]">
                          Printing
                        </p>
                        <p className="mt-1 font-medium">
                          {mapping.printingMethod || "Not Applicable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditMapping(mapping)}
                      className="flex-1 rounded-xl border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-semibold text-[#0078ED] transition hover:bg-[#EAF4FF]"
                    >
                      Edit Mapping
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMapping(mapping.id)}
                      className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sync settings */}
        <section className="mt-6 rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-bold">Sync Settings</h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              These settings will control how data moves between your store
              and Karodrop.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              [
                "Order Sync",
                "Send new store orders to Karodrop.",
              ],
              [
                "Inventory Sync",
                "Keep product inventory information synchronized.",
              ],
              [
                "Tracking Sync",
                "Send shipment and tracking updates to your store.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-[#DCE7F2] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{title}</h3>

                    <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                      {description}
                    </p>
                  </div>

                  <div className="h-6 w-11 rounded-full bg-[#0078ED] p-1">
                    <div className="ml-auto h-4 w-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-6 rounded-2xl bg-[#012467] p-6 text-white sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#8CC7FF]">
              HOW KARODROP WORKS
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Connect once. Fulfill every order.
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Connect your ecommerce store with Karodrop. Your mapped orders
              can then move through printing, production, packing and shipping
              from one fulfillment workflow.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Connect Store", "Connect Shopify, WooCommerce or API."],
              ["02", "Map Products", "Link store products with Karodrop."],
              ["03", "Receive Orders", "Orders move into your fulfillment flow."],
              ["04", "Ship", "Karodrop prints, packs and dispatches."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-sm font-bold text-[#8CC7FF]">
                  {number}
                </div>

                <h3 className="mt-3 font-semibold">{title}</h3>

                <p className="mt-1 text-xs leading-5 text-blue-100">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Connect modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012467]/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] font-bold text-[#0078ED]">
                  {selectedStore.icon}
                </div>

                <h2 className="mt-4 text-xl font-bold">
                  Connect {selectedStore.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
                  The real OAuth/API connection will be added when the backend
                  integration is implemented.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="text-xl text-[#5E6B7A] hover:text-[#0B1F3A]"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-[#F5FAFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Frontend Preview
              </p>

              <p className="mt-2 text-sm text-[#0B1F3A]">
                For now this will simulate a connected store. Later, this
                button will open the actual Shopify/WooCommerce authorization
                flow through the Karodrop backend.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="flex-1 rounded-xl border border-[#DCE7F2] px-4 py-2.5 text-sm font-semibold text-[#5E6B7A] hover:bg-[#F5FAFF]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDemoConnect}
                className="flex-1 rounded-xl bg-[#0078ED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#012467]"
              >
                Connect Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Mapping Modal */}
      {mappingModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#012467]/50 px-4 py-8">
          <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#DCE7F2] p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold">
                  {editingMappingId
                    ? "Edit Product Mapping"
                    : "Add Product Mapping"}
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  Map your store product to the exact Karodrop product
                  configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={closeMappingModal}
                className="text-xl text-[#5E6B7A] hover:text-[#0B1F3A]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSaveMapping}
              className="max-h-[75vh] overflow-y-auto p-5 sm:p-6"
            >
              {mappingError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {mappingError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Store */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    Connected Store
                  </label>

                  <select
                    name="storeId"
                    value={mappingForm.storeId}
                    onChange={handleMappingFormChange}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  >
                    <option value="">Select store</option>

                    {connectedStoreOptions.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Store product */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    Store Product Name
                  </label>

                  <input
                    type="text"
                    name="storeProductName"
                    value={mappingForm.storeProductName}
                    onChange={handleMappingFormChange}
                    placeholder="Example: Black Oversized T-Shirt"
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  />

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    Later this value will come automatically from Shopify or
                    WooCommerce.
                  </p>
                </div>

                {/* Store product ID */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    Store Product ID
                    <span className="ml-1 font-normal text-[#5E6B7A]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    name="storeProductId"
                    value={mappingForm.storeProductId}
                    onChange={handleMappingFormChange}
                    placeholder="Example: shopify-product-123"
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  />
                </div>

                {/* Karodrop product */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    Karodrop Product
                  </label>

                  <select
                    name="productId"
                    value={mappingForm.productId}
                    onChange={handleMappingFormChange}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  >
                    <option value="">
                      {productsLoading
                        ? "Loading products..."
                        : "Select Karodrop product"}
                    </option>

                    {products.map((product) => (
                      <option
                        key={product?._id || product?.id || product?.slug}
                        value={
                          product?._id ||
                          product?.id ||
                          product?.slug
                        }
                      >
                        {product?.title || product?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-semibold">
                    Brand
                  </label>

                  <select
                    name="brandId"
                    value={mappingForm.brandId}
                    onChange={handleMappingFormChange}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  >
                    <option value="">Select brand</option>

                    {customerBrands.map((brand) => (
                      <option
                        key={brand?.id || brand?._id}
                        value={brand?.id || brand?._id}
                      >
                        {brand?.name || brand?.brandName}
                      </option>
                    ))}
                  </select>

                  {customerBrands.length === 0 && (
                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Add a brand from My Brands first.
                    </p>
                  )}
                </div>

                {/* Design */}
                <div>
                  <label className="text-sm font-semibold">
                    Design
                    <span className="ml-1 font-normal text-[#5E6B7A]">
                      (Optional)
                    </span>
                  </label>

                  <select
                    name="designId"
                    value={mappingForm.designId}
                    onChange={handleMappingFormChange}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none focus:border-[#0078ED]"
                  >
                    <option value="">No design / Select design</option>

                    {customerDesigns.map((design) => (
                      <option
                        key={
                          design?.id ||
                          design?._id ||
                          design?.requestId
                        }
                        value={
                          design?.id ||
                          design?._id ||
                          design?.requestId
                        }
                      >
                        {design?.designName ||
                          design?.fileName ||
                          design?.designFileName ||
                          "Untitled Design"}
                      </option>
                    ))}
                  </select>

                  {customerDesigns.length === 0 && (
                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      No saved designs found.
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="text-sm font-semibold">
                    Color
                  </label>

                  <select
                    name="color"
                    value={mappingForm.color}
                    onChange={handleMappingFormChange}
                    disabled={!selectedProduct}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400 focus:border-[#0078ED]"
                  >
                    <option value="">
                      {selectedProduct
                        ? "Select color"
                        : "Select product first"}
                    </option>

                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="text-sm font-semibold">
                    Size
                  </label>

                  <select
                    name="size"
                    value={mappingForm.size}
                    onChange={handleMappingFormChange}
                    disabled={!selectedProduct}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400 focus:border-[#0078ED]"
                  >
                    <option value="">
                      {selectedProduct
                        ? "Select size"
                        : "Select product first"}
                    </option>

                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Printing */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    Printing Method
                  </label>

                  <select
                    name="printingMethod"
                    value={mappingForm.printingMethod}
                    onChange={handleMappingFormChange}
                    disabled={!selectedProduct}
                    className="mt-2 w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400 focus:border-[#0078ED]"
                  >
                    <option value="">
                      {selectedProduct
                        ? "Select printing method"
                        : "Select product first"}
                    </option>

                    {availablePrintingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {selectedProduct && (
                <div className="mt-5 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                    Mapping Preview
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Store
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {getStoreName(mappingForm.storeId)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Karodrop Product
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {selectedProduct?.title ||
                          selectedProduct?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Brand
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {selectedBrand?.name ||
                          selectedBrand?.brandName ||
                          "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Design
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold">
                        {selectedDesign?.designName ||
                          selectedDesign?.fileName ||
                          selectedDesign?.designFileName ||
                          "No design"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Configuration
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {mappingForm.color || "Color"} /{" "}
                        {mappingForm.size || "Size"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#5E6B7A]">
                        Printing
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {mappingForm.printingMethod ||
                          "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeMappingModal}
                  className="rounded-xl border border-[#DCE7F2] px-5 py-3 text-sm font-semibold text-[#5E6B7A] transition hover:bg-[#F5FAFF]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                >
                  {editingMappingId
                    ? "Save Changes"
                    : "Save Mapping"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
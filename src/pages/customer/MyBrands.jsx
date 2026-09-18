import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const BRANDS_STORAGE_KEY = "karodrop-brands";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  website: "",
  logo: "",
};

const categories = [
  "Fashion",
  "Clothing",
  "Jewellery",
  "Handicrafts",
  "Home & Living",
  "Beauty",
  "Accessories",
  "Other",
];

/* =========================
   USER HELPERS
========================= */

function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem("karodrop-user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);
    return null;
  }
}

function getCustomerId(user) {
  if (!user) {
    return "";
  }

  return String(
    user.id ||
      user.userId ||
      user._id ||
      user.email ||
      ""
  ).trim();
}

function getCustomerEmail(user) {
  return String(user?.email || "")
    .trim()
    .toLowerCase();
}

function getCustomerName(user) {
  return String(
    user?.name ||
      user?.fullName ||
      user?.username ||
      ""
  ).trim();
}

/* =========================
   BRAND OWNERSHIP
========================= */

function isBrandOwnedByUser(brand, user) {
  if (!brand || !user) {
    return false;
  }

  const customerId = getCustomerId(user);
  const customerEmail = getCustomerEmail(user);

  const brandCustomerId = String(
    brand.customerId || ""
  ).trim();

  const brandCustomerEmail = String(
    brand.customerEmail || ""
  )
    .trim()
    .toLowerCase();

  if (
    brandCustomerId &&
    customerId &&
    brandCustomerId === customerId
  ) {
    return true;
  }

  if (
    brandCustomerEmail &&
    customerEmail &&
    brandCustomerEmail === customerEmail
  ) {
    return true;
  }

  return false;
}

/* =========================
   COMPONENT
========================= */

export default function MyBrands() {
  const [brands, setBrands] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  /* =========================
     LOAD BRANDS
  ========================= */

  const loadBrands = () => {
    try {
      const savedBrands = localStorage.getItem(
        BRANDS_STORAGE_KEY
      );

      const user = getCurrentUser();

      setCurrentUser(user);

      if (!savedBrands) {
        setBrands([]);
        return;
      }

      const parsedBrands = JSON.parse(savedBrands);

      if (!Array.isArray(parsedBrands)) {
        setBrands([]);
        return;
      }

      /*
        OLD DATA MIGRATION

        Older brands may not have:
        customerId
        customerEmail
        customerName

        We attach those old brands to the currently
        logged-in customer so existing demo data
        doesn't disappear.
      */

      if (user) {
        const customerId = getCustomerId(user);
        const customerEmail = getCustomerEmail(user);
        const customerName = getCustomerName(user);

        let migrationRequired = false;

        const migratedBrands = parsedBrands.map((brand) => {
          const hasCustomerId = Boolean(
            brand.customerId
          );

          const hasCustomerEmail = Boolean(
            brand.customerEmail
          );

          if (
            hasCustomerId ||
            hasCustomerEmail
          ) {
            return brand;
          }

          migrationRequired = true;

          return {
            ...brand,
            customerId,
            customerEmail,
            customerName,
            updatedAt:
              brand.updatedAt ||
              new Date().toISOString(),
          };
        });

        setBrands(migratedBrands);

        if (migrationRequired) {
          localStorage.setItem(
            BRANDS_STORAGE_KEY,
            JSON.stringify(migratedBrands)
          );

          window.dispatchEvent(
            new Event("brandsUpdated")
          );
        }
      } else {
        setBrands(parsedBrands);
      }
    } catch (error) {
      console.error(
        "Unable to read brands:",
        error
      );

      setBrands([]);
    }
  };

  /* =========================
     INITIAL LOAD + EVENTS
  ========================= */

  useEffect(() => {
    loadBrands();

    const handleBrandsUpdated = () => {
      loadBrands();
    };

    const handleStorage = (event) => {
      if (
        event.key === BRANDS_STORAGE_KEY ||
        event.key === "karodrop-user"
      ) {
        loadBrands();
      }
    };

    window.addEventListener(
      "brandsUpdated",
      handleBrandsUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "brandsUpdated",
        handleBrandsUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =========================
     SAVE BRANDS
  ========================= */

  const saveBrands = (updatedBrands) => {
    setBrands(updatedBrands);

    localStorage.setItem(
      BRANDS_STORAGE_KEY,
      JSON.stringify(updatedBrands)
    );

    window.dispatchEvent(
      new Event("brandsUpdated")
    );
  };

  /* =========================
     CUSTOMER BRANDS
  ========================= */

  const customerBrands = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return brands.filter((brand) =>
      isBrandOwnedByUser(
        brand,
        currentUser
      )
    );
  }, [brands, currentUser]);

  /* =========================
     SEARCH
  ========================= */

  const filteredBrands = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return customerBrands;
    }

    return customerBrands.filter((brand) => {
      return (
        String(brand.name || "")
          .toLowerCase()
          .includes(query) ||
        String(brand.category || "")
          .toLowerCase()
          .includes(query) ||
        String(brand.description || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [customerBrands, search]);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================
     LOGO UPLOAD
  ========================= */

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Logo image should be smaller than 2 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        logo: reader.result,
      }));

      setError("");
    };

    reader.onerror = () => {
      setError(
        "Unable to read the logo image."
      );
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     ADD FORM
  ========================= */

  const openAddForm = () => {
    setEditingBrand(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  };

  /* =========================
     EDIT FORM
  ========================= */

  const openEditForm = (brand) => {
    if (
      !isBrandOwnedByUser(
        brand,
        currentUser
      )
    ) {
      return;
    }

    setEditingBrand(brand);

    setForm({
      name: brand.name || "",
      category: brand.category || "",
      description:
        brand.description || "",
      website: brand.website || "",
      logo: brand.logo || "",
    });

    setError("");
    setShowForm(true);
  };

  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {
    setShowForm(false);
    setEditingBrand(null);
    setForm({ ...emptyForm });
    setError("");
  };

  /* =========================
     SUBMIT BRAND
  ========================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentUser) {
      setError(
        "Please login before managing your brands."
      );
      return;
    }

    const brandName = form.name.trim();

    if (!brandName) {
      setError(
        "Please enter your brand name."
      );
      return;
    }

    if (!form.category) {
      setError(
        "Please select a brand category."
      );
      return;
    }

    const customerId =
      getCustomerId(currentUser);

    const customerEmail =
      getCustomerEmail(currentUser);

    const customerName =
      getCustomerName(currentUser);

    /* =========================
       DUPLICATE CHECK
    ========================= */

    const duplicateBrand =
      customerBrands.some((brand) => {
        const sameName =
          String(brand.name || "")
            .trim()
            .toLowerCase() ===
          brandName.toLowerCase();

        if (!editingBrand) {
          return sameName;
        }

        return (
          sameName &&
          String(brand.id) !==
            String(editingBrand.id)
        );
      });

    if (duplicateBrand) {
      setError(
        "You already have a brand with this name."
      );
      return;
    }

    /* =========================
       UPDATE EXISTING BRAND
    ========================= */

    if (editingBrand) {
      const canEdit =
        isBrandOwnedByUser(
          editingBrand,
          currentUser
        );

      if (!canEdit) {
        setError(
          "You are not allowed to edit this brand."
        );
        return;
      }

      const updatedBrands = brands.map(
        (brand) => {
          if (
            String(brand.id) !==
            String(editingBrand.id)
          ) {
            return brand;
          }

          return {
            ...brand,

            name: brandName,
            category: form.category,
            description:
              form.description.trim(),
            website:
              form.website.trim(),
            logo: form.logo,

            customerId,
            customerEmail,
            customerName,

            updatedAt:
              new Date().toISOString(),
          };
        }
      );

      saveBrands(updatedBrands);

      closeForm();

      return;
    }

    /* =========================
       CREATE NEW BRAND
    ========================= */

    const brandId =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const newBrand = {
      id: brandId,

      name: brandName,
      category: form.category,
      description:
        form.description.trim(),
      website: form.website.trim(),
      logo: form.logo,

      /* CUSTOMER OWNERSHIP */
      customerId,
      customerEmail,
      customerName,

      /* DASHBOARD DATA */
      designsCount: 0,
      ordersCount: 0,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    const updatedBrands = [
      newBrand,
      ...brands,
    ];

    saveBrands(updatedBrands);

    closeForm();
  };

  /* =========================
     DELETE BRAND
  ========================= */

  const handleDelete = (brandId) => {
    const brand = customerBrands.find(
      (item) =>
        String(item.id) ===
        String(brandId)
    );

    if (!brand) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedBrands =
      brands.filter(
        (item) =>
          String(item.id) !==
          String(brandId)
      );

    saveBrands(updatedBrands);
  };

  /* =========================
     LOGIN CHECK
  ========================= */

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-[#DCE7F2] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Login Required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Please login to manage your
            brands.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center mt-6 px-5 py-3 rounded-xl bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-white border-b border-[#DCE7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <Link
                to="/account"
                className="inline-flex items-center text-sm font-medium text-[#0078ED] hover:text-[#012467] mb-3"
              >
                ← Back to Account
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                My Brands
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Add and manage all your brands
                in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
            >
              <span className="text-lg">
                +
              </span>
              Add Brand
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEARCH */}

        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E6B7A]">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your brands..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#8A98A8] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

            <div className="text-sm text-[#5E6B7A] whitespace-nowrap">
              <span className="font-semibold text-[#0B1F3A]">
                {filteredBrands.length}
              </span>{" "}
              {filteredBrands.length === 1
                ? "Brand"
                : "Brands"}
            </div>
          </div>
        </div>

        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        {showForm && (
          <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  {editingBrand
                    ? "Edit Brand"
                    : "Add New Brand"}
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  {editingBrand
                    ? "Update your brand information."
                    : "Add your brand details to Karodrop."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="w-9 h-9 rounded-lg border border-[#DCE7F2] text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0B1F3A] transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LOGO */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Brand Logo
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#EAF4FF] border border-[#DCE7F2] flex items-center justify-center">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt="Brand preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-[#0078ED]">
                          🏷️
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#DCE7F2] text-sm font-medium text-[#0B1F3A] cursor-pointer hover:border-[#0078ED] hover:text-[#0078ED] transition">
                        Upload Logo

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleLogoChange
                          }
                          className="hidden"
                        />
                      </label>

                      <p className="mt-2 text-xs text-[#8A98A8]">
                        PNG, JPG or WEBP · Maximum
                        2 MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* NAME */}

                <div>
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Brand Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Urban Threads"
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white text-[#0B1F3A] placeholder:text-[#8A98A8] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Category{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white text-[#0B1F3A] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Brand Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us a little about your brand..."
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white text-[#0B1F3A] placeholder:text-[#8A98A8] outline-none resize-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                  />
                </div>

                {/* WEBSITE */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Website
                    <span className="ml-1 text-xs font-normal text-[#8A98A8]">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yourbrand.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white text-[#0B1F3A] placeholder:text-[#8A98A8] outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                  />
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-lg border border-[#DCE7F2] text-[#0B1F3A] font-medium hover:bg-[#F5FAFF] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
                >
                  {editingBrand
                    ? "Update Brand"
                    : "Add Brand"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================
            BRAND LIST
        ========================= */}

        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBrands.map(
              (brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>
        ) : (
          <div className="bg-white border border-[#DCE7F2] rounded-2xl py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
              🏷️
            </div>

            {search ? (
              <>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  No brands found
                </h2>

                <p className="mt-2 text-sm text-[#5E6B7A]">
                  Try searching with another
                  brand name.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-5 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  No brands added yet
                </h2>

                <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-[#5E6B7A]">
                  Add your first brand to start
                  creating custom products and
                  managing your designs.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-6 px-5 py-2.5 rounded-lg bg-[#0078ED] text-white font-semibold hover:bg-[#012467] transition"
                >
                  + Add Your First Brand
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================
   BRAND CARD
========================= */

function BrandCard({
  brand,
  onEdit,
  onDelete,
}) {
  const firstLetter = String(
    brand.name || "B"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="bg-white border border-[#DCE7F2] rounded-2xl p-5 hover:border-[#0078ED] hover:shadow-sm transition">
      {/* BRAND INFO */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#EAF4FF] border border-[#DCE7F2] flex items-center justify-center shrink-0">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#0078ED]">
                {firstLetter}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-[#0B1F3A] truncate">
              {brand.name}
            </h3>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              {brand.category}
            </p>
          </div>
        </div>

        {/* STATUS */}

        <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EAF8F3] text-[#16805A] text-xs font-semibold">
          Active
        </span>
      </div>

      {/* DESCRIPTION */}

      {brand.description && (
        <p className="mt-4 text-sm leading-6 text-[#5E6B7A] line-clamp-2">
          {brand.description}
        </p>
      )}

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl bg-[#F5FAFF] border border-[#DCE7F2] p-3">
          <p className="text-xs text-[#5E6B7A]">
            Designs
          </p>

          <p className="mt-1 text-lg font-bold text-[#0B1F3A]">
            {brand.designsCount || 0}
          </p>
        </div>

        <div className="rounded-xl bg-[#F5FAFF] border border-[#DCE7F2] p-3">
          <p className="text-xs text-[#5E6B7A]">
            Orders
          </p>

          <p className="mt-1 text-lg font-bold text-[#0B1F3A]">
            {brand.ordersCount || 0}
          </p>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-[#DCE7F2]">
        {brand.website ? (
          <a
            href={brand.website}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            Visit Website ↗
          </a>
        ) : (
          <span className="text-sm text-[#8A98A8]">
            No website
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(brand)}
            className="px-3 py-2 rounded-lg border border-[#DCE7F2] text-sm font-medium text-[#0B1F3A] hover:border-[#0078ED] hover:text-[#0078ED] transition"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(brand.id)
            }
            className="px-3 py-2 rounded-lg border border-red-100 text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
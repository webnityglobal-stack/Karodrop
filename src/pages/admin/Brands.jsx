import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "karodrop-brands";
const PRODUCTS_KEY = "karodrop-products";
const USERS_KEY = "karodrop-users";

const emptyForm = {
  name: "",
  ownerId: "",
  ownerName: "",
  ownerEmail: "",
  logo: "",
  description: "",
  status: "Active",
};

/* =========================================================
   HELPERS
========================================================= */

const getBrands = () => {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const getProducts = () => {
  try {
    const data = JSON.parse(
      localStorage.getItem(PRODUCTS_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const getUsers = () => {
  try {
    const data = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveBrands = (brands) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(brands)
  );

  window.dispatchEvent(
    new Event("brandsUpdated")
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

/* =========================================================
   ICONS
========================================================= */

function PlusIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function EditIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function CloseIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function StoreIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h16" />
      <path d="M5 10v9h14v-9" />
      <path d="M3 10l2-6h14l2 6" />
      <path d="M8 19v-5h8v5" />
    </svg>
  );
}

function UserIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function PackageIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
        {icon}
      </div>

      <p className="text-sm font-medium text-[#5E6B7A]">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#7A8795]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   BRAND MODAL
========================================================= */

function BrandModal({
  open,
  form,
  setForm,
  editingBrand,
  users,
  onClose,
  onSave,
}) {
  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOwnerChange = (event) => {
    const selectedId = event.target.value;

    const selectedUser = users.find(
      (user) =>
        String(user.id || "") ===
        String(selectedId)
    );

    if (!selectedUser) {
      setForm((previous) => ({
        ...previous,
        ownerId: "",
        ownerName: "",
        ownerEmail: "",
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      ownerId: selectedUser.id || "",
      ownerName: selectedUser.name || "",
      ownerEmail: selectedUser.email || "",
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/50 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              {editingBrand
                ? "Edit Brand"
                : "Add Brand"}
            </h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              {editingBrand
                ? "Update brand information."
                : "Create a new customer brand."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5E6B7A] transition hover:bg-[#F5FAFF] hover:text-[#0B1F3A]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={onSave}
          className="space-y-5 p-6"
        >
          {/* BRAND NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Brand Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Urban Threads"
              required
              className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* OWNER */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Brand Owner
            </label>

            <select
              value={form.ownerId}
              onChange={handleOwnerChange}
              className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            >
              <option value="">
                Select customer / seller
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name || "Unnamed User"}
                  {user.email
                    ? ` — ${user.email}`
                    : ""}
                </option>
              ))}
            </select>

            {users.length === 0 && (
              <p className="mt-2 text-xs text-[#7A8795]">
                No customer or seller accounts
                found yet.
              </p>
            )}
          </div>

          {/* OWNER DETAILS */}

          {form.ownerName && (
            <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                  <UserIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    {form.ownerName}
                  </p>

                  <p className="text-xs text-[#5E6B7A]">
                    {form.ownerEmail || "No email"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LOGO */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Brand Logo URL
            </label>

            <input
              type="text"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="/images/brand-logo.png"
              className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* LOGO PREVIEW */}

          {form.logo && (
            <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Logo Preview
              </p>

              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={form.logo}
                  alt={form.name || "Brand"}
                  className="h-full max-w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a short description about the brand..."
              className="w-full resize-none rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DCE7F2] px-5 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#F5FAFF]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
            >
              {editingBrand
                ? "Update Brand"
                : "Add Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Brands() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState(
    getBrands
  );

  const [products, setProducts] = useState(
    getProducts
  );

  const [users, setUsers] = useState(
    getUsers
  );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingBrand, setEditingBrand] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  /* =======================================================
     REFRESH DATA
  ======================================================= */

  useEffect(() => {
    const refreshData = () => {
      setBrands(getBrands());
      setProducts(getProducts());
      setUsers(getUsers());
    };

    window.addEventListener(
      "storage",
      refreshData
    );

    window.addEventListener(
      "brandsUpdated",
      refreshData
    );

    window.addEventListener(
      "productsUpdated",
      refreshData
    );

    window.addEventListener(
      "userChanged",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshData
      );

      window.removeEventListener(
        "brandsUpdated",
        refreshData
      );

      window.removeEventListener(
        "productsUpdated",
        refreshData
      );

      window.removeEventListener(
        "userChanged",
        refreshData
      );
    };
  }, []);

  /* =======================================================
     PRODUCT COUNT
  ======================================================= */

  const getProductCount = (brand) => {
    const brandId = normalize(brand.id);
    const brandName = normalize(brand.name);

    return products.filter((product) => {
      const productBrandId = normalize(
        product.brandId
      );

      const productBrandName = normalize(
        product.brandName ||
          product.brand ||
          product.storeName
      );

      if (
        brandId &&
        productBrandId &&
        productBrandId === brandId
      ) {
        return true;
      }

      if (
        brandName &&
        productBrandName &&
        productBrandName === brandName
      ) {
        return true;
      }

      return false;
    }).length;
  };

  /* =======================================================
     FILTERED BRANDS
  ======================================================= */

  const filteredBrands = useMemo(() => {
    const searchValue =
      normalize(search);

    return brands.filter((brand) => {
      const name = normalize(
        brand.name
      );

      const ownerName = normalize(
        brand.ownerName
      );

      const ownerEmail = normalize(
        brand.ownerEmail
      );

      const description = normalize(
        brand.description
      );

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        ownerName.includes(searchValue) ||
        ownerEmail.includes(searchValue) ||
        description.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        String(
          brand.status || "Active"
        ) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    brands,
    search,
    statusFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = brands.length;

    const active = brands.filter(
      (brand) =>
        String(
          brand.status || "Active"
        ) === "Active"
    ).length;

    const inactive = brands.filter(
      (brand) =>
        String(
          brand.status || "Active"
        ) === "Inactive"
    ).length;

    const totalProducts = products.length;

    const ownedBrands = brands.filter(
      (brand) =>
        brand.ownerId ||
        brand.ownerEmail ||
        brand.ownerName
    ).length;

    return {
      total,
      active,
      inactive,
      totalProducts,
      ownedBrands,
    };
  }, [brands, products]);

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const openAddModal = () => {
    setEditingBrand(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (brand) => {
    setEditingBrand(brand);

    setForm({
      name: brand.name || "",
      ownerId: brand.ownerId || "",
      ownerName: brand.ownerName || "",
      ownerEmail: brand.ownerEmail || "",
      logo: brand.logo || "",
      description: brand.description || "",
      status: brand.status || "Active",
    });

    setModalOpen(true);
  };

  /* =======================================================
     SAVE BRAND
  ======================================================= */

  const handleSaveBrand = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      alert("Please enter brand name.");
      return;
    }

    const duplicate = brands.some(
      (brand) =>
        brand.id !== editingBrand?.id &&
        normalize(brand.name) ===
          normalize(name)
    );

    if (duplicate) {
      alert("This brand already exists.");
      return;
    }

    const now =
      new Date().toISOString();

    let updatedBrands;

    if (editingBrand) {
      updatedBrands = brands.map(
        (brand) => {
          if (
            brand.id !==
            editingBrand.id
          ) {
            return brand;
          }

          return {
            ...brand,
            name,
            ownerId:
              form.ownerId || "",
            ownerName:
              form.ownerName.trim(),
            ownerEmail:
              form.ownerEmail.trim(),
            logo:
              form.logo.trim(),
            description:
              form.description.trim(),
            status:
              form.status || "Active",
            updatedAt: now,
          };
        }
      );
    } else {
      const newBrand = {
        id: `brand-${Date.now()}`,
        name,
        ownerId:
          form.ownerId || "",
        ownerName:
          form.ownerName.trim(),
        ownerEmail:
          form.ownerEmail.trim(),
        logo:
          form.logo.trim(),
        description:
          form.description.trim(),
        status:
          form.status || "Active",
        createdAt: now,
        updatedAt: now,
      };

      updatedBrands = [
        newBrand,
        ...brands,
      ];
    }

    setBrands(updatedBrands);
    saveBrands(updatedBrands);

    setModalOpen(false);
    setEditingBrand(null);
    setForm(emptyForm);
  };

  /* =======================================================
     DELETE BRAND
  ======================================================= */

  const handleDeleteBrand = (brand) => {
    const productCount =
      getProductCount(brand);

    if (productCount > 0) {
      alert(
        `"${brand.name}" cannot be deleted because ${productCount} product${
          productCount === 1 ? "" : "s"
        } is linked to this brand.\n\nPlease remove or update those products first.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${brand.name}"?`
      );

    if (!confirmed) return;

    const updatedBrands =
      brands.filter(
        (item) =>
          item.id !== brand.id
      );

    setBrands(updatedBrands);
    saveBrands(updatedBrands);
  };

  /* =======================================================
     STATUS STYLE
  ======================================================= */

  const getStatusStyle = (status) => {
    if (status === "Inactive") {
      return "border border-gray-200 bg-gray-50 text-gray-600";
    }

    return "border border-emerald-100 bg-emerald-50 text-emerald-700";
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF]">

      {/* ===================================================
          WHITE HEADER
      =================================================== */}

      <div className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              {/* BACK TO DASHBOARD */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin")
                }
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
              >
                <ArrowLeftIcon />
                Back to Dashboard
              </button>

              <h1 className="text-2xl font-bold text-[#0B1F3A] sm:text-3xl">
                Brands
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage customer brands and their
                product catalogs.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#012467]"
            >
              <PlusIcon />
              Add Brand
            </button>

          </div>

        </div>
      </div>

      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <div className="px-4 py-6 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-[1500px]">

          {/* STATS */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Brands"
              value={stats.total}
              description="Brands created"
              icon={<StoreIcon />}
            />

            <StatCard
              title="Active Brands"
              value={stats.active}
              description="Currently active"
              icon={<StoreIcon />}
            />

            <StatCard
              title="Brand Owners"
              value={stats.ownedBrands}
              description="Brands with assigned owners"
              icon={<UserIcon />}
            />

            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              description="Across all product catalogs"
              icon={<PackageIcon />}
            />

          </div>

          {/* SEARCH / FILTER */}

          <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">

              <div className="relative">

                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8795]">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search brand, owner or email..."
                  className="w-full rounded-xl border border-[#DCE7F2] py-3 pl-11 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0078ED]"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>
          </div>

          {/* BRAND CATALOG */}

          <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">

            <div className="flex flex-col gap-1 border-b border-[#DCE7F2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-bold text-[#0B1F3A]">
                  Brand Catalog
                </h2>

                <p className="text-xs text-[#7A8795]">
                  Showing{" "}
                  {filteredBrands.length}{" "}
                  of {brands.length} brands
                </p>
              </div>

            </div>

            {filteredBrands.length === 0 ? (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
                  <StoreIcon size={27} />
                </div>

                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  No brands found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B7A]">
                  {brands.length === 0
                    ? "Your brand catalog is empty. Add your first brand to get started."
                    : "Try changing your search or status filter."}
                </p>

                {brands.length === 0 && (
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                  >
                    <PlusIcon />
                    Add First Brand
                  </button>
                )}

              </div>
            ) : (
              <>
                {/* DESKTOP */}

                <div className="hidden overflow-x-auto lg:block">

                  <table className="w-full min-w-[1100px]">

                    <thead className="bg-[#F5FAFF]">

                      <tr className="border-b border-[#DCE7F2] text-left">

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Brand
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Owner
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Products
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Status
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Created
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredBrands.map(
                        (brand) => {
                          const productCount =
                            getProductCount(
                              brand
                            );

                          return (
                            <tr
                              key={brand.id}
                              className="border-b border-[#EEF3F7] transition hover:bg-[#F9FCFF]"
                            >

                              {/* BRAND */}

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0078ED]">

                                    {brand.logo ? (
                                      <img
                                        src={
                                          brand.logo
                                        }
                                        alt={
                                          brand.name
                                        }
                                        className="h-full w-full object-contain"
                                        onError={(
                                          event
                                        ) => {
                                          event.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    ) : (
                                      <StoreIcon />
                                    )}

                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-semibold text-[#0B1F3A]">
                                      {brand.name}
                                    </p>

                                    <p className="mt-1 max-w-xs truncate text-xs text-[#7A8795]">
                                      {brand.description ||
                                        "No description"}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              {/* OWNER */}

                              <td className="px-5 py-4">

                                {brand.ownerName ||
                                brand.ownerEmail ? (
                                  <div className="flex items-center gap-2">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-[#0078ED]">
                                      <UserIcon
                                        size={16}
                                      />
                                    </div>

                                    <div className="min-w-0">

                                      <p className="truncate text-sm font-semibold text-[#0B1F3A]">
                                        {brand.ownerName ||
                                          "Unknown"}
                                      </p>

                                      <p className="max-w-[180px] truncate text-xs text-[#7A8795]">
                                        {brand.ownerEmail ||
                                          "No email"}
                                      </p>

                                    </div>

                                  </div>
                                ) : (
                                  <span className="text-sm text-[#9AA7B5]">
                                    Not assigned
                                  </span>
                                )}

                              </td>

                              {/* PRODUCTS */}

                              <td className="px-5 py-4">

                                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0B1F3A]">
                                  <PackageIcon
                                    size={16}
                                  />
                                  {productCount}
                                </span>

                              </td>

                              {/* STATUS */}

                              <td className="px-5 py-4">

                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    brand.status
                                  )}`}
                                >
                                  {brand.status ||
                                    "Active"}
                                </span>

                              </td>

                              {/* CREATED */}

                              <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                                {formatDate(
                                  brand.createdAt
                                )}
                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">

                                <div className="flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditModal(
                                        brand
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#0078ED] transition hover:bg-[#EAF4FF]"
                                    title="Edit brand"
                                  >
                                    <EditIcon />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteBrand(
                                        brand
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50"
                                    title="Delete brand"
                                  >
                                    <DeleteIcon />
                                  </button>

                                </div>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* MOBILE */}

                <div className="divide-y divide-[#EEF3F7] lg:hidden">

                  {filteredBrands.map(
                    (brand) => {
                      const productCount =
                        getProductCount(
                          brand
                        );

                      return (
                        <div
                          key={brand.id}
                          className="p-4"
                        >

                          <div className="flex gap-3">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0078ED]">

                              {brand.logo ? (
                                <img
                                  src={
                                    brand.logo
                                  }
                                  alt={
                                    brand.name
                                  }
                                  className="h-full w-full object-contain"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <StoreIcon />
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                  <h3 className="truncate font-bold text-[#0B1F3A]">
                                    {brand.name}
                                  </h3>

                                  <p className="mt-1 text-xs text-[#5E6B7A]">
                                    {brand.description ||
                                      "No description"}
                                  </p>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                                    brand.status
                                  )}`}
                                >
                                  {brand.status ||
                                    "Active"}
                                </span>

                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">

                                <div className="min-w-0">

                                  <p className="text-[11px] text-[#7A8795]">
                                    Owner
                                  </p>

                                  <p className="max-w-[180px] truncate text-sm font-semibold text-[#0B1F3A]">
                                    {brand.ownerName ||
                                      "Not assigned"}
                                  </p>

                                  {brand.ownerEmail && (
                                    <p className="max-w-[180px] truncate text-[11px] text-[#7A8795]">
                                      {brand.ownerEmail}
                                    </p>
                                  )}

                                </div>

                                <div>

                                  <p className="text-[11px] text-[#7A8795]">
                                    Products
                                  </p>

                                  <p className="text-sm font-bold text-[#0B1F3A]">
                                    {productCount}
                                  </p>

                                </div>

                                <div>

                                  <p className="text-[11px] text-[#7A8795]">
                                    Created
                                  </p>

                                  <p className="text-sm font-semibold text-[#0B1F3A]">
                                    {formatDate(
                                      brand.createdAt
                                    )}
                                  </p>

                                </div>

                              </div>

                            </div>

                          </div>

                          <div className="mt-4 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  brand
                                )
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DCE7F2] py-2.5 text-sm font-semibold text-[#0078ED] transition hover:bg-[#EAF4FF]"
                            >
                              <EditIcon size={16} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteBrand(
                                  brand
                                )
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <DeleteIcon size={16} />
                              Delete
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* MODAL */}

      <BrandModal
        open={modalOpen}
        form={form}
        setForm={setForm}
        editingBrand={editingBrand}
        users={users}
        onClose={() => {
          setModalOpen(false);
          setEditingBrand(null);
          setForm(emptyForm);
        }}
        onSave={handleSaveBrand}
      />
    </div>
  );
}
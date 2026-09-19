import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "karodrop-categories";
const PRODUCTS_KEY = "karodrop-products";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  status: "Active",
};

const getCategories = () => {
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

const saveCategories = (categories) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(categories)
  );

  window.dispatchEvent(new Event("categoriesUpdated"));
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   ICONS
========================================================= */

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

function FolderIcon({ size = 22 }) {
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
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z" />
    </svg>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
        <FolderIcon />
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
   CATEGORY MODAL
========================================================= */

function CategoryModal({
  open,
  form,
  setForm,
  editingCategory,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/50 p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              {editingCategory
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              {editingCategory
                ? "Update category information."
                : "Create a new product category."}
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
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Category Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. T-Shirts"
              required
              className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

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
              placeholder="Write a short category description..."
              className="w-full resize-none rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="/images/category.jpg"
              className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* IMAGE PREVIEW */}

          {form.image && (
            <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Image Preview
              </p>

              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={form.image}
                  alt={form.name || "Category"}
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              {editingCategory
                ? "Update Category"
                : "Add Category"}
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

export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState(getCategories);

  const [products, setProducts] =
    useState(getProducts);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  /* =======================================================
     REFRESH DATA
  ======================================================= */

  useEffect(() => {
    const refreshData = () => {
      setCategories(getCategories());
      setProducts(getProducts());
    };

    window.addEventListener(
      "storage",
      refreshData
    );

    window.addEventListener(
      "categoriesUpdated",
      refreshData
    );

    window.addEventListener(
      "productsUpdated",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshData
      );

      window.removeEventListener(
        "categoriesUpdated",
        refreshData
      );

      window.removeEventListener(
        "productsUpdated",
        refreshData
      );
    };
  }, []);

  /* =======================================================
     PRODUCT COUNT
  ======================================================= */

  const getProductCount = (categoryName) => {
    return products.filter(
      (product) =>
        String(product.category || "")
          .trim()
          .toLowerCase() ===
        String(categoryName || "")
          .trim()
          .toLowerCase()
    ).length;
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredCategories = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return categories.filter((category) => {
      const name = String(
        category.name || ""
      ).toLowerCase();

      const description = String(
        category.description || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        description.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        String(category.status || "Active") ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    categories,
    search,
    statusFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter(
      (category) =>
        String(category.status || "Active") ===
        "Active"
    ).length;

    const inactive = categories.filter(
      (category) =>
        String(category.status || "Active") ===
        "Inactive"
    ).length;

    const totalProducts = products.length;

    return {
      total,
      active,
      inactive,
      totalProducts,
    };
  }, [categories, products]);

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      status: category.status || "Active",
    });

    setModalOpen(true);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSaveCategory = (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      alert("Please enter category name.");
      return;
    }

    /* Prevent duplicate category names */

    const duplicate = categories.some(
      (category) =>
        category.id !== editingCategory?.id &&
        String(category.name || "")
          .trim()
          .toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      alert("This category already exists.");
      return;
    }

    let updatedCategories;

    if (editingCategory) {
      updatedCategories = categories.map(
        (category) => {
          if (
            category.id !==
            editingCategory.id
          ) {
            return category;
          }

          return {
            ...category,
            name,
            description:
              form.description.trim(),
            image: form.image.trim(),
            status: form.status,
            updatedAt:
              new Date().toISOString(),
          };
        }
      );
    } else {
      const newCategory = {
        id: `category-${Date.now()}`,
        name,
        description:
          form.description.trim(),
        image: form.image.trim(),
        status: form.status,
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      };

      updatedCategories = [
        newCategory,
        ...categories,
      ];
    }

    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDeleteCategory = (category) => {
    const productCount =
      getProductCount(category.name);

    if (productCount > 0) {
      alert(
        `"${category.name}" cannot be deleted because ${productCount} product${
          productCount === 1 ? "" : "s"
        } is using this category.\n\nPlease move or delete those products first.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    const updatedCategories =
      categories.filter(
        (item) =>
          item.id !== category.id
      );

    setCategories(updatedCategories);
    saveCategories(updatedCategories);
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

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="border-b border-[#DCE7F2] bg-white">

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              {/* BACK TO DASHBOARD */}

              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
              >
                <ArrowLeftIcon />
                Back to Dashboard
              </button>

              <h1 className="text-2xl font-bold text-[#0B1F3A] sm:text-3xl">
                Categories
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Organize and manage your product
                categories.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#012467]"
            >
              <PlusIcon />
              Add Category
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          PAGE CONTENT
      ================================================== */}

      <div className="px-4 py-6 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-[1500px]">

          {/* =================================================
              STATS
          ================================================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Categories"
              value={stats.total}
              description="Categories created"
            />

            <StatCard
              title="Active Categories"
              value={stats.active}
              description="Currently visible"
            />

            <StatCard
              title="Inactive Categories"
              value={stats.inactive}
              description="Currently disabled"
            />

            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              description="Across all categories"
            />

          </div>

          {/* =================================================
              SEARCH / FILTER
          ================================================== */}

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
                  placeholder="Search category..."
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

          {/* =================================================
              CATEGORY LIST
          ================================================== */}

          <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">

            <div className="flex flex-col gap-1 border-b border-[#DCE7F2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-bold text-[#0B1F3A]">
                  Category Catalog
                </h2>

                <p className="text-xs text-[#7A8795]">
                  Showing{" "}
                  {filteredCategories.length}{" "}
                  of {categories.length}{" "}
                  categories
                </p>
              </div>

            </div>

            {filteredCategories.length === 0 ? (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
                  <FolderIcon size={27} />
                </div>

                <h3 className="text-lg font-bold text-[#0B1F3A]">
                  No categories found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B7A]">
                  {categories.length === 0
                    ? "Your category catalog is empty. Add your first category to get started."
                    : "Try changing your search or status filter."}
                </p>

                {categories.length === 0 && (
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                  >
                    <PlusIcon />
                    Add First Category
                  </button>
                )}

              </div>
            ) : (
              <>
                {/* DESKTOP */}

                <div className="hidden overflow-x-auto lg:block">

                  <table className="w-full min-w-[900px]">

                    <thead className="bg-[#F5FAFF]">

                      <tr className="border-b border-[#DCE7F2] text-left">

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                          Description
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

                      {filteredCategories.map(
                        (category) => {
                          const productCount =
                            getProductCount(
                              category.name
                            );

                          return (
                            <tr
                              key={category.id}
                              className="border-b border-[#EEF3F7] transition hover:bg-[#F9FCFF]"
                            >

                              {/* CATEGORY */}

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0078ED]">

                                    {category.image ? (
                                      <img
                                        src={
                                          category.image
                                        }
                                        alt={
                                          category.name
                                        }
                                        className="h-full w-full object-cover"
                                        onError={(
                                          event
                                        ) => {
                                          event.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    ) : (
                                      <FolderIcon />
                                    )}

                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-semibold text-[#0B1F3A]">
                                      {category.name}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              {/* DESCRIPTION */}

                              <td className="px-5 py-4">

                                <p className="max-w-xs truncate text-sm text-[#5E6B7A]">
                                  {category.description ||
                                    "—"}
                                </p>

                              </td>

                              {/* PRODUCTS */}

                              <td className="px-5 py-4">

                                <span className="font-semibold text-[#0B1F3A]">
                                  {productCount}
                                </span>

                              </td>

                              {/* STATUS */}

                              <td className="px-5 py-4">

                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    category.status
                                  )}`}
                                >
                                  {category.status ||
                                    "Active"}
                                </span>

                              </td>

                              {/* CREATED */}

                              <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                                {formatDate(
                                  category.createdAt
                                )}
                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">

                                <div className="flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditModal(
                                        category
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#0078ED] transition hover:bg-[#EAF4FF]"
                                    title="Edit category"
                                  >
                                    <EditIcon />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteCategory(
                                        category
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50"
                                    title="Delete category"
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

                  {filteredCategories.map(
                    (category) => {
                      const productCount =
                        getProductCount(
                          category.name
                        );

                      return (
                        <div
                          key={category.id}
                          className="p-4"
                        >

                          <div className="flex gap-3">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] text-[#0078ED]">

                              {category.image ? (
                                <img
                                  src={
                                    category.image
                                  }
                                  alt={
                                    category.name
                                  }
                                  className="h-full w-full object-cover"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <FolderIcon />
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                  <h3 className="truncate font-bold text-[#0B1F3A]">
                                    {category.name}
                                  </h3>

                                  <p className="mt-1 text-xs text-[#5E6B7A]">
                                    {category.description ||
                                      "No description"}
                                  </p>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                                    category.status
                                  )}`}
                                >
                                  {category.status ||
                                    "Active"}
                                </span>

                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">

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
                                      category.createdAt
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
                                  category
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
                                handleDeleteCategory(
                                  category
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

      {/* ===================================================
          MODAL
      ================================================== */}

      <CategoryModal
        open={modalOpen}
        form={form}
        setForm={setForm}
        editingCategory={editingCategory}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
          setForm(emptyForm);
        }}
        onSave={handleSaveCategory}
      />

    </div>
  );
}
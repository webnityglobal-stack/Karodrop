import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   HELPERS
========================================================= */

const STORAGE_KEY = "karodrop-products";
const CATEGORIES_KEY = "karodrop-categories";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

const getProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const getCategories = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CATEGORIES_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("productsUpdated"));
};

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString("en-IN")}`;
};

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
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-9 1 1-4Z" />
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

function PackageIcon({ size = 20 }) {
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
      <path d="m21 8-9 5-9-5" />
      <path d="M3 8l9-5 9 5v8l-9 5-9-5Z" />
      <path d="M12 13v8" />
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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
          <PackageIcon />
        </div>
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
   PRODUCT MODAL
========================================================= */

function ProductModal({
  open,
  form,
  setForm,
  editingProduct,
  categories,
  onClose,
  onSave,
  onAddCategory,
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
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              {editingProduct
                ? "Update product information."
                : "Add a new product to your catalog."}
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
          {/* PRODUCT NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Premium Oversized T-Shirt"
              required
              className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
          </div>

          {/* CATEGORY + PRICE */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* CATEGORY */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#0B1F3A]">
                  Category *
                </label>

                <button
                  type="button"
                  onClick={onAddCategory}
                  className="text-xs font-semibold text-[#0078ED] transition hover:text-[#012467]"
                >
                  + Add Category
                </button>
              </div>

              {categories.length > 0 ? (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    No active categories available.
                  </div>

                  <button
                    type="button"
                    onClick={onAddCategory}
                    className="mt-2 text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
                  >
                    Create your first category →
                  </button>
                </div>
              )}
            </div>

            {/* PRICE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 499"
                min="0"
                required
                className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

          </div>

          {/* STOCK + IMAGE */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* STOCK */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 100"
                min="0"
                required
                className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
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
                placeholder="/images/product.jpg"
                className="w-full rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

          </div>

          {/* IMAGE PREVIEW */}

          {form.image && (
            <div className="rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                Image Preview
              </p>

              <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={form.image}
                  alt={form.name || "Product preview"}
                  className="h-full w-full object-contain"
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
              placeholder="Write a short product description..."
              rows="4"
              className="w-full resize-none rounded-xl border border-[#DCE7F2] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
            />
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
              disabled={categories.length === 0}
              className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012467] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(getProducts);
  const [allCategories, setAllCategories] =
    useState(getCategories);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");
  const [stockFilter, setStockFilter] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  /* =======================================================
     REFRESH PRODUCTS + CATEGORIES
  ======================================================= */

  useEffect(() => {
    const refreshData = () => {
      setProducts(getProducts());
      setAllCategories(getCategories());
    };

    window.addEventListener(
      "storage",
      refreshData
    );

    window.addEventListener(
      "productsUpdated",
      refreshData
    );

    window.addEventListener(
      "categoriesUpdated",
      refreshData
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshData
      );

      window.removeEventListener(
        "productsUpdated",
        refreshData
      );

      window.removeEventListener(
        "categoriesUpdated",
        refreshData
      );
    };
  }, []);

  /* =======================================================
     ACTIVE CATEGORIES
  ======================================================= */

  const activeCategories = useMemo(() => {
    return allCategories
      .filter(
        (category) =>
          String(category.status || "Active") ===
          "Active"
      )
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [allCategories]);

  /* =======================================================
     FILTER CATEGORY LIST
======================================================= */

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean)
      .map((category) =>
        String(category).trim()
      );

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [products]);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const name = String(
        product.name || ""
      ).toLowerCase();

      const category = String(
        product.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        category.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        String(product.category || "") ===
          categoryFilter;

      const stock =
        Number(product.stock) || 0;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" &&
          stock > 0) ||
        (stockFilter === "Out of Stock" &&
          stock === 0) ||
        (stockFilter === "Low Stock" &&
          stock > 0 &&
          stock <= 10);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    stockFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = products.length;

    const inStock = products.filter(
      (product) =>
        Number(product.stock) > 0
    ).length;

    const outOfStock = products.filter(
      (product) =>
        Number(product.stock) <= 0
    ).length;

    const lowStock = products.filter(
      (product) => {
        const stock =
          Number(product.stock) || 0;

        return stock > 0 && stock <= 10;
      }
    ).length;

    return {
      total,
      inStock,
      outOfStock,
      lowStock,
    };
  }, [products]);

  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      category:
        activeCategories.length === 1
          ? activeCategories[0].name
          : "",
    });

    setModalOpen(true);
  };

  /* =======================================================
     EDIT PRODUCT
  ======================================================= */

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image:
        product.image ||
        product.imageUrl ||
        "",
      description:
        product.description || "",
    });

    setModalOpen(true);
  };

  /* =======================================================
     ADD CATEGORY
  ======================================================= */

  const handleAddCategory = () => {
    setModalOpen(false);

    navigate("/admin/categories");
  };

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  const handleSaveProduct = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const category = form.category.trim();

    if (!name || !category) {
      alert(
        "Please enter product name and select a category."
      );
      return;
    }

    /* Check that selected category exists */

    const categoryExists =
      activeCategories.some(
        (item) =>
          String(item.name)
            .trim()
            .toLowerCase() ===
          category.toLowerCase()
      );

    /*
      When editing an old product whose category
      has later been made inactive, allow the
      existing category to remain unchanged.
    */

    const editingOldCategory =
      editingProduct &&
      String(
        editingProduct.category || ""
      )
        .trim()
        .toLowerCase() ===
        category.toLowerCase();

    if (
      !categoryExists &&
      !editingOldCategory
    ) {
      alert(
        "Please select a valid active category."
      );
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      alert(
        "Please enter a valid stock quantity."
      );
      return;
    }

    let updatedProducts;

    if (editingProduct) {
      updatedProducts = products.map(
        (product) => {
          if (
            product.id !==
            editingProduct.id
          ) {
            return product;
          }

          return {
            ...product,
            name,
            category,
            price,
            stock,
            image:
              form.image.trim(),
            description:
              form.description.trim(),
            updatedAt:
              new Date().toISOString(),
          };
        }
      );
    } else {
      const newProduct = {
        id: `product-${Date.now()}`,
        name,
        category,
        price,
        stock,
        image:
          form.image.trim(),
        description:
          form.description.trim(),
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      };

      updatedProducts = [
        newProduct,
        ...products,
      ];
    }

    setProducts(updatedProducts);

    saveProducts(updatedProducts);

    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const handleDeleteProduct = (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) return;

    const updatedProducts =
      products.filter(
        (item) =>
          item.id !== product.id
      );

    setProducts(updatedProducts);

    saveProducts(updatedProducts);
  };

  /* =======================================================
     STOCK STATUS
  ======================================================= */

  const getStockStatus = (
    stockValue
  ) => {
    const stock =
      Number(stockValue) || 0;

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-700 border border-red-100",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-700 border border-amber-100",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-100",
    };
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF] px-4 py-5 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2 text-sm text-[#5E6B7A]">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin")
                }
                className="transition hover:text-[#0078ED]"
              >
                Dashboard
              </button>

              <span>/</span>

              <span className="font-medium text-[#0B1F3A]">
                Products
              </span>

            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#0B1F3A] sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-[#5E6B7A]">
              Manage your Karodrop product catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#012467]"
          >
            <PlusIcon />
            Add Product
          </button>

        </div>

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Products"
            value={stats.total}
            description="Products in catalog"
          />

          <StatCard
            title="In Stock"
            value={stats.inStock}
            description="Currently available"
          />

          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            description="10 or fewer units"
          />

          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            description="Needs restocking"
          />

        </div>

        {/* SEARCH + FILTER */}

        <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_180px]">

            {/* SEARCH */}

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
                placeholder="Search product or category..."
                className="w-full rounded-xl border border-[#DCE7F2] py-3 pl-11 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />

            </div>

            {/* CATEGORY FILTER */}

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            >

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                )
              )}

            </select>

            {/* STOCK FILTER */}

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#DCE7F2] bg-white px-4 py-3 text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            >

              <option value="All">
                All Stock
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>

            </select>

          </div>
        </div>

        {/* PRODUCT TABLE */}

        <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">

          <div className="flex flex-col gap-1 border-b border-[#DCE7F2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-bold text-[#0B1F3A]">
                Product Catalog
              </h2>

              <p className="text-xs text-[#7A8795]">
                Showing{" "}
                {filteredProducts.length}{" "}
                of {products.length}{" "}
                products
              </p>

            </div>

          </div>

          {filteredProducts.length ===
          0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0078ED]">
                <PackageIcon size={26} />
              </div>

              <h3 className="text-lg font-bold text-[#0B1F3A]">
                No products found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B7A]">
                {products.length ===
                0
                  ? "Your product catalog is empty. Add your first product to get started."
                  : "Try changing your search or filters."}
              </p>

              {products.length ===
                0 && (
                <button
                  type="button"
                  onClick={
                    openAddModal
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#012467]"
                >
                  <PlusIcon />
                  Add First Product
                </button>
              )}

            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-[#F5FAFF]">

                    <tr className="border-b border-[#DCE7F2] text-left">

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Category
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Price
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Stock
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.map(
                      (product) => {
                        const status =
                          getStockStatus(
                            product.stock
                          );

                        return (
                          <tr
                            key={
                              product.id
                            }
                            className="border-b border-[#EEF3F7] transition hover:bg-[#F9FCFF]"
                          >

                            {/* PRODUCT */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF]">

                                  {product.image ||
                                  product.imageUrl ? (
                                    <img
                                      src={
                                        product.image ||
                                        product.imageUrl
                                      }
                                      alt={
                                        product.name
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
                                    <PackageIcon />
                                  )}

                                </div>

                                <div className="min-w-0">

                                  <p className="truncate font-semibold text-[#0B1F3A]">
                                    {product.name ||
                                      "Unnamed Product"}
                                  </p>

                                  {product.description && (
                                    <p className="mt-1 max-w-xs truncate text-xs text-[#7A8795]">
                                      {
                                        product.description
                                      }
                                    </p>
                                  )}

                                </div>

                              </div>

                            </td>

                            {/* CATEGORY */}

                            <td className="px-5 py-4 text-sm text-[#5E6B7A]">
                              {product.category ||
                                "—"}
                            </td>

                            {/* PRICE */}

                            <td className="px-5 py-4 text-sm font-bold text-[#0B1F3A]">
                              {formatCurrency(
                                product.price
                              )}
                            </td>

                            {/* STOCK */}

                            <td className="px-5 py-4 text-sm font-semibold text-[#0B1F3A]">
                              {Number(
                                product.stock
                              ) || 0}
                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-4">

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                              >
                                {
                                  status.label
                                }
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditModal(
                                      product
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#0078ED] transition hover:bg-[#EAF4FF]"
                                  title="Edit product"
                                >
                                  <EditIcon />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50"
                                  title="Delete product"
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

                {filteredProducts.map(
                  (product) => {
                    const status =
                      getStockStatus(
                        product.stock
                      );

                    return (
                      <div
                        key={
                          product.id
                        }
                        className="p-4"
                      >

                        <div className="flex gap-3">

                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCE7F2] bg-[#F5FAFF]">

                            {product.image ||
                            product.imageUrl ? (
                              <img
                                src={
                                  product.image ||
                                  product.imageUrl
                                }
                                alt={
                                  product.name
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
                              <PackageIcon />
                            )}

                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <h3 className="truncate font-bold text-[#0B1F3A]">
                                  {product.name ||
                                    "Unnamed Product"}
                                </h3>

                                <p className="mt-1 text-xs text-[#5E6B7A]">
                                  {product.category ||
                                    "No category"}
                                </p>

                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                              >
                                {
                                  status.label
                                }
                              </span>

                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">

                              <div>

                                <p className="text-[11px] text-[#7A8795]">
                                  Price
                                </p>

                                <p className="text-sm font-bold text-[#0B1F3A]">
                                  {formatCurrency(
                                    product.price
                                  )}
                                </p>

                              </div>

                              <div>

                                <p className="text-[11px] text-[#7A8795]">
                                  Stock
                                </p>

                                <p className="text-sm font-bold text-[#0B1F3A]">
                                  {Number(
                                    product.stock
                                  ) || 0}
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
                                product
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
                              handleDeleteProduct(
                                product
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

      {/* PRODUCT MODAL */}

      <ProductModal
        open={modalOpen}
        form={form}
        setForm={setForm}
        editingProduct={
          editingProduct
        }
        categories={
          activeCategories
        }
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
          setForm(emptyForm);
        }}
        onSave={
          handleSaveProduct
        }
        onAddCategory={
          handleAddCategory
        }
      />

    </div>
  );
}
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialDesigns = [
  {
    id: 1,
    name: "Summer Vibes",
    category: "T-Shirt",
    status: "Approved",
    products: 4,
    createdAt: "28 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    name: "Minimal Mountain",
    category: "Hoodie",
    status: "Pending",
    products: 2,
    createdAt: "26 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    name: "Stay Positive",
    category: "T-Shirt",
    status: "Approved",
    products: 6,
    createdAt: "24 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    name: "Urban Art",
    category: "Mug",
    status: "Draft",
    products: 1,
    createdAt: "22 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 5,
    name: "Abstract Waves",
    category: "Poster",
    status: "Rejected",
    products: 0,
    createdAt: "20 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 6,
    name: "Classic Typography",
    category: "T-Shirt",
    status: "Approved",
    products: 3,
    createdAt: "18 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
  },
];

const statusStyles = {
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Draft: "bg-gray-100 text-gray-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function SellerDesigns() {
  const [designs, setDesigns] = useState(initialDesigns);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(initialDesigns.map((design) => design.category)),
  ];

  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        design.name.toLowerCase().includes(searchText) ||
        design.category.toLowerCase().includes(searchText);

      const matchesStatus =
        status === "All" || design.status === status;

      const matchesCategory =
        category === "All" || design.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [designs, search, status, category]);

  const deleteDesign = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this design?"
    );

    if (!confirmed) return;

    setDesigns((prev) =>
      prev.filter((design) => design.id !== id)
    );
  };

  const duplicateDesign = (design) => {
    const newDesign = {
      ...design,
      id: Date.now(),
      name: `${design.name} Copy`,
      status: "Draft",
      products: 0,
      createdAt: "Just now",
    };

    setDesigns((prev) => [newDesign, ...prev]);
  };

  const totalDesigns = designs.length;
  const approvedDesigns = designs.filter(
    (design) => design.status === "Approved"
  ).length;
  const pendingDesigns = designs.filter(
    (design) => design.status === "Pending"
  ).length;
  const draftDesigns = designs.filter(
    (design) => design.status === "Draft"
  ).length;

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Panel
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            My Designs
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Manage your custom designs and connect them with your products.
          </p>
        </div>

        <Link
          to="/seller/designs/add"
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-[#0078ED]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#012467]
          "
        >
          + Add Design
        </Link>

      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Designs
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {totalDesigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Approved
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-600">
            {approvedDesigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Pending Review
          </p>

          <p className="mt-2 text-2xl font-semibold text-yellow-600">
            {pendingDesigns}
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Drafts
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            {draftDesigns}
          </p>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designs..."
            className="
              w-full
              rounded-xl
              border
              border-[#DCE7F2]
              bg-[#F5FAFF]
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              transition
              focus:border-[#0078ED]
              focus:bg-white
            "
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              rounded-xl
              border
              border-[#DCE7F2]
              bg-white
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              focus:border-[#0078ED]
            "
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              rounded-xl
              border
              border-[#DCE7F2]
              bg-white
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              focus:border-[#0078ED]
            "
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* =====================================================
          DESIGNS GRID
      ====================================================== */}

      {filteredDesigns.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#DCE7F2]
                bg-white
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5FAFF]">

                <img
                  src={design.image}
                  alt={design.name}
                  className="h-full w-full object-cover"
                />

                <span
                  className={`
                    absolute
                    right-3
                    top-3
                    rounded-full
                    px-3
                    py-1.5
                    text-[11px]
                    font-semibold
                    ${statusStyles[design.status]}
                  `}
                >
                  {design.status}
                </span>

              </div>

              {/* Content */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="truncate text-base font-semibold text-[#0B1F3A]">
                      {design.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      {design.category}
                    </p>

                  </div>

                  <span className="shrink-0 rounded-lg bg-[#F5FAFF] px-2.5 py-1 text-xs font-medium text-[#0078ED]">
                    {design.products} Products
                  </span>

                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#DCE7F2] pt-4">

                  <div>
                    <p className="text-[11px] text-[#5E6B7A]">
                      Created
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#0B1F3A]">
                      {design.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() => duplicateDesign(design)}
                      title="Duplicate"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#DCE7F2]
                        text-sm
                        text-[#0B1F3A]
                        transition
                        hover:border-[#0078ED]
                        hover:text-[#0078ED]
                      "
                    >
                      ⧉
                    </button>

                    <button
                      type="button"
                      title="Edit"
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#DCE7F2]
                        text-sm
                        text-[#0B1F3A]
                        transition
                        hover:border-[#0078ED]
                        hover:text-[#0078ED]
                      "
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => deleteDesign(design.id)}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-red-100
                        text-sm
                        text-red-500
                        transition
                        hover:bg-red-50
                      "
                    >
                      🗑
                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-[#DCE7F2] bg-white px-5 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5FAFF] text-2xl">
            🎨
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#0B1F3A]">
            No designs found
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-[#5E6B7A]">
            {search || status !== "All" || category !== "All"
              ? "Try changing your search or filters."
              : "You haven't added any designs yet."}
          </p>

          {search || status !== "All" || category !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("All");
                setCategory("All");
              }}
              className="mt-4 text-sm font-semibold text-[#0078ED] hover:underline"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/seller/designs/add"
              className="
                mt-5
                inline-flex
                rounded-xl
                bg-[#0078ED]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                hover:bg-[#012467]
              "
            >
              Add Your First Design
            </Link>
          )}

        </div>
      )}

      {/* =====================================================
          DESIGN INFORMATION
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-5">

        <div className="flex gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0078ED]">
            ℹ
          </div>

          <div>

            <h3 className="text-sm font-semibold text-[#0B1F3A]">
              Design Management
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
              Approved designs can be connected with your products and used
              in your store. Designs marked as pending are waiting for review.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
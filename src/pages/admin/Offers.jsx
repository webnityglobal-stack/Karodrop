import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const COUPONS_KEY = "karodrop-coupons";
const OFFERS_KEY = "karodrop-offers";

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L3.41 13.41a2 2 0 0 1 0-2.82L10.59 3H20v9.41a2 2 0 0 1-.59 1Z" />
      <circle cx="16.5" cy="7.5" r="1" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8H8.5a2.5 2.5 0 1 1 2.5-2.5V8Z" />
      <path d="M12 8h3.5a2.5 2.5 0 1 0-2.5-2.5V8Z" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function readStorage(key) {
  try {
    const data = localStorage.getItem(key);

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read ${key}`, error);
    return [];
  }
}

function saveStorage(key, data, eventName) {
  localStorage.setItem(key, JSON.stringify(data));

  window.dispatchEvent(new Event(eventName));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function formatDate(date) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return date;

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(date) {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(date);
  expiry.setHours(23, 59, 59, 999);

  return expiry < today;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Offers() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("coupons");

  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    status: "active",

    title: "",
    offerType: "product",
    target: "",
    offerDiscountType: "percentage",
    offerDiscountValue: "",
    startDate: "",
    endDate: "",
  });

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    setCoupons(readStorage(COUPONS_KEY));
    setOffers(readStorage(OFFERS_KEY));

    const handleCouponsUpdate = () => {
      setCoupons(readStorage(COUPONS_KEY));
    };

    const handleOffersUpdate = () => {
      setOffers(readStorage(OFFERS_KEY));
    };

    window.addEventListener("couponsUpdated", handleCouponsUpdate);
    window.addEventListener("offersUpdated", handleOffersUpdate);

    return () => {
      window.removeEventListener("couponsUpdated", handleCouponsUpdate);
      window.removeEventListener("offersUpdated", handleOffersUpdate);
    };
  }, []);

  /* =======================================================
     STATS
  ======================================================= */

  const couponStats = useMemo(() => {
    const total = coupons.length;

    const active = coupons.filter(
      (coupon) =>
        coupon.status === "active" && !isExpired(coupon.expiryDate)
    ).length;

    const expired = coupons.filter((coupon) =>
      isExpired(coupon.expiryDate)
    ).length;

    const totalUses = coupons.reduce(
      (sum, coupon) => sum + Number(coupon.usedCount || 0),
      0
    );

    return {
      total,
      active,
      expired,
      totalUses,
    };
  }, [coupons]);

  const offerStats = useMemo(() => {
    const total = offers.length;

    const active = offers.filter(
      (offer) => offer.status === "active"
    ).length;

    const inactive = offers.filter(
      (offer) => offer.status !== "active"
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [offers]);

  /* =======================================================
     FILTERED COUPONS
  ======================================================= */

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesSearch =
        !query ||
        coupon.code?.toLowerCase().includes(query) ||
        coupon.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        coupon.status === statusFilter ||
        (statusFilter === "expired" && isExpired(coupon.expiryDate));

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  /* =======================================================
     FILTERED OFFERS
  ======================================================= */

  const filteredOffers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch =
        !query ||
        offer.title?.toLowerCase().includes(query) ||
        offer.target?.toLowerCase().includes(query) ||
        offer.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || offer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [offers, search, statusFilter]);

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetForm() {
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      expiryDate: "",
      usageLimit: "",
      status: "active",

      title: "",
      offerType: "product",
      target: "",
      offerDiscountType: "percentage",
      offerDiscountValue: "",
      startDate: "",
      endDate: "",
    });

    setEditingId(null);
  }

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  function openEditCoupon(coupon) {
    setEditingId(coupon.id);

    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue ?? "",
      minOrderAmount: coupon.minOrderAmount ?? "",
      maxDiscount: coupon.maxDiscount ?? "",
      expiryDate: coupon.expiryDate || "",
      usageLimit: coupon.usageLimit ?? "",
      status: coupon.status || "active",

      title: "",
      offerType: "product",
      target: "",
      offerDiscountType: "percentage",
      offerDiscountValue: "",
      startDate: "",
      endDate: "",
    });

    setShowModal(true);
  }

  function openEditOffer(offer) {
    setEditingId(offer.id);

    setForm({
      code: "",
      description: offer.description || "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      expiryDate: "",
      usageLimit: "",
      status: offer.status || "active",

      title: offer.title || "",
      offerType: offer.offerType || "product",
      target: offer.target || "",
      offerDiscountType:
        offer.offerDiscountType || offer.discountType || "percentage",
      offerDiscountValue:
        offer.offerDiscountValue ?? offer.discountValue ?? "",
      startDate: offer.startDate || "",
      endDate: offer.endDate || "",
    });

    setShowModal(true);
  }

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /* =======================================================
     SAVE COUPON
  ======================================================= */

  function saveCoupon() {
    const code = form.code.trim().toUpperCase();

    if (!code) {
      alert("Please enter coupon code.");
      return;
    }

    if (!form.discountValue) {
      alert("Please enter discount value.");
      return;
    }

    if (!form.expiryDate) {
      alert("Please select expiry date.");
      return;
    }

    const duplicate = coupons.some(
      (coupon) =>
        coupon.code?.toUpperCase() === code &&
        coupon.id !== editingId
    );

    if (duplicate) {
      alert("This coupon code already exists.");
      return;
    }

    const existingCoupon = coupons.find(
      (coupon) => coupon.id === editingId
    );

    const couponData = {
      id: editingId || createId("coupon"),
      code,
      description: form.description.trim(),

      discountType: form.discountType,
      discountValue: Number(form.discountValue),

      minOrderAmount: Number(form.minOrderAmount || 0),
      maxDiscount: Number(form.maxDiscount || 0),

      expiryDate: form.expiryDate,

      usageLimit:
        form.usageLimit === ""
          ? null
          : Number(form.usageLimit),

      usedCount: existingCoupon?.usedCount || 0,

      status: form.status,

      createdAt:
        existingCoupon?.createdAt || new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    const nextCoupons = editingId
      ? coupons.map((coupon) =>
          coupon.id === editingId ? couponData : coupon
        )
      : [couponData, ...coupons];

    setCoupons(nextCoupons);

    saveStorage(
      COUPONS_KEY,
      nextCoupons,
      "couponsUpdated"
    );

    setShowModal(false);
    resetForm();
  }

  /* =======================================================
     SAVE OFFER
  ======================================================= */

  function saveOffer() {
    if (!form.title.trim()) {
      alert("Please enter offer title.");
      return;
    }

    if (!form.target.trim()) {
      alert(
        form.offerType === "product"
          ? "Please enter product name."
          : "Please enter category name."
      );
      return;
    }

    if (!form.offerDiscountValue) {
      alert("Please enter discount value.");
      return;
    }

    const existingOffer = offers.find(
      (offer) => offer.id === editingId
    );

    const offerData = {
      id: editingId || createId("offer"),

      title: form.title.trim(),

      description: form.description.trim(),

      offerType: form.offerType,

      target: form.target.trim(),

      offerDiscountType: form.offerDiscountType,

      offerDiscountValue: Number(
        form.offerDiscountValue
      ),

      startDate: form.startDate || "",

      endDate: form.endDate || "",

      status: form.status,

      createdAt:
        existingOffer?.createdAt || new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    const nextOffers = editingId
      ? offers.map((offer) =>
          offer.id === editingId ? offerData : offer
        )
      : [offerData, ...offers];

    setOffers(nextOffers);

    saveStorage(
      OFFERS_KEY,
      nextOffers,
      "offersUpdated"
    );

    setShowModal(false);
    resetForm();
  }

  /* =======================================================
     SAVE
  ======================================================= */

  function handleSubmit(event) {
    event.preventDefault();

    if (activeTab === "coupons") {
      saveCoupon();
    } else {
      saveOffer();
    }
  }

  /* =======================================================
     DELETE COUPON
  ======================================================= */

  function deleteCoupon(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    const nextCoupons = coupons.filter(
      (coupon) => coupon.id !== id
    );

    setCoupons(nextCoupons);

    saveStorage(
      COUPONS_KEY,
      nextCoupons,
      "couponsUpdated"
    );
  }

  /* =======================================================
     DELETE OFFER
  ======================================================= */

  function deleteOffer(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?"
    );

    if (!confirmed) return;

    const nextOffers = offers.filter(
      (offer) => offer.id !== id
    );

    setOffers(nextOffers);

    saveStorage(
      OFFERS_KEY,
      nextOffers,
      "offersUpdated"
    );
  }

  /* =======================================================
     TOGGLE COUPON
  ======================================================= */

  function toggleCoupon(id) {
    const nextCoupons = coupons.map((coupon) =>
      coupon.id === id
        ? {
            ...coupon,
            status:
              coupon.status === "active"
                ? "inactive"
                : "active",
            updatedAt: new Date().toISOString(),
          }
        : coupon
    );

    setCoupons(nextCoupons);

    saveStorage(
      COUPONS_KEY,
      nextCoupons,
      "couponsUpdated"
    );
  }

  /* =======================================================
     TOGGLE OFFER
  ======================================================= */

  function toggleOffer(id) {
    const nextOffers = offers.map((offer) =>
      offer.id === id
        ? {
            ...offer,
            status:
              offer.status === "active"
                ? "inactive"
                : "active",
            updatedAt: new Date().toISOString(),
          }
        : offer
    );

    setOffers(nextOffers);

    saveStorage(
      OFFERS_KEY,
      nextOffers,
      "offersUpdated"
    );
  }

  /* =======================================================
     DISCOUNT DISPLAY
  ======================================================= */

  function couponDiscount(coupon) {
    if (coupon.discountType === "fixed") {
      return `₹${Number(
        coupon.discountValue || 0
      ).toLocaleString("en-IN")}`;
    }

    return `${coupon.discountValue || 0}%`;
  }

  function offerDiscount(offer) {
    if (
      offer.offerDiscountType === "fixed" ||
      offer.discountType === "fixed"
    ) {
      return `₹${Number(
        offer.offerDiscountValue ??
          offer.discountValue ??
          0
      ).toLocaleString("en-IN")}`;
    }

    return `${
      offer.offerDiscountValue ??
      offer.discountValue ??
      0
    }%`;
  }

  /* =======================================================
     MODAL
  ======================================================= */

  const modalTitle =
    activeTab === "coupons"
      ? editingId
        ? "Edit Coupon"
        : "Add Coupon"
      : editingId
      ? "Edit Offer"
      : "Add Offer";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="border-b border-[#DCE7F2] bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#5E6B7A] transition hover:text-[#0078ED]"
          >
            <ArrowLeftIcon />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Coupons & Offers
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage discount coupons and promotional offers.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0078ED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0068D1]"
            >
              <PlusIcon />

              {activeTab === "coupons"
                ? "Add Coupon"
                : "Add Offer"}
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            TABS
        ================================================= */}

        <div className="mb-6 flex w-full max-w-xl rounded-2xl border border-[#DCE7F2] bg-white p-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("coupons");
              setSearch("");
              setStatusFilter("all");
              resetForm();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "coupons"
                ? "bg-[#0078ED] text-white shadow-sm"
                : "text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
            }`}
          >
            <TagIcon />
            Coupons
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("offers");
              setSearch("");
              setStatusFilter("all");
              resetForm();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "offers"
                ? "bg-[#0078ED] text-white shadow-sm"
                : "text-[#5E6B7A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
            }`}
          >
            <GiftIcon />
            Offers
          </button>
        </div>

        {/* =================================================
            COUPON STATS
        ================================================= */}

        {activeTab === "coupons" && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Coupons"
              value={couponStats.total}
              icon={<TagIcon />}
            />

            <StatCard
              title="Active Coupons"
              value={couponStats.active}
              icon={<GiftIcon />}
            />

            <StatCard
              title="Expired"
              value={couponStats.expired}
              icon={<TagIcon />}
            />

            <StatCard
              title="Total Uses"
              value={couponStats.totalUses}
              icon={<GiftIcon />}
            />
          </div>
        )}

        {/* =================================================
            OFFER STATS
        ================================================= */}

        {activeTab === "offers" && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Offers"
              value={offerStats.total}
              icon={<GiftIcon />}
            />

            <StatCard
              title="Active Offers"
              value={offerStats.active}
              icon={<GiftIcon />}
            />

            <StatCard
              title="Inactive Offers"
              value={offerStats.inactive}
              icon={<TagIcon />}
            />
          </div>
        )}

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-[#DCE7F2] bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A98A8]">
                <SearchIcon />
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={
                  activeTab === "coupons"
                    ? "Search coupon code or description..."
                    : "Search offer or product/category..."
                }
                className="w-full rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] py-3 pl-11 pr-4 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#8A98A8] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] px-4 py-3 text-sm text-[#0B1F3A] outline-none focus:border-[#0078ED]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>

              {activeTab === "coupons" && (
                <option value="expired">Expired</option>
              )}
            </select>
          </div>
        </div>

        {/* =================================================
            COUPONS TABLE
        ================================================= */}

        {activeTab === "coupons" && (
          <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-[#DCE7F2] bg-[#F8FBFF]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Coupon
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Discount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Minimum Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Expiry
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Usage
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCoupons.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-3 rounded-full bg-[#EAF4FF] p-4 text-[#0078ED]">
                            <TagIcon />
                          </div>

                          <h3 className="text-base font-semibold text-[#0B1F3A]">
                            No coupons found
                          </h3>

                          <p className="mt-1 text-sm text-[#5E6B7A]">
                            Add your first coupon to start offering
                            discounts.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCoupons.map((coupon) => {
                      const expired = isExpired(
                        coupon.expiryDate
                      );

                      return (
                        <tr
                          key={coupon.id}
                          className="border-b border-[#EEF3F8] last:border-b-0 hover:bg-[#F8FBFF]"
                        >
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-[#0B1F3A]">
                                {coupon.code}
                              </p>

                              <p className="mt-1 max-w-xs text-xs text-[#5E6B7A]">
                                {coupon.description ||
                                  "No description"}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-[#EAF4FF] px-3 py-1.5 text-sm font-bold text-[#0078ED]">
                              {couponDiscount(coupon)}
                            </span>

                            {coupon.maxDiscount > 0 && (
                              <p className="mt-2 text-xs text-[#5E6B7A]">
                                Max ₹
                                {Number(
                                  coupon.maxDiscount
                                ).toLocaleString("en-IN")}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#0B1F3A]">
                            ₹
                            {Number(
                              coupon.minOrderAmount || 0
                            ).toLocaleString("en-IN")}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`text-sm font-medium ${
                                expired
                                  ? "text-red-600"
                                  : "text-[#0B1F3A]"
                              }`}
                            >
                              {formatDate(
                                coupon.expiryDate
                              )}
                            </span>

                            {expired && (
                              <p className="mt-1 text-xs font-medium text-red-500">
                                Expired
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#0B1F3A]">
                              {coupon.usedCount || 0}
                              {coupon.usageLimit
                                ? ` / ${coupon.usageLimit}`
                                : " uses"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                expired
                                  ? "expired"
                                  : coupon.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCoupon(coupon.id)
                                }
                                className="rounded-lg border border-[#DCE7F2] px-3 py-2 text-xs font-semibold text-[#0078ED] transition hover:bg-[#EAF4FF]"
                              >
                                {coupon.status === "active"
                                  ? "Disable"
                                  : "Enable"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openEditCoupon(coupon)
                                }
                                className="rounded-lg border border-[#DCE7F2] p-2 text-[#5E6B7A] transition hover:border-[#0078ED] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                              >
                                <EditIcon />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteCoupon(coupon.id)
                                }
                                className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================
            OFFERS TABLE
        ================================================= */}

        {activeTab === "offers" && (
          <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-[#DCE7F2] bg-[#F8FBFF]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Offer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Target
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Discount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Duration
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#5E6B7A]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-3 rounded-full bg-[#EAF4FF] p-4 text-[#0078ED]">
                            <GiftIcon />
                          </div>

                          <h3 className="text-base font-semibold text-[#0B1F3A]">
                            No offers found
                          </h3>

                          <p className="mt-1 text-sm text-[#5E6B7A]">
                            Create your first promotional offer.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((offer) => (
                      <tr
                        key={offer.id}
                        className="border-b border-[#EEF3F8] last:border-b-0 hover:bg-[#F8FBFF]"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-bold text-[#0B1F3A]">
                              {offer.title}
                            </p>

                            <p className="mt-1 max-w-xs text-xs text-[#5E6B7A]">
                              {offer.description ||
                                "No description"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#F0F6FF] px-3 py-1.5 text-xs font-bold capitalize text-[#0078ED]">
                            {offer.offerType}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-[#0B1F3A]">
                          {offer.target}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[#EAF4FF] px-3 py-1.5 text-sm font-bold text-[#0078ED]">
                            {offerDiscount(offer)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-[#0B1F3A]">
                            {offer.startDate
                              ? formatDate(
                                  offer.startDate
                                )
                              : "Immediately"}
                          </p>

                          <p className="mt-1 text-xs text-[#5E6B7A]">
                            to{" "}
                            {offer.endDate
                              ? formatDate(
                                  offer.endDate
                                )
                              : "No end date"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={offer.status}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                toggleOffer(offer.id)
                              }
                              className="rounded-lg border border-[#DCE7F2] px-3 py-2 text-xs font-semibold text-[#0078ED] transition hover:bg-[#EAF4FF]"
                            >
                              {offer.status === "active"
                                ? "Disable"
                                : "Enable"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditOffer(offer)
                              }
                              className="rounded-lg border border-[#DCE7F2] p-2 text-[#5E6B7A] transition hover:border-[#0078ED] hover:bg-[#EAF4FF] hover:text-[#0078ED]"
                            >
                              <EditIcon />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteOffer(offer.id)
                              }
                              className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================
          MODAL
      =================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE7F2] bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  {modalTitle}
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  {activeTab === "coupons"
                    ? "Create a discount coupon for customers."
                    : "Create a promotional offer for products or categories."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg px-3 py-2 text-xl text-[#5E6B7A] hover:bg-[#F5FAFF]"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* =================================================
                  COUPON FORM
              ================================================= */}

              {activeTab === "coupons" && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Coupon Code *">
                      <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="e.g. WELCOME10"
                        className="input-style"
                        maxLength="30"
                      />
                    </FormField>

                    <FormField label="Status">
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="inactive">
                          Inactive
                        </option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Description">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Short description about this coupon..."
                      rows="3"
                      className="input-style resize-none"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Discount Type">
                      <select
                        name="discountType"
                        value={form.discountType}
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option value="percentage">
                          Percentage (%)
                        </option>

                        <option value="fixed">
                          Fixed Amount (₹)
                        </option>
                      </select>
                    </FormField>

                    <FormField label="Discount Value *">
                      <input
                        type="number"
                        min="0"
                        name="discountValue"
                        value={form.discountValue}
                        onChange={handleChange}
                        placeholder={
                          form.discountType ===
                          "percentage"
                            ? "10"
                            : "200"
                        }
                        className="input-style"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Minimum Order Amount">
                      <input
                        type="number"
                        min="0"
                        name="minOrderAmount"
                        value={form.minOrderAmount}
                        onChange={handleChange}
                        placeholder="500"
                        className="input-style"
                      />
                    </FormField>

                    <FormField label="Maximum Discount">
                      <input
                        type="number"
                        min="0"
                        name="maxDiscount"
                        value={form.maxDiscount}
                        onChange={handleChange}
                        placeholder="1000"
                        className="input-style"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Expiry Date *">
                      <input
                        type="date"
                        name="expiryDate"
                        value={form.expiryDate}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </FormField>

                    <FormField label="Usage Limit">
                      <input
                        type="number"
                        min="1"
                        name="usageLimit"
                        value={form.usageLimit}
                        onChange={handleChange}
                        placeholder="100"
                        className="input-style"
                      />
                    </FormField>
                  </div>
                </>
              )}

              {/* =================================================
                  OFFER FORM
              ================================================= */}

              {activeTab === "offers" && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Offer Title *">
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Summer Sale"
                        className="input-style"
                      />
                    </FormField>

                    <FormField label="Status">
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="inactive">
                          Inactive
                        </option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Description">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe this offer..."
                      rows="3"
                      className="input-style resize-none"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Offer Type">
                      <select
                        name="offerType"
                        value={form.offerType}
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option value="product">
                          Product Based
                        </option>

                        <option value="category">
                          Category Based
                        </option>
                      </select>
                    </FormField>

                    <FormField
                      label={
                        form.offerType === "product"
                          ? "Product Name *"
                          : "Category Name *"
                      }
                    >
                      <input
                        name="target"
                        value={form.target}
                        onChange={handleChange}
                        placeholder={
                          form.offerType === "product"
                            ? "e.g. Oversized T-Shirt"
                            : "e.g. T-Shirts"
                        }
                        className="input-style"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Discount Type">
                      <select
                        name="offerDiscountType"
                        value={
                          form.offerDiscountType
                        }
                        onChange={handleChange}
                        className="input-style"
                      >
                        <option value="percentage">
                          Percentage (%)
                        </option>

                        <option value="fixed">
                          Fixed Amount (₹)
                        </option>
                      </select>
                    </FormField>

                    <FormField label="Discount Value *">
                      <input
                        type="number"
                        min="0"
                        name="offerDiscountValue"
                        value={
                          form.offerDiscountValue
                        }
                        onChange={handleChange}
                        placeholder={
                          form.offerDiscountType ===
                          "percentage"
                            ? "20"
                            : "300"
                        }
                        className="input-style"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Start Date">
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </FormField>

                    <FormField label="End Date">
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="input-style"
                      />
                    </FormField>
                  </div>
                </>
              )}

              {/* =================================================
                  MODAL ACTIONS
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7F2] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-[#DCE7F2] px-5 py-3 text-sm font-semibold text-[#5E6B7A] transition hover:bg-[#F5FAFF]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#0078ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0068D1]"
                >
                  {editingId
                    ? "Update"
                    : activeTab === "coupons"
                    ? "Create Coupon"
                    : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          CUSTOM INPUT STYLE
      =================================================== */}

      <style>{`
        .input-style {
          width: 100%;
          border: 1px solid #DCE7F2;
          background: #F8FBFF;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #0B1F3A;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-style::placeholder {
          color: #8A98A8;
        }

        .input-style:focus {
          border-color: #0078ED;
          box-shadow: 0 0 0 3px rgba(0, 120, 237, 0.08);
          background: #FFFFFF;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-[#EAF4FF] p-3 text-[#0078ED]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const config = {
    active: {
      text: "Active",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
    },

    inactive: {
      text: "Inactive",
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
    },

    expired: {
      text: "Expired",
      className:
        "bg-red-50 text-red-600 border-red-100",
    },
  };

  const current = config[status] || config.inactive;

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.text}
    </span>
  );
}
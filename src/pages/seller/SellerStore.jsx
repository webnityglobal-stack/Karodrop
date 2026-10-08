import React, { useState } from "react";

export default function SellerStore() {
  const [store, setStore] = useState({
    storeName: "My Karodrop Store",
    storeSlug: "my-karodrop-store",
    description:
      "Welcome to my Karodrop store. Discover quality products at great prices.",
    email: "",
    phone: "",
    status: "Active",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "karodrop-seller-store",
      JSON.stringify(store)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Store
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            My Store
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Manage your store information and storefront settings.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Store Active
        </span>

      </div>

      {/* =====================================================
          STORE PREVIEW
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="h-32 bg-gradient-to-r from-[#0078ED] to-[#012467]" />

        <div className="px-5 pb-6 sm:px-7">

          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex items-end gap-4">

              {/* Store Logo */}
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#EAF4FF] text-3xl font-bold text-[#0078ED] shadow-md">
                {store.storeName.charAt(0).toUpperCase()}
              </div>

              <div className="pb-1">

                <h2 className="text-xl font-semibold text-[#0B1F3A]">
                  {store.storeName}
                </h2>

                <p className="mt-1 text-sm text-[#5E6B7A]">
                  karodrop.com/store/{store.storeSlug}
                </p>

              </div>

            </div>

            <button
              type="button"
              className="rounded-xl border border-[#DCE7F2] px-4 py-2.5 text-sm font-medium text-[#0B1F3A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
              onClick={() =>
                window.open(
                  `/store/${store.storeSlug}`,
                  "_blank"
                )
              }
            >
              View Store →
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          STORE STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Products
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            24
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Store Views
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            1,248
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Orders
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            128
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Conversion
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            4.8%
          </p>
        </div>

      </div>

      {/* =====================================================
          STORE SETTINGS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-7">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Store Information
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Update the basic information displayed on your store.
          </p>

        </div>

        <form
          onSubmit={handleSave}
          className="space-y-6 p-5 sm:p-7"
        >

          {/* Store Name */}
          <div>

            <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
              Store Name
            </label>

            <input
              type="text"
              name="storeName"
              value={store.storeName}
              onChange={handleChange}
              placeholder="Enter store name"
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

          </div>

          {/* Store URL */}
          <div>

            <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
              Store URL
            </label>

            <div className="flex flex-col sm:flex-row">

              <div className="flex items-center rounded-t-xl border border-b-0 border-[#DCE7F2] bg-[#F5FAFF] px-4 text-sm text-[#5E6B7A] sm:rounded-l-xl sm:rounded-tr-none sm:border-b">
                karodrop.com/store/
              </div>

              <input
                type="text"
                name="storeSlug"
                value={store.storeSlug}
                onChange={handleChange}
                className="
                  min-w-0
                  flex-1
                  rounded-b-xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#0B1F3A]
                  outline-none
                  focus:border-[#0078ED]
                  sm:rounded-r-xl
                  sm:rounded-bl-none
                "
              />

            </div>

          </div>

          {/* Description */}
          <div>

            <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
              Store Description
            </label>

            <textarea
              name="description"
              value={store.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell customers about your store..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#DCE7F2]
                bg-[#F5FAFF]
                px-4
                py-3
                text-sm
                text-[#0B1F3A]
                outline-none
                focus:border-[#0078ED]
                focus:bg-white
              "
            />

          </div>

          {/* Contact */}
          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
                Store Email
              </label>

              <input
                type="email"
                name="email"
                value={store.email}
                onChange={handleChange}
                placeholder="store@example.com"
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
                  focus:border-[#0078ED]
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
                Store Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={store.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
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
                  focus:border-[#0078ED]
                "
              />

            </div>

          </div>

          {/* Save */}
          <div className="flex flex-col justify-between gap-3 border-t border-[#DCE7F2] pt-5 sm:flex-row sm:items-center">

            <div>
              {saved && (
                <p className="text-sm font-medium text-green-600">
                  ✓ Store information saved successfully.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="
                rounded-xl
                bg-[#0078ED]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#012467]
              "
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

      {/* =====================================================
          STORE FEATURES
      ====================================================== */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl text-[#0078ED]">
            🛍
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Product Management
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Add, edit and manage products available in your store.
          </p>

        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl text-[#0078ED]">
            📊
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Store Analytics
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Track store views, orders, sales and customer activity.
          </p>

        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl text-[#0078ED]">
            🎨
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Store Branding
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Customize your store identity, logo and storefront appearance.
          </p>

        </div>

      </div>

    </div>
  );
}
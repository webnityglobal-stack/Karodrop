import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ADDRESSES_STORAGE_KEY = "karodrop-addresses";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  house: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
  isDefault: false,
};

function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem("karodrop-user");
    if (!savedUser) return null;
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Unable to read current user:", error);
    return null;
  }
}

function getCustomerId(user) {
  return String(
    user?.id ||
      user?.userId ||
      user?._id ||
      user?.email ||
      ""
  ).trim();
}

function getCustomerEmail(user) {
  return String(user?.email || "").trim().toLowerCase();
}

function isAddressForCurrentUser(address, user) {
  const customerId = getCustomerId(user);
  const customerEmail = getCustomerEmail(user);

  if (
    address.customerId &&
    customerId &&
    String(address.customerId) === customerId
  ) {
    return true;
  }

  if (
    address.customerEmail &&
    customerEmail &&
    String(address.customerEmail).toLowerCase() === customerEmail
  ) {
    return true;
  }

  return false;
}

export default function Addresses() {
  const [currentUser, setCurrentUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  /* =========================================================
     CURRENT USER
  ========================================================= */

  useEffect(() => {
    const loadUser = () => {
      setCurrentUser(getCurrentUser());
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  /* =========================================================
     LOAD ADDRESSES
  ========================================================= */

  useEffect(() => {
    const loadAddresses = () => {
      const savedAddresses = localStorage.getItem(
        ADDRESSES_STORAGE_KEY
      );

      if (!savedAddresses) {
        setAddresses([]);
        return;
      }

      try {
        const parsed = JSON.parse(savedAddresses);

        if (!Array.isArray(parsed)) {
          setAddresses([]);
          return;
        }

        setAddresses(parsed);
      } catch (error) {
        console.error("Unable to load addresses:", error);
        setAddresses([]);
      }
    };

    loadAddresses();

    const handleUpdate = () => loadAddresses();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("addressesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("addressesUpdated", handleUpdate);
    };
  }, []);

  /* =========================================================
     CUSTOMER ADDRESSES
  ========================================================= */

  const customerAddresses = useMemo(() => {
    if (!currentUser) return [];

    return addresses
      .filter((address) =>
        isAddressForCurrentUser(address, currentUser)
      )
      .sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;

        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
  }, [addresses, currentUser]);

  /* =========================================================
     SAVE
  ========================================================= */

  const saveAddresses = (updatedAddresses) => {
    setAddresses(updatedAddresses);

    localStorage.setItem(
      ADDRESSES_STORAGE_KEY,
      JSON.stringify(updatedAddresses)
    );

    window.dispatchEvent(new Event("addressesUpdated"));
  };

  /* =========================================================
     FORM HANDLING
  ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.house.trim()) {
      newErrors.house = "House / Flat / Building is required.";
    }

    if (!form.area.trim()) {
      newErrors.area = "Area / Street is required.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     OPEN ADD FORM
  ========================================================= */

  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      isDefault: customerAddresses.length === 0,
    });
    setErrors({});
    setShowForm(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      house: address.house || "",
      area: address.area || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      type: address.type || "Home",
      isDefault: Boolean(address.isDefault),
    });

    setErrors({});
    setShowForm(true);
  };

  /* =========================================================
     CANCEL FORM
  ========================================================= */

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentUser) return;

    if (!validateForm()) return;

    const customerId = getCustomerId(currentUser);
    const customerEmail = getCustomerEmail(currentUser);

    let updatedAddresses = [...addresses];

    if (editingId) {
      updatedAddresses = updatedAddresses.map((address) => {
        if (address.id !== editingId) {
          return address;
        }

        return {
          ...address,
          ...form,
          customerId,
          customerEmail,
          updatedAt: new Date().toISOString(),
        };
      });
    } else {
      const newAddress = {
        id: `ADDR-${Date.now()}`,
        ...form,
        customerId,
        customerEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updatedAddresses.push(newAddress);
    }

    /* =======================================================
       ONLY ONE DEFAULT ADDRESS PER CUSTOMER
    ======================================================= */

    if (form.isDefault) {
      updatedAddresses = updatedAddresses.map((address) => {
        if (!isAddressForCurrentUser(address, currentUser)) {
          return address;
        }

        if (editingId && address.id === editingId) {
          return {
            ...address,
            isDefault: true,
          };
        }

        if (!editingId && address.id === updatedAddresses[updatedAddresses.length - 1]?.id) {
          return {
            ...address,
            isDefault: true,
          };
        }

        return {
          ...address,
          isDefault: false,
        };
      });
    }

    /*
      Safety:
      Agar customer ke paas koi default address nahi hai,
      first address automatically default ho jayega.
    */

    const customerUpdatedAddresses = updatedAddresses.filter(
      (address) =>
        isAddressForCurrentUser(address, currentUser)
    );

    const hasDefault = customerUpdatedAddresses.some(
      (address) => address.isDefault
    );

    if (!hasDefault && customerUpdatedAddresses.length > 0) {
      const firstCustomerAddress =
        customerUpdatedAddresses[0];

      updatedAddresses = updatedAddresses.map((address) => {
        if (address.id === firstCustomerAddress.id) {
          return {
            ...address,
            isDefault: true,
          };
        }

        return address;
      });
    }

    saveAddresses(updatedAddresses);
    handleCancel();
  };

  /* =========================================================
     SET DEFAULT
  ========================================================= */

  const handleSetDefault = (addressId) => {
    if (!currentUser) return;

    const updatedAddresses = addresses.map((address) => {
      if (!isAddressForCurrentUser(address, currentUser)) {
        return address;
      }

      return {
        ...address,
        isDefault: address.id === addressId,
        updatedAt:
          address.id === addressId
            ? new Date().toISOString()
            : address.updatedAt,
      };
    });

    saveAddresses(updatedAddresses);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (addressId) => {
    if (!currentUser) return;

    const addressToDelete = customerAddresses.find(
      (address) => address.id === addressId
    );

    if (!addressToDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    let updatedAddresses = addresses.filter(
      (address) => address.id !== addressId
    );

    /*
      If deleted address was default,
      make another customer address default.
    */

    if (
      addressToDelete.isDefault &&
      customerAddresses.length > 1
    ) {
      const remainingCustomerAddresses =
        updatedAddresses.filter((address) =>
          isAddressForCurrentUser(address, currentUser)
        );

      if (remainingCustomerAddresses.length > 0) {
        const newDefault =
          remainingCustomerAddresses[0];

        updatedAddresses = updatedAddresses.map(
          (address) => {
            if (address.id === newDefault.id) {
              return {
                ...address,
                isDefault: true,
              };
            }

            return address;
          }
        );
      }
    }

    saveAddresses(updatedAddresses);
  };

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-[#DCE7F2] rounded-2xl p-8 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
            📍
          </div>

          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Login Required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Please login to manage your saved addresses.
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

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="bg-white border-b border-[#DCE7F2]">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <Link
            to="/account"
            className="inline-flex items-center text-sm font-medium text-[#0078ED] hover:text-[#012467] mb-3"
          >
            ← Back to Account
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                Address Book
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage your saved delivery addresses.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467] transition"
            >
              <span className="text-lg leading-none">+</span>
              Add New Address
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===================================================
            FORM
        ==================================================== */}

        {showForm && (
          <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-sm mb-8 overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-[#DCE7F2]">

              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Enter your delivery details below.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* FULL NAME */}

                <FormField
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  error={errors.fullName}
                  required
                />

                {/* PHONE */}

                <FormField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  error={errors.phone}
                  required
                  maxLength={10}
                  type="tel"
                />

                {/* HOUSE */}

                <FormField
                  label="House / Flat / Building"
                  name="house"
                  value={form.house}
                  onChange={handleChange}
                  placeholder="Flat 101, ABC Apartments"
                  error={errors.house}
                  required
                />

                {/* AREA */}

                <FormField
                  label="Area / Street"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Street / Locality / Area"
                  error={errors.area}
                  required
                />

                {/* CITY */}

                <FormField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  error={errors.city}
                  required
                />

                {/* STATE */}

                <FormField
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  error={errors.state}
                  required
                />

                {/* PINCODE */}

                <FormField
                  label="Pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  error={errors.pincode}
                  required
                  maxLength={6}
                  type="tel"
                />

                {/* ADDRESS TYPE */}

                <div>
                  <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                    Address Type
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {["Home", "Work", "Other"].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              type,
                            }))
                          }
                          className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                            form.type === type
                              ? "border-[#0078ED] bg-[#EAF4FF] text-[#0078ED]"
                              : "border-[#DCE7F2] bg-white text-[#5E6B7A] hover:border-[#0078ED]"
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}

                  </div>
                </div>

              </div>

              {/* DEFAULT */}

              <label className="mt-6 flex items-center gap-3 cursor-pointer select-none">

                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#0078ED]"
                />

                <span className="text-sm font-medium text-[#0B1F3A]">
                  Set this as my default address
                </span>

              </label>

              {/* ACTIONS */}

              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg border border-[#DCE7F2] text-sm font-semibold text-[#5E6B7A] hover:bg-[#F5FAFF] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467] transition"
                >
                  {editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ===================================================
            ADDRESS COUNT
        ==================================================== */}

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">
              Saved Addresses
            </h2>

            <p className="mt-1 text-sm text-[#8A98A8]">
              {customerAddresses.length} address
              {customerAddresses.length !== 1
                ? "es"
                : ""}
            </p>
          </div>

        </div>

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {customerAddresses.length === 0 ? (
          <div className="bg-white border border-[#DCE7F2] rounded-2xl py-16 px-6 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-2xl mb-5">
              📍
            </div>

            <h2 className="text-xl font-bold text-[#0B1F3A]">
              No saved addresses
            </h2>

            <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-[#5E6B7A]">
              Add your delivery address so you can
              complete future orders faster.
            </p>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-[#0078ED] text-white text-sm font-semibold hover:bg-[#012467] transition"
            >
              <span className="text-lg leading-none">+</span>
              Add Your First Address
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {customerAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() =>
                  handleDelete(address.id)
                }
                onSetDefault={() =>
                  handleSetDefault(address.id)
                }
              />
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = "text",
  maxLength,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#A4AFBB] ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-[#DCE7F2] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   ADDRESS CARD
========================================================= */

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition ${
        address.isDefault
          ? "border-[#0078ED] shadow-sm"
          : "border-[#DCE7F2]"
      }`}
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-lg">
            {address.type === "Work"
              ? "💼"
              : address.type === "Other"
              ? "📌"
              : "🏠"}
          </div>

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <h3 className="font-bold text-[#0B1F3A]">
                {address.fullName}
              </h3>

              <span className="px-2 py-1 rounded-full bg-[#F5FAFF] border border-[#DCE7F2] text-[10px] font-bold uppercase tracking-wide text-[#5E6B7A]">
                {address.type}
              </span>

            </div>

            {address.isDefault && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-[#0078ED]">
                ⭐ Default Address
              </span>
            )}

          </div>

        </div>

      </div>

      {/* ADDRESS */}

      <div className="mt-5 text-sm leading-6 text-[#5E6B7A]">

        <p>{address.house}</p>
        <p>{address.area}</p>
        <p>
          {address.city}, {address.state} -{" "}
          <span className="font-semibold text-[#0B1F3A]">
            {address.pincode}
          </span>
        </p>

        <p className="mt-2 font-medium text-[#0B1F3A]">
          Phone: {address.phone}
        </p>

      </div>

      {/* ACTIONS */}

      <div className="mt-5 pt-4 border-t border-[#DCE7F2] flex flex-wrap items-center gap-3">

        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="text-xs font-semibold text-[#0078ED] hover:text-[#012467] transition"
          >
            Set as Default
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-[#5E6B7A] hover:text-[#0078ED] transition"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-semibold text-[#5E6B7A] hover:text-red-600 transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}
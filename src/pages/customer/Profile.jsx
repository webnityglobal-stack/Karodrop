import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const USER_STORAGE_KEY = "karodrop-user";
const USERS_STORAGE_KEY = "karodrop-users";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getInitialsFromName = (name) => {
  return (name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export default function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = getSavedUser();

    if (!currentUser) return;

    setUser(currentUser);

    setForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      businessName: currentUser.businessName || "",
      address: currentUser.address || "",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!user) return;

    const name = form.name.trim();
    const phone = form.phone.trim();
    const businessName = form.businessName.trim();
    const address = form.address.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const updatedUser = {
      ...user,
      name,
      email: user.email || form.email.trim(),
      phone,
      businessName,
      address,
    };

    try {
      // Update currently logged-in user
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(updatedUser)
      );

      // Also update the user inside the registered users list
      try {
        const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

        if (savedUsers) {
          const users = JSON.parse(savedUsers);

          if (Array.isArray(users)) {
            const updatedUsers = users.map((item) => {
              const sameUser =
                (user._id && item._id === user._id) ||
                (user.id && item.id === user.id) ||
                (
                  user.email &&
                  item.email &&
                  item.email.toLowerCase() === user.email.toLowerCase()
                );

              return sameUser
                ? {
                  ...item,
                  name,
                  phone,
                  businessName,
                  address,
                }
                : item;
            });

            localStorage.setItem(
              USERS_STORAGE_KEY,
              JSON.stringify(updatedUsers)
            );
          }
        }
      } catch {
        // Keep profile working even if users list has invalid data.
      }

      setUser(updatedUser);

      setForm({
        name,
        email: updatedUser.email || "",
        phone,
        businessName,
        address,
      });

      setEditing(false);
      setError("");
      setSaved(true);

      // Notify other parts of the app
      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new Event("userChanged"));

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch {
      setError("Unable to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      businessName: user.businessName || "",
      address: user.address || "",
    });

    setEditing(false);
    setError("");
    setSaved(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center px-4">
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
          <h2 className="text-xl font-semibold text-[#0B1F3A]">
            Login Required
          </h2>

          <p className="text-sm text-[#5E6B7A] mt-2">
            Please login to view your profile.
          </p>

          <Link
            to="/login"
            className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#0078ED] hover:bg-[#012467] text-white text-sm font-semibold transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitialsFromName(form.name);

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#DCE7F2]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link
                to="/account"
                className="text-sm text-[#5E6B7A] hover:text-[#0078ED] transition"
              >
                ← Back to Dashboard
              </Link>

              <h1 className="text-2xl font-bold text-[#0B1F3A] mt-2">
                Profile
              </h1>

              <p className="text-sm text-[#5E6B7A] mt-1">
                Manage your personal and business information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSaved(false);
                  setError("");
                }}
                className="px-5 py-2.5 rounded-lg bg-[#0078ED] hover:bg-[#012467] text-white text-sm font-semibold transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Profile updated successfully.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Profile Overview */}
        <section className="bg-white border border-[#DCE7F2] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-[#DCE7F2]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#EAF4FF] border border-[#DCE7F2] flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-[#0078ED]">
                  {initials}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  {form.name || "User"}
                </h2>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  {form.email || "No email available"}
                </p>

                {form.businessName && (
                  <p className="text-sm text-[#0078ED] font-medium mt-2">
                    {form.businessName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A]">
                Personal Information
              </h3>

              <p className="text-sm text-[#5E6B7A] mt-1 mb-6">
                Keep your profile information up to date.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your name"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${editing
                        ? "border-[#DCE7F2] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 bg-white"
                        : "border-[#DCE7F2] bg-[#F8FBFE] text-[#5E6B7A]"
                      }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full rounded-lg border border-[#DCE7F2] px-4 py-3 text-sm outline-none bg-[#F8FBFE] text-[#5E6B7A] cursor-not-allowed"
                  />

                  <p className="text-xs text-[#7A8795] mt-2">
                    Email address cannot be changed from the profile.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your phone number"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${editing
                        ? "border-[#DCE7F2] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 bg-white"
                        : "border-[#DCE7F2] bg-[#F8FBFE] text-[#5E6B7A]"
                      }`}
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Business Name
                  </label>

                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter business name"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${editing
                        ? "border-[#DCE7F2] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 bg-white"
                        : "border-[#DCE7F2] bg-[#F8FBFE] text-[#5E6B7A]"
                      }`}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={!editing}
                    rows={4}
                    placeholder="Enter your business or basic address"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition resize-none ${editing
                        ? "border-[#DCE7F2] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 bg-white"
                        : "border-[#DCE7F2] bg-[#F8FBFE] text-[#5E6B7A]"
                      }`}
                  />

                  <p className="text-xs text-[#7A8795] mt-2">
                    For multiple shipping addresses, use the Addresses section.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="px-6 py-5 border-t border-[#DCE7F2] bg-[#F8FBFE] flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg border border-[#DCE7F2] bg-white text-[#0B1F3A] text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0078ED] hover:bg-[#012467] text-white text-sm font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Account Information */}
        <section className="mt-6 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#0B1F3A]">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            {/* Account Type */}
            <div className="rounded-xl bg-[#F8FBFE] border border-[#DCE7F2] p-4">
              <p className="text-xs font-medium text-[#5E6B7A] uppercase tracking-wide">
                Account Type
              </p>

              <p className="text-sm font-semibold text-[#0B1F3A] mt-2 capitalize">
                {user.role || "Customer"}
              </p>
            </div>

            {/* Account Email */}
            <div className="rounded-xl bg-[#F8FBFE] border border-[#DCE7F2] p-4">
              <p className="text-xs font-medium text-[#5E6B7A] uppercase tracking-wide">
                Account Email
              </p>

              <p className="text-sm font-semibold text-[#0B1F3A] mt-2 break-all">
                {user.email || "-"}
              </p>
            </div>
          </div>
        </section>

        {/* Address Management */}
        <section className="mt-6 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#0B1F3A]">
                Shipping Addresses
              </h3>

              <p className="text-sm text-[#5E6B7A] mt-1">
                Manage multiple delivery addresses for your orders.
              </p>
            </div>

            <Link
              to="/addresses"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#0078ED] text-[#0078ED] hover:bg-[#0078ED] hover:text-white text-sm font-semibold transition"
            >
              Manage Addresses
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
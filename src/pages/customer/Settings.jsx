import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const USER_STORAGE_KEY = "karodrop-user";
const SETTINGS_STORAGE_KEY = "karodrop-settings";

const DEFAULT_SETTINGS = {
  orderUpdates: true,
  designUpdates: true,
  shippingUpdates: true,
  marketingEmails: false,
};

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (savedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(savedSettings),
        });
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    /*
      Frontend-only project:
      Real password update should be handled by backend/API.
      For now we only show success and reset the form.
    */

    alert("Password change request saved. Backend integration will be added later.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem(USER_STORAGE_KEY);
    navigate("/login", { replace: true });
  };

  const Toggle = ({ enabled, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-[#0078ED]" : "bg-[#CBD5E1]"
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* Header */}
      <header className="bg-white border-b border-[#DCE7F2]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/account"
            className="text-sm text-[#5E6B7A] hover:text-[#0078ED] transition"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1F3A]">
                Settings
              </h1>

              <p className="text-sm text-[#5E6B7A] mt-1">
                Manage your account preferences and notifications.
              </p>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0078ED] hover:bg-[#012467] text-white text-sm font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success */}
        {saved && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Settings saved successfully.
          </div>
        )}

        {/* Notifications */}
        <section className="bg-white border border-[#DCE7F2] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#DCE7F2]">
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              Notifications
            </h2>

            <p className="text-sm text-[#5E6B7A] mt-1">
              Choose which updates you want to receive.
            </p>
          </div>

          <div className="divide-y divide-[#DCE7F2]">
            {/* Order Updates */}
            <div className="p-5 flex items-center justify-between gap-5">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Order Updates
                </h3>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  Get updates about your orders and order status.
                </p>
              </div>

              <Toggle
                enabled={settings.orderUpdates}
                onClick={() => handleToggle("orderUpdates")}
              />
            </div>

            {/* Design Updates */}
            <div className="p-5 flex items-center justify-between gap-5">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Design Request Updates
                </h3>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  Receive updates when your design request status changes.
                </p>
              </div>

              <Toggle
                enabled={settings.designUpdates}
                onClick={() => handleToggle("designUpdates")}
              />
            </div>

            {/* Shipping Updates */}
            <div className="p-5 flex items-center justify-between gap-5">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Shipping Updates
                </h3>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  Get notifications about shipment and delivery.
                </p>
              </div>

              <Toggle
                enabled={settings.shippingUpdates}
                onClick={() => handleToggle("shippingUpdates")}
              />
            </div>

            {/* Marketing */}
            <div className="p-5 flex items-center justify-between gap-5">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Marketing Emails
                </h3>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  Receive offers, product updates and promotional emails.
                </p>
              </div>

              <Toggle
                enabled={settings.marketingEmails}
                onClick={() => handleToggle("marketingEmails")}
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mt-6 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#DCE7F2]">
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              Security
            </h2>

            <p className="text-sm text-[#5E6B7A] mt-1">
              Manage your account security.
            </p>
          </div>

          <div className="p-6">
            {!showPasswordForm ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A]">
                    Password
                  </h3>

                  <p className="text-sm text-[#5E6B7A] mt-1">
                    Change your account password regularly for better security.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#DCE7F2] bg-white text-[#0B1F3A] text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED] transition"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full rounded-lg border border-[#DCE7F2] px-4 py-3 text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full rounded-lg border border-[#DCE7F2] px-4 py-3 text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                    />

                    <p className="text-xs text-[#5E6B7A] mt-2">
                      Password should contain at least 6 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full rounded-lg border border-[#DCE7F2] px-4 py-3 text-sm outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-5 py-2.5 rounded-lg border border-[#DCE7F2] bg-white text-[#0B1F3A] text-sm font-semibold hover:border-[#0078ED] hover:text-[#0078ED] transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#0078ED] hover:bg-[#012467] text-white text-sm font-semibold transition"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Account */}
        <section className="mt-6 bg-white border border-[#DCE7F2] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#DCE7F2]">
            <h2 className="text-lg font-semibold text-[#0B1F3A]">
              Account
            </h2>

            <p className="text-sm text-[#5E6B7A] mt-1">
              Manage your account session.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Logout
                </h3>

                <p className="text-sm text-[#5E6B7A] mt-1">
                  Sign out of your Karodrop customer account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 text-sm font-semibold hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        {/* Help */}
        <section className="mt-6 bg-[#EAF4FF] border border-[#DCE7F2] rounded-2xl p-6">
          <h3 className="text-base font-semibold text-[#0B1F3A]">
            Need Help?
          </h3>

          <p className="text-sm text-[#5E6B7A] mt-1">
            If you need help with your account, orders or design requests,
            visit our help section.
          </p>

          <Link
            to="/how-it-works"
            className="inline-flex mt-4 text-sm font-semibold text-[#0078ED] hover:text-[#012467] transition"
          >
            Visit Help & Support →
          </Link>
        </section>
      </main>
    </div>
  );
}
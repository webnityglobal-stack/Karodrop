import React, { useState } from "react";

export default function SellerSettings() {
  const [settings, setSettings] = useState({
    storeNotifications: true,
    orderNotifications: true,
    emailNotifications: true,
    marketingEmails: false,
  });

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const rows = [
    ["storeNotifications", "Store Notifications", "Get updates about your store."],
    ["orderNotifications", "Order Notifications", "Receive alerts for new orders."],
    ["emailNotifications", "Email Notifications", "Receive important account emails."],
    ["marketingEmails", "Marketing Emails", "Receive promotional updates from Karodrop."],
  ];

  return (
    <div className="space-y-6">

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
          Account
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
          Settings
        </h2>

        <p className="mt-1 text-sm text-[#5E6B7A]">
          Manage your seller account preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] p-6">
          <h3 className="text-base font-semibold text-[#0B1F3A]">
            Notifications
          </h3>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Choose which notifications you want to receive.
          </p>
        </div>

        <div className="divide-y divide-[#DCE7F2]">
          {rows.map(([key, title, description]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-5 p-6"
            >
              <div>
                <p className="text-sm font-semibold text-[#0B1F3A]">
                  {title}
                </p>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  {description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggle(key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  settings[key]
                    ? "bg-[#0078ED]"
                    : "bg-[#CBD5E1]"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    settings[key]
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">
        <h3 className="text-base font-semibold text-[#0B1F3A]">
          Seller Account
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F5FAFF] p-4">
            <p className="text-xs text-[#5E6B7A]">Account Type</p>
            <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">
              Seller
            </p>
          </div>

          <div className="rounded-xl bg-[#F5FAFF] p-4">
            <p className="text-xs text-[#5E6B7A]">Account Status</p>
            <p className="mt-1 text-sm font-semibold text-green-600">
              Active
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
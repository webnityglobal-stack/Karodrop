import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "karodrop-settings";

const DEFAULT_SETTINGS = {
  storeName: "Karodrop",
  storeEmail: "",
  storePhone: "",
  website: "",

  currency: "INR",
  timezone: "Asia/Kolkata",

  autoConfirmOrders: false,
  allowCOD: true,
  allowOnlinePayment: true,

  lowStockThreshold: 5,
  shippingCharge: 0,
  freeShippingThreshold: 999,

  orderNotifications: true,
  customerNotifications: true,
  stockNotifications: true,
  designNotifications: true,
  couponNotifications: true,

  emailNotifications: false,

  maintenanceMode: false,
};

const COLORS = {
  navy: "#012467",
  blue: "#0078ED",
  background: "#F5FAFF",
  text: "#0B1F3A",
  secondary: "#5E6B7A",
  border: "#DCE7F2",
};

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

function StoreIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 10h18" />
      <path d="M5 10v10h14V10" />
      <path d="M4 4h16l2 6H2l2-6Z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 2h12v20H6z" />
      <path d="M9 6h6" />
      <path d="M9 10h6" />
      <path d="M9 14h3" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-[#DCE7F2] bg-white shadow-sm">
      <div className="border-b border-[#DCE7F2] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0078ED]">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-bold text-[#012467]">
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-[#5E6B7A]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#DCE7F2] bg-white px-3.5 py-2.5 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#9AA7B5] focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0B1F3A]">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[#DCE7F2] bg-white px-3.5 py-2.5 text-sm text-[#0B1F3A] outline-none transition focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10"
      >
        {children}
      </select>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#DCE7F2] bg-[#F9FCFF] p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0B1F3A]">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
          checked ? "bg-[#0078ED]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Setting() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(
    DEFAULT_SETTINGS
  );

  const [saved, setSaved] = useState(false);

  /* =======================================================
     LOAD SETTINGS
  ======================================================= */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    window.dispatchEvent(new Event("settingsUpdated"));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings to default?"
    );

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );

    window.dispatchEvent(new Event("settingsUpdated"));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#012467]">
                Settings
              </h1>

              <p className="mt-1 text-sm text-[#5E6B7A]">
                Manage your Karodrop store and admin preferences.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DCE7F2] bg-white px-4 py-2.5 text-sm font-semibold text-[#5E6B7A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
              >
                <RefreshIcon />
                Reset
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0078ED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0068D2]"
              >
                <SaveIcon />
                Save Settings
              </button>
            </div>
          </div>

          {saved && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ Settings saved successfully.
            </div>
          )}
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-2">
          {/* =================================================
              STORE SETTINGS
          ================================================= */}

          <SectionCard
            icon={<StoreIcon />}
            title="Store Settings"
            description="Basic information about your Karodrop store."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Store Name"
                value={settings.storeName}
                onChange={(event) =>
                  updateSetting(
                    "storeName",
                    event.target.value
                  )
                }
                placeholder="Karodrop"
              />

              <InputField
                label="Store Email"
                type="email"
                value={settings.storeEmail}
                onChange={(event) =>
                  updateSetting(
                    "storeEmail",
                    event.target.value
                  )
                }
                placeholder="support@karodrop.com"
              />

              <InputField
                label="Store Phone"
                value={settings.storePhone}
                onChange={(event) =>
                  updateSetting(
                    "storePhone",
                    event.target.value
                  )
                }
                placeholder="+91 98765 43210"
              />

              <InputField
                label="Website"
                value={settings.website}
                onChange={(event) =>
                  updateSetting(
                    "website",
                    event.target.value
                  )
                }
                placeholder="https://karodrop.com"
              />
            </div>
          </SectionCard>

          {/* =================================================
              ORDER SETTINGS
          ================================================= */}

          <SectionCard
            icon={<OrderIcon />}
            title="Order Settings"
            description="Control how orders are handled."
          >
            <div className="space-y-3">
              <Toggle
                label="Auto-confirm orders"
                description="Automatically confirm new orders after successful payment."
                checked={settings.autoConfirmOrders}
                onChange={(value) =>
                  updateSetting(
                    "autoConfirmOrders",
                    value
                  )
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Low Stock Threshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(event) =>
                    updateSetting(
                      "lowStockThreshold",
                      Number(event.target.value)
                    )
                  }
                  placeholder="5"
                />

                <SelectField
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(event) =>
                    updateSetting(
                      "timezone",
                      event.target.value
                    )
                  }
                >
                  <option value="Asia/Kolkata">
                    India (IST)
                  </option>

                  <option value="Asia/Dubai">
                    Dubai (GST)
                  </option>

                  <option value="Asia/Singapore">
                    Singapore (SGT)
                  </option>

                  <option value="UTC">
                    UTC
                  </option>
                </SelectField>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              PAYMENT SETTINGS
          ================================================= */}

          <SectionCard
            icon={<PaymentIcon />}
            title="Payment Settings"
            description="Manage supported payment methods."
          >
            <div className="space-y-3">
              <SelectField
                label="Currency"
                value={settings.currency}
                onChange={(event) =>
                  updateSetting(
                    "currency",
                    event.target.value
                  )
                }
              >
                <option value="INR">
                  Indian Rupee (₹)
                </option>

                <option value="USD">
                  US Dollar ($)
                </option>

                <option value="EUR">
                  Euro (€)
                </option>

                <option value="GBP">
                  British Pound (£)
                </option>
              </SelectField>

              <Toggle
                label="Cash on Delivery"
                description="Allow customers to place COD orders."
                checked={settings.allowCOD}
                onChange={(value) =>
                  updateSetting(
                    "allowCOD",
                    value
                  )
                }
              />

              <Toggle
                label="Online Payments"
                description="Allow customers to pay through online payment methods."
                checked={settings.allowOnlinePayment}
                onChange={(value) =>
                  updateSetting(
                    "allowOnlinePayment",
                    value
                  )
                }
              />
            </div>
          </SectionCard>

          {/* =================================================
              SHIPPING SETTINGS
          ================================================= */}

          <SectionCard
            icon={<ShippingIcon />}
            title="Shipping Settings"
            description="Configure your store's shipping charges."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Shipping Charge"
                type="number"
                value={settings.shippingCharge}
                onChange={(event) =>
                  updateSetting(
                    "shippingCharge",
                    Number(event.target.value)
                  )
                }
                placeholder="0"
              />

              <InputField
                label="Free Shipping Above"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(event) =>
                  updateSetting(
                    "freeShippingThreshold",
                    Number(event.target.value)
                  )
                }
                placeholder="999"
              />
            </div>

            <div className="mt-4 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] p-4">
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Shipping preview
              </p>

              <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                Orders below ₹
                {Number(
                  settings.freeShippingThreshold || 0
                ).toLocaleString("en-IN")}{" "}
                will have a shipping charge of ₹
                {Number(
                  settings.shippingCharge || 0
                ).toLocaleString("en-IN")}.
              </p>
            </div>
          </SectionCard>

          {/* =================================================
              NOTIFICATION SETTINGS
          ================================================= */}

          <SectionCard
            icon={<BellIcon />}
            title="Notification Settings"
            description="Choose which activities should create notifications."
          >
            <div className="space-y-3">
              <Toggle
                label="Order notifications"
                description="Notify admin when a new order is received."
                checked={settings.orderNotifications}
                onChange={(value) =>
                  updateSetting(
                    "orderNotifications",
                    value
                  )
                }
              />

              <Toggle
                label="Customer notifications"
                description="Notify admin when a new customer registers."
                checked={settings.customerNotifications}
                onChange={(value) =>
                  updateSetting(
                    "customerNotifications",
                    value
                  )
                }
              />

              <Toggle
                label="Low stock notifications"
                description="Show alerts when product stock reaches the threshold."
                checked={settings.stockNotifications}
                onChange={(value) =>
                  updateSetting(
                    "stockNotifications",
                    value
                  )
                }
              />

              <Toggle
                label="Design request notifications"
                description="Notify admin when customers submit design requests."
                checked={settings.designNotifications}
                onChange={(value) =>
                  updateSetting(
                    "designNotifications",
                    value
                  )
                }
              />

              <Toggle
                label="Coupon notifications"
                description="Show updates related to coupons and offers."
                checked={settings.couponNotifications}
                onChange={(value) =>
                  updateSetting(
                    "couponNotifications",
                    value
                  )
                }
              />

              <Toggle
                label="Email notifications"
                description="Enable email notifications for supported activities."
                checked={settings.emailNotifications}
                onChange={(value) =>
                  updateSetting(
                    "emailNotifications",
                    value
                  )
                }
              />
            </div>
          </SectionCard>

          {/* =================================================
              SECURITY
          ================================================= */}

          <SectionCard
            icon={<SecurityIcon />}
            title="Security & System"
            description="Manage basic admin and store system preferences."
          >
            <div className="space-y-3">
              <Toggle
                label="Maintenance mode"
                description="Temporarily disable customer-facing store access while making changes."
                checked={settings.maintenanceMode}
                onChange={(value) =>
                  updateSetting(
                    "maintenanceMode",
                    value
                  )
                }
              />

              <div className="rounded-xl border border-[#DCE7F2] bg-[#F9FCFF] p-4">
                <p className="text-sm font-semibold text-[#0B1F3A]">
                  Admin panel
                </p>

                <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                  Your admin settings are stored locally in this
                  browser for the current Karodrop frontend.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs font-medium text-green-600">
                    System is active
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* =================================================
            BOTTOM SAVE
        ================================================= */}

        <div className="mt-6 flex flex-col items-stretch justify-end gap-3 rounded-2xl border border-[#DCE7F2] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <p className="mr-auto text-sm text-[#5E6B7A]">
            Remember to save your changes before leaving this page.
          </p>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DCE7F2] bg-white px-5 py-2.5 text-sm font-semibold text-[#5E6B7A] transition hover:border-[#0078ED] hover:text-[#0078ED]"
          >
            <RefreshIcon />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0078ED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0068D2]"
          >
            <SaveIcon />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    to: "/seller/dashboard",
    icon: "⌂",
  },
  {
    label: "Products",
    to: "/seller/products",
    icon: "▣",
  },
  {
    label: "Orders",
    to: "/seller/orders",
    icon: "▤",
  },
  {
    label: "My Store",
    to: "/seller/store",
    icon: "⌘",
  },
  {
    label: "Customers",
    to: "/seller/customers",
    icon: "♙",
  },
  {
    label: "Earnings",
    to: "/seller/earnings",
    icon: "₹",
  },
  {
    label: "Analytics",
    to: "/seller/analytics",
    icon: "◒",
  },
  {
    label: "Settings",
    to: "/seller/settings",
    icon: "⚙",
  },
];

export default function SellerSidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-[100]
        hidden
        h-screen
        w-[260px]
        border-r
        border-[#DCE7F2]
        bg-white
        lg:block
      "
    >

      {/* Logo */}
      <div
        className="
          flex
          h-[80px]
          items-center
          border-b
          border-[#DCE7F2]
          px-6
        "
      >
        <img
          src="/images/Karodrop-logo.png"
          alt="Karodrop"
          className="h-[48px] w-[125px] object-contain"
        />
      </div>

      {/* Seller Label */}
      <div className="px-5 pt-6 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6B7A]">
          Seller Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                mb-1
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                ${
                  isActive
                    ? "bg-[#EAF4FF] text-[#0078ED]"
                    : "text-[#0B1F3A] hover:bg-[#F5FAFF] hover:text-[#0078ED]"
                }
              `
            }
          >
            <span className="flex h-7 w-7 items-center justify-center text-base">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}

      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#DCE7F2] p-4">

        <div className="rounded-xl bg-[#F5FAFF] p-4">

          <p className="text-xs font-semibold text-[#0B1F3A]">
            Need Help?
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#5E6B7A]">
            Contact Karodrop support for seller assistance.
          </p>

          <button
            type="button"
            className="
              mt-3
              text-xs
              font-semibold
              text-[#0078ED]
              hover:text-[#012467]
            "
          >
            Contact Support →
          </button>

        </div>

      </div>

    </aside>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SellerHeader({ onMenuClick }) {
  const navigate = useNavigate();

  let seller = null;

  try {
    const savedUser = localStorage.getItem("karodrop-user");
    seller = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    seller = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("karodrop-user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        flex
        h-[80px]
        items-center
        justify-between
        border-b
        border-[#DCE7F2]
        bg-white
        px-4
        sm:px-6
        lg:px-8
      "
    >

      {/* =====================================================
          LEFT SIDE
      ====================================================== */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open seller menu"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-[#DCE7F2]
            bg-white
            text-xl
            text-[#0B1F3A]
            transition
            hover:bg-[#F5FAFF]
            hover:text-[#0078ED]
            lg:hidden
          "
        >
          ☰
        </button>

        {/* Page Heading */}
        <div>
          <p className="text-xs font-medium text-[#5E6B7A]">
            Seller Panel
          </p>

          <h1 className="text-base font-semibold text-[#0B1F3A] sm:text-lg">
            Welcome back, {seller?.name || "Seller"}
          </h1>
        </div>

      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notification */}
        <button
          type="button"
          onClick={() => navigate("/seller/notifications")}
          aria-label="Notifications"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[#DCE7F2]
            text-[#0B1F3A]
            transition
            hover:bg-[#F5FAFF]
            hover:text-[#0078ED]
          "
        >
          🔔
        </button>

        {/* Profile / Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-[#DCE7F2]
            bg-white
            px-2
            py-1.5
            transition
            hover:border-[#0078ED]
            hover:bg-[#F5FAFF]
          "
          title="Logout"
        >

          {/* Avatar */}
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[#EAF4FF]
              text-sm
              font-semibold
              text-[#0078ED]
            "
          >
            {seller?.profileImage ? (
              <img
                src={seller.profileImage}
                alt={seller?.name || "Seller"}
                className="h-full w-full object-cover"
              />
            ) : (
              (seller?.name || "S")
                .charAt(0)
                .toUpperCase()
            )}
          </span>

          {/* Name */}
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#0B1F3A] sm:block">
            {seller?.name || "Seller"}
          </span>

        </button>

      </div>

    </header>
  );
}
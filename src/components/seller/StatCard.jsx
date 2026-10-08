import React from "react";

export default function StatCard({
  title,
  value,
  change,
  icon,
  iconBg = "bg-[#EAF4FF]",
  iconColor = "text-[#0078ED]",
  changeColor = "text-green-600",
  subtitle = "this month",
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#DCE7F2]
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#5E6B7A]">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
            {value}
          </h3>
        </div>

        {/* Icon */}
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-lg
            font-semibold
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Bottom */}
      {(change || subtitle) && (
        <div className="mt-4 flex items-center gap-1.5">
          {change && (
            <span className={`text-xs font-semibold ${changeColor}`}>
              {change}
            </span>
          )}

          {subtitle && (
            <span className="text-xs text-[#5E6B7A]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
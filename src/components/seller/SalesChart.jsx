import React, { useMemo, useState } from "react";

const chartData = {
  "This Month": [
    { label: "01", value: 35 },
    { label: "03", value: 48 },
    { label: "05", value: 42 },
    { label: "07", value: 65 },
    { label: "09", value: 55 },
    { label: "11", value: 72 },
    { label: "13", value: 60 },
    { label: "15", value: 82 },
    { label: "17", value: 68 },
    { label: "19", value: 90 },
    { label: "21", value: 78 },
    { label: "23", value: 96 },
    { label: "25", value: 84 },
    { label: "27", value: 100 },
    { label: "29", value: 92 },
    { label: "30", value: 108 },
  ],

  "Last Month": [
    { label: "01", value: 28 },
    { label: "03", value: 42 },
    { label: "05", value: 36 },
    { label: "07", value: 52 },
    { label: "09", value: 48 },
    { label: "11", value: 62 },
    { label: "13", value: 58 },
    { label: "15", value: 70 },
    { label: "17", value: 65 },
    { label: "19", value: 76 },
    { label: "21", value: 72 },
    { label: "23", value: 84 },
    { label: "25", value: 78 },
    { label: "27", value: 91 },
    { label: "29", value: 86 },
    { label: "30", value: 94 },
  ],

  "This Year": [
    { label: "Jan", value: 42 },
    { label: "Feb", value: 55 },
    { label: "Mar", value: 48 },
    { label: "Apr", value: 68 },
    { label: "May", value: 61 },
    { label: "Jun", value: 76 },
    { label: "Jul", value: 70 },
    { label: "Aug", value: 88 },
    { label: "Sep", value: 82 },
    { label: "Oct", value: 96 },
    { label: "Nov", value: 91 },
    { label: "Dec", value: 108 },
  ],
};

export default function SalesChart() {
  const [period, setPeriod] = useState("This Month");

  const data = useMemo(() => {
    return chartData[period] || [];
  }, [period]);

  const maxValue = Math.max(...data.map((item) => item.value), 100);

  return (
    <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div>
          <h3 className="text-base font-semibold text-[#0B1F3A]">
            Sales Overview
          </h3>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Revenue performance for your store
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="
            w-fit
            rounded-lg
            border
            border-[#DCE7F2]
            bg-white
            px-3
            py-2
            text-xs
            font-medium
            text-[#0B1F3A]
            outline-none
            transition
            focus:border-[#0078ED]
          "
        >
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="This Year">This Year</option>
        </select>

      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">

        <div>
          <p className="text-xs text-[#5E6B7A]">
            Total Revenue
          </p>

          <p className="mt-1 text-2xl font-bold text-[#0B1F3A]">
            ₹48,250
          </p>
        </div>

        <div>
          <p className="text-xs text-[#5E6B7A]">
            Growth
          </p>

          <p className="mt-1 text-sm font-semibold text-green-600">
            +12.5%
          </p>
        </div>

      </div>

      {/* Chart */}
      <div className="mt-8">

        <div className="relative h-[260px] w-full">

          {/* Grid */}
          <div className="absolute inset-0 flex flex-col justify-between">

            {[100, 75, 50, 25, 0].map((value) => (
              <div
                key={value}
                className="flex items-center gap-3"
              >
                <span className="w-8 text-right text-[10px] text-[#94A3B8]">
                  {value}
                </span>

                <div className="h-px flex-1 bg-[#EEF3F8]" />
              </div>
            ))}

          </div>

          {/* Bars */}
          <div className="absolute inset-y-0 left-11 right-0 flex items-end gap-1.5 sm:gap-2">

            {data.map((item, index) => {
              const height = `${(item.value / maxValue) * 100}%`;

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="group relative flex h-full flex-1 items-end"
                >

                  {/* Tooltip */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-[calc(100%+8px)]
                      left-1/2
                      z-10
                      -translate-x-1/2
                      whitespace-nowrap
                      rounded-lg
                      bg-[#0B1F3A]
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-medium
                      text-white
                      opacity-0
                      shadow-lg
                      transition
                      group-hover:opacity-100
                    "
                  >
                    ₹{item.value * 450}
                  </div>

                  {/* Bar */}
                  <div
                    className="
                      w-full
                      rounded-t-md
                      bg-[#0078ED]
                      transition-all
                      duration-300
                      group-hover:bg-[#012467]
                    "
                    style={{
                      height,
                      minHeight: "8px",
                    }}
                  />

                </div>
              );
            })}

          </div>

        </div>

        {/* Labels */}
        <div className="ml-11 mt-3 flex justify-between">

          {data.map((item, index) => (
            <span
              key={`${item.label}-label-${index}`}
              className="
                flex-1
                text-center
                text-[9px]
                text-[#94A3B8]
                sm:text-[10px]
              "
            >
              {item.label}
            </span>
          ))}

        </div>

      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col gap-2 border-t border-[#EEF3F8] pt-4 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-xs text-[#5E6B7A]">
          Sales data is updated based on your latest orders.
        </p>

        <span className="inline-flex w-fit items-center gap-2 text-xs font-medium text-[#0078ED]">
          <span className="h-2 w-2 rounded-full bg-[#0078ED]" />
          Revenue
        </span>

      </div>

    </div>
  );
}
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function SellerEarnings() {
  /*
   * Demo earnings data
   * Baad me backend/API se replace kar sakte ho.
   */
  const stats = {
    totalSales: 128450,
    availableBalance: 82450,
    pendingBalance: 18600,
    withdrawnAmount: 27400,
  };

  const transactions = [
    {
      id: "TXN-1001",
      orderId: "ORD-5001",
      date: "28 Sep 2026",
      type: "Sale",
      amount: 2499,
      status: "Completed",
    },
    {
      id: "TXN-1002",
      orderId: "ORD-4997",
      date: "27 Sep 2026",
      type: "Sale",
      amount: 1799,
      status: "Completed",
    },
    {
      id: "TXN-1003",
      orderId: "ORD-4992",
      date: "26 Sep 2026",
      type: "Withdrawal",
      amount: -5000,
      status: "Completed",
    },
    {
      id: "TXN-1004",
      orderId: "ORD-4988",
      date: "25 Sep 2026",
      type: "Sale",
      amount: 3299,
      status: "Pending",
    },
    {
      id: "TXN-1005",
      orderId: "ORD-4981",
      date: "24 Sep 2026",
      type: "Sale",
      amount: 2199,
      status: "Completed",
    },
  ];

  const monthlyData = [
    { month: "Apr", amount: 18500 },
    { month: "May", amount: 24200 },
    { month: "Jun", amount: 31800 },
    { month: "Jul", amount: 28600 },
    { month: "Aug", amount: 39400 },
    { month: "Sep", amount: 46200 },
  ];

  const maxAmount = Math.max(
    ...monthlyData.map((item) => item.amount)
  );

  const totalMonthlySales = useMemo(
    () =>
      monthlyData.reduce(
        (total, item) => total + item.amount,
        0
      ),
    [monthlyData]
  );

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Finance
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Earnings
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Track your sales, balance and seller payouts.
          </p>
        </div>

        <button
          type="button"
          className="
            rounded-xl
            bg-[#0078ED]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#012467]
          "
        >
          Withdraw Funds
        </button>

      </div>


      {/* =====================================================
          EARNINGS CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Sales */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_8px_30px_rgba(1,36,103,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Total Sales
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(stats.totalSales)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg text-[#0078ED]">
              ₹
            </span>

          </div>

          <p className="mt-4 text-xs font-medium text-green-600">
            +12.8% from last month
          </p>

        </div>


        {/* Available Balance */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_8px_30px_rgba(1,36,103,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Available Balance
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(stats.availableBalance)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
              ✓
            </span>

          </div>

          <p className="mt-4 text-xs text-[#5E6B7A]">
            Available for withdrawal
          </p>

        </div>


        {/* Pending */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_8px_30px_rgba(1,36,103,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Pending Balance
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(stats.pendingBalance)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-500">
              ◷
            </span>

          </div>

          <p className="mt-4 text-xs text-[#5E6B7A]">
            Awaiting order completion
          </p>

        </div>


        {/* Withdrawn */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_8px_30px_rgba(1,36,103,0.04)]">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Total Withdrawn
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
                {formatCurrency(stats.withdrawnAmount)}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
              ↑
            </span>

          </div>

          <p className="mt-4 text-xs text-[#5E6B7A]">
            Successfully withdrawn
          </p>

        </div>

      </div>


      {/* =====================================================
          CHART + PAYOUT CARD
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">

        {/* Sales Chart */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 sm:p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-base font-semibold text-[#0B1F3A]">
                Sales Overview
              </h2>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Monthly sales performance
              </p>
            </div>

            <span className="text-sm font-semibold text-[#0078ED]">
              ₹{totalMonthlySales.toLocaleString("en-IN")}
            </span>

          </div>


          {/* Chart */}

          <div className="mt-8 flex h-[260px] items-end gap-3 overflow-x-auto pb-2 sm:gap-5">

            {monthlyData.map((item) => {

              const height =
                (item.amount / maxAmount) * 190;

              return (
                <div
                  key={item.month}
                  className="flex min-w-[42px] flex-1 flex-col items-center justify-end gap-3"
                >

                  <span className="text-[10px] font-medium text-[#5E6B7A]">
                    ₹{Math.round(item.amount / 1000)}k
                  </span>

                  <div
                    className="
                      w-full
                      max-w-[46px]
                      rounded-t-xl
                      bg-[#0078ED]
                      transition
                      hover:bg-[#012467]
                    "
                    style={{
                      height: `${height}px`,
                    }}
                  />

                  <span className="text-xs font-medium text-[#5E6B7A]">
                    {item.month}
                  </span>

                </div>
              );
            })}

          </div>

        </div>


        {/* Payout Card */}

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Payout Information
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Your seller payout details
          </p>


          <div className="mt-6 space-y-4">

            <div className="rounded-xl bg-[#F5FAFF] p-4">

              <p className="text-xs text-[#5E6B7A]">
                Next Payout
              </p>

              <p className="mt-1 text-lg font-semibold text-[#0B1F3A]">
                ₹18,600
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Expected on 5 Oct 2026
              </p>

            </div>


            <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">

              <span className="text-sm text-[#5E6B7A]">
                Minimum payout
              </span>

              <span className="text-sm font-semibold text-[#0B1F3A]">
                ₹500
              </span>

            </div>


            <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">

              <span className="text-sm text-[#5E6B7A]">
                Payout frequency
              </span>

              <span className="text-sm font-semibold text-[#0B1F3A]">
                Weekly
              </span>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-sm text-[#5E6B7A]">
                Account status
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Active
              </span>

            </div>

          </div>


          <Link
            to="/seller/settings"
            className="
              mt-6
              block
              w-full
              rounded-xl
              border
              border-[#DCE7F2]
              px-4
              py-3
              text-center
              text-sm
              font-semibold
              text-[#0B1F3A]
              transition
              hover:border-[#0078ED]
              hover:text-[#0078ED]
            "
          >
            Manage Payout Settings
          </Link>

        </div>

      </div>


      {/* =====================================================
          TRANSACTIONS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="flex flex-col gap-3 border-b border-[#DCE7F2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <div>
            <h2 className="text-base font-semibold text-[#0B1F3A]">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-[#5E6B7A]">
              Latest sales and payout activity
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-[#0078ED] hover:text-[#012467]"
          >
            Download Statement
          </button>

        </div>


        {/* Desktop Table */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-[#DCE7F2] bg-[#F5FAFF]">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Transaction
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Type
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#5E6B7A]">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {transactions.map((transaction) => (

                <tr
                  key={transaction.id}
                  className="border-b border-[#DCE7F2] last:border-0 hover:bg-[#F5FAFF]"
                >

                  <td className="px-6 py-4">

                    <p className="text-sm font-medium text-[#0B1F3A]">
                      {transaction.id}
                    </p>

                  </td>

                  <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                    {transaction.orderId}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                    {transaction.date}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#5E6B7A]">
                    {transaction.type}
                  </td>

                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      transaction.amount < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.amount < 0 ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.status === "Completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {transaction.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* Mobile Transactions */}

        <div className="divide-y divide-[#DCE7F2] md:hidden">

          {transactions.map((transaction) => (

            <div
              key={transaction.id}
              className="p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    {transaction.id}
                  </p>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    {transaction.orderId}
                  </p>

                  <p className="mt-1 text-xs text-[#5E6B7A]">
                    {transaction.date}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    transaction.status === "Completed"
                      ? "bg-green-50 text-green-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {transaction.status}
                </span>

              </div>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs text-[#5E6B7A]">
                  {transaction.type}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    transaction.amount < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {transaction.amount < 0 ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =====================================================
          NOTE
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-[#F5FAFF] p-5">

        <p className="text-sm font-semibold text-[#0B1F3A]">
          Earnings calculation
        </p>

        <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
          Your available earnings are calculated after successful
          order completion, applicable platform charges and other
          deductions. Actual payout values will be connected to
          your seller account and backend.
        </p>

      </div>

    </div>
  );
}
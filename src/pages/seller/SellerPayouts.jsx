import React, { useMemo, useState } from "react";

const demoPayouts = [
  {
    id: "PAY-1006",
    date: "28 Sep 2026",
    amount: 12450,
    method: "Bank Transfer",
    reference: "UTR784521963",
    status: "Completed",
  },
  {
    id: "PAY-1005",
    date: "21 Sep 2026",
    amount: 8750,
    method: "Bank Transfer",
    reference: "UTR784518742",
    status: "Completed",
  },
  {
    id: "PAY-1004",
    date: "14 Sep 2026",
    amount: 6200,
    method: "Bank Transfer",
    reference: "UTR784513428",
    status: "Processing",
  },
  {
    id: "PAY-1003",
    date: "07 Sep 2026",
    amount: 9450,
    method: "Bank Transfer",
    reference: "UTR784507921",
    status: "Completed",
  },
  {
    id: "PAY-1002",
    date: "31 Aug 2026",
    amount: 7300,
    method: "Bank Transfer",
    reference: "UTR784498621",
    status: "Completed",
  },
  {
    id: "PAY-1001",
    date: "24 Aug 2026",
    amount: 5100,
    method: "Bank Transfer",
    reference: "UTR784491236",
    status: "Failed",
  },
];

const statusStyles = {
  Completed: "bg-green-50 text-green-700",
  Processing: "bg-yellow-50 text-yellow-700",
  Pending: "bg-orange-50 text-orange-700",
  Failed: "bg-red-50 text-red-700",
};

export default function SellerPayouts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showRequest, setShowRequest] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const availableBalance = 18650;
  const pendingBalance = 6200;
  const totalEarnings = 84250;
  const totalPaid = 65400;

  const filteredPayouts = useMemo(() => {
    return demoPayouts.filter((payout) => {
      const query = search.toLowerCase();

      const matchesSearch =
        payout.id.toLowerCase().includes(query) ||
        payout.reference.toLowerCase().includes(query) ||
        payout.method.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || payout.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const handleRequestPayout = (e) => {
    e.preventDefault();

    const amount = Number(requestAmount);

    if (!amount || amount <= 0) {
      setRequestMessage("Please enter a valid payout amount.");
      return;
    }

    if (amount > availableBalance) {
      setRequestMessage(
        "Requested amount cannot be greater than your available balance."
      );
      return;
    }

    setRequestMessage(
      `Payout request of ₹${amount.toLocaleString(
        "en-IN"
      )} submitted successfully.`
    );

    setRequestAmount("");

    setTimeout(() => {
      setShowRequest(false);
      setRequestMessage("");
    }, 2500);
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
            Seller Finance
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
            Payouts
          </h1>

          <p className="mt-1 text-sm text-[#5E6B7A]">
            Track your earnings, payout balance and payment history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRequest(true)}
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
          Request Payout
        </button>

      </div>

      {/* =====================================================
          BALANCE CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Available Balance */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Available Balance
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                ₹{availableBalance.toLocaleString("en-IN")}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg font-bold text-[#0078ED]">
              ₹
            </span>

          </div>

          <p className="mt-4 text-xs text-[#5E6B7A]">
            Available for withdrawal
          </p>

        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Pending Payout
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                ₹{pendingBalance.toLocaleString("en-IN")}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg">
              ⏳
            </span>

          </div>

          <p className="mt-4 text-xs text-orange-600">
            Currently processing
          </p>

        </div>

        {/* Total Earnings */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Total Earnings
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                ₹{totalEarnings.toLocaleString("en-IN")}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg">
              ↗
            </span>

          </div>

          <p className="mt-4 text-xs text-green-600">
            Lifetime earnings
          </p>

        </div>

        {/* Total Paid */}
        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-[#5E6B7A]">
                Total Paid
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                ₹{totalPaid.toLocaleString("en-IN")}
              </h2>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg">
              ✓
            </span>

          </div>

          <p className="mt-4 text-xs text-green-600">
            Successfully transferred
          </p>

        </div>

      </div>

      {/* =====================================================
          PAYMENT ACCOUNT
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Payout Account
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Bank account used for seller payouts.
          </p>

        </div>

        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4FF] text-xl text-[#0078ED]">
              🏦
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0B1F3A]">
                HDFC Bank
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                Account ending in •••• 4521
              </p>

              <p className="mt-1 text-xs text-[#5E6B7A]">
                IFSC: HDFC0001234
              </p>
            </div>

          </div>

          <span className="inline-flex w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            Verified
          </span>

        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payout ID, reference or method..."
            className="
              flex-1
              rounded-xl
              border
              border-[#DCE7F2]
              bg-[#F5FAFF]
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              focus:border-[#0078ED]
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              rounded-xl
              border
              border-[#DCE7F2]
              bg-white
              px-4
              py-3
              text-sm
              text-[#0B1F3A]
              outline-none
              focus:border-[#0078ED]
            "
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

        </div>

      </div>

      {/* =====================================================
          PAYOUT HISTORY
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Payout History
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            View your previous payout transactions.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-[#F5FAFF]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Payout
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Method
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Reference
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#DCE7F2]">

              {filteredPayouts.map((payout) => (

                <tr
                  key={payout.id}
                  className="transition hover:bg-[#F9FCFF]"
                >

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#0078ED]">
                      #{payout.id}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-[#5E6B7A]">
                      {payout.date}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{payout.amount.toLocaleString("en-IN")}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-[#0B1F3A]">
                      {payout.method}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-[#5E6B7A]">
                      {payout.reference}
                    </p>
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${statusStyles[payout.status]}
                      `}
                    >
                      {payout.status}
                    </span>

                  </td>

                </tr>

              ))}

              {filteredPayouts.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >

                    <p className="text-sm font-medium text-[#0B1F3A]">
                      No payouts found
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Try changing your search or status filter.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          PAYOUT INFORMATION
      ====================================================== */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg">
            💰
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Minimum Payout
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Minimum withdrawal amount is ₹500.
          </p>

        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg">
            ⏱
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Processing Time
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Payouts are generally processed within 2–5 business days.
          </p>

        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-6">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4FF] text-lg">
            🛡
          </div>

          <h3 className="font-semibold text-[#0B1F3A]">
            Secure Payments
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#5E6B7A]">
            Your payout information is securely handled by Karodrop.
          </p>

        </div>

      </div>

      {/* =====================================================
          REQUEST PAYOUT MODAL
      ====================================================== */}

      {showRequest && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-[#DCE7F2] px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-[#0B1F3A]">
                  Request Payout
                </h2>

                <p className="mt-1 text-xs text-[#5E6B7A]">
                  Available balance: ₹
                  {availableBalance.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRequest(false);
                  setRequestMessage("");
                }}
                className="text-xl text-[#5E6B7A] hover:text-[#0B1F3A]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleRequestPayout}
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-[#0B1F3A]">
                  Payout Amount
                </label>

                <div className="flex">

                  <span className="flex items-center rounded-l-xl border border-r-0 border-[#DCE7F2] bg-[#F5FAFF] px-4 text-sm text-[#5E6B7A]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="500"
                    max={availableBalance}
                    value={requestAmount}
                    onChange={(e) => {
                      setRequestAmount(e.target.value);
                      setRequestMessage("");
                    }}
                    placeholder="Enter amount"
                    className="
                      min-w-0
                      flex-1
                      rounded-r-xl
                      border
                      border-[#DCE7F2]
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#0078ED]
                    "
                  />

                </div>

                <p className="mt-2 text-xs text-[#5E6B7A]">
                  Minimum payout amount: ₹500
                </p>

              </div>

              {requestMessage && (

                <div
                  className={`rounded-xl p-3 text-xs font-medium ${
                    requestMessage.includes("successfully")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {requestMessage}
                </div>

              )}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowRequest(false);
                    setRequestMessage("");
                  }}
                  className="
                    rounded-xl
                    border
                    border-[#DCE7F2]
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-[#0B1F3A]
                    hover:bg-[#F5FAFF]
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    rounded-xl
                    bg-[#0078ED]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#012467]
                  "
                >
                  Submit Request
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
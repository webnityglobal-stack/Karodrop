import React, { useMemo, useState } from "react";

const demoCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    orders: 12,
    spent: 18450,
    status: "Active",
    joined: "12 Aug 2026",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 98765 12345",
    orders: 8,
    spent: 12600,
    status: "Active",
    joined: "19 Aug 2026",
  },
  {
    id: 3,
    name: "Aman Verma",
    email: "aman@example.com",
    phone: "+91 91234 56789",
    orders: 5,
    spent: 7499,
    status: "Active",
    joined: "25 Aug 2026",
  },
  {
    id: 4,
    name: "Neha Gupta",
    email: "neha@example.com",
    phone: "+91 99887 66554",
    orders: 3,
    spent: 4200,
    status: "Inactive",
    joined: "02 Sep 2026",
  },
  {
    id: 5,
    name: "Vikas Kumar",
    email: "vikas@example.com",
    phone: "+91 90123 45678",
    orders: 7,
    spent: 10950,
    status: "Active",
    joined: "07 Sep 2026",
  },
  {
    id: 6,
    name: "Anjali Mehta",
    email: "anjali@example.com",
    phone: "+91 87654 32109",
    orders: 4,
    spent: 6800,
    status: "Active",
    joined: "14 Sep 2026",
  },
];

export default function SellerCustomers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredCustomers = useMemo(() => {
    return demoCustomers.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "All" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalCustomers = demoCustomers.length;

  const activeCustomers = demoCustomers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalOrders = demoCustomers.reduce(
    (sum, customer) => sum + customer.orders,
    0
  );

  const totalRevenue = demoCustomers.reduce(
    (sum, customer) => sum + customer.spent,
    0
  );

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0078ED]">
          Seller Customers
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#0B1F3A]">
          Customers
        </h1>

        <p className="mt-1 text-sm text-[#5E6B7A]">
          View and manage customers who have purchased from your store.
        </p>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Customers
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {totalCustomers}
          </p>

          <p className="mt-1 text-xs text-green-600">
            Customer base
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Active Customers
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            {activeCustomers}
          </p>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            Currently active
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Total Orders
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0B1F3A]">
            {totalOrders}
          </p>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            From these customers
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5">
          <p className="text-xs text-[#5E6B7A]">
            Customer Revenue
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0078ED]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-green-600">
            Total purchase value
          </p>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-2xl border border-[#DCE7F2] bg-white p-4">

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="flex-1">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email or phone..."
              className="
                w-full
                rounded-xl
                border
                border-[#DCE7F2]
                bg-[#F5FAFF]
                px-4
                py-3
                text-sm
                text-[#0B1F3A]
                outline-none
                transition
                focus:border-[#0078ED]
                focus:bg-white
              "
            />

          </div>

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
            <option value="All">All Customers</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

      </div>

      {/* =====================================================
          CUSTOMER TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#DCE7F2] bg-white">

        <div className="border-b border-[#DCE7F2] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[#0B1F3A]">
            Customer List
          </h2>

          <p className="mt-1 text-xs text-[#5E6B7A]">
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-[#F5FAFF]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Orders
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Total Spent
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5E6B7A]">
                  Joined
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#DCE7F2]">

              {filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="transition hover:bg-[#F9FCFF]"
                >

                  {/* Customer */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] text-sm font-semibold text-[#0078ED]">
                        {customer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#0B1F3A]">
                          {customer.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#5E6B7A]">
                          Customer #{customer.id}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-[#0B1F3A]">
                      {customer.email}
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      {customer.phone}
                    </p>

                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">

                    <span className="rounded-lg bg-[#F5FAFF] px-3 py-1.5 text-sm font-medium text-[#0B1F3A]">
                      {customer.orders}
                    </span>

                  </td>

                  {/* Spent */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      ₹{customer.spent.toLocaleString("en-IN")}
                    </p>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${
                          customer.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {customer.status}
                    </span>

                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-[#5E6B7A]">
                      {customer.joined}
                    </p>

                  </td>

                </tr>

              ))}

              {filteredCustomers.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4FF] text-xl">
                      👥
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#0B1F3A]">
                      No customers found
                    </p>

                    <p className="mt-1 text-xs text-[#5E6B7A]">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
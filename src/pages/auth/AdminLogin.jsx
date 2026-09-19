import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function getUsers() {
  try {
    const savedUsers = localStorage.getItem("karodrop-users");

    if (!savedUsers) return [];

    const users = JSON.parse(savedUsers);

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const users = getUsers();

    const admin = users.find(
      (user) =>
        user?.email?.toLowerCase() === email &&
        user?.password === password &&
        user?.role === "admin"
    );

    if (!admin) {
      setError("Invalid admin email or password.");
      setLoading(false);
      return;
    }

    const currentUser = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "admin",
      phone: admin.phone || "",
      businessName: admin.businessName || "",
      address: admin.address || "",
    };

    localStorage.setItem(
      "karodrop-admin",
      JSON.stringify(currentUser)
    );

    window.dispatchEvent(new Event("userChanged"));

    setLoading(false);

    navigate("/admin", { replace: true });
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-[#F5FAFF] flex items-center justify-center px-4 py-16">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#EAF4FF] opacity-90 blur-[110px]" />

      <div className="pointer-events-none absolute -top-40 -right-40 h-[450px] w-[450px] rounded-full bg-[#EAF4FF] opacity-70 blur-[110px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">

          <p className="text-xs font-semibold tracking-[0.25em] text-[#0078ED] uppercase mb-3">
            Admin Access
          </p>

          <h1 className="font-display text-4xl text-[#0B1F3A] mb-3">
            Admin Login
          </h1>

          <p className="text-sm text-[#5E6B7A]">
            Sign in to manage your Karodrop platform.
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(1,36,103,0.06)]">

          {/* Admin Badge */}
          <div className="flex items-center gap-3 mb-6 rounded-xl border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0078ED]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 12l1.7 1.7 3.5-3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Administrator
              </p>

              <p className="text-xs text-[#5E6B7A]">
                Restricted access
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>

              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-[#0B1F3A] mb-2"
              >
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter admin email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#DCE7F2] rounded-lg px-4 py-3 text-sm bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#5E6B7A]/60 outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 transition"
              />

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-[#0B1F3A]"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-[#0078ED] hover:text-[#012467] hover:underline transition"
                  onClick={() =>
                    alert("Admin password reset will be available soon.")
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-[#DCE7F2] rounded-lg px-4 py-3 pr-16 text-sm bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#5E6B7A]/60 outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#5E6B7A] hover:text-[#0078ED] transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0078ED] text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-[#012467] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login as Admin"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">

            <div className="flex-1 h-px bg-[#DCE7F2]" />

            <span className="text-xs text-[#5E6B7A]/60">
              OR
            </span>

            <div className="flex-1 h-px bg-[#DCE7F2]" />

          </div>

          {/* Normal Login */}
          <p className="text-center text-sm text-[#5E6B7A]">

            Not an admin?{" "}

            <Link
              to="/login"
              className="text-[#0078ED] font-semibold hover:text-[#012467] hover:underline transition"
            >
              User Login
            </Link>

          </p>

        </div>

        {/* Back to Website */}
        <div className="mt-6 text-center">

          <Link
            to="/"
            className="text-xs font-medium text-[#5E6B7A] hover:text-[#0078ED] transition"
          >
            ← Back to Karodrop
          </Link>

        </div>

      </div>

    </div>
  );
}
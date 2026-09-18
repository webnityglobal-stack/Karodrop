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

export default function Login() {
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

    const user = users.find(
      (item) =>
        item?.email?.toLowerCase() === email &&
        item?.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    /*
     * Store only safe information
     * Password is NOT stored in current session.
     */
    const currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "customer",
      phone: user.phone || "",
      businessName: user.businessName || "",
      address: user.address || "",
    };

    localStorage.setItem(
      "karodrop-user",
      JSON.stringify(currentUser)
    );

    // Notify other parts of the application
    window.dispatchEvent(new Event("userChanged"));

    /*
     * Admin → Admin Panel
     * Customer/Seller → Home Page
     *
     * Dashboard will be available
     * from the logged-in profile menu.
     */
    if (user.role === "admin") {
      setLoading(false);
      navigate("/admin", { replace: true });
      return;
    }

    setLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-[#F5FAFF] flex items-center justify-center px-4 py-16">

      {/* Background glow */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#EAF4FF] opacity-90 blur-[110px]" />

      <div className="pointer-events-none absolute -top-40 -right-40 h-[450px] w-[450px] rounded-full bg-[#EAF4FF] opacity-70 blur-[110px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">

          <p className="text-xs font-semibold tracking-[0.25em] text-[#0078ED] uppercase mb-3">
            Welcome Back
          </p>

          <h1 className="font-display text-4xl text-[#0B1F3A] mb-3">
            Login to Karodrop
          </h1>

          <p className="text-sm text-[#5E6B7A]">
            Access your account and continue your journey.
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(1,36,103,0.06)]">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0B1F3A] mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#DCE7F2] rounded-lg px-4 py-3 text-sm bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#5E6B7A]/60 outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 transition"
              />

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#0B1F3A]"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-[#0078ED] hover:text-[#012467] hover:underline transition"
                  onClick={() =>
                    alert("Password reset will be available soon.")
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
              {loading ? "Logging in..." : "Login"}
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

          {/* Signup */}
          <p className="text-center text-sm text-[#5E6B7A]">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-[#0078ED] font-semibold hover:text-[#012467] hover:underline transition"
            >
              Create Account
            </Link>

          </p>

        </div>

        {/* Note */}
        <div className="mt-6 text-center">

          <p className="text-xs text-[#5E6B7A]">
            Start selling without holding inventory.
          </p>

        </div>

      </div>

    </div>
  );
}
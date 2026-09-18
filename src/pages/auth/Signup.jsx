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

function createUserId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    if (name.length < 2) {
      setError("Please enter a valid name.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const users = getUsers();

    // Check duplicate email
    const existingUser = users.find(
      (user) => user?.email?.toLowerCase() === email
    );

    if (existingUser) {
      setError("An account with this email already exists.");
      setLoading(false);
      return;
    }

    /*
     * Public signup allows only:
     * Customer or Seller.
     *
     * Admin accounts are not created from
     * the public signup page.
     */
    const selectedRole =
      form.role === "seller" ? "seller" : "customer";

    const newUser = {
      id: createUserId(),
      name,
      email,
      password,
      role: selectedRole,
      phone: "",
      businessName: "",
      address: "",
    };

    // Save user
    const updatedUsers = [...users, newUser];

    localStorage.setItem(
      "karodrop-users",
      JSON.stringify(updatedUsers)
    );

    /*
     * Save current logged-in user.
     * Password is NOT stored here.
     */
    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      businessName: newUser.businessName,
      address: newUser.address,
    };

    localStorage.setItem(
      "karodrop-user",
      JSON.stringify(currentUser)
    );

    // Notify other application components
    window.dispatchEvent(new Event("userChanged"));

    setSuccess("Account created successfully!");

    // After signup, take every public account type to the Home page.
    // Dashboard remains available from the logged-in profile menu.
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);
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
            Create Account
          </p>

          <h1 className="font-display text-4xl text-[#0B1F3A] mb-3">
            Join Karodrop
          </h1>

          <p className="text-sm text-[#5E6B7A]">
            Create your account and start your journey.
          </p>

        </div>

        {/* Signup Card */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(1,36,103,0.06)]">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#0B1F3A] mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-[#DCE7F2] rounded-lg px-4 py-3 text-sm bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#5E6B7A]/60 outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 transition"
              />

            </div>

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

              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0B1F3A] mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#0B1F3A] mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-[#DCE7F2] rounded-lg px-4 py-3 pr-16 text-sm bg-[#F5FAFF] text-[#0B1F3A] placeholder:text-[#5E6B7A]/60 outline-none focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#5E6B7A] hover:text-[#0078ED] transition"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Account Type */}
            <div>

              <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      role: "customer",
                    });
                    setError("");
                    setSuccess("");
                  }}
                  className={`py-3 rounded-lg border text-sm font-semibold transition ${
                    form.role === "customer"
                      ? "border-[#0078ED] bg-[#EAF4FF] text-[#0078ED]"
                      : "border-[#DCE7F2] bg-white text-[#5E6B7A] hover:border-[#0078ED]"
                  }`}
                >
                  Customer
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      role: "seller",
                    });
                    setError("");
                    setSuccess("");
                  }}
                  className={`py-3 rounded-lg border text-sm font-semibold transition ${
                    form.role === "seller"
                      ? "border-[#0078ED] bg-[#EAF4FF] text-[#0078ED]"
                      : "border-[#DCE7F2] bg-white text-[#5E6B7A] hover:border-[#0078ED]"
                  }`}
                >
                  Seller
                </button>

              </div>

              {/* Account Type Description */}
              <div className="mt-3 rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3">

                {form.role === "seller" ? (
                  <>
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Seller Account
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                      Create and manage your products, designs, brands
                      and selling activities on Karodrop.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Customer Account
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5E6B7A]">
                      Manage your brands, products, designs, orders
                      and custom product requests.
                    </p>
                  </>
                )}

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0078ED] text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-[#012467] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
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

          {/* Login */}
          <p className="text-center text-sm text-[#5E6B7A]">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-[#0078ED] font-semibold hover:text-[#012467] hover:underline transition"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}
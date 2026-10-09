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

  return `user-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    // Accept a 10-digit Indian mobile number, optionally with +91.
    const normalizedPhone = phone.replace(/[\s-]/g, "");
    const validPhone = /^(?:\+91)?[6-9]\d{9}$/.test(normalizedPhone);

    if (!validPhone) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const users = getUsers();

      const existingUser = users.find(
        (user) => user?.email?.toLowerCase() === email
      );

      if (existingUser) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = {
        id: createUserId(),
        name,
        email,
        password,
        phone: normalizedPhone,
        role: "seller",
        businessName: "",
        address: "",
      };

      const updatedUsers = [...users, newUser];

      localStorage.setItem(
        "karodrop-users",
        JSON.stringify(updatedUsers)
      );

      // Save the current session without including the password.
      const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: "seller",
        businessName: newUser.businessName,
        address: newUser.address,
      };

      localStorage.setItem(
        "karodrop-user",
        JSON.stringify(currentUser)
      );

      window.dispatchEvent(new Event("userChanged"));

      setSuccess("Account created successfully. Opening your dashboard...");

      setTimeout(() => {
        navigate("/seller-dashboard", { replace: true });
      }, 500);
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-[#5E6B7A]/60 focus:border-[#0078ED] focus:ring-2 focus:ring-[#0078ED]/10";

  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#F5FAFF] px-4 py-10 sm:py-14">
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#EAF4FF] opacity-90 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#EAF4FF] opacity-70 blur-[110px]" />

      <section className="relative z-10 w-full max-w-md">
        <header className="mb-7 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0078ED]">
            Create Account
          </p>

          <h1 className="mb-3 text-3xl font-bold text-[#0B1F3A] sm:text-4xl">
            Join Karodrop
          </h1>

          <p className="text-sm leading-6 text-[#5E6B7A]">
            Create your account and start your dropshipping journey.
          </p>
        </header>

        <div className="rounded-2xl border border-[#DCE7F2] bg-white p-5 shadow-[0_12px_40px_rgba(1,36,103,0.06)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#0B1F3A]"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#0B1F3A]"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[#0B1F3A]"
              >
                Mobile Number
              </label>

              <div className="flex overflow-hidden rounded-lg border border-[#DCE7F2] bg-[#F5FAFF] focus-within:border-[#0078ED] focus-within:ring-2 focus-within:ring-[#0078ED]/10">
                <span className="flex items-center border-r border-[#DCE7F2] px-3 text-sm font-medium text-[#5E6B7A]">
                  +91
                </span>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  required
                  className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-[#0B1F3A] outline-none placeholder:text-[#5E6B7A]/60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#0B1F3A]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  className={`${inputClass} pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5E6B7A] hover:text-[#0078ED]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#0B1F3A]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pr-16`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5E6B7A] hover:text-[#0078ED]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0078ED] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#012467] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#DCE7F2]" />
            <span className="text-xs text-[#5E6B7A]/60">OR</span>
            <div className="h-px flex-1 bg-[#DCE7F2]" />
          </div>

          <p className="text-center text-sm text-[#5E6B7A]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0078ED] transition hover:text-[#012467] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

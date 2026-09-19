import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const location = useLocation();

  // ==========================================
  // ADMIN AUTH
  // ==========================================
  if (allowedRole === "admin") {
    const savedAdmin = localStorage.getItem("karodrop-admin");

    // Admin login nahi hai
    if (!savedAdmin) {
      return (
        <Navigate
          to="/admin-login"
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    let admin;

    try {
      admin = JSON.parse(savedAdmin);
    } catch {
      localStorage.removeItem("karodrop-admin");

      return (
        <Navigate
          to="/admin-login"
          replace
        />
      );
    }

    // Admin role verify
    if (admin?.role !== "admin") {
      localStorage.removeItem("karodrop-admin");

      return (
        <Navigate
          to="/admin-login"
          replace
        />
      );
    }

    return children;
  }

  // ==========================================
  // CUSTOMER / SELLER AUTH
  // ==========================================
  const savedUser = localStorage.getItem("karodrop-user");

  // User login nahi hai
  if (!savedUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("karodrop-user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================
  if (allowedRole && user?.role !== allowedRole) {
    // Seller ko customer page par jane se roko
    if (user?.role === "seller") {
      return <Navigate to="/dashboard" replace />;
    }

    // Customer ko seller/admin page par jane se roko
    return <Navigate to="/account" replace />;
  }

  return children;
}
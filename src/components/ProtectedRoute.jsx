import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const location = useLocation();

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

  // Agar specific role required hai
  if (allowedRole && user.role !== allowedRole) {
    // Seller ko customer page par jane se roko
    if (user.role === "seller") {
      return <Navigate to="/dashboard" replace />;
    }

    // Customer ko seller dashboard par jane se roko
    return <Navigate to="/account" replace />;
  }

  return children;
}
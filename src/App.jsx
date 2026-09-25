import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* =========================================================
   PUBLIC PAGES
========================================================= */

import Home from "./pages/public/Home.jsx";
import Category from "./pages/public/Category.jsx";
import Product from "./pages/public/Product.jsx";
import Products from "./pages/public/Products.jsx";
import Search from "./pages/public/Search.jsx";
import Cart from "./pages/public/Cart.jsx";
import Checkout from "./pages/public/Checkout.jsx";
import OrderSuccess from "./pages/public/OrderSuccess.jsx";
import CreatorStore from "./pages/public/CreatorStore.jsx";
import HowItWorks from "./pages/public/HowItWorks.jsx";
import About from "./pages/public/About.jsx";
import Resources from "./pages/public/resources/Resources.jsx";

/* =========================================================
   AUTHENTICATION
========================================================= */

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import AdminLogin from "./pages/auth/AdminLogin";

/* =========================================================
   CUSTOMER PANEL
========================================================= */

import Account from "./pages/customer/Account.jsx";
import Orders from "./pages/customer/Orders.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";
import Designs from "./pages/customer/Designs.jsx";
import Profile from "./pages/customer/Profile.jsx";
import Settings from "./pages/customer/Settings.jsx";
import Notifications from "./pages/customer/Notifications.jsx";
import Addresses from "./pages/customer/Addresses.jsx";
import HelpSupport from "./pages/customer/HelpSupport.jsx";
import Integrations from "./pages/customer/Integrations.jsx";

import MyBrands from "./pages/customer/MyBrands.jsx";
import DesignRequest from "./pages/customer/DesignRequest.jsx";

/* =========================================================
   ADMIN PANEL
========================================================= */

import Dashboard from "./pages/admin/Dashboard.jsx";
import Customers from "./pages/admin/Customers.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import Categories from "./pages/admin/Categories.jsx";
import Brands from "./pages/admin/Brands.jsx";
import DesignRequests from "./pages/admin/DesignRequests.jsx";
import Production from "./pages/admin/Production.jsx";
import Shipping from "./pages/admin/Shipping.jsx";
import Offers from "./pages/admin/Offers.jsx";
import Reports from "./pages/admin/Reports.jsx";
import AdminNotifications from "./pages/admin/Notifications.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";
import Sellers from "./pages/admin/Sellers.jsx";

/* =========================================================
   APP
========================================================= */

export default function App() {
  const location = useLocation();
  useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]);

  /* =========================================================
     ADMIN PANEL
  ========================================================= */

  const isAdminPanel =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  /* =========================================================
     CUSTOMER PANEL

     In pages par public Navbar/Footer hide rahega.
  ========================================================= */

  const isCustomerPanel =
    location.pathname === "/account" ||
    location.pathname.startsWith("/account/") ||

    location.pathname === "/orders" ||
    location.pathname.startsWith("/orders/") ||

    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||

    location.pathname === "/designs" ||
    location.pathname.startsWith("/designs/") ||

    location.pathname === "/brands" ||
    location.pathname.startsWith("/brands/") ||

    location.pathname === "/design-request" ||
    location.pathname.startsWith("/design-request/") ||

    location.pathname === "/profile" ||
    location.pathname.startsWith("/profile/") ||

    location.pathname === "/settings" ||
    location.pathname.startsWith("/settings/") ||

    location.pathname === "/notifications" ||
    location.pathname.startsWith("/notifications/") ||

    location.pathname === "/addresses" ||
    location.pathname.startsWith("/addresses/") ||

    location.pathname === "/help-support" ||
    location.pathname.startsWith("/help-support/") ||

    location.pathname === "/wishlist" ||
    location.pathname.startsWith("/wishlist/") ||

    location.pathname === "/integrations" ||
    location.pathname.startsWith("/integrations/");

  /* =========================================================
     HIDE PUBLIC NAVBAR / FOOTER
  ========================================================= */

  const hidePublicLayout =
    isAdminPanel || isCustomerPanel;

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* =====================================================
          PUBLIC NAVBAR
      ====================================================== */}

      {!hidePublicLayout && <Navbar />}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="flex-1">

        <Routes>

          {/* =================================================
              PUBLIC
          ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route 
          path="/resources" 
          element={<Resources />} 
          />

          <Route
            path="/category/:slug"
            element={<Category />}
          />

          <Route
            path="/product/:slug"
            element={<Product />}
          />

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/creator-store"
            element={<CreatorStore />}
          />

          <Route
            path="/how-it-works"
            element={<HowItWorks />}
          />

          {/* =================================================
              AUTH
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          {/* =================================================
              CUSTOMER PRODUCT CATALOGUE
          ================================================== */}

          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRole="customer">
                <Products />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER ACCOUNT
          ================================================== */}

          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRole="customer">
                <Account />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER ORDERS
          ================================================== */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRole="customer">
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER BRANDS
          ================================================== */}

          <Route
            path="/brands"
            element={
              <ProtectedRoute allowedRole="customer">
                <MyBrands />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER DESIGN REQUEST
          ================================================== */}

          <Route
            path="/design-request"
            element={
              <ProtectedRoute allowedRole="customer">
                <DesignRequest />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER DESIGNS
          ================================================== */}

          <Route
            path="/designs"
            element={
              <ProtectedRoute allowedRole="customer">
                <Designs />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER PROFILE
          ================================================== */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="customer">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER SETTINGS
          ================================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRole="customer">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER NOTIFICATIONS
          ================================================== */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRole="customer">
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER ADDRESSES
          ================================================== */}

          <Route
            path="/addresses"
            element={
              <ProtectedRoute allowedRole="customer">
                <Addresses />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER HELP & SUPPORT
          ================================================== */}

          <Route
            path="/help-support"
            element={
              <ProtectedRoute allowedRole="customer">
                <HelpSupport />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER INTEGRATIONS
          ================================================== */}

          <Route
            path="/integrations"
            element={
              <ProtectedRoute allowedRole="customer">
                <Integrations />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER CART
          ================================================== */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRole="customer">
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER WISHLIST
          ================================================== */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRole="customer">
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              CUSTOMER CHECKOUT
          ================================================== */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRole="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ORDER SUCCESS
          ================================================== */}

          <Route
            path="/order-success"
            element={
              <ProtectedRoute allowedRole="customer">
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN PRODUCTS
          ================================================== */}

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN CATEGORIES
          ================================================== */}

          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRole="admin">
                <Categories />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN BRANDS
          ================================================== */}

          <Route
            path="/admin/brands"
            element={
              <ProtectedRoute allowedRole="admin">
                <Brands />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN CUSTOMERS
          ================================================== */}

          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRole="admin">
                <Customers />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ORDERS
          ================================================== */}

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN DESIGN REQUESTS
          ================================================== */}

          <Route
            path="/admin/design-requests"
            element={
              <ProtectedRoute allowedRole="admin">
                <DesignRequests />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN PRODUCTION
          ================================================== */}

          <Route
            path="/admin/production"
            element={
              <ProtectedRoute allowedRole="admin">
                <Production />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN SHIPPING
          ================================================== */}

          <Route
            path="/admin/shipping"
            element={
              <ProtectedRoute allowedRole="admin">
                <Shipping />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN OFFERS
          ================================================== */}

          <Route
            path="/admin/offers"
            element={
              <ProtectedRoute allowedRole="admin">
                <Offers />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN REPORTS
          ================================================== */}

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN NOTIFICATIONS
          ================================================== */}

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN SETTINGS
          ================================================== */}

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN SELLERS / RESELLERS
          ================================================== */}

          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute allowedRole="admin">
                <Sellers />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

      {/* =====================================================
          PUBLIC FOOTER
      ====================================================== */}

      {!hidePublicLayout && <Footer />}

    </div>
  );
}
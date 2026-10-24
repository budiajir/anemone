import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import SmartWall from "./pages/SmartWall";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Invoice from "./pages/Invoice";
import Maintenance from "./pages/Maintenance";

// Admin Panel Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";

import CatalogDownloadBanner from "./components/CatalogDownloadBanner";
import MobileStickyContactBar from "./components/MobileStickyContactBar";

import ErrorBoundary from "./components/ErrorBoundary";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}

// Master Maintenance Mode switch: Set to true to show Under Maintenance / Coming Soon page
const MAINTENANCE_MODE = true;

// Public site layout wrapper
function ClientLayout() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const previewQuery = searchParams.get("preview");

  const [isPreview, setIsPreview] = useState(() => {
    if (previewQuery === "true") {
      try {
        sessionStorage.setItem("anemone_preview", "true");
      } catch (e) {}
      return true;
    }
    try {
      return sessionStorage.getItem("anemone_preview") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (previewQuery === "true") {
      try {
        sessionStorage.setItem("anemone_preview", "true");
      } catch (e) {}
      setIsPreview(true);
    }
  }, [previewQuery]);

  const handleExitPreview = () => {
    try {
      sessionStorage.removeItem("anemone_preview");
    } catch (e) {}
    setIsPreview(false);
  };

  // If maintenance mode is active and user is not in preview mode, render Maintenance page
  if (MAINTENANCE_MODE && !isPreview) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pb-16 md:pb-0">
      {/* Discreet Banner when preview mode is active during maintenance */}
      {MAINTENANCE_MODE && isPreview && (
        <div className="bg-amber-400 text-black px-4 py-2 font-mono text-xs font-semibold flex items-center justify-between sticky top-0 z-[100] border-b border-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
            <span>PREVIEW MODE ACTIVE — Website is currently showing 'Under Maintenance' to public visitors.</span>
          </div>
          <button
            onClick={handleExitPreview}
            className="bg-black text-white px-3 py-1 text-[11px] uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
      )}
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CatalogDownloadBanner />
      <Footer />
      {/* Mobile-Only Sticky Floating Contact Bar */}
      <MobileStickyContactBar />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
        {/* Client Portal (with Public Navbar & Footer) */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/catalog" element={<Shop />} />
          <Route path="/macros" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/smart-wall" element={<SmartWall />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Route>

        {/* Digital Invoice Link (Standalone printable & shareable route) */}
        <Route path="/invoice/:orderId" element={<Invoice />} />

        {/* Admin Login Route (Public within Admin domain) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard (Requires Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
  );
}

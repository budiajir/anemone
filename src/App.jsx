import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import SmartWall from "./pages/SmartWall";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Invoice from "./pages/Invoice";

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

// Public site layout wrapper
function ClientLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col pb-16 md:pb-0">
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
        <Routes>
        {/* Client Portal (with Public Navbar & Footer) */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/macros" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/smart-wall" element={<SmartWall />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
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

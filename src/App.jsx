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

// Admin Panel Components
import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";

import CatalogDownloadBanner from "./components/CatalogDownloadBanner";

// Public site layout wrapper
function ClientLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CatalogDownloadBanner />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
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

        {/* Isolated Admin Dashboard (uses its own Sidebar layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

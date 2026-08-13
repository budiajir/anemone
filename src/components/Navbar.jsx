import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { categories } from "../data/products";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Smart Wall", path: "/smart-wall" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const filterCategories = ["All", ...categories];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const prevScrollY = useRef(0);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current && currentScrollY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Shop category filter — active on /shop and /macros routes
  const isShopPage = location.pathname === "/shop" || location.pathname === "/macros";
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = useMemo(() => {
    if (!isShopPage) return "All";
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const found = categories.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      if (found) return found;
    }
    if (location.pathname === "/macros") return "Macros";
    return "All";
  }, [isShopPage, searchParams, location.pathname]);

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    setSearchParams(newParams);
  };

  return (
    <>
      {/* Blokholds Style Top Header Bar (Auto-hides on scroll down) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${navHidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="max-w-7xl mx-auto w-full px-8 sm:px-12 md:px-16 lg:px-24">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Brand */}
            <Link to="/" className="hover:opacity-90 transition-opacity flex items-center gap-3">
              <Logo className="h-7 sm:h-8" />
            </Link>

            {/* Desktop Nav Links (Blokholds Uppercase Style) */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative p-2.5 text-neutral-400 hover:text-white transition-all rounded-lg hover:bg-white/5 flex items-center gap-2"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Cart
                </span>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-teal text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-glow-teal"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>

              <div className="w-px h-5 bg-white/10 md:hidden" />

              {/* Hamburger Menu Toggle (Mobile Only) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2.5 text-neutral-400 hover:text-white transition-all rounded-lg hover:bg-white/5"
                aria-label="Open Navigation Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-80 bg-neutral-950 border-l border-white/10 p-6 flex flex-col justify-between md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo className="h-7" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white transition-all rounded-lg hover:bg-white/5"
                  aria-label="Close Menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links Navigation */}
              <nav className="flex-1 py-10 flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl text-base font-bold uppercase tracking-widest transition-colors ${
                        location.pathname === link.path
                          ? "text-teal bg-white/5"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={18} className="text-teal" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer inside mobile menu */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="w-full bg-teal text-black font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-light transition-all text-xs"
                >
                  <ShoppingCart size={16} />
                  <span>View Cart ({itemCount})</span>
                </Link>
                <div className="text-center">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                    Grip. Climb. Evolve.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Smart Wall", path: "/smart-wall" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const mobileNavLinks = [
  { name: "HOME", path: "/" },
  { name: "SHOP", path: "/shop" },
  { name: "SMART WALL", path: "/smart-wall" },
  { name: "ABOUT", path: "/about" },
  { name: "CONTACT", path: "/contact" },
  { name: "CART", path: "/cart", isCart: true },
];

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Blokholds Style Top Header Bar (Auto-hides on scroll down) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${navHidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-16 sm:h-20 relative">
            
            {/* 1. Mobile Left: Hamburger Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-neutral-300 hover:text-white transition-all rounded-md hover:bg-white/5"
                aria-label="Open Navigation Menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* 2. Desktop Left / Mobile Center: Brand Logo */}
            <div className="flex items-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <Link to="/" className="hover:opacity-90 transition-opacity flex items-center gap-2.5">
                <Logo className="h-7 sm:h-8" />
              </Link>
            </div>

            {/* 3. Desktop Center: Navigation Links */}
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
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 4. Desktop Right & Mobile Right: Shopping Cart */}
            <div className="flex items-center">
              <Link
                to="/cart"
                className="relative p-2 text-neutral-300 hover:text-white transition-all rounded-md hover:bg-white/5 flex items-center gap-2"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} />
                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Cart
                </span>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 md:static w-5 h-5 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Drawer (Nakula Brutalist Style) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0c0c0c] text-white flex flex-col justify-between overflow-y-auto md:hidden"
          >
            <div>
              {/* Top Bar: ■ MENU on left, Circular ( ✕ ) on right */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <span className="inline-block w-2 h-2 bg-[#ff4d29]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
                    MENU
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-full border border-neutral-700/80 hover:border-white flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95"
                  aria-label="Close Menu"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>

              {/* Navigation Links — Nakula Bold Condensed Typography */}
              <nav className="flex flex-col px-6 pt-3">
                {mobileNavLinks.map((link, idx) => {
                  const isActive =
                    link.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.path);

                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-4 sm:py-5 border-b border-neutral-800/80 group"
                      >
                        <div className="flex items-center">
                          <span
                            className={`text-4xl sm:text-5xl font-black uppercase tracking-tight transition-colors ${
                              isActive
                                ? "text-white"
                                : "text-neutral-300 group-hover:text-[#ff4d29]"
                            }`}
                          >
                            {link.name}
                          </span>
                          {isActive && (
                            <span className="inline-block w-2.5 h-2.5 bg-[#ff4d29] ml-2.5 mb-1 shrink-0" />
                          )}
                        </div>
                        {link.isCart && itemCount > 0 && (
                          <span className="w-6 h-6 bg-white text-black text-xs font-black rounded-full flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer Area: (EMAIL) & (SOCIALS) */}
            <div className="px-6 pt-8 pb-12 mt-auto">
              {/* Email */}
              <div className="mb-6">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
                  (EMAIL)
                </p>
                <a
                  href="mailto:anemone@anemonegrip.com"
                  className="text-xl sm:text-2xl font-bold text-[#ff4d29] hover:underline tracking-tight block"
                >
                  anemone@anemonegrip.com
                </a>
              </div>

              {/* Socials */}
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-3">
                  (SOCIALS)
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                  <a
                    href="https://www.instagram.com/anemonegrip/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base font-medium text-neutral-200 hover:text-white group transition-colors"
                  >
                    <span>Instagram</span>
                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sm">↗</span>
                  </a>

                  <a
                    href="https://wa.me/628569044778"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base font-medium text-neutral-200 hover:text-white group transition-colors"
                  >
                    <span>WhatsApp</span>
                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sm">↗</span>
                  </a>

                  <Link
                    to="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 text-base font-medium text-neutral-200 hover:text-white group transition-colors"
                  >
                    <span>Catalog</span>
                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sm">↗</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 text-base font-medium text-neutral-200 hover:text-white group transition-colors"
                  >
                    <span>Inquiries</span>
                    <span className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-sm">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

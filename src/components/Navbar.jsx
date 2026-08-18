import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ArrowRight, Mail, Phone } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import Logo from "./Logo";

function InstagramIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Smart Wall", path: "/smart-wall" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-full sm:w-80 bg-neutral-950 border-r border-white/10 p-6 flex flex-col justify-between md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo className="h-7" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white transition-all rounded-md hover:bg-white/5"
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Links Navigation */}
              <nav className="flex-1 py-8 flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-md text-sm font-bold uppercase tracking-widest transition-colors ${
                        location.pathname === link.path
                          ? "text-white bg-white/10"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={16} className="text-neutral-500" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Menu Bottom Quick Contact & Cart */}
              <div className="border-t border-white/10 pt-6 space-y-5">
                {/* 3 Quick Action Contact Icons */}
                <div className="grid grid-cols-3 gap-2 text-center border border-white/10 rounded-md p-3 bg-black">
                  <a
                    href="mailto:anemone@anemonegrip.com"
                    className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Mail size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Email</span>
                  </a>
                  <a
                    href="https://wa.me/6281218124221"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors border-x border-white/10"
                  >
                    <Phone size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Phone</span>
                  </a>
                  <a
                    href="https://www.instagram.com/anemonegrip/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Instagram size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Instagram</span>
                  </a>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="w-full bg-white text-black font-black uppercase tracking-wider py-3.5 rounded-md flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all text-xs"
                >
                  <ShoppingCart size={16} />
                  <span>View Cart ({itemCount})</span>
                </Link>
                
                <div className="text-center">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
                    &copy; 2026 ANEMONE CLIMBING HOLDS
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

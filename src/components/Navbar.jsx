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

      {/* Mobile Menu Drawer (Elite Exped Style) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Semi-transparent backdrop — page slightly visible on right */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Drawer Panel — ~85% width, dark background */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#1a1a1a] flex flex-col md:hidden"
            >
              {/* Header: Logo + Close */}
              <div className="flex items-center justify-between px-6 py-6">
                <Logo className="h-8" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close Menu"
                >
                  <X size={26} />
                </button>
              </div>

              {/* Navigation Links — large uppercase with dividers */}
              <nav className="flex-1 flex flex-col pt-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-6 py-5 border-b border-white/10 transition-colors ${
                        location.pathname === link.path
                          ? "text-white"
                          : "text-neutral-300 active:bg-white/5"
                      }`}
                    >
                      <span className="text-lg font-bold uppercase tracking-wider">{link.name}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </Link>
                  </motion.div>
                ))}

                {/* Shop / Cart link without arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.04 }}
                >
                  <Link
                    to="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-6 py-5 text-neutral-300 active:bg-white/5 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    <span className="text-lg font-bold uppercase tracking-wider">Cart</span>
                    {itemCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-white text-black text-xs font-black rounded-full flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </nav>

              {/* Bottom: WhatsApp CTA Button */}
              <div className="px-6 pb-8 pt-4">
                <a
                  href="https://wa.me/628569044778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide py-4 rounded-full transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

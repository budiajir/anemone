import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const location = useLocation();

  const items = useCartStore((state) => state.items);
  const setManifestOpen = useCartStore((state) => state.setManifestOpen);
  const totalSets = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setCatalogDropdownOpen(false);
    setOrderDropdownOpen(false);
  }, [location.pathname, location.search]);

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

  const isHome = location.pathname === "/";
  const isCatalog =
    location.pathname === "/shop" ||
    location.pathname === "/catalog" ||
    location.pathname === "/macros" ||
    location.pathname.startsWith("/product");
  const isSmartWall = location.pathname === "/smart-wall";
  const isAbout = location.pathname === "/about";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black text-white border-b border-[#262B2E]">
        <div className="h-16 w-full px-6 lg:px-12 flex items-center justify-between">
          
          {/* 1. Mobile Menu Button */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* 2. Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group text-white">
              <svg
                className="w-5 h-5 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:rotate-45"
                viewBox="0 0 24 24"
              >
                <polygon fill="none" points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" stroke="currentColor" strokeWidth="1.75"></polygon>
                <circle cx="12" cy="12" fill="currentColor" r="2.5"></circle>
              </svg>
              <span className="font-headline-code text-lg sm:text-xl tracking-widest text-white uppercase leading-none font-bold">
                ANEMONE
              </span>
            </Link>
          </div>

          {/* 3. Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            <Link
              to="/"
              className={`font-nav-caps text-xs uppercase tracking-wider transition-colors py-1 ${
                isHome ? "text-white border-b border-white pb-0.5" : "text-[#c6c6c6] hover:text-white"
              }`}
            >
              HOME
            </Link>

            {/* CATALOG WITH DROPDOWN */}
            <div
              className="relative group inline-block"
              onMouseEnter={() => setCatalogDropdownOpen(true)}
              onMouseLeave={() => setCatalogDropdownOpen(false)}
            >
              <Link
                to="/shop"
                className={`font-nav-caps text-xs uppercase tracking-wider transition-colors py-1 flex items-center gap-1.5 cursor-pointer ${
                  isCatalog ? "text-white border-b border-white pb-0.5" : "text-[#c6c6c6] hover:text-white"
                }`}
              >
                <span>CATALOG</span>
                <span className="text-[10px] text-[#666D71] transition-transform duration-200 group-hover:rotate-180">↓</span>
              </Link>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-64 flex flex-col z-50 transition-all duration-200 ${
                  catalogDropdownOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
                }`}
              >
                <div className="bg-black border border-[#262B2E] shadow-2xl py-2 flex flex-col">
                  <div className="px-6 py-2 border-b border-[#262B2E] flex items-center justify-between">
                    <span className="font-headline-code text-xs uppercase tracking-widest text-white font-semibold underline">
                      CATALOG
                    </span>
                    <span className="font-label-mono text-[10px] text-[#666D71]">INDEX</span>
                  </div>
                  <div className="flex flex-col py-1">
                    <Link
                      to="/shop?category=Holds"
                      className="px-6 py-2.5 font-headline-code text-base uppercase tracking-wider text-[#c6c6c6] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group/item"
                    >
                      <span className="font-semibold">HOLDS</span>
                      <span className="text-xs text-[#666D71] group-hover/item:text-white group-hover/item:translate-x-1 transition-all">→</span>
                    </Link>
                    <Link
                      to="/shop?category=Macros"
                      className="px-6 py-2.5 font-headline-code text-base uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group/item"
                    >
                      <span className="font-semibold">MACROS</span>
                      <span className="text-xs text-[#666D71] group-hover/item:text-white group-hover/item:translate-x-1 transition-all">•</span>
                    </Link>
                    <Link
                      to="/shop?category=Volumes"
                      className="px-6 py-2.5 font-headline-code text-base uppercase tracking-wider text-[#c6c6c6] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group/item"
                    >
                      <span className="font-semibold">VOLUMES</span>
                      <span className="text-xs text-[#666D71] group-hover/item:text-white group-hover/item:translate-x-1 transition-all">→</span>
                    </Link>
                    <Link
                      to="/shop?category=Accessories"
                      className="px-6 py-2.5 font-headline-code text-base uppercase tracking-wider text-[#c6c6c6] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group/item"
                    >
                      <span className="font-semibold">ACCESSORIES</span>
                      <span className="text-xs text-[#666D71] group-hover/item:text-white group-hover/item:translate-x-1 transition-all">→</span>
                    </Link>
                  </div>
                  <div className="px-6 py-1.5 border-t border-[#262B2E] bg-black/60 flex items-center justify-between text-[#666D71] font-label-mono text-[10px]">
                    <span>SWISS HERITAGE</span>
                    <span>2026</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/smart-wall"
              className={`font-nav-caps text-xs uppercase tracking-wider transition-colors py-1 ${
                isSmartWall ? "text-white border-b border-white pb-0.5" : "text-[#c6c6c6] hover:text-white"
              }`}
            >
              SMART WALL
            </Link>

            <Link
              to="/about"
              className={`font-nav-caps text-xs uppercase tracking-wider transition-colors py-1 ${
                isAbout ? "text-white border-b border-white pb-0.5" : "text-[#c6c6c6] hover:text-white"
              }`}
            >
              ABOUT US
            </Link>
          </nav>

          {/* 4. Right Controls: ORDER Dropdown + Manifest Pill */}
          <div className="flex items-center gap-3 font-label-mono text-label-mono">
            {/* ORDER BUTTON & DROPDOWN */}
            <div
              className="relative group"
              onMouseEnter={() => setOrderDropdownOpen(true)}
              onMouseLeave={() => setOrderDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white px-4 py-1 text-label-mono uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={orderDropdownOpen}
              >
                <span className="text-[11px] font-semibold tracking-widest">ORDER</span>
                <span className="text-[10px] text-[#666D71] group-hover:text-black transition-colors">↓</span>
              </button>

              <div
                className={`absolute right-0 top-full pt-2 w-48 flex flex-col z-50 transition-all duration-200 ${
                  orderDropdownOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
                }`}
              >
                <div className="bg-black border border-[#262B2E] shadow-2xl py-1">
                  <div className="px-4 py-1.5 text-[10px] text-[#666D71] border-b border-[#262B2E] uppercase tracking-wider font-semibold">
                    Direct Desk
                  </div>
                  <a
                    href="https://wa.me/628569044778"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs text-[#c6c6c6] hover:text-white hover:bg-white/10 uppercase tracking-wider flex items-center justify-between transition-colors font-label-mono"
                  >
                    <span>VIA WHATSAPP</span>
                    <span className="text-[10px] text-[#666D71]">→</span>
                  </a>
                  <a
                    href="mailto:anemone@anemonegrip.com"
                    className="px-4 py-2 text-xs text-[#c6c6c6] hover:text-white hover:bg-white/10 uppercase tracking-wider flex items-center justify-between transition-colors font-label-mono"
                  >
                    <span>VIA EMAIL</span>
                    <span className="text-[10px] text-[#666D71]">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SETTER MANIFEST BADGE INDICATOR */}
            <button
              type="button"
              onClick={() => setManifestOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-[#262B2E] bg-[#1b1b1b] px-3 py-1 text-[11px] uppercase tracking-wider text-[#c6c6c6] hover:text-white hover:border-white transition-all duration-200 cursor-pointer"
              title="Open Setter Specification Manifest"
            >
              <span>[{totalSets}]</span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-black border-r border-[#262B2E] flex flex-col justify-between overflow-y-auto xl:hidden text-white"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#262B2E]">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <polygon fill="none" points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" stroke="currentColor" strokeWidth="1.75"></polygon>
                      <circle cx="12" cy="12" fill="currentColor" r="2.5"></circle>
                    </svg>
                    <span className="font-headline-code text-lg font-bold tracking-widest uppercase">
                      ANEMONE
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Nav list */}
                <nav className="flex flex-col py-2">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="px-6 py-4 font-headline-code text-xl font-bold uppercase tracking-wider border-b border-[#262B2E] hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span>HOME</span>
                    <ArrowRight size={16} className="text-[#666D71]" />
                  </Link>

                  <div className="border-b border-[#262B2E]">
                    <Link
                      to="/shop"
                      onClick={() => setMobileOpen(false)}
                      className="px-6 py-4 font-headline-code text-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>CATALOG</span>
                      <ArrowRight size={16} className="text-[#666D71]" />
                    </Link>
                    {/* Subcategories */}
                    <div className="px-6 pb-3 pt-1 space-y-2 bg-[#0a0a0a] text-xs font-mono tracking-wider text-[#c6c6c6]">
                      <Link
                        to="/shop?category=Holds"
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 hover:text-white"
                      >
                        • HOLDS
                      </Link>
                      <Link
                        to="/shop?category=Macros"
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 hover:text-white"
                      >
                        • MACROS
                      </Link>
                      <Link
                        to="/shop?category=Volumes"
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 hover:text-white"
                      >
                        • VOLUMES
                      </Link>
                      <Link
                        to="/shop?category=Accessories"
                        onClick={() => setMobileOpen(false)}
                        className="block py-1 hover:text-white"
                      >
                        • ACCESSORIES
                      </Link>
                    </div>
                  </div>

                  <Link
                    to="/smart-wall"
                    onClick={() => setMobileOpen(false)}
                    className="px-6 py-4 font-headline-code text-xl font-bold uppercase tracking-wider border-b border-[#262B2E] hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span>SMART WALL</span>
                    <ArrowRight size={16} className="text-[#666D71]" />
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setMobileOpen(false)}
                    className="px-6 py-4 font-headline-code text-xl font-bold uppercase tracking-wider border-b border-[#262B2E] hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span>ABOUT US</span>
                    <ArrowRight size={16} className="text-[#666D71]" />
                  </Link>
                </nav>
              </div>

              {/* Bottom WhatsApp CTA */}
              <div className="p-6 border-t border-[#262B2E] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setManifestOpen(true);
                  }}
                  className="w-full py-3 rounded-full border border-[#262B2E] font-label-mono text-xs uppercase tracking-wider text-center text-white hover:bg-white/10 transition-colors"
                >
                  VIEW MANIFEST [{totalSets}]
                </button>
                <a
                  href="https://wa.me/628569044778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-colors"
                >
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

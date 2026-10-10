import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const location = useLocation();

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-transform duration-300">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-16 sm:h-20 relative">
            
            {/* 1. Mobile Left: Hamburger Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-neutral-300 hover:text-white transition-all rounded-md hover:bg-white/5 cursor-pointer"
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
              
              {/* HOME */}
              <Link
                to="/"
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 relative py-1 ${
                  isHome ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                Home
                {isHome && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* CATALOG (WITH DROPDOWN) */}
              <div
                className="relative group inline-block"
                onMouseEnter={() => setCatalogDropdownOpen(true)}
                onMouseLeave={() => setCatalogDropdownOpen(false)}
              >
                <Link
                  to="/shop"
                  className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 relative py-1 flex items-center gap-1.5 cursor-pointer ${
                    isCatalog ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>Catalog</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      catalogDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  {isCatalog && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 flex flex-col z-50 transition-all duration-200 ${
                    catalogDropdownOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  <div className="bg-neutral-950 border border-white/10 rounded-lg shadow-2xl py-2 overflow-hidden">
                    <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-500 border-b border-white/[0.06]">
                      Catalog Index
                    </div>
                    <Link
                      to="/shop?category=Holds"
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Holds</span>
                      <span className="text-[10px] text-neutral-500">→</span>
                    </Link>
                    <Link
                      to="/shop?category=Macros"
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Macros</span>
                      <span className="text-[10px] text-neutral-500">•</span>
                    </Link>
                    <Link
                      to="/shop?category=Volumes"
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Volumes</span>
                      <span className="text-[10px] text-neutral-500">→</span>
                    </Link>
                    <Link
                      to="/shop?category=Accessories"
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Accessories</span>
                      <span className="text-[10px] text-neutral-500">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* SMART WALL */}
              <Link
                to="/smart-wall"
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 relative py-1 ${
                  isSmartWall ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                Smart Wall
                {isSmartWall && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* ABOUT US */}
              <Link
                to="/about"
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-200 relative py-1 ${
                  isAbout ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                About Us
                {isAbout && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

            </div>

            {/* 4. Desktop Right & Mobile Right: ORDER CTA (No Cart) */}
            <div className="flex items-center">
              <div
                className="relative group"
                onMouseEnter={() => setOrderDropdownOpen(true)}
                onMouseLeave={() => setOrderDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}
                  className="px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Order</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${orderDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`absolute right-0 top-full pt-2 w-48 flex flex-col z-50 transition-all duration-200 ${
                    orderDropdownOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  <div className="bg-neutral-950 border border-white/10 rounded-lg shadow-2xl py-1 overflow-hidden">
                    <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500 border-b border-white/[0.06]">
                      Direct Desk
                    </div>
                    <a
                      href="https://wa.me/628569044778"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Via WhatsApp</span>
                      <span className="text-[10px] text-neutral-500">→</span>
                    </a>
                    <a
                      href="mailto:anemone@anemonegrip.com"
                      className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Via Email</span>
                      <span className="text-[10px] text-neutral-500">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#1a1a1a] flex flex-col justify-between overflow-y-auto md:hidden"
            >
              <div>
                {/* Header: Logo + Close */}
                <div className="flex items-center justify-between px-7 py-6 border-b border-white/10">
                  <Logo className="h-8" />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <X size={26} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col pt-2">
                  {/* HOME */}
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-7 py-5 border-b border-white/10 transition-colors ${
                      isHome ? "text-white bg-white/[0.04]" : "text-neutral-300 active:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-xl font-extrabold uppercase tracking-wide">
                      Home
                    </span>
                    <ArrowRight size={18} className="text-neutral-500" />
                  </Link>

                  {/* CATALOG */}
                  <div className="border-b border-white/10">
                    <Link
                      to="/shop"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-7 py-5 transition-colors ${
                        isCatalog ? "text-white bg-white/[0.04]" : "text-neutral-300 active:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-xl font-extrabold uppercase tracking-wide">
                        Catalog
                      </span>
                      <ArrowRight size={18} className="text-neutral-500" />
                    </Link>
                    {/* Subcategories */}
                    <div className="px-7 pb-4 pt-1 space-y-2 bg-black/40 text-xs font-mono tracking-wider text-neutral-400">
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

                  {/* SMART WALL */}
                  <Link
                    to="/smart-wall"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-7 py-5 border-b border-white/10 transition-colors ${
                      isSmartWall ? "text-white bg-white/[0.04]" : "text-neutral-300 active:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-xl font-extrabold uppercase tracking-wide">
                      Smart Wall
                    </span>
                    <ArrowRight size={18} className="text-neutral-500" />
                  </Link>

                  {/* ABOUT US */}
                  <Link
                    to="/about"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-7 py-5 border-b border-white/10 transition-colors ${
                      isAbout ? "text-white bg-white/[0.04]" : "text-neutral-300 active:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-xl font-extrabold uppercase tracking-wide">
                      About Us
                    </span>
                    <ArrowRight size={18} className="text-neutral-500" />
                  </Link>
                </nav>
              </div>

              {/* Bottom: WhatsApp CTA Button */}
              <div className="px-7 pb-10 pt-6 mt-auto">
                <a
                  href="https://wa.me/628569044778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-wider py-4 rounded-full transition-colors shadow-lg active:scale-98"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

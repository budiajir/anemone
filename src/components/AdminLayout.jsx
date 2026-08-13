import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Box, ArrowLeft, Bell, User, Menu, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function AdminLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Products', path: '/admin/products', icon: Box },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* TOP HEADER / NAVBAR (MONOCHROME SUPR STYLE) */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Logo & Administration Panel Title */}
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-3 group">
              <Logo className="h-7" showText={false} />
              <div>
                <span className="text-white font-black uppercase tracking-widest text-sm block leading-none">
                  ADMINISTRATION PANEL
                </span>
                <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mt-1 block">
                  ANEMONE HARDWARE &amp; TECH
                </span>
              </div>
            </Link>

            <div className="h-8 w-px bg-white/10 hidden md:block" />

            {/* Desktop Navigation Tabs (Solid White Active Block Style) */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/admin' 
                  ? location.pathname === '/admin' 
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? 'bg-white text-black shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: System Status, Back to Site, User Badge */}
          <div className="flex items-center gap-4">
            {/* System Online Status Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-black border border-white/10 px-3 py-1.5 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-300">
                SYSTEM ONLINE
              </span>
            </div>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-white/5 border border-white/15 transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to Website</span>
            </Link>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-white text-xs font-bold uppercase tracking-wider leading-none">Superadmin</div>
                <div className="text-neutral-500 font-mono text-[9px] mt-0.5 uppercase tracking-widest leading-none">Root Access</div>
              </div>
              <div className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center border border-white/15 text-neutral-300">
                <User size={16} />
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-sm border border-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#0a0a0a] px-6 py-4 space-y-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white/10 rounded-sm inline-flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-300">
                  SYSTEM ONLINE
                </span>
              </div>

              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path === '/admin' 
                    ? location.pathname === '/admin' 
                    : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-white text-black'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-white/10">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Main Website</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <Outlet />
      </main>

    </div>
  );
}

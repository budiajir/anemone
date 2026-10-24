import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Mail, Hammer } from 'lucide-react';
import Logo from '../components/Logo';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black font-body-lg relative overflow-hidden">
      {/* Subtle Background Accent & Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-[#262B2E] px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8" textClassName="text-white text-lg font-bold tracking-widest uppercase font-headline-code" />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#262B2E] bg-white/5 rounded-full font-label-mono text-[11px] uppercase tracking-wider text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Redesign In Progress</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16 lg:py-24">
        <div className="max-w-3xl w-full text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-label-mono text-xs uppercase tracking-[0.2em] text-[#888E92] mb-6 px-3.5 py-1 border border-[#262B2E] bg-[#0c0d0e]"
          >
            <Hammer size={13} className="text-white" />
            <span>Under Maintenance // Coming Soon</span>
          </motion.div>

          {/* Monumental Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-headline-xl text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-[1.05] mb-10 sm:mb-12"
          >
            Crafting The Next <br />
            <span className="text-neutral-400">Digital Experience.</span>
          </motion.h1>

          {/* Direct Contact & Order Cards */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-xl"
          >
            <div className="text-left font-label-mono text-[11px] uppercase tracking-widest text-[#666D71] mb-3 px-1 flex items-center justify-between">
              <span>Direct Inquiries & Order Desk</span>
              <span>Available 24/7</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/628569044778?text=Halo%20Anemone%2C%20saya%20ingin%20tanya%20mengenai%20katalog%20dan%20pemesanan%20climbing%20holds."
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-[#0c0d0e] border border-[#262B2E] hover:border-white transition-all text-left flex flex-col justify-between min-h-[110px]"
              >
                <div className="flex items-center justify-between text-neutral-400 group-hover:text-white transition-colors">
                  <MessageCircle size={18} />
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="font-label-mono text-[10px] uppercase text-[#666D71] tracking-wider">Direct Order</div>
                  <div className="font-bold text-sm tracking-wide text-white mt-0.5">WhatsApp</div>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/anemonegrip/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-[#0c0d0e] border border-[#262B2E] hover:border-white transition-all text-left flex flex-col justify-between min-h-[110px]"
              >
                <div className="flex items-center justify-between text-neutral-400 group-hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="font-label-mono text-[10px] uppercase text-[#666D71] tracking-wider">Follow Updates</div>
                  <div className="font-bold text-sm tracking-wide text-white mt-0.5">@anemonegrip</div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:anemone@anemonegrip.com"
                className="group p-4 bg-[#0c0d0e] border border-[#262B2E] hover:border-white transition-all text-left flex flex-col justify-between min-h-[110px]"
              >
                <div className="flex items-center justify-between text-neutral-400 group-hover:text-white transition-colors">
                  <Mail size={18} />
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="font-label-mono text-[10px] uppercase text-[#666D71] tracking-wider">B2B Proposals</div>
                  <div className="font-bold text-sm tracking-wide text-white mt-0.5">Email Desk</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full border-t border-[#262B2E] px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-label-mono text-[11px] text-[#666D71] uppercase tracking-wider">
        <div>
          © {new Date().getFullYear()} Anemone Climbing Holds. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Swiss Heritage // Indonesian Craft</span>
          <a
            href="/admin/login"
            className="hover:text-white transition-colors underline decoration-[#444]"
          >
            Admin Portal
          </a>
          <a
            href="/?preview=true"
            className="text-neutral-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider border border-[#262B2E] px-2 py-0.5 hover:border-neutral-500"
          >
            Preview UI
          </a>
        </div>
      </footer>
    </div>
  );
}

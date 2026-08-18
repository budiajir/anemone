import React from 'react';
import { Mail, Phone } from 'lucide-react';

function InstagramIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function MobileStickyContactBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a0c]/95 backdrop-blur-md border-t border-white/15 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-3 divide-x divide-white/10 text-center py-2.5">
        {/* 1. Email */}
        <a
          href="mailto:anemone@anemonegrip.com"
          className="flex flex-col items-center justify-center gap-1 text-neutral-300 active:text-white active:bg-white/5 py-1 transition-colors"
          aria-label="Send Email"
        >
          <Mail size={18} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Email</span>
        </a>

        {/* 2. Phone / WhatsApp */}
        <a
          href="https://wa.me/6281218124221"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-neutral-300 active:text-white active:bg-white/5 py-1 transition-colors"
          aria-label="WhatsApp or Call"
        >
          <Phone size={18} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Phone</span>
        </a>

        {/* 3. Instagram */}
        <a
          href="https://www.instagram.com/anemonegrip/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-neutral-300 active:text-white active:bg-white/5 py-1 transition-colors"
          aria-label="Instagram Profile"
        >
          <InstagramIcon size={18} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">Instagram</span>
        </a>
      </div>
    </div>
  );
}

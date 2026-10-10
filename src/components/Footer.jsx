import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-[#262B2E] text-white">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-[#262B2E] pb-12">
          
          {/* Column 1: ANEMONE HOLD ARCHITECTURE */}
          <div className="flex flex-col gap-3">
            <span className="font-nav-caps text-sm uppercase tracking-wider text-white font-bold">
              ANEMONE HOLD ARCHITECTURE
            </span>
            <p className="font-body-sm text-xs leading-relaxed text-[#666D71] max-w-sm">
              Radical geometric restraint for high-level commercial routesetting and architectural climbing installations. Engineered under Swiss laboratory precision standards.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center font-label-mono text-[10px] text-white bg-[#1b1b1b] border border-[#262B2E] px-3 py-1 rounded-full uppercase tracking-wider">
                SPEC GRADE: PE / PU / FIBERGLASS
              </span>
            </div>
          </div>

          {/* Column 2: B2B LOGISTICS & ASSETS */}
          <div className="flex flex-col gap-3">
            <span className="font-label-mono text-xs text-[#666D71] uppercase tracking-wider">
              B2B LOGISTICS &amp; ASSETS
            </span>
            <div className="flex flex-col gap-2 font-label-mono text-xs">
              <a
                href="/shop"
                className="inline-flex items-center justify-between border-b border-[#262B2E] pb-2 text-white hover:text-neutral-400 transition-colors"
              >
                <span>EXPORT PDF SPEC SHEET (2026)</span>
                <span className="text-[#666D71]">↓ [24MB]</span>
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-between border-b border-[#262B2E] pb-2 text-white hover:text-neutral-400 transition-colors"
              >
                <span>COMMERCIAL BATCH DISPATCH</span>
                <span className="text-[#666D71]">→ VIEW</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-between border-b border-[#262B2E] pb-2 text-white hover:text-neutral-400 transition-colors"
              >
                <span>SURFACE FRICTION DATA (ISO)</span>
                <span className="text-[#666D71]">→ TECH</span>
              </Link>
            </div>
          </div>

          {/* Column 3: DIRECT ROUTE-SETTER DESK */}
          <div className="flex flex-col gap-3">
            <span className="font-label-mono text-xs text-[#666D71] uppercase tracking-wider">
              DIRECT ROUTE-SETTER DESK
            </span>
            <p className="font-body-sm text-xs text-[#666D71] leading-relaxed max-w-sm">
              Immediate support for competition setters, gym deliveries, and project volume calculations.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <a
                className="inline-flex items-center justify-center rounded-full border border-white px-6 py-2 font-label-mono text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-200"
                href="https://wa.me/628569044778"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="font-label-mono font-semibold">WHATSAPP</span>
              </a>
              <span className="font-label-mono text-[10px] text-[#666D71] text-center tracking-wider uppercase">
                DISPATCH: BANDUNG / INDONESIA
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-label-mono text-[11px] text-[#666D71]">
          <div>
            © 2026 ANEMONE GRIPS LABORATORY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              LEGAL / COMPLIANCE
            </Link>
            <a
              href="https://www.instagram.com/anemonegrip/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              INSTAGRAM
            </a>
            <span className="text-white font-semibold">SWISS ENGINEERED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

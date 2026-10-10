import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-hairline-border text-on-surface">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-hairline-border pb-12">
          
          {/* Column 1: ANEMONE HOLD ARCHITECTURE */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-nav-caps text-sm uppercase tracking-wider text-primary font-bold">
                ANEMONE HOLD ARCHITECTURE
              </span>
            </div>
            <p className="font-body-sm text-xs leading-relaxed text-text-muted">
              Radical geometric restraint for high-level commercial routesetting and architectural climbing installations. Engineered under Swiss laboratory precision standards.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center font-label-mono text-[10px] text-primary bg-surface-container px-3 py-1 rounded-full uppercase tracking-wider">
                SPEC GRADE: PE / PU / FIBERGLASS
              </span>
            </div>
          </div>

          {/* Column 2: STANDARDS & COMPLIANCE */}
          <div className="flex flex-col gap-3">
            <span className="font-label-mono text-xs text-text-muted uppercase tracking-wider">
              STANDARDS &amp; COMPLIANCE
            </span>
            <ul className="space-y-1.5 font-label-mono text-xs text-on-surface">
              <li>IFSC CERTIFIED MANUFACTURE</li>
              <li>EN 12572-3 STRUCTURAL TESTING</li>
              <li>DUAL-TEXTURE SURFACE CONTROL</li>
              <li>DUAL FIXATION: CHC M10 + WOOD / SCREW-ON</li>
            </ul>
          </div>

          {/* Column 3: B2B LOGISTICS & ASSETS */}
          <div className="flex flex-col gap-3">
            <span className="font-label-mono text-xs text-text-muted uppercase tracking-wider">
              B2B LOGISTICS &amp; ASSETS
            </span>
            <div className="flex flex-col gap-2 font-body-sm text-xs">
              <a
                href="/shop"
                className="inline-flex items-center justify-between border-b border-hairline-border pb-1.5 text-primary hover:text-secondary transition-colors font-label-mono"
              >
                <span>EXPORT PDF SPEC SHEET (2026)</span>
                <span>↓ [24MB]</span>
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-between border-b border-hairline-border pb-1.5 text-primary hover:text-secondary transition-colors font-label-mono"
              >
                <span>COMMERCIAL BATCH DISPATCH</span>
                <span>→ VIEW</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-between border-b border-hairline-border pb-1.5 text-primary hover:text-secondary transition-colors font-label-mono"
              >
                <span>SURFACE FRICTION DATA (ISO)</span>
                <span>→ TECH</span>
              </Link>
            </div>
          </div>

          {/* Column 4: DIRECT ROUTE-SETTER DESK */}
          <div className="flex flex-col gap-3">
            <span className="font-label-mono text-xs text-text-muted uppercase tracking-wider">
              DIRECT ROUTE-SETTER DESK
            </span>
            <p className="font-body-sm text-xs text-text-muted leading-relaxed">
              Immediate support for competition setters, gym deliveries, and project volume calculations.
            </p>
            <div className="flex flex-col gap-1.5 mt-1">
              <a
                className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-1.5 font-label-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-on-primary transition-all duration-200"
                href="https://wa.me/628569044778"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="font-label-mono">WHATSAPP B2B DESK</span>
              </a>
              <span className="font-label-mono text-[10px] text-text-muted text-center tracking-wider uppercase">
                DISPATCH: BANDUNG / INDONESIA
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-label-mono text-[11px] text-text-muted">
            © 2026 ANEMONE GRIPS LABORATORY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 font-label-mono text-[11px] text-text-muted">
            <Link to="/about" className="hover:text-primary transition-colors">
              LEGAL / COMPLIANCE
            </Link>
            <a
              href="https://www.instagram.com/anemonegrip/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              INSTAGRAM
            </a>
            <span className="text-primary font-medium">SWISS ENGINEERED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

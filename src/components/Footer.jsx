import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerLinks = {
  Shop: [
    { name: "Holds & Volumes", path: "/shop?category=Holds" },
    { name: "Hangboard", path: "/shop?category=Hangboard" },
    { name: "Bouldering Essentials", path: "/shop?category=Bouldering+Essentials" },
    { name: "Smart Wall Kit", path: "/smart-wall" },
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/" },
    { name: "Careers", path: "/" },
  ],
  Support: [
    { name: "FAQ", path: "/" },
    { name: "Shipping", path: "/" },
    { name: "Returns", path: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10">

      {/* Simple top border */}
      <div className="border-t border-white/10" />

      {/* Main footer content */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">

          {/* Grid: Logo/Desc + Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-12">

            {/* Column 1: Brand + Description + Socials */}
            <div className="md:col-span-4 space-y-6">
              <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                <Logo className="h-10 sm:h-12" />
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-xs">
                Premium climbing holds, training gear, and smart wall technology — built by climbers, for climbers.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-5 pt-2">
                <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Youtube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                    <path d="m10 15 5-3-5-3z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Columns 2-4: Link Groups */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="space-y-5">
                  <h4 className="text-white text-xs font-bold uppercase tracking-widest">
                    {title}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.path}
                          className="text-neutral-500 hover:text-white uppercase text-xs tracking-wider transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom copyright bar — warna paling gelap */}
      <div className="bg-black border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 font-light">
          <p>© 2026 Anemone. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Privacy</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Terms</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Sitemap</a>
          </div>
        </div>
      </div>

    </footer>
  );
}

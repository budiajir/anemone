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
    { name: "Contact", path: "/contact" },
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
                <a href="https://www.instagram.com/anemonegrip/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
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

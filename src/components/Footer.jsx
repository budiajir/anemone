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
    { name: "Shop", path: "/shop" },
  ],
  Support: [
    { name: "FAQ", path: "/" },
    { name: "Shipping", path: "/" },
    { name: "Returns", path: "/" },
  ],
};

const socialIcons = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/anemonegrip/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/628569044778",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:anemone@anemonegrip.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10">

      {/* ========== MOBILE FOOTER (Elite Exped Style) ========== */}
      <div className="md:hidden bg-[#1a1a1a]">
        <div className="max-w-lg mx-auto px-8 pt-14 pb-10">

          {/* Two-Column Link Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {Object.entries(footerLinks).slice(0, 2).map(([title, links]) => (
              <div key={title} className="space-y-5">
                <h4 className="text-white text-base font-bold tracking-wide">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-neutral-400 hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-8 pt-12 pb-10">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/15" />

          {/* Bottom Links */}
          <div className="flex flex-col items-center gap-3 pt-8 pb-4">
            <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms & Conditions</a>
            <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
          </div>

          {/* Copyright & Made In */}
          <div className="flex flex-col items-center gap-2 pt-4 pb-2 text-center">
            <p className="text-neutral-500 text-xs">© 2026 Anemone Climbing Holds</p>
            <p className="text-neutral-500 text-xs">
              Made in <span className="text-white font-semibold">Bandung</span>
            </p>
          </div>
        </div>
      </div>

      {/* ========== DESKTOP FOOTER (Original Style) ========== */}
      <div className="hidden md:block border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-y-12 gap-x-12">

            {/* Column 1: Brand + Description + Socials */}
            <div className="col-span-4 space-y-6">
              <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                <Logo className="h-10 sm:h-12" />
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-xs">
                Premium climbing holds, training gear, and smart wall technology — built by climbers, for climbers.
              </p>
              <div className="flex items-center gap-5 pt-2">
                {socialIcons.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Columns 2-4: Link Groups */}
            <div className="col-span-8 grid grid-cols-3 gap-y-10 gap-x-8">
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

        {/* Desktop Bottom Bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between gap-4 text-xs text-neutral-600 font-light">
            <p>© 2026 Anemone. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Privacy</a>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Terms</a>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

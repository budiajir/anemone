import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Mail, Phone } from 'lucide-react';
import { products } from '../data/products';
import { generateProductCatalogPdfHtml } from '../utils/pdfGenerator';

function InstagramIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  const seriesStrips = [
    {
      id: "holds",
      title: "GRIPS & CHIPS",
      subtitle: "PE & PU Climbing Holds | First Batch of 2026 Edition",
      categoryName: "Holds",
      path: "/shop?category=Holds",
      bgImage: "/images/motela.png",
      tag: "Signature Holds"
    },
    {
      id: "smartwall",
      title: "SMART WALL TECH",
      subtitle: "App-Integrated Interactive LED Climbing Ecosystem",
      categoryName: "Smart Wall Kit",
      path: "/smart-wall",
      bgImage: "/images/argus.png",
      tag: "Interactive Hardware"
    },
    {
      id: "hangboard",
      title: "TRAINING GEAR",
      subtitle: "Carved Beech Wood Fingerboards for Max Strength",
      categoryName: "Training Board",
      path: "/shop?category=Hangboard",
      bgImage: "/images/cucu_chips.png",
      tag: "Hangboard Series"
    },
    {
      id: "essentials",
      title: "BOULDERING ESSENTIALS",
      subtitle: "Multi-Layer Crash Pads & Ultra-Pure Magnesium Chalk",
      categoryName: "Essentials",
      path: "/shop?category=Bouldering+Essentials",
      bgImage: "/images/eclipse.png",
      tag: "Gear & Accessories"
    }
  ];

  const handleDownloadCatalogPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const htmlContent = generateProductCatalogPdfHtml(products);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950 border-b border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 opacity-45 filter brightness-75"
          style={{ backgroundImage: `url('/images/motela.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-4xl mx-auto flex flex-col items-center justify-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
                Welcome to ANEMONE
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-7xl md:text-8xl font-black text-white tracking-tight uppercase leading-none font-sans">
              Welcome to ANEMONE
            </motion.h1>

            <motion.p variants={fadeUp} className="text-neutral-200 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] max-w-2xl leading-relaxed mx-auto text-center">
              PE/PU Holds | Fiberglass Macros | Plywood Volumes
            </motion.p>

            <motion.div variants={fadeUp} className="pt-4 flex items-center justify-center gap-4">
              <Link
                to="/shop"
                className="bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded hover:bg-neutral-200 transition-colors"
              >
                Explore Catalog
              </Link>
              <Link
                to="/smart-wall"
                className="border border-white/20 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded hover:bg-white/5 transition-colors"
              >
                Smart Wall &rarr;
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-400 animate-bounce hidden sm:block">
          <a href="#series-section" aria-label="Scroll Down">
            <ChevronDown size={24} className="hover:text-white transition-colors" />
          </a>
        </div>
      </section>

      {/* 2. QUICK CONTACT ACTION BAR (Blokholds Style: Email | Phone | Instagram) */}
      <section className="bg-[#1c1c1e] border-b border-white/10 py-4 sm:py-5 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 divide-x divide-white/10 text-center">
          {/* Email */}
          <a
            href="mailto:anemone@anemonegrip.com"
            className="flex flex-col items-center justify-center gap-1 text-neutral-300 hover:text-white transition-colors group px-2"
          >
            <Mail size={22} className="group-hover:scale-110 transition-transform text-white" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">Email</span>
          </a>

          {/* Phone / WhatsApp */}
          <a
            href="https://wa.me/6281218124221"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 text-neutral-300 hover:text-white transition-colors group px-2"
          >
            <Phone size={22} className="group-hover:scale-110 transition-transform text-white" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">Phone</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/anemonegrip/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 text-neutral-300 hover:text-white transition-colors group px-2"
          >
            <Instagram size={22} className="group-hover:scale-110 transition-transform text-white" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">Instagram</span>
          </a>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE STRIPS */}
      <section id="series-section" className="bg-black">
        {seriesStrips.map((strip) => (
          <div
            key={strip.id}
            className="relative min-h-[380px] md:min-h-[460px] flex items-center justify-center overflow-hidden border-b border-white/10 group cursor-pointer"
          >
            {/* Background Image with Hover Zoom */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50"
              style={{ backgroundImage: `url('${strip.bgImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80 transition-opacity group-hover:opacity-90" />

            {/* Strip Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-4 flex flex-col items-center justify-center text-center">
              <div>
                <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] inline-block bg-white/10 border border-white/20 px-3 py-1 rounded">
                  {strip.tag}
                </span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-sans group-hover:text-neutral-300 transition-colors text-center">
                <Link to={strip.path}>{strip.title}</Link>
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium max-w-2xl mx-auto text-center leading-relaxed">
                {strip.subtitle}
              </p>

              <div className="pt-4 flex justify-center">
                <Link
                  to={strip.path}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-white/40 pb-1 hover:border-white transition-colors"
                >
                  <span>Explore Series</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}

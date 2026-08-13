import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function CatalogDownloadBanner() {
  return (
    <section className="py-24 md:py-36 min-h-[45vh] flex items-center justify-center bg-black border-t border-white/10">
      <div className="max-w-xl mx-auto w-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
            <FileText size={24} />
          </div>

          <div className="space-y-2 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 block">
              CATALOG & ORDERFORM
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              COMING SOON
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed pt-1 max-w-sm mx-auto">
              Catalog resmi & orderform sedang dalam proses finalisasi. Silakan hubungi tim kami untuk informasi produk dan pemesanan.
            </p>
          </div>

          <a
            href="/contact"
            className="mt-2 bg-white text-black font-black uppercase text-xs tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
          >
            HUBUNGI KAMI
          </a>
        </motion.div>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { products } from '../data/products';
import { generateProductCatalogPdfHtml } from '../utils/pdfGenerator';

export default function CatalogDownloadBanner() {
  const handleDownloadCatalogPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const htmlContent = generateProductCatalogPdfHtml(products);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <section className="py-24 md:py-36 min-h-[45vh] flex items-center justify-center bg-black border-t border-white/10">
      <div className="max-w-xl mx-auto w-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-6"
        >
          {/* Button 1: Catalog 2025-2026 */}
          <button
            onClick={handleDownloadCatalogPdf}
            style={{ marginBottom: '28px' }}
            className="w-full sm:w-[380px] bg-[#1a1a1a] border border-white/30 text-white font-semibold text-base sm:text-lg px-8 py-4.5 rounded-2xl hover:bg-neutral-800 hover:border-white/50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
          >
            <Download size={20} className="text-neutral-300 group-hover:text-white transition-colors" />
            <span>Catalog 2025-2026</span>
          </button>

          {/* Button 2: Orderform* */}
          <button
            onClick={handleDownloadCatalogPdf}
            className="w-full sm:w-[380px] bg-[#1a1a1a] border border-teal text-teal font-semibold text-base sm:text-lg px-8 py-4.5 rounded-2xl hover:bg-teal hover:text-black transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
          >
            <Download size={20} className="text-teal group-hover:text-black transition-colors" />
            <span>Orderform*</span>
          </button>

          {/* Footnote note */}
          <p className="text-neutral-400 font-sans text-xs sm:text-sm tracking-wide pt-4">
            *Prices outside Indonesia may vary!
          </p>
        </motion.div>
      </div>
    </section>
  );
}

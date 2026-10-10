import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';

export default function SetterManifestModal() {
  const { items, removeItem, updateQuantity, clearCart, manifestOpen, setManifestOpen } = useCartStore();

  const totalSets = items.reduce((acc, item) => acc + item.quantity, 0);

  // Estimate total weight (Macros ~ 3.48kg/set, Holds ~ 1.85kg/set)
  const totalWeight = items.reduce((acc, item) => {
    const isMacro = (item.product?.category || '').toLowerCase() === 'macros';
    const weightPerSet = isMacro ? 3.48 : 1.85;
    return acc + weightPerSet * item.quantity;
  }, 0);

  const handleWhatsAppDispatch = () => {
    if (items.length === 0) return;

    let message = `*ANEMONE LAB — ROUTE SETTER MANIFEST INQUIRY*\n`;
    message += `────────────────────────────\n`;
    message += `Total Sets: ${totalSets} Sets\n`;
    message += `Estimasi Bobot: ${totalWeight.toFixed(2)} KG\n\n`;
    message += `*DAFTAR PRODUK:*\n`;

    items.forEach((item, index) => {
      const color = item.selectedVariants?.Color ? ` [Color: ${item.selectedVariants.Color}]` : '';
      const cat = item.product?.category || 'Hold';
      const mat = item.product?.material || 'PU';
      const bolt = item.product?.specs?.boltType || (cat.toLowerCase() === 'macros' ? 'Screw-on' : 'M10 Allen');
      message += `${index + 1}. *${item.product?.name}* (${cat} - ${mat})\n`;
      message += `   • Qty: ${item.quantity} Set${color}\n`;
      message += `   • Bolt: ${bolt}\n`;
      message += `   • Estimasi: ${formatPrice((item.product?.price || 0) * item.quantity)}\n\n`;
    });

    message += `────────────────────────────\n`;
    message += `Mohon konfirmasi ketersediaan batch produksi dan jadwal pengiriman. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/628569044778?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleExportCsv = () => {
    if (items.length === 0) return;

    const headers = ['Series/Category', 'Product Name', 'Quantity (Sets)', 'Color', 'Material', 'Bolt Insert', 'Est. Price'];
    const rows = items.map((item) => [
      item.product?.category || '',
      `"${item.product?.name || ''}"`,
      item.quantity,
      item.selectedVariants?.Color || 'Standard',
      item.product?.material || '',
      item.product?.specs?.boltType || '',
      item.product?.price || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anemone_manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Dark Sticky Floating Manifest Bar */}
      <AnimatePresence>
        {totalSets > 0 && (
          <motion.aside
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-black text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 border border-[#262B2E] flex items-center gap-3 sm:gap-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                <span className="font-label-mono text-[11px] sm:text-xs tracking-wider uppercase text-white">
                  SETTER MANIFEST : <span className="font-bold text-white">{totalSets} SETS</span>
                </span>
              </div>
              <span className="text-[#666D71] font-label-mono text-xs">|</span>
              <span className="hidden md:inline font-label-mono text-[11px] sm:text-xs text-[#a0a0a0]">
                WEIGHT: <span className="text-white font-medium">{totalWeight.toFixed(2)} KG</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManifestOpen(true)}
                  className="bg-white text-black rounded-full px-3.5 sm:px-4 py-1 font-label-mono text-[11px] uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  VIEW LIST
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppDispatch}
                  className="bg-white text-black rounded-full px-3.5 sm:px-4 py-1 font-label-mono text-[11px] uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>B2B DISPATCH</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Manifest Modal Drawer */}
      <AnimatePresence>
        {manifestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setManifestOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-neutral-950 border border-[#262B2E] max-w-2xl w-full p-6 sm:p-8 flex flex-col max-h-[85vh] overflow-hidden shadow-2xl z-10 text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#262B2E]">
                <div>
                  <span className="font-label-mono text-[10px] text-[#666D71] uppercase tracking-wider">
                    ANEMONE LAB • ROUTE SETTER SPEC SHEET
                  </span>
                  <h3 className="font-headline-code text-xl sm:text-2xl text-white mt-0.5 uppercase tracking-wide font-bold">
                    Project Volume Requisition
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setManifestOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
                  aria-label="Close manifest modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Itemized Table */}
              <div className="overflow-y-auto my-4 flex-1">
                {items.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="font-label-mono text-xs uppercase text-[#666D71]">
                      Manifest Tray is Empty
                    </p>
                    <p className="font-body-sm text-xs text-[#666D71]">
                      Pilih produk dari katalog dan klik "+ MANIFEST" untuk menambahkan spesifikasi volume.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left font-label-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#262B2E] text-[#666D71] uppercase text-[10px]">
                        <th className="py-2">Series</th>
                        <th className="py-2">Product</th>
                        <th className="py-2 text-center">Sets</th>
                        <th className="py-2">Material / Color</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262B2E]">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-[#666D71] text-[11px] font-medium uppercase">
                            {item.product?.category}
                          </td>
                          <td className="py-3 text-white font-semibold">
                            {item.product?.name}
                          </td>
                          <td className="py-3 text-center">
                            <div className="inline-flex items-center border border-[#262B2E] rounded bg-black">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-1.5 py-0.5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="px-2 text-[11px] font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-1.5 py-0.5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-[#666D71] text-[11px]">
                            {item.product?.material}
                            {item.selectedVariants?.Color && (
                              <span className="block text-[10px] text-white">
                                • {item.selectedVariants.Color}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 uppercase text-[10px] hover:underline cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#262B2E] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="font-label-mono text-[11px] text-[#666D71] text-center sm:text-left">
                  <span>ESTIMATED WEIGHT: <strong className="text-white">{totalWeight.toFixed(2)} KG</strong></span>
                  <br />
                  <span className="text-white font-medium">DISPATCH FROM: BANDUNG HUB (INDONESIA)</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="px-3 py-1.5 text-[11px] font-label-mono uppercase text-[#666D71] hover:text-white transition-colors cursor-pointer"
                    >
                      CLEAR
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={items.length === 0}
                    className="flex-1 sm:flex-none border border-[#262B2E] px-4 py-2 rounded-full font-label-mono text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    EXPORT CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppDispatch}
                    disabled={items.length === 0}
                    className="flex-1 sm:flex-none bg-white text-black px-5 py-2 rounded-full font-label-mono text-xs uppercase tracking-wider font-bold text-center hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    <span>DIRECT INQUIRY</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ShoppingBag, FileText, Send } from "lucide-react";
import { generateOrderFormPdfHtml } from "../utils/pdfGenerator";

export default function OrderSuccess() {
  const mockOrderId = React.useMemo(() => {
    return `ANM-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  const dateStr = React.useMemo(() => {
    const today = new Date();
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  }, []);

  // Print / Download Order Form PDF
  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = generateOrderFormPdfHtml({
      orderNo: mockOrderId,
      date: dateStr,
      status: 'Processing',
      items: 'Anemone Gear Order',
      total: 0,
    });

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Send WhatsApp Confirmation
  const handleSendWhatsApp = () => {
    const messageText = `Halo Anemone, pesanan saya telah berhasil dibuat!\n\n📝 *ORDER NO:* ${mockOrderId}\n📅 *Tanggal:* ${dateStr}\n status: *Processing*\n\nMohon info proses pengiriman pesanan saya. Terima kasih!`;
    const encodedText = encodeURIComponent(messageText);
    const businessWhatsAppNumber = "6287883976827";
    window.open(`https://wa.me/${businessWhatsAppNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Animated Glow Check Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-teal/20 blur-xl rounded-full" />
            <div className="relative w-20 h-20 bg-teal/10 border border-teal/30 rounded-full flex items-center justify-center text-teal">
              <CheckCircle2 size={44} className="animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Order Placed Successfully!
            </h1>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Thank you for choosing Anemone. Your order is being processed and will be shipped soon.
            </p>
          </div>

          {/* Mock Order Details Box */}
          <div className="rounded-2xl border border-white/5 bg-neutral-950 p-6 space-y-3 text-left">
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
              <span className="text-neutral-500 font-medium">Order Form No.</span>
              <span className="font-mono text-teal font-bold">{mockOrderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
              <span className="text-neutral-500 font-medium">Status</span>
              <span className="text-xs bg-teal/10 border border-teal/20 text-teal px-2.5 py-0.5 rounded-full font-semibold">
                Processing
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500 font-medium">Date</span>
              <span className="text-neutral-300">{dateStr}</span>
            </div>
          </div>

          {/* Order Form Quick Actions (Download PDF & Send WA) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPdf}
              className="h-12 bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Send size={16} />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-teal text-black font-bold uppercase tracking-wider text-sm w-full py-4 rounded-xl hover:shadow-glow-teal transition-all duration-200"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider w-full py-2 transition-colors"
            >
              View Order in Dashboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

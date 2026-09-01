import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Send, CheckCircle2, Package, ShieldCheck, MapPin, Phone, User, Calendar } from "lucide-react";
import { useOrdersStore } from "../store/ordersStore";
import { formatPrice } from "../data/products";
import Logo from "../components/Logo";

export default function Invoice() {
  const { orderId } = useParams();
  const orders = useOrdersStore((s) => s.orders) || [];

  // Find order from store
  const order = useMemo(() => {
    if (!orderId) return null;
    const cleanId = String(orderId).trim().toLowerCase();
    return orders.find(
      (o) =>
        String(o.id).toLowerCase() === cleanId ||
        String(o.orderNo).toLowerCase() === cleanId ||
        String(o.details?.orderNo).toLowerCase() === cleanId
    );
  }, [orders, orderId]);

  // Fallback defaults if order is accessed via direct link
  const displayId = order?.id || order?.orderNo || orderId || "ANM-2026-0000";
  const displayCustomer = order?.customer || order?.details?.customer?.fullName || "Pelanggan Anemone";
  const displayPhone = order?.phone || order?.details?.customer?.phone || "+62 856 9044 778";
  const displayAddress = order?.address || order?.details?.customer?.address || "Alamat pengiriman diinfokan via WhatsApp";
  const displayDate = order?.date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const displayStatus = order?.status || "Processing";
  
  // Extract items list
  const itemsList = useMemo(() => {
    if (order?.rawItems && order.rawItems.length > 0) {
      return order.rawItems;
    }
    if (order?.details?.items && Array.isArray(order.details.items)) {
      return order.details.items.map((item) => ({
        name: item.name || item.product?.name || "Climbing Product",
        quantity: item.quantity || 1,
        price: item.price || item.product?.price || 0,
        selectedVariants: item.selectedVariants || {},
      }));
    }
    // Default single item fallback if total exists
    if (order?.total) {
      return [
        {
          name: order.items || "Anemone Climbing Gear Order",
          quantity: 1,
          price: order.total,
          selectedVariants: {},
        },
      ];
    }
    return [
      {
        name: "Anemone Climbing Gear Order",
        quantity: 1,
        price: 0,
        selectedVariants: {},
      },
    ];
  }, [order]);

  const subtotal = order?.total || itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `Halo Anemone, saya ingin konfirmasi pesanan Invoice ${displayId} atas nama ${displayCustomer}. Rincian pesanan: https://anemonegrip.com/invoice/${displayId}`;
  const whatsappUrl = `https://wa.me/628569044778?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-100 font-sans print:bg-white print:text-black py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      
      {/* ─── PRINT CSS OVERRIDES ─── */}
      <style>{`
        @media print {
          @page {
            margin: 15mm;
            size: A4 portrait;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-clean {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #e5e5e5 !important;
            box-shadow: none !important;
          }
          .print-table th {
            background-color: #f5f5f5 !important;
            color: #000000 !important;
            border-color: #000000 !important;
          }
          .print-table td {
            border-color: #e5e5e5 !important;
            color: #000000 !important;
          }
          .print-badge {
            border: 1px solid #000000 !important;
            color: #000000 !important;
            background: transparent !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ─── TOP ACTION BAR (HIDDEN DURING PRINT) ─── */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Toko</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm transition-colors shadow-sm"
            >
              <Send size={15} />
              <span>Konfirmasi WA</span>
            </a>
          </div>
        </div>

        {/* ─── MAIN INVOICE PAPER CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="print-clean bg-neutral-950 border border-white/10 rounded-sm p-6 sm:p-12 space-y-10 shadow-2xl"
        >
          
          {/* HEADER: LOGO & INVOICE TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/10 print:border-black pb-8">
            <div className="space-y-3">
              <Link to="/" className="inline-block">
                <Logo className="h-8 sm:h-9" />
              </Link>
              <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-xs print:text-neutral-600">
                Premium Climbing Holds, Macros, Volumes &amp; Smart Wall Ecosystem.
                <br />
                Bandung, Jawa Barat — Indonesia
              </p>
            </div>

            <div className="sm:text-right space-y-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400 print:text-neutral-600 block">
                OFFICIAL DIGITAL INVOICE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black font-mono tracking-tight">
                {displayId}
              </h1>
              <div className="inline-flex items-center gap-2 pt-1">
                <span className="print-badge inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 print:text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm">
                  <CheckCircle2 size={12} className="text-emerald-400 print:text-black" />
                  <span>{displayStatus}</span>
                </span>
              </div>
            </div>
          </div>

          {/* METADATA 3-COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b border-white/10 print:border-black pb-8">
            
            {/* 1. Billed To */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 print:text-neutral-600 block">
                DITAGIHKAN KEPADA (BILLED TO)
              </span>
              <div className="space-y-1 text-neutral-200 print:text-black">
                <p className="font-bold text-sm text-white print:text-black flex items-center gap-2">
                  <User size={14} className="text-neutral-400 print:text-black shrink-0" />
                  <span>{displayCustomer}</span>
                </p>
                <p className="text-neutral-400 print:text-neutral-700 flex items-center gap-2 font-mono">
                  <Phone size={13} className="text-neutral-400 print:text-black shrink-0" />
                  <span>{displayPhone}</span>
                </p>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 print:text-neutral-600 block">
                ALAMAT PENGIRIMAN
              </span>
              <div className="space-y-1 text-neutral-300 print:text-neutral-800 leading-relaxed flex items-start gap-2">
                <MapPin size={14} className="text-neutral-400 print:text-black shrink-0 mt-0.5" />
                <p className="font-light">{displayAddress}</p>
              </div>
            </div>

            {/* 3. Invoice Summary Details */}
            <div className="space-y-2 md:text-right">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 print:text-neutral-600 block">
                RINCIAN TANGGAL &amp; METODE
              </span>
              <div className="space-y-1 font-mono text-neutral-300 print:text-neutral-800">
                <p className="flex md:justify-end items-center gap-2">
                  <Calendar size={13} className="text-neutral-400 print:text-black shrink-0" />
                  <span>{displayDate}</span>
                </p>
                <p className="text-neutral-400 print:text-neutral-600 text-[11px]">
                  Metode: <strong className="text-white print:text-black">WhatsApp / Transfer</strong>
                </p>
              </div>
            </div>

          </div>

          {/* ITEM TABLE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 print:text-neutral-600 flex items-center gap-2">
                <Package size={15} />
                <span>DAFTAR PESANAN (ORDER ITEMS)</span>
              </span>
            </div>

            <div className="overflow-x-auto border border-white/10 print:border-black rounded-sm">
              <table className="w-full text-left border-collapse text-xs print-table">
                <thead>
                  <tr className="bg-white/5 print:bg-neutral-100 border-b border-white/10 print:border-black text-[10px] font-mono uppercase tracking-widest text-neutral-400 print:text-black">
                    <th className="py-3 px-4 w-12 text-center">NO</th>
                    <th className="py-3 px-4">PRODUK / ITEM</th>
                    <th className="py-3 px-4 text-center">QTY</th>
                    <th className="py-3 px-4 text-right">HARGA SATUAN</th>
                    <th className="py-3 px-4 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200">
                  {itemsList.map((item, idx) => {
                    const variantsArr = item.selectedVariants
                      ? Object.entries(item.selectedVariants)
                      : [];
                    const itemTotal = (item.price || 0) * (item.quantity || 1);

                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 text-center font-mono text-neutral-400 print:text-neutral-600">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white print:text-black uppercase tracking-wide">
                            {item.name}
                          </div>
                          {variantsArr.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {variantsArr.map(([k, v]) => (
                                <span
                                  key={k}
                                  className="text-[9px] font-mono bg-white/5 print:bg-neutral-200 border border-white/10 print:border-neutral-400 px-1.5 py-0.5 rounded text-neutral-300 print:text-neutral-800"
                                >
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-white print:text-black">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-neutral-300 print:text-black">
                          {formatPrice(item.price || 0)}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-white print:text-black">
                          {formatPrice(itemTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTAL & PAYMENT SUMMARY SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-4 border-t border-white/10 print:border-black">
            
            {/* Left: Payment Instructions */}
            <div className="md:col-span-7 bg-[#0a0a0a] print:bg-neutral-50 border border-white/10 print:border-neutral-300 rounded-sm p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-white print:text-black">
                <ShieldCheck size={16} className="text-teal print:text-black" />
                <h4 className="font-bold uppercase text-xs tracking-wider">
                  INSTRUKSI PEMBAYARAN &amp; KONFIRMASI
                </h4>
              </div>
              <p className="text-[11px] text-neutral-400 print:text-neutral-700 font-light leading-relaxed">
                Nomor rekening pembayaran resmi dan total ongkos kirim ke alamat Anda akan dikonfirmasikan langsung oleh tim Anemone melalui WhatsApp.
              </p>
              <div className="pt-1 flex items-center gap-2 font-mono text-xs text-white print:text-black">
                <span className="text-neutral-400">WhatsApp Resmi:</span>
                <span className="font-bold">+62 856 9044 778</span>
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="md:col-span-5 space-y-3 text-xs font-mono">
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Subtotal Produk:</span>
                <span className="text-white print:text-black font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-700">
                <span>Estimasi Ongkir:</span>
                <span className="italic text-neutral-300 print:text-neutral-800">Diinfokan via WhatsApp</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-white/15 print:border-black text-sm font-bold">
                <span className="text-white print:text-black uppercase tracking-wider">Total Estimasi:</span>
                <span className="text-xl sm:text-2xl font-black text-white print:text-black">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

          </div>

          {/* FOOTER SIGNATURE & BRAND PROMISE */}
          <div className="pt-8 border-t border-white/5 print:border-neutral-300 text-center space-y-2">
            <p className="text-[11px] text-neutral-400 print:text-neutral-600 uppercase font-mono tracking-widest">
              &copy; 2026 ANEMONE CLIMBING HOLDS &bull; BUILT BY CLIMBERS, FOR CLIMBERS.
            </p>
            <p className="text-[10px] text-neutral-600 print:text-neutral-500">
              Dokumen ini merupakan invoice digital resmi yang digenerate oleh sistem Anemone Grip.
            </p>
          </div>

        </motion.div>

      </div>
    </div>
  );
}

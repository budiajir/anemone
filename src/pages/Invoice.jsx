import React, { useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Send } from "lucide-react";
import { useOrdersStore } from "../store/ordersStore";
import { formatPrice } from "../data/products";
import { decodeOrderData } from "../utils/orderEncoder";

export default function Invoice() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orders = useOrdersStore((s) => s.orders) || [];
  const addOrder = useOrdersStore((s) => s.addOrder);

  // 1. Check if encoded data is provided in URL (?d=...)
  const encodedData = searchParams.get("d");
  const decodedFromUrl = useMemo(() => {
    if (!encodedData) return null;
    return decodeOrderData(encodedData);
  }, [encodedData]);

  // If decoded from URL, persist to store
  useEffect(() => {
    if (decodedFromUrl) {
      addOrder(decodedFromUrl);
    }
  }, [decodedFromUrl, addOrder]);

  // 2. Find order from store or fallback to decoded URL / params
  const order = useMemo(() => {
    if (decodedFromUrl) return decodedFromUrl;

    if (!orderId) return null;
    const cleanId = String(orderId).trim().toLowerCase();
    return orders.find(
      (o) =>
        String(o.id).toLowerCase() === cleanId ||
        String(o.orderNo).toLowerCase() === cleanId ||
        String(o.details?.orderNo).toLowerCase() === cleanId
    );
  }, [decodedFromUrl, orders, orderId]);

  // Metadata Fallbacks
  const displayId = order?.orderNo || order?.id || orderId || "ANM-2026-0000";
  const displayCustomer =
    order?.customer?.fullName ||
    order?.customer ||
    order?.name ||
    order?.details?.customer?.fullName ||
    "Pelanggan Anemone";
  const displayPhone =
    order?.customer?.phone ||
    order?.phone ||
    order?.details?.customer?.phone ||
    "-";
  const displayAddress =
    order?.customer?.address ||
    order?.address ||
    order?.details?.customer?.address ||
    "Alamat pengiriman diinfokan via WhatsApp";
  const displayDate =
    order?.date ||
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const displayStatus = order?.status || "PROCESSING";

  // Format items list
  const itemsList = useMemo(() => {
    if (order?.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((item) => {
        let fullName = item.name || item.product?.name || "Climbing Product";
        if (item.variantsText) {
          if (!fullName.includes(item.variantsText)) {
            fullName += ` (${item.variantsText})`;
          }
        } else if (item.selectedVariants && typeof item.selectedVariants === "object") {
          const vStr = Object.entries(item.selectedVariants)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          if (vStr && !fullName.includes(vStr)) {
            fullName += ` (${vStr})`;
          }
        }
        const qty = item.quantity || 1;
        const price = item.price || item.product?.price || 0;
        return {
          name: fullName,
          quantity: qty,
          price: price,
          total: item.total || price * qty,
        };
      });
    }

    if (order?.rawItems && Array.isArray(order.rawItems)) {
      return order.rawItems.map((item) => {
        const qty = item.quantity || 1;
        const price = item.price || 0;
        return {
          name: item.name || "Climbing Hold",
          quantity: qty,
          price: price,
          total: price * qty,
        };
      });
    }

    if (order?.details?.items && Array.isArray(order.details.items)) {
      return order.details.items.map((item) => {
        const name = item.name || item.product?.name || "Climbing Hold";
        const variantsText = item.selectedVariants
          ? Object.entries(item.selectedVariants)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          : "";
        const fullName = name + (variantsText ? ` (${variantsText})` : "");
        const price = item.price || item.product?.price || 0;
        const qty = item.quantity || 1;
        return {
          name: fullName,
          quantity: qty,
          price,
          total: price * qty,
        };
      });
    }

    if (order?.total) {
      return [
        {
          name: order.items || "Anemone Climbing Gear",
          quantity: 1,
          price: order.total,
          total: order.total,
        },
      ];
    }

    return [];
  }, [order]);

  const total =
    order?.total ||
    itemsList.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `Halo Anemone, saya ingin konfirmasi Order Form No. ${displayId} atas nama ${displayCustomer}. Rincian pesanan: ${window.location.href}`;
  const whatsappUrl = `https://wa.me/628569044778?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-900 font-sans print:bg-white print:p-0 py-8 sm:py-12 px-4 sm:px-6">
      {/* ─── PRINT CSS STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
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
          .order-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* ─── TOP ACTION BAR (NO PRINT) ─── */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10 text-white">
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-sm"
            >
              <Send size={15} />
              <span>Konfirmasi WA</span>
            </a>
          </div>
        </div>

        {/* ─── OFFICIAL ORDER FORM PAPER (100% Identical to Previous Design) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="order-sheet bg-white text-black p-8 sm:p-14 shadow-2xl rounded-sm border border-neutral-200"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* 1. Header: Logo Block & ORDER FORM */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 sm:mb-14">
            <div className="bg-black text-white px-6 py-4 flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 5C52.7614 5 55 25.1472 55 50C55 74.8528 52.7614 95 50 95C47.2386 95 45 74.8528 45 50C45 25.1472 47.2386 5 50 5Z"
                  fill="#FFF"
                />
                <path
                  d="M95 50C95 52.7614 74.8528 55 50 55C25.1472 55 5 52.7614 5 45C5 47.2386 25.1472 45 50 45C74.8528 45 95 47.2386 95 50Z"
                  fill="#FFF"
                />
                <path
                  d="M81.8198 18.1802C83.7724 20.1328 68.0416 34.6274 50.5 50.5C32.9584 66.3726 16.2276 79.8672 14.275 77.9146C12.3224 75.962 25.817 59.2542 43.3585 43.3817C60.9001 27.5091 79.8672 16.2276 81.8198 18.1802Z"
                  fill="#FFF"
                />
                <path
                  d="M14.275 18.1802C12.3224 20.1328 27.817 34.6274 45.3585 50.5C62.9001 66.3726 79.6309 79.8672 81.5835 77.9146C83.5361 75.962 70.0416 59.2542 52.5 43.3817C34.9584 27.5091 16.2276 16.2276 14.275 18.1802Z"
                  fill="#FFF"
                />
              </svg>
              <span className="font-black text-xl tracking-[2px] uppercase">
                ANEMONE
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-normal tracking-wide uppercase text-black">
              ORDER FORM
            </div>
          </div>

          {/* 2. Meta Container (Customer Details & Order No) */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10 pb-2">
            <div className="flex-1 max-w-md space-y-1 text-sm">
              <div className="text-xs text-neutral-500 font-normal mb-1">
                Order form by:
              </div>
              <div className="text-lg font-bold text-black uppercase tracking-tight">
                {displayCustomer}
              </div>
              <div className="text-neutral-700 font-medium">{displayPhone}</div>
              <div className="text-neutral-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {displayAddress}
              </div>
            </div>

            <div className="sm:text-right space-y-1.5 min-w-[200px] text-sm">
              <div className="font-bold text-[15px] text-black">
                Order Form No. {displayId}
              </div>
              <div className="text-neutral-500 font-medium">Date: {displayDate}</div>
              <div className="pt-1">
                <span className="inline-block bg-black text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                  {displayStatus}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Items Table */}
          <div className="overflow-x-auto mb-8 border border-black">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 w-[10%] text-center border-r border-neutral-700">
                    QTY
                  </th>
                  <th className="py-3 px-4 w-[55%] text-left border-r border-neutral-700">
                    ITEM DESCRIPTION
                  </th>
                  <th className="py-3 px-4 w-[17.5%] text-right border-r border-neutral-700">
                    PRICE
                  </th>
                  <th className="py-3 px-4 w-[17.5%] text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {itemsList.length > 0 ? (
                  itemsList.map((item, idx) => (
                    <tr key={idx} className="border-b border-black">
                      <td className="py-3.5 px-3 text-center border-r border-black font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 border-r border-black">
                        <div className="font-semibold text-xs sm:text-[13px] uppercase tracking-wide">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right border-r border-black font-mono font-medium text-xs sm:text-sm">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-xs sm:text-sm">
                        {formatPrice(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-neutral-400">
                      Tidak ada rincian item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Total Summary */}
          <div className="flex justify-end mt-6">
            <table className="min-w-[280px] sm:min-w-[320px] text-right">
              <tbody>
                <tr className="border-t border-neutral-300">
                  <td className="py-3 pr-4 text-xs sm:text-sm font-bold text-neutral-700 uppercase tracking-widest">
                    TOTAL AMOUNT
                  </td>
                  <td className="py-3 font-mono font-black text-lg sm:text-xl text-black">
                    {formatPrice(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

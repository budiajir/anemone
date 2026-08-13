import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, CreditCard, FileText, Send, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { formatPrice } from '../data/products';
import { generateOrderFormPdfHtml } from '../utils/pdfGenerator';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  // Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Form States (Name, Phone, Address are user inputs in the checkout modal)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Automatic Order Metadata (Computed automatically, no inputs)
  const [orderNo, setOrderNo] = useState("");
  const [date, setDate] = useState("");

  // Initialize date & order no automatically on mount
  useEffect(() => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const today = new Date();
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    setDate(formattedDate);

    // Format: ANM-YYYYMMDD-RANDOM4
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    setOrderNo(`ANM-${yyyy}${mm}${dd}-${random}`);
  }, [showCheckoutModal]); // Regenerate unique number if modal opens

  const handleCheckout = () => {
    alert("Checkout simulator: Pembayaran dan integrasi sistem ekosistem Anemone akan terhubung di tahap selanjutnya!");
  };

  // Generate WhatsApp Message & Redirect
  const handleSendWhatsApp = () => {
    const formattedTotal = formatPrice(getTotal());
    
    // Format product items list for WhatsApp text
    const itemsList = items.map((item, idx) => {
      const variantsText = Object.entries(item.selectedVariants || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      const itemName = item.product.name + (variantsText ? ` (${variantsText})` : '');
      const itemPrice = formatPrice(item.product.price);
      const itemTotal = formatPrice(item.product.price * item.quantity);
      return `${idx + 1}. *${itemName}*\n   Qty: ${item.quantity} x ${itemPrice} = *${itemTotal}*`;
    }).join('\n\n');
    
    // Construct WA chat template with bold markup
    const messageText = `Halo Anemone, saya ingin melakukan pemesanan dengan detail berikut:

📝 *ORDER FORM NO:* ${orderNo}
📅 *Tanggal:* ${date}

👤 *DETAIL PEMESAN:*
• *Nama:* ${name}
• *No. HP:* ${phone}
• *Alamat:* ${address}

📦 *DAFTAR PESANAN:*
${itemsList}

💵 *TOTAL PEMBAYARAN:* *${formattedTotal}*

Saya juga telah menyiapkan dokumen PDF Order Form untuk pesanan ini. Mohon info langkah pembayaran selanjutnya. Terima kasih!`;

    const encodedText = encodeURIComponent(messageText);
    // Anemone Business WhatsApp Number (using international format)
    const businessWhatsAppNumber = "6281218124221"; 
    const whatsappUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodedText}`;
    
    // Save to shared store for Admin Panel
    useOrdersStore.getState().addOrder({
      orderNo: orderNo || `ANM-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: { fullName: name, phone, address },
      items: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: getTotal(),
      status: 'Processing',
    });

    window.open(whatsappUrl, '_blank');
  };

  // Generate PDF / Print Order Form window
  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = generateOrderFormPdfHtml({
      orderNo,
      customer: { fullName: name, phone, address },
      details: {
        items: items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selectedVariants: item.selectedVariants,
        })),
      },
      total: getTotal(),
      status: 'Processing',
    });

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (items.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-neutral-950 border border-white/5 rounded-3xl flex items-center justify-center mx-auto text-neutral-600">
            <ShoppingBag size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Your Cart Is Empty</h2>
            <p className="text-neutral-500 text-sm font-light leading-relaxed">
              Keranjang belanja Anda kosong. Telusuri katalog kami untuk menemukan holds, training boards, atau paket Smart Wall terbaik.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-3.5 rounded uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-28 md:pt-36 pb-20">
      <div style={{ maxWidth: '1280px' }} className="mx-auto w-full px-6 md:px-12">
        
        {/* HEADER */}
        <header className="border-b border-white/5 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-teal text-xs font-bold tracking-widest uppercase">Shopping Bag</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Shopping Cart
            </h1>
          </div>
          <button 
            onClick={clearCart}
            className="text-neutral-500 hover:text-coral text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer self-start sm:self-auto"
          >
            Clear All Items
          </button>
        </header>

        {/* TWO-COLUMN GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ITEM LIST WITH ANIMATION */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-neutral-950 border border-white/[0.06] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-white/20 transition-colors group"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded overflow-hidden bg-neutral-900 border border-white/[0.06] shrink-0 filter grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img 
                      src={item.product?.images?.[0] || item.product?.image || '/images/crimps.jpg'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details info */}
                  <div className="flex-1 text-center sm:text-left space-y-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-white font-bold text-base truncate uppercase tracking-wide">
                        {item.product.name}
                      </h3>
                      <span className="text-white text-sm font-bold shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xs">
                      <span className="text-neutral-500 uppercase tracking-widest font-semibold text-[10px]">
                        {item.product.category}
                      </span>
                      {Object.keys(item.selectedVariants || {}).length > 0 && (
                        <>
                          <span className="text-white/10">•</span>
                          <span className="text-neutral-400 font-light">
                            {Object.entries(item.selectedVariants || {})
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' | ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Controls & Delete row */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-white/10 rounded overflow-hidden bg-neutral-950 h-9">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 h-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 h-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-600 hover:text-white transition-colors rounded cursor-pointer"
                      aria-label="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY BOX */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-neutral-950 border border-white/[0.06] rounded-lg p-6 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-sm font-light text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping Est.</span>
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border border-white/10">
                    Calculated Next
                  </span>
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline text-white">
                  <span className="font-bold uppercase tracking-wider text-xs">Total Price</span>
                  <span className="text-2xl font-black text-white">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* Checkout Trigger (Navigates to /checkout) */}
                <Link
                  to="/checkout"
                  className="w-full bg-white text-black font-bold uppercase tracking-wider rounded px-8 py-3.5 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard size={14} />
                  Proceed to Checkout
                </Link>

                {/* Generate Order Form Modal Trigger */}
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full border border-white/20 text-white font-bold uppercase tracking-wider rounded px-8 py-3.5 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Generate Order Form (PDF / WA)</span>
                </button>

                <Link
                  to="/shop"
                  className="w-full h-11 border border-white/10 hover:border-white/20 text-neutral-500 hover:text-white font-bold uppercase tracking-wider text-[10px] rounded transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={12} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CHECKOUT MODAL (Data Pemesanan Popup) */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-white/10 rounded-lg p-6 md:p-8 max-w-lg w-full space-y-6 relative overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Title Header */}
              <div className="space-y-1">
                <span className="text-teal text-xs font-bold tracking-widest uppercase block">Order Form Details</span>
                <h3 className="text-xl font-bold uppercase text-white tracking-wide">
                  Lengkapi Data Pemesanan
                </h3>
                <p className="text-neutral-500 text-xs font-light">
                  Silakan isi nama, telepon, dan alamat Anda. Nomor pemesanan dan tanggal akan dibuat secara otomatis oleh sistem Anemone.
                </p>
              </div>

              {/* Autogenerated Fields Info Banner */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 uppercase font-semibold text-[10px] block">Order Form No. (Auto)</span>
                  <span className="text-white font-bold tracking-wide mt-1 block font-mono">{orderNo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase font-semibold text-[10px] block">Tanggal Formulir (Auto)</span>
                  <span className="text-white font-bold mt-1 block">{date}</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-400">Nama Pemesan</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors placeholder-neutral-600"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-400">Nomor Telepon</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors placeholder-neutral-600"
                    placeholder="Contoh: 081218124221"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-400">Alamat Pengiriman Lengkap</label>
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/30 outline-none transition-colors placeholder-neutral-600 resize-none"
                    placeholder="Tuliskan alamat lengkap tujuan pengiriman..."
                  />
                </div>
              </div>

              {/* Order Actions inside Modal */}
              <div className="flex flex-col gap-3 pt-2">
                {/* WhatsApp Send */}
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-white text-black rounded font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send WhatsApp</span>
                </button>

                {/* Download PDF */}
                <button
                  onClick={handleDownloadPdf}
                  className="w-full border border-white/20 text-white rounded font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Optional simulated full checkout */}
              <button
                onClick={handleCheckout}
                className="w-full h-11 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white font-bold uppercase tracking-wider text-xs rounded transition-colors flex items-center justify-center gap-2"
              >
                Proceed via Sandbox Gateway
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

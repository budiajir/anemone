import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Truck, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useOrdersStore } from "../store/ordersStore";
import { formatPrice } from "../data/products";
import { openWhatsAppChat } from "../utils/whatsapp";

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/shop", { replace: true });
    }
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const subtotal = getTotal();
  const total = subtotal;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const random4 = Math.floor(1000 + Math.random() * 9000);
    const orderNo = `ANM-2026-${random4}`;
    const fullAddress = `${form.address}, ${form.city} ${form.postalCode}`;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const digitalInvoiceUrl = `https://anemonegrip.com/invoice/${orderNo}`;

    // 1. Save to Orders Store for Digital Invoice and Admin
    try {
      useOrdersStore.getState().addOrder({
        orderNo,
        date: today,
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: fullAddress,
        },
        items: items.map((item) => ({
          name: item.product?.name || 'Product',
          quantity: item.quantity || 1,
          price: item.product?.price || 0,
          selectedVariants: item.selectedVariants || {},
          product: item.product,
        })),
        total,
        status: 'Processing',
      });
    } catch (err) {
      console.warn("Orders store save notice:", err);
    }

    // 2. Format WhatsApp Order message with Digital Invoice URL
    const itemsList = items.map((item, idx) => {
      const variantsText = Object.entries(item.selectedVariants || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      const itemName = (item.product?.name || 'Product') + (variantsText ? ` (${variantsText})` : '');
      const itemPrice = formatPrice(item.product?.price || 0);
      const itemTotal = formatPrice((item.product?.price || 0) * (item.quantity || 1));
      return `${idx + 1}. *${itemName}*\n   Qty: ${item.quantity} x ${itemPrice} = *${itemTotal}*`;
    }).join('\n\n');

    const messageText = `Halo Anemone, saya ingin melakukan pemesanan resmi dengan rincian berikut:

📝 *ORDER NO:* ${orderNo}
📅 *Tanggal:* ${today}

👤 *DATA PEMESAN:*
• *Nama:* ${form.fullName}
• *Email:* ${form.email}
• *No. WhatsApp:* ${form.phone}
• *Alamat:* ${fullAddress}

📦 *DAFTAR PESANAN:*
${itemsList}

💵 *TOTAL HARGA PRODUK:* *${formatPrice(total)}*
🚚 *Ongkos Kirim:* _(Diinfokan oleh Admin)_

🔗 *DIGITAL INVOICE LINK:*
${digitalInvoiceUrl}

📄 Dokumen invoice & rincian pesanan resmi dapat diakses dan dicetak melalui tautan di atas. Mohon informasi total keseluruhan beserta rekening pembayaran. Terima kasih!`;

    // 3. Open WhatsApp directly (without popup blocker issues)
    openWhatsAppChat(messageText, "628569044778");

    clearCart();
    navigate("/order-success");
  };

  const isFormValid =
    form.fullName && form.email && form.phone && form.address && form.city && form.postalCode;

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Back link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white text-sm font-medium transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-10">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ─── LEFT COLUMN: Shipping Form ─── */}
            <div className="lg:col-span-7 space-y-8">
              {/* Shipping Details */}
              <div className="bg-neutral-950 border border-white/[0.06] rounded-lg p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Truck size={20} className="text-white" />
                  <h2 className="text-lg font-bold uppercase tracking-wider">
                    Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nama Lengkap" />
                  <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@domain.com" />
                  <InputField label="Phone Number / WhatsApp" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08569044778" />
                  <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Kota / Kabupaten" />
                  <div className="sm:col-span-2">
                    <InputField label="Shipping Address" name="address" value={form.address} onChange={handleChange} placeholder="Jl. Raya No. 123, Kelurahan, Kecamatan..." />
                  </div>
                  <InputField label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="12345" />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-neutral-950 border border-white/[0.06] rounded-lg p-6 md:p-8 space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-white" />
                  <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                    Instruksi Pembayaran
                  </h2>
                </div>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  Detail ongkos kirim, nomor rekening, dan konfirmasi pembayaran akan diinformasikan langsung oleh tim Anemone melalui WhatsApp setelah pesanan dibuat.
                </p>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Order Summary ─── */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-950 border border-white/[0.06] rounded-lg p-6 md:p-8 sticky top-28 space-y-6">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  Order Summary
                </h2>

                {/* Item list */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="w-14 h-14 rounded overflow-hidden bg-neutral-900 shrink-0 group transition-all duration-500">
                        <img
                          src={item.product?.images?.[0] || item.product?.image || '/images/crimps.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white whitespace-nowrap">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-white/5 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal Produk</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Ongkos Kirim</span>
                    <span className="text-neutral-400 text-xs italic">Diinfokan via WhatsApp</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10 text-base font-bold text-white">
                    <span>Total Produk</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Place Order Button with WhatsApp and Auto PDF */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2.5 ${
                    isFormValid && !submitting
                      ? "bg-[#25D366] hover:bg-[#20bd5a] text-white cursor-pointer shadow-lg"
                      : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Memproses Pesanan &amp; PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Checkout ke WhatsApp &amp; PDF</span>
                    </>
                  )}
                </motion.button>

                <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
                  Pesanan langsung terhubung ke WhatsApp resmi Anemone.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block uppercase text-xs font-bold tracking-wider text-neutral-400 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-white/30 outline-none placeholder-neutral-600 transition-colors"
      />
    </div>
  );
}

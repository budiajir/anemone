import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, FileText, X, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { formatPrice } from '../data/products';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  // Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Form States (Name, Phone, Address)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  // Automatic Order Metadata
  const [orderNo, setOrderNo] = useState("");
  const [date, setDate] = useState("");

  // Initialize date & order no automatically on mount or modal open (Format: ANM-2026-XXXX)
  useEffect(() => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const today = new Date();
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    setDate(formattedDate);

    // Format: ANM-2026-XXXX (4 random digits)
    const random = Math.floor(1000 + Math.random() * 9000);
    setOrderNo(`ANM-2026-${random}`);
  }, [showCheckoutModal]);

  // Combined 1-Click WhatsApp Checkout + Digital Invoice Link
  const handleCheckoutViaWhatsApp = (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat pengiriman terlebih dahulu.");
      return;
    }

    const formattedTotal = formatPrice(getTotal());
    const digitalInvoiceUrl = `https://anemonegrip.com/invoice/${orderNo}`;
    
    // 1. SAVE TO ORDERS STORE (Persisted for Digital Invoice / Admin)
    try {
      useOrdersStore.getState().addOrder({
        orderNo,
        date,
        customer: { fullName: name, phone, address },
        items: items.map((item) => ({
          name: item.product?.name || 'Product',
          quantity: item.quantity || 1,
          price: item.product?.price || 0,
          selectedVariants: item.selectedVariants || {},
          product: item.product,
        })),
        total: getTotal(),
        status: 'Processing',
      });
    } catch (err) {
      console.warn("Orders store save notice:", err);
    }

    // 2. FORMAT WHATSAPP ORDER DRAFT MESSAGE WITH DIGITAL INVOICE LINK
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
📅 *Tanggal:* ${date}

👤 *DATA PEMESAN:*
• *Nama:* ${name}
• *No. WhatsApp:* ${phone}
• *Alamat:* ${address}

📦 *DAFTAR PESANAN:*
${itemsList}

💵 *TOTAL HARGA PRODUK:* *${formattedTotal}*
🚚 *Ongkos Kirim:* _(Diinfokan oleh Admin)_

🔗 *DIGITAL INVOICE LINK:*
${digitalInvoiceUrl}

📄 Dokumen invoice & rincian pesanan resmi dapat diakses dan dicetak melalui tautan di atas. Mohon informasi total keseluruhan dan rekening pembayaran. Terima kasih!`;

    // 3. RELIABLY OPEN WHATSAPP TO ADMIN NUMBER (Without popup blocker issues)
    openWhatsAppChat(messageText, "628569044778");
    setShowCheckoutModal(false);
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
            <ArrowLeft size={16} />
            <span>Explore Catalog</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500 block">
              YOUR SELECTION
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              Shopping Cart
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-rose-400 uppercase tracking-widest font-bold self-start sm:self-auto transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        {/* 2-COLUMN GRID: CART ITEMS & SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start">
          
          {/* LEFT COLUMN: LIST OF CART ITEMS */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-950 border border-white/[0.06] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-white/20 transition-colors group"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded overflow-hidden bg-neutral-900 border border-white/[0.06] shrink-0 transition-all duration-500">
                    <img 
                      src={item.product?.images?.[0] || item.product?.image || '/images/crimps.jpg'} 
                      alt={item.product?.name || 'Product'} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title & Material Specs */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {item.product?.category || 'Holds'}
                      </span>
                      {item.product?.material && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                          {item.product.material}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white uppercase text-sm sm:text-base tracking-wide">
                      {item.product?.name || 'Product'}
                    </h3>
                    
                    {/* Selected Variants / Color */}
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-xs text-neutral-400 font-mono flex flex-wrap gap-2 pt-0.5">
                        {Object.entries(item.selectedVariants || {}).map(([key, val]) => (
                          <span key={key} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px]">
                            {key}: <strong className="text-neutral-200">{val}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center sm:text-right">
                    <div className="text-white font-bold text-sm">
                      {formatPrice(item.product?.price || 0)}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      Sub: {formatPrice((item.product?.price || 0) * (item.quantity || 1))}
                    </div>
                  </div>

                  {/* Quantity Adjuster & Delete */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded overflow-hidden bg-black">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                  <span>Total Produk ({items.reduce((sum, i) => sum + i.quantity, 0)} item)</span>
                  <span className="text-white font-medium">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ongkos Kirim</span>
                  <span className="text-neutral-300 font-medium text-xs italic">
                    Diinfokan via WhatsApp
                  </span>
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-baseline text-white">
                  <span className="font-bold uppercase tracking-wider text-xs">Total Pembayaran</span>
                  <span className="text-2xl font-black text-white">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* 1-CLICK WHATSAPP CHECKOUT (AUTOMATIC PDF) */}
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold uppercase tracking-wider text-xs py-4 rounded transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Checkout ke WhatsApp</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1 text-center">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Langsung terhubung ke WhatsApp Admin + Link Invoice</span>
                </div>

                <Link
                  to="/shop"
                  className="w-full h-11 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white font-bold uppercase tracking-wider text-[10px] rounded transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <ArrowLeft size={12} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CHECKOUT MODAL (Data Pemesanan & 1-Click WhatsApp + Digital Invoice) */}
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block font-mono">
                  DIRECT WHATSAPP CHECKOUT
                </span>
                <h3 className="text-xl font-bold uppercase text-white tracking-wide">
                  Lengkapi Data Pemesanan
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  Isi data di bawah ini. Ketika dikirim, sistem akan <strong className="text-white">langsung membuka WhatsApp resmi Anemone</strong> beserta tautan Digital Invoice resmi pesanan Anda.
                </p>
              </div>

              {/* Autogenerated Fields Info Banner */}
              <div className="bg-black border border-white/10 rounded p-3.5 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 uppercase text-[9px] block">Order No. (Auto)</span>
                  <span className="text-white font-bold tracking-wide mt-0.5 block">{orderNo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase text-[9px] block">Tanggal (Auto)</span>
                  <span className="text-white font-bold mt-0.5 block">{date}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCheckoutViaWhatsApp} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-300">
                    Nama Pemesan *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/40 outline-none transition-colors placeholder-neutral-600"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-300">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/40 outline-none transition-colors placeholder-neutral-600"
                    placeholder="Contoh: 08569044778"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-bold tracking-wider text-neutral-300">
                    Alamat Pengiriman Lengkap *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white/40 outline-none transition-colors placeholder-neutral-600 resize-none"
                    placeholder="Tuliskan alamat lengkap tujuan pengiriman (jalan, no rumah, kota, kode pos)..."
                  />
                </div>

                {/* Single Direct Action Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded font-bold uppercase tracking-wider py-4 text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xl"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Kirim Pesan &amp; Invoice ke WhatsApp</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

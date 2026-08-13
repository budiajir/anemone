import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Truck, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useOrdersStore } from "../store/ordersStore";
import { formatPrice } from "../data/products";
import { createOrder } from "../services/api";

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

    const orderPayload = {
      orderNo: `ANM-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      paymentMethod: "WhatsApp Confirmation",
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
      })),
      subtotal,
      subtotal,
      shippingCost: "Diinfokan via WhatsApp",
      total,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save order to shared ordersStore so it appears instantly in Admin Panel
      useOrdersStore.getState().addOrder(orderPayload);
      await createOrder(orderPayload);
    } catch (err) {
      console.warn("Order submission encountered error, proceeding to success screen:", err);
    } finally {
      clearCart();
      navigate("/order-success");
    }
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
                  <Truck size={20} className="text-teal" />
                  <h2 className="text-lg font-bold uppercase tracking-wider">
                    Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
                  <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" />
                  <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08123456789" />
                  <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Jakarta" />
                  <div className="sm:col-span-2">
                    <InputField label="Shipping Address" name="address" value={form.address} onChange={handleChange} placeholder="Jl. Raya No. 123, Kelurahan..." />
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
                          className="w-full h-full object-cover"
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

                {/* Place Order Button with API integration */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2 ${
                    isFormValid && !submitting
                      ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
                      : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    "Place Order"
                  )}
                </motion.button>

                <p className="text-[11px] text-neutral-600 text-center leading-relaxed">
                  By placing this order you agree to our Terms of Service and Privacy Policy.
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

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Gym Order Inquiry",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const messageText = `Halo Anemone, ada pesan baru dari Formulir Kontak Website:

👤 *NAMA:* ${formData.name}
✉️ *EMAIL:* ${formData.email}
🏷️ *KATEGORI:* ${formData.subject}

💬 *PESAN:*
${formData.message}`;

    const encodedText = encodeURIComponent(messageText);
    window.open(`https://wa.me/628569044778?text=${encodedText}`, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "Gym Order Inquiry", message: "" });
    }, 4000);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      
      {/* 1. TITLE & DIRECT ACTION BUTTONS (BLOKHOLDS STYLE) */}
      <section style={{ paddingTop: '180px' }} className="pb-16 px-6 md:px-12 border-b border-white/10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center justify-center w-full">
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white text-center w-full"
          >
            CONTACT US
          </motion.h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Hubungi tim Anemone untuk konsultasi pengadaan holds gimnasium, pesanan kustom, atau integrasi Smart Wall.
          </p>

          {/* Action Buttons Stack (Direct Email & Phone/WhatsApp - Blokholds Style) */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 w-full">
            <a
              href="mailto:anemone@anemonegrip.com"
              className="w-full sm:w-[380px] bg-[#1a1a1a] border border-white/30 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-2xl hover:bg-neutral-800 hover:border-white/50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
            >
              <Mail size={19} className="text-neutral-300 group-hover:text-white transition-colors" />
              <span>anemone@anemonegrip.com</span>
            </a>

            <a
              href="https://wa.me/628569044778"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-[380px] bg-[#1a1a1a] border border-teal text-teal font-semibold text-sm sm:text-base px-8 py-4 rounded-2xl hover:bg-teal hover:text-black transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
            >
              <Phone size={19} className="text-teal group-hover:text-black transition-colors" />
              <span>+62 856 9044 778</span>
            </a>

            <a
              href="https://www.instagram.com/anemonegrip/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-[380px] bg-[#1a1a1a] border border-white/30 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-2xl hover:bg-neutral-800 hover:border-white/50 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 group-hover:text-white transition-colors">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@anemonegrip</span>
            </a>
          </div>

        </div>
      </section>

      {/* 2. FORM & HQ DETAILS SECTION */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 bg-black border border-white/10 rounded-sm p-6 sm:p-8 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-2xl font-black uppercase tracking-wider text-white">
                  KIRIM PESAN LANGSUNG
                </h3>
                <p className="text-neutral-400 text-xs font-light">
                  Isi formulir di bawah ini dan tim spesialis kami akan membalas dalam 1x24 jam.
                </p>
              </div>

              {submitted ? (
                <div className="bg-white/5 border border-teal/40 rounded-sm p-6 text-center space-y-3">
                  <CheckCircle2 size={36} className="text-teal mx-auto" />
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="text-neutral-400 text-xs font-light">
                    Terima kasih telah menghubungi Anemone. Tim kami akan merespons pesan Anda sesegera mungkin.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama Anda..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3.5 text-white text-xs focus:border-white/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3.5 text-white text-xs focus:border-white/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                      Kategori Pertanyaan
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3.5 text-white text-xs focus:border-white/40 outline-none transition-colors"
                    >
                      <option value="Gym Order Inquiry">Gym Order &amp; Catalog Request</option>
                      <option value="Custom Holds Shaping">Custom Holds Shaping &amp; Color</option>
                      <option value="Smart Wall Project">Smart Wall Ecosystem Project</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pesan atau spesifikasi pesanan Anda..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-3.5 text-white text-xs focus:border-white/40 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2 pt-3"
                  >
                    <Send size={14} />
                    <span>KIRIM PESAN</span>
                  </button>
                </form>
              )}

            </div>

            {/* Right Column: HQ Info & Business Hours (5 Cols) */}
            <div className="lg:col-span-5 bg-black border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
                    HEADQUARTERS &amp; MANUFACTURING
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-wider text-white">
                    ANEMONE HQ
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Tile 1: Workshop */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 space-y-2 hover:border-white/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <MapPin size={16} />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-wider">
                        WORKSHOP &amp; WAREHOUSE
                      </h4>
                    </div>
                    <p className="text-neutral-400 text-xs font-light leading-relaxed pl-11">
                      Komplek Griya Bandung Indah Blok F19 No. 55, Desa Buah Batu, Kec. Bojongsoang, Kab. Bandung
                    </p>
                  </div>

                  {/* Tile 2: Operating Hours */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 space-y-2 hover:border-white/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <Clock size={16} />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-wider">
                        JAM OPERASIONAL
                      </h4>
                    </div>
                    <div className="text-neutral-400 text-xs font-light leading-relaxed pl-11 space-y-1">
                      <p>Senin – Jumat: <span className="text-white font-mono font-medium">09.00 – 17.00 WIB</span></p>
                      <p>Sabtu – Minggu: <span className="text-white font-mono font-medium">Dengan Janji Temu</span></p>
                    </div>
                  </div>

                  {/* Tile 3: Fast Response Support */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 space-y-2 hover:border-white/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-teal shrink-0">
                        <MessageSquare size={16} />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-wider">
                        FAST RESPONSE SUPPORT
                      </h4>
                    </div>
                    <p className="text-neutral-400 text-xs font-light leading-relaxed pl-11">
                      Respon cepat WhatsApp resmi <span className="text-teal font-mono font-bold">+62 856 9044 778</span> untuk pertanyaan stok &amp; pengiriman sampel holds.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

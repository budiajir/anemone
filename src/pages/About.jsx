import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Wind, Box } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

/* ─── DATA ─── */
const materials = [
  {
    icon: <Layers size={22} />,
    title: "POLYURETHANE (PU) RESIN",
    tag: "HOLDS",
    description:
      "Lightweight, unbreakable, and engineered for maximum skin-friendly friction that resists chalk buildup.",
    specs: ["Skin-friendly texture", "Chalk-resistant surface", "Unbreakable under competition load"],
  },
  {
    icon: <Wind size={22} />,
    title: "FIBERGLASS (MACROS)",
    tag: "MACROS",
    description:
      "Ultra-lightweight hollow-back macros featuring clean dual-texture or single-texture options for modern aesthetic setting.",
    specs: ["Hollow-back construction", "Dual / single texture options", "Competition-grade weight"],
  },
  {
    icon: <Box size={22} />,
    title: "BALTIC BIRCH PLYWOOD",
    tag: "VOLUMES",
    description:
      "Precision 5-axis CNC cut plywood volumes with high-friction coating and reinforced bolt inserts.",
    specs: ["5-axis CNC precision", "High-friction coating", "Reinforced T-nut inserts"],
  },
];

const guides = [
  {
    label: "BOULDERING",
    stat: "5 – 15",
    unit: "holds / problem",
    note: "Depending on wall angle & movement variety.",
  },
  {
    label: "LEAD CLIMBING",
    stat: "3 – 7",
    unit: "holds / vertical meter",
    note: "Varies by difficulty grade & route style.",
  },
  {
    label: "FINISHES",
    stat: "2",
    unit: "texture types",
    note: "Single Texture (full friction) vs Dual Texture (slick + grip zones for technical movement).",
  },
];

export default function About() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section
        style={{ paddingTop: "180px" }}
        className="pb-20 md:pb-28 px-6 md:px-12 border-b border-white/10 flex items-center justify-center"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8 flex flex-col items-center w-full">
          {/* Chip badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full"
          >
            ANEMONE // ABOUT US
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] text-center"
          >
            WHERE
            <br />
            MOVEMENT
            <br />
            FLOWS.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-lg text-center"
          >
            We are a collective of climbers obsessed with shape, movement, and
            friction. From plastic walls to natural crags, our mission is to
            design climbing holds that make movement feel intuitive, fluid, and
            memorable.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ENGINEERED MATERIALS SECTION (FULL WIDTH)
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full space-y-12">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
              MATERIAL SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              ENGINEERED MATERIALS
            </h2>
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Setiap material dipilih dan diuji untuk memenuhi standar kompetisi internasional dan ketahanan penggunaan komersial harian.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {materials.map((mat) => (
              <motion.div
                key={mat.title}
                variants={fadeUp}
                className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-4 hover:border-white/25 transition-colors group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                      {mat.icon}
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                      {mat.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    {mat.title}
                  </h3>
                  <p className="text-neutral-400 text-xs font-light leading-relaxed">
                    {mat.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  {mat.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-white/40 rounded-full shrink-0" />
                      <span className="text-neutral-300 text-[11px] font-light">{spec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          ROW 2 — SETTER GUIDE (left) + CTA (right)
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* LEFT — Setter & Buyer Guide */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
                  FOR ROUTE SETTERS & GYM OWNERS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  SETTER & BUYER GUIDE
                </h2>
                <p className="text-neutral-400 text-sm font-light leading-relaxed">
                  Panduan cepat untuk memperkirakan kebutuhan holds berdasarkan
                  disiplin panjat dan tipe dinding Anda.
                </p>
              </motion.div>

              <motion.div variants={stagger} className="space-y-4">
                {guides.map((g) => (
                  <motion.div
                    key={g.label}
                    variants={fadeUp}
                    className="bg-black border border-white/10 rounded-sm p-5 hover:border-white/25 transition-colors flex items-center gap-6"
                  >
                    <div className="text-center shrink-0 w-20">
                      <span className="text-3xl font-black text-white tracking-tight block">{g.stat}</span>
                      <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">{g.unit}</span>
                    </div>
                    <div className="border-l border-white/10 pl-5 space-y-1 flex-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 block">{g.label}</span>
                      <p className="text-neutral-400 text-xs font-light leading-relaxed">{g.note}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-8 lg:sticky lg:top-32"
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
                  NEXT STEP
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  READY TO ELEVATE YOUR WALL?
                </h2>
                <p className="text-neutral-400 text-sm font-light leading-relaxed">
                  Jelajahi katalog lengkap climbing holds kami atau coba demo
                  interaktif Smart Wall untuk merasakan pengalaman panjat
                  digital dari Anemone.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-3">
                <Link
                  to="/shop"
                  className="bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2.5"
                >
                  EXPLORE CATALOG
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/smart-wall"
                  className="border border-white/20 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2.5"
                >
                  TRY SMART WALL DEMO
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="border border-white/10 text-neutral-400 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2.5"
                >
                  HUBUNGI TIM ANEMONE
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}

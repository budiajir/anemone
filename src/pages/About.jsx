import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Wind, Box } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/* ─── DATA (Volumes is strictly Plywood) ─── */
const materials = [
  {
    icon: <Layers size={20} />,
    title: "POLYURETHANE (PU) RESIN",
    tag: "HOLDS",
    description:
      "Lightweight, unbreakable, and engineered for maximum skin-friendly friction that resists chalk buildup.",
    specs: ["Skin-friendly texture", "Chalk-resistant surface", "Unbreakable under competition load"],
  },
  {
    icon: <Wind size={20} />,
    title: "FIBERGLASS (MACROS)",
    tag: "MACROS",
    description:
      "Ultra-lightweight hollow-back macros featuring clean dual-texture or single-texture options for modern aesthetic setting.",
    specs: ["Hollow-back construction", "Dual / single texture options", "Competition-grade weight"],
  },
  {
    icon: <Box size={20} />,
    title: "PLYWOOD",
    tag: "VOLUMES",
    description:
      "High-grade plywood precision 5-axis CNC cut volumes with high-friction textured coating and reinforced T-nut inserts.",
    specs: ["High-grade Plywood", "5-axis CNC precision", "High-friction textured coating"],
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
          1. HERO SECTION
          ═══════════════════════════════════════ */}
      <section
        style={{ paddingTop: "180px" }}
        className="pb-20 md:pb-28 px-6 md:px-12 border-b border-white/10 flex items-center justify-center text-center"
      >
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center w-full">
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
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95]"
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
            className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto"
          >
            We are a collective of climbers obsessed with shape, movement, and
            friction. From plastic walls to natural crags, our mission is to
            design climbing holds that make movement feel intuitive, fluid, and
            memorable.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. ENGINEERED MATERIALS (SEJAJAR & RAPI)
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full space-y-12">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
              MATERIAL SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              ENGINEERED MATERIALS
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
              Setiap material dipilih dan diuji untuk memenuhi standar kompetisi internasional dan ketahanan penggunaan komersial harian.
            </p>
          </motion.div>

          {/* 3-Cards Grid with strict equal height & baseline alignment */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {materials.map((mat) => (
              <motion.div
                key={mat.title}
                variants={fadeUp}
                className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 flex flex-col justify-between hover:border-white/30 transition-all group h-full"
              >
                <div className="space-y-4">
                  {/* Icon & Category Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                      {mat.icon}
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                      {mat.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    {mat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs font-light leading-relaxed min-h-[54px]">
                    {mat.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="pt-5 mt-6 border-t border-white/10 flex flex-col gap-2">
                  {mat.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
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
          3. SETTER GUIDE (LEFT) & CTA (RIGHT) - SEJAJAR
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

            {/* LEFT COLUMN: SETTER & BUYER GUIDE (7 Cols) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-7 space-y-6 flex flex-col justify-between"
            >
              {/* Header */}
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
                  FOR ROUTE SETTERS &amp; GYM OWNERS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  SETTER &amp; BUYER GUIDE
                </h2>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  Panduan cepat untuk memperkirakan kebutuhan holds &amp; volumes berdasarkan disiplin panjat dinding Anda.
                </p>
              </motion.div>

              {/* 3 Rows */}
              <motion.div variants={stagger} className="space-y-3.5 flex-1 flex flex-col justify-center">
                {guides.map((g) => (
                  <motion.div
                    key={g.label}
                    variants={fadeUp}
                    className="bg-black border border-white/10 rounded-sm p-4 sm:p-5 hover:border-white/25 transition-colors flex items-center gap-5"
                  >
                    <div className="text-center shrink-0 w-24">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight block font-mono">{g.stat}</span>
                      <span className="text-neutral-400 text-[9px] font-bold uppercase tracking-wider">{g.unit}</span>
                    </div>
                    <div className="border-l border-white/10 pl-5 space-y-1 flex-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block">{g.label}</span>
                      <p className="text-neutral-400 text-xs font-light leading-relaxed">{g.note}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN: CTA CARD (5 Cols) - MATCHING HEIGHT */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:col-span-5 bg-black border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between h-full space-y-8"
            >
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
                  NEXT STEP
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                  READY TO ELEVATE YOUR WALL?
                </h2>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  Jelajahi katalog lengkap climbing holds kami atau coba demo interaktif Smart Wall untuk merasakan pengalaman panjat digital dari Anemone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <Link
                  to="/shop"
                  className="bg-white text-black font-black uppercase tracking-widest text-xs px-6 py-4 rounded-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2.5"
                >
                  <span>EXPLORE CATALOG</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/smart-wall"
                  className="border border-white/20 text-white font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-sm hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2.5"
                >
                  <span>TRY SMART WALL DEMO</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="border border-white/10 text-neutral-400 font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-sm hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2.5"
                >
                  <span>HUBUNGI TIM ANEMONE</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}

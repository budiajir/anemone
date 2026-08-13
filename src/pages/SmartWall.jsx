import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Smartphone, Zap, SmartphoneIcon, Settings, BarChart2, Cpu, Sparkles, Layers } from 'lucide-react';


const gradesData = {
  v3: {
    id: "v3",
    label: "V3 (Beginner)",
    name: "Golden Ladder",
    holds: {
      start: [[1, 2], [1, 4]],
      route: [[3, 3], [5, 2], [7, 4]],
      top: [[9, 3]]
    },
    description: "Rute dasar dengan tumpuan tangan seimbang. Ideal untuk latihan daya tahan dan gerakan dasar."
  },
  v5: {
    id: "v5",
    label: "V5 (Intermediate)",
    name: "Crimson Traverse",
    holds: {
      start: [[1, 1], [1, 5]],
      route: [[2, 2], [4, 1], [6, 4], [7, 2], [8, 5]],
      top: [[9, 4]]
    },
    description: "Jalur silang membutuhkan kontrol inti (core tension) dan genggaman crimp yang lebih kuat."
  },
  v8: {
    id: "v8",
    label: "V8 (Advanced)",
    name: "Tidal Dyno",
    holds: {
      start: [[1, 3]],
      route: [[3, 5], [4, 2], [6, 6], [8, 1]],
      top: [[9, 6]]
    },
    description: "Rute tingkat lanjut dengan jangkauan lebar (dyno) dan tuntutan presisi jari tingkat tinggi."
  }
};

export default function SmartWall() {
  const [selectedGrade, setSelectedGrade] = useState("v5");

  const ledRows = 10;
  const ledCols = 7;

  const currentRoute = gradesData[selectedGrade];

  // Helper to determine LED light status & styling
  const getLedStatus = (r, c) => {
    const isStart = currentRoute.holds.start.some(([row, col]) => row === r && col === c);
    if (isStart) {
      return {
        bgClass: "bg-emerald-400 border-emerald-300",
        shadow: "rgba(52, 211, 153, 0.9)",
        type: "START"
      };
    }

    const isTop = currentRoute.holds.top.some(([row, col]) => row === r && col === c);
    if (isTop) {
      return {
        bgClass: "bg-rose-500 border-rose-400",
        shadow: "rgba(244, 63, 94, 0.95)",
        type: "TOP"
      };
    }

    const isRoute = currentRoute.holds.route.some(([row, col]) => row === r && col === c);
    if (isRoute) {
      return {
        bgClass: "bg-cyan-400 border-cyan-300",
        shadow: "rgba(34, 211, 238, 0.9)",
        type: "ROUTE"
      };
    }

    return null;
  };


  const steps = [
    {
      title: "INSTALL HARDWARE",
      description: "Pasang modul LED pintar dan pengontrol Anemone ke struktur dinding panjatmu dengan plug-and-play wiring.",
      icon: Box
    },
    {
      title: "CONNECT THE APP",
      description: "Buka aplikasi Anemone di smartphone dan sambungkan via Bluetooth/Wi-Fi secara instan dan otomatis.",
      icon: Smartphone
    },
    {
      title: "CLIMB & SHARE",
      description: "Pilih dari ribuan rute terdata, lihat lampu menyala di papan, dan catat kemajuan latihan harianmu.",
      icon: Zap
    }
  ];

  const appFeatures = [
    {
      title: "Route Creator",
      description: "Buat dan gambar jalur panjat baru langsung dengan menyentuh grid holds di layar hp Anda. Rute akan otomatis menyala di papan panjat fisik.",
      icon: Settings
    },
    {
      title: "Smart LED Blinking",
      description: "Lampu LED indikator menyala secara real-time dengan kode warna universal: Hijau untuk start, Biru/Teal untuk genggaman, dan Merah untuk top finish.",
      icon: SmartphoneIcon
    },
    {
      title: "Training Log & Stats",
      description: "Rekam statistik sesi Anda. Catat percobaan (attempts), keberhasilan menyelesaikan jalur (sends), dan visualisasikan dalam grafik perkembangan mingguan.",
      icon: BarChart2
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 grid lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Smart Wall App // Coming Soon on Stores</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
              Transform Your Wall<br />
              <span className="text-white">
                Into An Endless Crag
              </span>
            </h1>

            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
              Hubungkan papan panjat fisik Anda ke ribuan rute interaktif. Papan LED pintar memandu jalur panjat Anda secara instan dari aplikasi smartphone.
            </p>

            {/* APP COMING SOON STATUS BOX */}
            <div className="bg-neutral-950 border border-white/15 rounded-lg p-5 space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles size={16} />
                <span>MOBILE APP STATUS: COMING SOON</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                Aplikasi mobile Anemone Smart Wall sudah selesai dikembangkan! Saat ini kami sedang dalam tahap akhir penyesuaian <span className="text-white font-semibold">shaping points holds</span> sebelum dirilis secara resmi di Google Play Store &amp; Apple App Store.
              </p>

              {/* STORE BADGES */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="bg-black border border-white/10 px-4 py-2.5 rounded flex items-center gap-3 text-neutral-400 font-mono text-xs uppercase tracking-wider">
                  <SmartphoneIcon size={16} className="text-neutral-400" />
                  <div>
                    <span className="text-[9px] text-neutral-500 block leading-none">AVAILABLE SOON ON</span>
                    <span className="font-bold text-white text-xs">Google Play</span>
                  </div>
                </div>

                <div className="bg-black border border-white/10 px-4 py-2.5 rounded flex items-center gap-3 text-neutral-400 font-mono text-xs uppercase tracking-wider">
                  <SmartphoneIcon size={16} className="text-neutral-400" />
                  <div>
                    <span className="text-[9px] text-neutral-500 block leading-none">AVAILABLE SOON ON</span>
                    <span className="font-bold text-white text-xs">App Store</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#simulator"
                className="bg-white text-black hover:bg-neutral-200 font-bold px-8 py-3.5 rounded transition-colors uppercase tracking-wider text-xs flex items-center gap-2"
              >
                <Sparkles size={14} className="text-black" />
                Try Interactive LED Simulator
              </a>
            </div>
          </div>

          {/* Hero Right Visual Accent */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-[360px] aspect-[4/5] bg-neutral-950 border border-white/10 rounded-lg p-6 relative flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest text-neutral-500 border-b border-white/5 pb-4">
                <span className="flex items-center gap-2 text-white">
                  <Cpu size={14} className="text-white" />
                  Anemone Controller Hub v2
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  ONLINE
                </span>
              </div>

              <div className="space-y-4 my-auto py-6">
                <div className="bg-white/5 border border-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest">
                    <span className="text-neutral-400">Sync Rate</span>
                    <span className="text-white">&lt; 10ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded overflow-hidden">
                    <div className="h-full w-4/5 bg-white rounded animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-900 border border-white/5 rounded-lg p-3 text-center">
                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-widest block">LED Modules</span>
                    <span className="text-lg font-black text-white mt-1 block tracking-wider">50 - 100+</span>
                  </div>
                  <div className="bg-neutral-900 border border-white/5 rounded-lg p-3 text-center">
                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-widest block">App Directory</span>
                    <span className="text-lg font-black text-white mt-1 block tracking-wider">10,000+</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-500 text-center uppercase tracking-widest font-bold border-t border-white/5 pt-3">
                Plug & Play Bluetooth 5.0
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE LED SIMULATOR SECTION */}
      <section id="simulator" className="py-24 bg-neutral-950 border-b border-white/5 relative flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-8 space-y-12 flex flex-col items-center justify-center text-center">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center justify-center">
            <span className="text-white text-xs font-bold tracking-widest uppercase inline-flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              Interactive Demo
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight text-center">
              Interactive LED Simulator
            </h2>
            <p className="text-neutral-400 text-sm font-light leading-relaxed text-center">
              Uji coba bagaimana modul LED Anemone menyalakan jalur panjat secara instan sesuai tingkat kesulitan yang Anda pilih.
            </p>
          </div>

          {/* Simulator Box & Controls */}
          <div className="bg-neutral-950 border border-white/10 rounded-lg p-6 md:p-10 max-w-4xl mx-auto space-y-8 backdrop-blur-xl w-full flex flex-col items-center">
            
            {/* Top Grade Selector Buttons */}
            <div className="space-y-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">
                Pilih Tingkat Kesulitan (Grade Selector):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {Object.values(gradesData).map((grade) => {
                  const isActive = selectedGrade === grade.id;
                  return (
                    <button
                      key={grade.id}
                      onClick={() => setSelectedGrade(grade.id)}
                      className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? "bg-white text-black border-white"
                          : "border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      <Layers size={14} />
                      <span>{grade.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Grid & Route Info */}
            <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
              
              {/* LED Wall Grid */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-[320px] aspect-[3/4] bg-neutral-950 border border-white/10 rounded-lg p-5 relative flex flex-col justify-between">
                  {/* Status header inside board */}
                  <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest text-neutral-500 border-b border-white/5 pb-3 mb-3">
                    <span className="text-neutral-400">GRID 10 × 7</span>
                    <span className="text-white">{currentRoute.name}</span>
                  </div>

                  {/* 10x7 LED Grid */}
                  <div className="grid grid-cols-7 gap-y-3 gap-x-2 justify-items-center flex-1 items-center">
                    {Array.from({ length: ledRows }).map((_, r) => {
                      const rowIdx = ledRows - 1 - r;
                      return Array.from({ length: ledCols }).map((_, c) => {
                        const status = getLedStatus(rowIdx, c);
                        return (
                          <motion.div
                            key={`${rowIdx}-${c}`}
                            animate={{
                              scale: status ? [1, 1.2, 1] : 1,
                              boxShadow: status
                                ? `0 0 14px ${status.shadow}, inset 0 0 6px ${status.shadow}`
                                : "0 0 0px rgba(0,0,0,0)"
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: status ? Infinity : 0,
                              repeatType: "reverse"
                            }}
                            className={`w-4 h-4 rounded-full border transition-colors duration-300 ${
                              status ? status.bgClass : "bg-neutral-900 border-white/[0.04]"
                            }`}
                          />
                        );
                      });
                    })}
                  </div>
                </div>
              </div>

              {/* Route Details & Color Legend Side */}
              <div className="md:col-span-5 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoute.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-white text-xs font-bold uppercase tracking-widest block">Selected Route</span>
                      <h3 className="text-2xl font-black uppercase text-white tracking-widest mt-1">
                        {currentRoute.name}
                      </h3>
                      <p className="text-neutral-400 text-sm font-light leading-relaxed mt-2">
                        {currentRoute.description}
                      </p>
                    </div>

                    {/* Color Legend */}
                    <div className="bg-neutral-950 border border-white/5 rounded-lg p-4 space-y-3 text-xs">
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block border-b border-white/5 pb-2">
                        Petunjuk Warna Indikator LED:
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] shrink-0" />
                        <span className="text-neutral-300 font-medium">Start Hold (Pegangan Awal)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] shrink-0" />
                        <span className="text-neutral-300 font-medium">Hand Hold (Jalur Tangan)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] shrink-0" />
                        <span className="text-neutral-300 font-medium">Top Finish Hold (Pegangan Akhir)</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* Description Footer Requirement */}
            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-neutral-400 text-xs md:text-sm font-light italic leading-relaxed">
                "Contoh tampilan visual rute di dinding panjat yang disinkronkan secara instan melalui aplikasi Anemone."
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (THE ECOSYSTEM) */}
      <section className="py-24 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 text-center space-y-16">
          
          <div className="space-y-3">
            <span className="text-white text-xs font-bold tracking-widest uppercase">Simple Architecture</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              The Anemone Ecosystem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-neutral-950 border border-white/[0.06] p-8 rounded-lg space-y-6 relative hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon size={22} />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-neutral-600 font-black tracking-widest block uppercase">Step 0{idx + 1}</span>
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider">{step.title}</h3>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. APP FEATURE HIGHLIGHTS */}
      <section className="py-24 bg-neutral-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* App features description */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2">
                <span className="text-white text-xs font-bold tracking-widest uppercase">Self-Built Software</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                  Climbing Quantified
                </h2>
                <p className="text-neutral-400 text-sm font-light leading-relaxed">
                  Semua kendali ada dalam genggaman. Kami mendesain aplikasi Anemone secara khusus untuk memperkaya cara Anda berlatih di rumah.
                </p>
              </div>

              <div className="space-y-4">
                {appFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="bg-neutral-950 border border-white/[0.06] p-6 rounded-lg flex items-start gap-4 hover:border-white/20 transition-colors">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/10">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm">{feat.title}</h3>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* App Mockup Phone Display */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-72 bg-neutral-950 border border-white/10 rounded-lg p-3 relative">
                {/* Phone screen */}
                <div className="aspect-[9/19] rounded bg-black overflow-hidden border border-white/5 p-4 flex flex-col justify-between">
                  {/* Top Status */}
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-500 tracking-widest uppercase">
                    <span>ANEMONE APP</span>
                    <span className="text-white">ONLINE</span>
                  </div>

                  {/* Simulated App Route Display */}
                  <div className="space-y-4 my-auto">
                    <div className="space-y-1 text-center">
                      <span className="text-xs text-white font-bold uppercase tracking-widest block">Current Selection</span>
                      <h4 className="text-white font-black text-xl uppercase tracking-widest">{currentRoute.name}</h4>
                      <p className="text-neutral-500 text-xs uppercase font-bold tracking-widest">Grade {selectedGrade.toUpperCase()} • Active</p>
                    </div>

                    <div className="border border-white/5 bg-neutral-950 rounded p-4 space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold tracking-widest text-neutral-400">
                          <span>COMPLETION RATE</span>
                          <span>75%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center border-t border-white/5 pt-3">
                        <div>
                          <span className="text-neutral-500 text-xs uppercase font-bold tracking-widest block">Attempts</span>
                          <span className="text-white font-black text-sm">3</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-xs uppercase font-bold tracking-widest block">Best Time</span>
                          <span className="text-white font-black text-sm">1:24s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Bottom nav */}
                  <div className="border-t border-white/5 pt-3 flex justify-around text-neutral-500">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. KIT PACKAGES & PRICING — COMING SOON */}
      <section id="pricing" className="py-24 md:py-32 bg-black border-t border-white/5 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-8 text-center flex flex-col items-center justify-center">
          <div className="bg-neutral-950 border border-white/10 rounded-lg p-8 sm:p-12 space-y-6 flex flex-col items-center justify-center text-center w-full max-w-2xl">
            
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 mx-auto">
              <Sparkles size={24} />
            </div>

            <div className="space-y-2 text-center max-w-xl mx-auto flex flex-col items-center justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 block text-center">
                SMART WALL HARDWARE — COMING SOON
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight text-center">
                HARDWARE KITS &amp; PRE-ORDER
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed pt-2 text-center">
                Paket modul LED &amp; pengontrol hardware Smart Wall Kit saat ini sedang dalam proses manufaktur akhir. Pre-order resmi akan dibuka bersamaan dengan peluncuran aplikasi mobile Anemone di Play Store &amp; App Store.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link
                to="/contact"
                className="bg-white text-black font-black uppercase text-xs tracking-widest px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
              >
                HUBUNGI TIM ANEMONE
              </Link>
              <Link
                to="/shop?category=Holds"
                className="border border-white/20 text-white font-bold uppercase text-xs tracking-widest px-8 py-3.5 rounded hover:bg-white/5 transition-colors"
              >
                LIHAT KATALOG HOLDS
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

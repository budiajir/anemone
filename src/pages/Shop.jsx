import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SetterManifestModal from "../components/SetterManifestModal";
import { categories } from "../data/products";
import { getProducts } from "../services/api";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // API State
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBolt, setSelectedBolt] = useState("all");

  // Category from URL or route
  const activeCategory = useMemo(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const found = categories.find((c) => c.toLowerCase() === categoryParam.toLowerCase());
      if (found) return found;
    }
    if (location.pathname === "/macros") return "Macros";
    return "All";
  }, [searchParams, location.pathname]);

  // Fetch catalog from API / Supabase
  useEffect(() => {
    let isMounted = true;
    async function fetchCatalog() {
      setLoading(true);
      try {
        const data = await getProducts(activeCategory === "All" ? "" : activeCategory);
        if (isMounted) {
          setProductsList(data || []);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    if (cat === "All" || cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    searchParams.delete("category");
    setSearchParams(searchParams);
    setSelectedMaterial("all");
    setSelectedType("all");
    setSelectedBolt("all");
  };

  const isFiltered =
    activeCategory !== "All" ||
    selectedMaterial !== "all" ||
    selectedType !== "all" ||
    selectedBolt !== "all";

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const pMat = (product.material || "").toLowerCase();
      const pSpecs = product.specs || {};
      const pType = (pSpecs.type || "").toLowerCase();
      const pBolt = (pSpecs.boltType || "").toLowerCase();

      if (selectedMaterial !== "all" && !pMat.includes(selectedMaterial.toLowerCase())) {
        return false;
      }
      if (selectedType !== "all" && !pType.includes(selectedType.toLowerCase())) {
        return false;
      }
      if (selectedBolt !== "all" && !pBolt.includes(selectedBolt.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [productsList, selectedMaterial, selectedType, selectedBolt]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="w-full pt-16 bg-black min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col w-full">
          
          {/* Minimalist Title Section (Dark Flathold Editorial Heritage) */}
          <section className="w-full pt-14 pb-8 md:pt-18 md:pb-12 px-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 font-label-mono text-[11px] text-[#666D71] uppercase tracking-widest mb-2.5">
              <span>SYS.24</span>
              <span>•</span>
              <span>OFFICIAL IFSC PRODUCER</span>
              <span>•</span>
              <span>BANDUNG / ZÜRICH</span>
            </div>
            <h1 className="font-display-hero text-4xl sm:text-6xl md:text-7xl text-white tracking-tight font-bold leading-none uppercase">
              {activeCategory === "All" ? "Macros & Series" : activeCategory}
            </h1>
            <p className="mt-3.5 font-body-sm text-xs sm:text-sm text-[#666D71] max-w-xl text-center leading-relaxed">
              Dual-texture fiberglass volumes and high-density polyurethane geometries engineered for commercial setting dynamics and World Cup circuit compliance.
            </p>
          </section>

          {/* Precision Filter Bar (1:1 Flathold Minimalist Spec Selector) */}
          <section className="w-full border-t border-b border-[#262B2E] bg-black sticky top-16 z-30 transition-shadow duration-200">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-white">
              
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-label-mono text-xs">
                
                {/* Category / Series Families */}
                <div className="flex items-center gap-2">
                  <span className="text-[#666D71] whitespace-nowrap">Series families :</span>
                  <div className="relative inline-block">
                    <select
                      value={activeCategory.toLowerCase()}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="appearance-none bg-black border border-[#262B2E] rounded-full px-3 py-1 pr-6 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                    >
                      <option value="all" className="bg-black">ALL</option>
                      {categories.map((c) => (
                        <option key={c} value={c.toLowerCase()} className="bg-black">{c}</option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
                  </div>
                </div>

                {/* Material Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[#666D71] whitespace-nowrap">Material :</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="appearance-none bg-black border border-[#262B2E] rounded-full px-3 py-1 pr-6 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                    >
                      <option value="all" className="bg-black">ALL</option>
                      <option value="fiberglass" className="bg-black">Fiberglass (Macros)</option>
                      <option value="pu" className="bg-black">PU (Polyurethane)</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
                  </div>
                </div>

                {/* Hold Profile / Type Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[#666D71] whitespace-nowrap">Profile :</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="appearance-none bg-black border border-[#262B2E] rounded-full px-3 py-1 pr-6 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                    >
                      <option value="all" className="bg-black">ALL</option>
                      <option value="sloper" className="bg-black">Sloper &amp; Jug</option>
                      <option value="pinch" className="bg-black">Pinch</option>
                      <option value="crimp" className="bg-black">Crimp</option>
                      <option value="mini jug" className="bg-black">Mini Jug</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
                  </div>
                </div>

                {/* Bolt Insert Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[#666D71] whitespace-nowrap">Size :</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedBolt}
                      onChange={(e) => setSelectedBolt(e.target.value)}
                      className="appearance-none bg-black border border-[#262B2E] rounded-full px-3 py-1 pr-6 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                    >
                      <option value="all" className="bg-black">ALL</option>
                      <option value="screw-on" className="bg-black">Screw-on (Macro)</option>
                      <option value="m10" className="bg-black">M10 Allen</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
                  </div>
                </div>

              </div>

              {/* Quick Index Count & Reset */}
              <div className="flex items-center gap-4 font-label-mono text-xs">
                <span className="text-[#666D71] uppercase">
                  SHOWING {filteredProducts.length} / {productsList.length} SPECS
                </span>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-white underline hover:text-neutral-400 uppercase cursor-pointer"
                  >
                    RESET
                  </button>
                )}
              </div>

            </div>
          </section>

          {/* 4-Column Continuous Hairline Matrix (Direct Flathold Aesthetic on Pure Black) */}
          <section className="w-full bg-black">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 size={36} className="text-white animate-spin" />
                <p className="font-label-mono text-xs uppercase tracking-widest text-[#666D71]">
                  Loading Spec Matrix...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#262B2E]">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-28 px-6 text-center space-y-4 max-w-lg mx-auto">
                <span className="font-label-mono text-xs uppercase tracking-widest text-[#666D71] block">
                  ZERO MATCHES FOUND
                </span>
                <h3 className="font-headline-code text-2xl font-bold text-white uppercase">
                  Tidak Ada Produk yang Sesuai Filter
                </h3>
                <p className="font-body-sm text-xs text-[#666D71] leading-relaxed">
                  Coba ubah kriteria filter material atau profil pegangan, atau tekan tombol reset untuk kembali melihat seluruh inventaris.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-white text-black px-6 py-2.5 rounded-full font-label-mono text-xs uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  RESET FILTER
                </button>
              </div>
            )}
          </section>

          {/* Technical Material Index Matrix (Laboratory Precision on Dark Background) */}
          <section className="w-full bg-black py-16 lg:py-20 border-t border-[#262B2E] px-6 lg:px-12">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-label-mono text-xs text-[#666D71] uppercase tracking-widest">
                    SPECIFICATION COMPLIANCE
                  </span>
                  <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-white mt-1">
                    Material Integrity &amp; Friction Grain
                  </h2>
                </div>
                <p className="font-body-sm text-xs text-[#666D71] max-w-md leading-relaxed">
                  Every Anemone volume is cast under controlled pressure to prevent void bubbles, and finished with precision grit dispersion according to DIN 18032 friction standards.
                </p>
              </div>

              {/* 3 Dark Tech Spec Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-label-mono text-xs">
                
                {/* Tech 1 */}
                <div className="bg-[#070707] border border-[#262B2E] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-[#666D71] text-[10px] pb-3 border-b border-[#262B2E] uppercase">
                      <span>TECH.01</span>
                      <span className="font-semibold text-white">COMPLIANT IFSC</span>
                    </div>
                    <h3 className="font-headline-code text-xl font-bold text-white mt-4">
                      Dual-Tex Fiberglass
                    </h3>
                    <p className="font-body-sm text-xs text-[#666D71] mt-2 leading-relaxed">
                      Ultra-light hollow construction for competition macros. Combines high-gloss low-drag zero-step coating with 280-mesh micro-quartz perimeter holds.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#262B2E] flex items-center justify-between text-[11px] text-[#666D71]">
                    <span>DENSITY: 1.45 G/CM³</span>
                    <span className="text-white font-medium">NO WALL DAMAGE</span>
                  </div>
                </div>

                {/* Tech 2 */}
                <div className="bg-[#070707] border border-[#262B2E] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-[#666D71] text-[10px] pb-3 border-b border-[#262B2E] uppercase">
                      <span>TECH.02</span>
                      <span className="font-semibold text-white">SWISS POLYMER</span>
                    </div>
                    <h3 className="font-headline-code text-xl font-bold text-white mt-4">
                      Dannomond PU Pure
                    </h3>
                    <p className="font-body-sm text-xs text-[#666D71] mt-2 leading-relaxed">
                      High fracture-toughness thermoset polymer. Unmatched washer seating strength with zero flex under extreme commercial impact loads.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#262B2E] flex items-center justify-between text-[11px] text-[#666D71]">
                    <span>IMPACT: &gt;32 KJ/M²</span>
                    <span className="text-white font-medium">100% COLOR STABLE</span>
                  </div>
                </div>

                {/* Tech 3 */}
                <div className="bg-[#070707] border border-[#262B2E] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between text-[#666D71] text-[10px] pb-3 border-b border-[#262B2E] uppercase">
                      <span>TECH.03</span>
                      <span className="font-semibold text-white">PATENTED INSERT</span>
                    </div>
                    <h3 className="font-headline-code text-xl font-bold text-white mt-4">
                      Dual-Fixation System
                    </h3>
                    <p className="font-body-sm text-xs text-[#666D71] mt-2 leading-relaxed">
                      Reinforced stainless steel bushings integrated flush with the hold base. Engineered for rapid cordless impact-wrench route-setting rotations.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#262B2E] flex items-center justify-between text-[11px] text-[#666D71]">
                    <span>TORQUE MAX: 45 NM</span>
                    <span className="text-white font-medium">EN 12572-3</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Route Setter Floating B2B Inquiry Bar & Modal */}
      <SetterManifestModal />
    </div>
  );
}

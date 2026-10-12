import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SetterManifestModal from "../components/SetterManifestModal";
import { categories } from "../data/products";
import { getProducts } from "../services/api";

function getProductSize(product) {
  if (!product) return 'm';
  const specs = product.specs || {};
  if (specs.size) return specs.size.toLowerCase();
  if (product.size) return product.size.toLowerCase();

  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const desc = (product.shortDescription || product.description || '').toLowerCase();

  if (cat === 'macros' || name.includes('macro') || name.includes('mega') || desc.includes('macro')) {
    return 'macro';
  }
  if (name.includes('chips') || name.includes('baby') || name.includes('foothold') || desc.includes('micro')) {
    return 's';
  }
  if (name.includes('motela') || name.includes('eclipse')) {
    return 'l';
  }
  if (name.includes('argus')) {
    return 'm';
  }

  // Parse dimensions in cm/mm
  const dimMatch = (specs.dimensions || desc).match(/(\d+)\s*(?:cm|mm)/i);
  if (dimMatch) {
    const val = parseInt(dimMatch[1], 10);
    const isMm = (specs.dimensions || desc).includes('mm');
    const cm = isMm ? val / 10 : val;
    if (cm >= 40) return 'macro';
    if (cm >= 28) return 'xl';
    if (cm >= 20) return 'l';
    if (cm >= 12) return 'm';
    return 's';
  }

  return 'm';
}

function matchesDifficulty(product, target) {
  if (target === 'all') return true;
  const specs = product.specs || {};
  const diff = (specs.difficulty || '').toLowerCase();
  const desc = (product.shortDescription || product.description || '').toLowerCase();
  const t = target.toLowerCase();

  if (t === 'easy') {
    return diff === 'easy' || (desc.includes('easy') && !desc.includes('easy - medium') && !desc.includes('easy-medium'));
  }
  if (t === 'easy - medium') {
    return diff.includes('easy - medium') || diff.includes('easy-medium') || desc.includes('easy - medium') || desc.includes('easy-medium');
  }
  if (t === 'medium') {
    return diff === 'medium' || (desc.includes('medium') && !desc.includes('easy - medium') && !desc.includes('medium - hard') && !desc.includes('easy-medium') && !desc.includes('medium-hard'));
  }
  if (t === 'medium - hard') {
    return diff.includes('medium - hard') || diff.includes('medium-hard') || desc.includes('medium - hard') || desc.includes('medium-hard');
  }
  if (t === 'hard') {
    return diff === 'hard' || (desc.includes('hard') && !desc.includes('medium - hard') && !desc.includes('medium-hard'));
  }
  return diff.includes(t) || desc.includes(t);
}

const pillCategories = ["All", "Holds", "Macros", "Volumes", "Accessories"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // API State
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters (Difficulty, Size)
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");

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
    setSelectedDifficulty("all");
    setSelectedSize("all");
  };

  const isFiltered =
    activeCategory !== "All" ||
    selectedDifficulty !== "all" ||
    selectedSize !== "all";

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // 1. Difficulty filter
      if (selectedDifficulty !== 'all') {
        if (!matchesDifficulty(product, selectedDifficulty)) {
          return false;
        }
      }

      // 2. Size filter
      if (selectedSize !== 'all') {
        const pSize = getProductSize(product);
        const target = selectedSize.toLowerCase();
        if (target === 'macro') {
          if (pSize !== 'macro' && pSize !== 'xl') return false;
        } else if (target === 'xl') {
          if (pSize !== 'xl' && pSize !== 'macro') return false;
        } else {
          if (pSize !== target) return false;
        }
      }

      return true;
    });
  }, [productsList, selectedDifficulty, selectedSize]);

  // Immediate scroll to top on mount and category change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activeCategory, location.pathname]);

  const displayTitle = activeCategory === "All" ? "Holds & Macros" : activeCategory;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Container with guaranteed 150px top clearance ensuring title is completely below the fixed navbar */}
      <div className="w-full bg-black" style={{ paddingTop: '150px' }}>
        
        {/* Title Section matching screenshot layout: clean title, NO subtext */}
        <section className="w-full px-6 flex flex-col items-center justify-center text-center pb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline-lg font-normal tracking-tight text-white capitalize leading-normal my-2 select-none">
            {displayTitle}
          </h1>

          {/* Pill Tabs for Series Families (Replacing Continent Pills as requested) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 mb-4 max-w-4xl mx-auto">
            {pillCategories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-8 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-lg"
                      : "border border-[#262B2E] text-neutral-400 hover:text-white hover:border-white/50 bg-transparent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Centered Filter Row matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-label-mono text-xs my-4 text-white">
            
            {/* 1. Series families */}
            <div className="flex items-center gap-2">
              <span className="text-[#666D71] whitespace-nowrap">Series families :</span>
              <div className="relative inline-block">
                <select
                  value={activeCategory.toLowerCase()}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none bg-black border border-[#262B2E] rounded-full px-4 py-1.5 pr-8 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                >
                  <option value="all" className="bg-black">ALL</option>
                  {categories.map((c) => (
                    <option key={c} value={c.toLowerCase()} className="bg-black">{c}</option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
              </div>
            </div>

            {/* 2. Difficulty */}
            <div className="flex items-center gap-2">
              <span className="text-[#666D71] whitespace-nowrap">Difficulty :</span>
              <div className="relative inline-block">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-black border border-[#262B2E] rounded-full px-4 py-1.5 pr-8 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                >
                  <option value="all" className="bg-black">ALL</option>
                  <option value="easy" className="bg-black">Easy</option>
                  <option value="easy - medium" className="bg-black">Easy - Medium</option>
                  <option value="medium" className="bg-black">Medium</option>
                  <option value="medium - hard" className="bg-black">Medium - Hard</option>
                  <option value="hard" className="bg-black">Hard</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
              </div>
            </div>

            {/* 3. Size */}
            <div className="flex items-center gap-2">
              <span className="text-[#666D71] whitespace-nowrap">Size :</span>
              <div className="relative inline-block">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="appearance-none bg-black border border-[#262B2E] rounded-full px-4 py-1.5 pr-8 text-white focus:outline-none focus:border-white transition-colors cursor-pointer text-xs uppercase tracking-wider font-label-mono"
                >
                  <option value="all" className="bg-black">ALL</option>
                  <option value="s" className="bg-black">S (Small)</option>
                  <option value="m" className="bg-black">M (Medium)</option>
                  <option value="l" className="bg-black">L (Large)</option>
                  <option value="xl" className="bg-black">XL (Extra Large)</option>
                  <option value="macro" className="bg-black">Macro</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white text-[10px]">↓</span>
              </div>
            </div>

            {/* Reset button if filtered */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-white underline hover:text-neutral-400 uppercase cursor-pointer ml-2"
              >
                RESET
              </button>
            )}

          </div>
        </section>

        {/* 4-Column Continuous Hairline Matrix */}
        <section className="w-full bg-black border-t border-[#262B2E] mt-6">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 size={36} className="text-white animate-spin" />
              <p className="font-label-mono text-xs uppercase tracking-widest text-[#666D71]">
                Loading Spec Matrix...
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                Coba ubah kriteria filter difficulty atau size, atau tekan tombol reset untuk kembali melihat seluruh inventaris.
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

        {/* Technical Material Index Matrix */}
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

      {/* Route Setter Floating B2B Inquiry Bar & Modal */}
      <SetterManifestModal />
    </div>
  );
}

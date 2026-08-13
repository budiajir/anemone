import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { getProducts } from '../services/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // API State
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterCategories = ['All', ...categories];
  const location = useLocation();

  // Active category filter state synced with URL search params or route path (/macros)
  const activeCategory = useMemo(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const found = categories.find((c) => c.toLowerCase() === categoryParam.toLowerCase());
      if (found) return found;
    }
    if (location.pathname === '/macros') return 'Macros';
    return 'All';
  }, [searchParams, location.pathname]);

  // Fetch products from API / productsStore
  useEffect(() => {
    let isMounted = true;
    async function fetchCatalog() {
      setLoading(true);
      try {
        const data = await getProducts(activeCategory);
        if (isMounted) {
          setProductsList(data);
        }
      } catch (err) {
        console.error('Error loading products:', err);
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

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    setMobileFilterOpen(false);
  };

  const filteredProducts = useMemo(() => {
    let items = [...productsList];

    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return items;
  }, [productsList, sortBy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <div className="bg-black text-white min-h-screen pb-24" style={{ paddingTop: '160px' }}>
      <div style={{ maxWidth: '1280px' }} className="mx-auto w-full px-6 md:px-12 space-y-10">
        
        {/* CENTERED EDITORIAL HEADER */}
        <header className="border-b border-white/10 pb-8 space-y-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-neutral-500 text-xs font-bold tracking-[0.3em] uppercase block">
              Catalog &amp; Inventory
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-sans">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
          </div>

          {/* DESKTOP CENTERED CATEGORY FILTER CHIPS */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2 pt-2">
            {filterCategories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-black shadow-md'
                      : 'bg-neutral-950 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* CENTERED SORT & ITEM COUNT CONTROLS */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-950 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded appearance-none pr-8 cursor-pointer focus:border-white/40 outline-none"
              >
                <option value="newest" className="bg-neutral-950">Sort: Newest</option>
                <option value="price-asc" className="bg-neutral-950">Price: Low to High</option>
                <option value="price-desc" className="bg-neutral-950">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">
              {filteredProducts.length} items
            </p>
          </div>

          {/* MOBILE CATEGORY DROPDOWN SELECTOR */}
          <div className="md:hidden pt-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-neutral-950 border border-white/10 rounded text-xs font-bold uppercase tracking-wider text-neutral-200"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-white" />
                Category: {activeCategory}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${mobileFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {mobileFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-neutral-950 border border-white/10 rounded p-3 mt-2 space-y-1"
                >
                  {filterCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                        activeCategory.toLowerCase() === cat.toLowerCase() ? 'bg-white/10 text-white font-bold' : 'text-neutral-400'
                      }`}
                    >
                      <span>{cat}</span>
                      {activeCategory.toLowerCase() === cat.toLowerCase() && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 size={40} className="text-white animate-spin" />
            <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">
              Loading Product Catalog...
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 bg-neutral-950 border border-white/10 rounded-lg text-center flex flex-col items-center justify-center space-y-4 px-6 w-full"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                    <SlidersHorizontal size={22} />
                  </div>
                  <div className="space-y-2 text-center flex flex-col items-center justify-center w-full">
                    <h3 className="font-black uppercase tracking-widest text-lg text-white text-center w-full">
                      {activeCategory.toUpperCase()} COLLECTION — COMING SOON
                    </h3>
                    <p className="text-xs text-neutral-400 font-light max-w-md text-center leading-relaxed mx-auto">
                      Koleksi {activeCategory} batch 2026 sedang dalam tahap akhir presisi shaping &amp; pengujian. Lihat koleksi <span className="text-white font-semibold">Holds</span> yang sudah resmi rilis.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center w-full">
                    <button
                      onClick={() => handleCategoryChange('Holds')}
                      className="bg-white text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      LIHAT PRODUK HOLDS
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}

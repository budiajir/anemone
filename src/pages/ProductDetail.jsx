import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../data/products';
import { getProductBySlug, getProducts } from '../services/api';
import { useCartStore } from '../store/cartStore';
import SetterManifestModal from '../components/SetterManifestModal';

const ifscColors = [
  { name: 'Black', hex: '#111111' },
  { name: 'Dark Grey', hex: '#444444' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#10b981' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
];

function resolveProductSpecs(product) {
  if (!product) return {};
  const specs = product.specs || {};
  const cat = (product.category || '').toLowerCase();
  const isMacro = cat === 'macros';

  // Composition Material
  const composition = product.material || specs.material || (isMacro ? 'Hollow Fiber-Reinforced Polymer (FRP)' : 'High-density Polyurethane (PU)');

  // Dimensions
  let dimensions = specs.dimensions || specs.size;
  if (!dimensions) {
    dimensions = isMacro ? '520 × 440 × 210 mm (32.5 × 17.3 × 8.3")' : '310 × 240 × 95 mm (12.2 × 9.4 × 3.7")';
  }

  // Weight
  let weight = specs.weight;
  if (!weight) {
    weight = isMacro ? '3.40 kg / 7.50 lbs' : '1.85 kg / 4.08 lbs';
  }

  // Bolt Insert / Hardware Fixation
  let boltType = specs.boltType || specs.bolt_type;
  if (!boltType) {
    boltType = isMacro ? 'Screw-on' : 'M10 Allen';
  }

  const hardware = isMacro 
    ? (specs.hardware || 'Screw-on / 5× Wood Anti-Spin Screws') 
    : (specs.hardware || '1× CHC M10 Central + 2× Anti-Spin Screws');

  // Torque
  const torque = specs.torque || '45 Nm (Integrated Deflection Washer)';

  // Panel Suitability
  let panel = specs.panel || specs.difficulty;
  if (!panel) {
    panel = isMacro ? '15° to 55° Competition Overhangs' : '0° to 45° All Wall Profiles';
  }

  return {
    composition,
    dimensions,
    weight,
    hardware,
    torque,
    panel,
    boltType,
  };
}

export default function ProductDetail() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleManifest = useCartStore((state) => state.toggleManifest);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Fetch product data
  useEffect(() => {
    let isMounted = true;

    async function fetchProductData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductBySlug(slug);
        if (isMounted) {
          if (!data) {
            setError('Product not found');
            return;
          }
          setProduct(data);
          setQuantity(1);
          setActiveImage(0);
          window.scrollTo(0, 0);

          // Fetch all products for prev/next and related items
          const list = await getProducts();
          if (isMounted && Array.isArray(list)) {
            setAllProducts(list);
            const filtered = list.filter((p) => p.id !== data.id && (p.category?.toLowerCase() === data.category?.toLowerCase()));
            setRelatedProducts(filtered.slice(0, 3));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Product not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProductData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const resolvedSpecs = useMemo(() => resolveProductSpecs(product), [product]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6 font-label-mono">
        <Loader2 size={36} className="text-white animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#666D71]">
          LOADING SPECIMEN TELEMETRY...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6 font-label-mono">
        <div className="space-y-6 max-w-md">
          <h2 className="text-3xl font-bold font-headline-lg uppercase tracking-wider text-white">
            SPECIMEN NOT FOUND
          </h2>
          <p className="text-[#666D71] text-xs font-light leading-relaxed">
            The requested geometry or product identifier cannot be located in the current database.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-white px-6 py-3 uppercase tracking-wider text-xs font-nav-caps text-white hover:bg-white hover:text-black transition-colors"
          >
            ← BACK TO CATALOG INDEX
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || '/images/crimps.jpg'];

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Find prev and next products in category
  const currentIndex = allProducts.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < allProducts.length - 1 && currentIndex >= 0 ? allProducts[currentIndex + 1] : null;

  const handleDirectOrder = () => {
    const text = `Halo Anemone B2B Desk, saya ingin memesan:\n• Produk: ${product.name}\n• Kategori: ${product.category}\n• Warna IFSC: ${selectedColor}\n• Jumlah: ${quantity} Set\n• Bolt Insert / Fixation: ${resolvedSpecs.boltType}\n• Total: ${formatPrice(product.price * quantity)}\n\nMohon info ketersediaan stok & delivery schedule. Terima kasih.`;
    window.open(`https://wa.me/628569044778?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddToManifest = () => {
    addItem(product, { Color: selectedColor }, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const seriesTag = (product.category || 'MACROS').toUpperCase();
  const weightNum = parseFloat(resolvedSpecs.weight) || 3.4;
  const totalWeightCalc = (weightNum * quantity).toFixed(2);

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      {/* 1. TOP SUB-NAV BREADCRUMB STRIP */}
      <div className="w-full border-b border-[#262B2E] bg-black text-[#666D71] font-label-mono text-[11px] uppercase tracking-wider px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1 text-[#666D71]">
            <span>‹ CATALOG INDEX</span>
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category?.toLowerCase()}`} className="hover:text-white transition-colors text-[#666D71]">
            {seriesTag}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{product.name}</span>
        </div>

        {/* Right: Series Navigation Prev / Next */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#666D71] text-[10px]">SERIES NAVIGATION</span>
          {prevProduct && (
            <Link
              to={`/product/${prevProduct.slug || prevProduct.id}`}
              className="px-2.5 py-1 border border-[#262B2E] hover:border-white/60 text-[#666D71] hover:text-white transition-colors text-[10px]"
            >
              PREV [{prevProduct.name?.slice(0, 10)}]
            </Link>
          )}
          {nextProduct && (
            <Link
              to={`/product/${nextProduct.slug || nextProduct.id}`}
              className="px-2.5 py-1 border border-[#262B2E] hover:border-white/60 text-[#666D71] hover:text-white transition-colors text-[10px]"
            >
              NEXT [{nextProduct.name?.slice(0, 10)}] →
            </Link>
          )}
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN SPLIT SECTION (7/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)] border-b border-[#262B2E]">
        
        {/* ─── LEFT COLUMN: STUDIO SPECIMEN STAGE (7 Cols) ─── */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#262B2E] bg-black">
          {/* Interactive Studio Stage */}
          <div className="relative flex-1 min-h-[460px] lg:min-h-[580px] bg-[#050505] flex items-center justify-center p-6 lg:p-12 overflow-hidden group">
            {/* Specimen Product Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsFullscreen(true)}
                className="max-h-[65vh] max-w-full object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-102 select-none"
              />
            </AnimatePresence>

            {/* Lightbox / Zoom Trigger Icon */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 p-2 border border-[#262B2E] bg-black/70 hover:bg-white text-white hover:text-black transition-colors"
              title="Expand High-Resolution View"
            >
              <Maximize2 size={14} />
            </button>

            {/* Left & Right Arrow controls if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[#262B2E] bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
                  aria-label="Previous Perspective"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[#262B2E] bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
                  aria-label="Next Perspective"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Clean Gallery Thumbnails Strip (Only when multiple images exist) */}
          {images.length > 1 && (
            <div className="border-t border-[#262B2E] p-3 lg:p-4 bg-black flex items-center justify-center gap-3 overflow-x-auto">
              {images.map((img, idx) => {
                const isActive = activeImage === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded border transition-all cursor-pointer bg-[#050505] p-1.5 flex items-center justify-center ${
                      isActive
                        ? 'border-white scale-105 shadow-md'
                        : 'border-[#262B2E] hover:border-[#666] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain select-none"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN: TECHNICAL SPECS & DIRECT B2B ACTIONS (5 Cols) ─── */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 lg:p-10 bg-black">
          <div>
            {/* Series Label & Code */}
            <div className="font-label-mono text-[11px] uppercase tracking-widest text-[#666D71] mb-2">
              SERIES: {seriesTag} [2026]
            </div>

            {/* Shaper Series Designation */}
            <div className="font-headline-code text-xl text-neutral-400 uppercase tracking-wide">
              {product.category || 'Anemone'}
            </div>

            {/* Monumental Product Title */}
            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase mt-1 mb-4 leading-none">
              {product.name}
            </h1>

            {/* Price Row */}
            {product.price > 0 && (
              <div className="font-label-mono text-base font-semibold text-white mb-4">
                {formatPrice(product.price)}
                <span className="text-[11px] text-[#666D71] font-normal ml-2">/ SET (EXCL. TAX)</span>
              </div>
            )}

            {/* Editorial Description */}
            <p className="font-body-sm text-[13px] text-[#a0a0a0] leading-relaxed mb-6 font-light">
              {product.description || product.shortDescription || 'Curved dual-texture volume engineered for delicate compression sloper sequences, friction arrester blocks, and dynamic body displacement on steep competition panels.'}
            </p>

            {/* Technical Specifications Hairline Grid */}
            <div className="border-t border-[#262B2E] divide-y divide-[#262B2E] font-label-mono text-[11px] mb-6">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">COMPOSITION MATERIAL</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.composition}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">EXTERNAL DIMENSIONS</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.dimensions}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">SET PIECE MASS</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.weight}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">HARDWARE FIXATION</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.hardware}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">MAX FASTENING TORQUE</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.torque}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">PANEL SUITABILITY</span>
                <span className="text-white uppercase font-medium">{resolvedSpecs.panel}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#666D71] uppercase tracking-wider">SHAPER DESIGNATION</span>
                <span className="text-white uppercase font-medium">Anemone Lab (Bandung, ID)</span>
              </div>
            </div>

            {/* IFSC Color Palette Swatches */}
            <div className="border-t border-[#262B2E] pt-4 pb-4">
              <div className="flex items-center justify-between font-label-mono text-[10px] uppercase tracking-wider mb-3">
                <span className="text-[#666D71]">IFSC COLOR PALETTE</span>
                <span className="text-white font-medium">{selectedColor.toUpperCase()} / DUAL-TEX MATTE-GLOSS</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {ifscColors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-[#666]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Set Quantity Stepper */}
            <div className="border border-[#262B2E] p-3 flex items-center justify-between font-label-mono text-[11px] mb-6">
              <div>
                <span className="text-[#666D71] block text-[9px] uppercase tracking-widest">SET SELECTOR</span>
                <span className="text-white font-medium">WEIGHT: {totalWeightCalc} KG</span>
              </div>
              <div className="flex items-center border border-[#262B2E]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#666D71] hover:text-white border-r border-[#262B2E] transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-white text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#666D71] hover:text-white border-l border-[#262B2E] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              {/* WhatsApp Direct Order White Pill Button */}
              <button
                type="button"
                onClick={handleDirectOrder}
                className="w-full bg-white hover:bg-neutral-200 text-black font-nav-caps text-[12px] uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center justify-between font-semibold transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  PESAN LANGSUNG VIA WHATSAPP
                  <span className="text-[9px] font-label-mono border border-black/20 rounded-full px-2 py-0.5">DIRECT B2B DESK</span>
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Setter Manifest Tray Button */}
              <button
                type="button"
                onClick={handleAddToManifest}
                className="w-full border border-[#262B2E] hover:border-white/50 text-white font-nav-caps text-[11px] uppercase tracking-wider py-3 px-6 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>+ TAMBAH KE SETTER MANIFEST TRAY</span>
                <span className="text-[9px] font-label-mono text-[#666D71]">SPEC REF: #{product.id?.toString().slice(0, 5) || 'A0283'}</span>
              </button>

              {/* Technical Asset Links row */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/628569044778?text=${encodeURIComponent(`Halo Anemone, mohon kirim file CAD 3D / STEP untuk produk: ${product.name}`)}`)}
                  className="border border-[#262B2E] hover:border-[#666] text-[#666D71] hover:text-white py-2 px-3 text-[10px] font-label-mono uppercase tracking-wider flex items-center justify-between cursor-pointer"
                >
                  <span>CAD STEP / OBJ 3D</span>
                  <span>[34MB]</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/628569044778?text=${encodeURIComponent(`Halo Anemone, mohon kirim PDF Technical Spec Archive untuk produk: ${product.name}`)}`)}
                  className="border border-[#262B2E] hover:border-[#666] text-[#666D71] hover:text-white py-2 px-3 text-[10px] font-label-mono uppercase tracking-wider flex items-center justify-between cursor-pointer"
                >
                  <span>PDF SPEC ARCHIVE</span>
                  <span>[1.2MB]</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. IN-SERIES GEOMETRIC FAMILIES / COMPLEMENTARY SHAPES */}
      {relatedProducts.length > 0 && (
        <section className="p-6 lg:p-12 border-b border-[#262B2E] bg-black">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#262B2E] gap-4">
            <div>
              <span className="font-label-mono text-[10px] uppercase tracking-widest text-[#666D71] block mb-1">
                IN-SERIES GEOMETRIC FAMILIES
              </span>
              <h2 className="font-headline-lg text-2xl lg:text-3xl uppercase font-bold tracking-tight text-white">
                COMPLEMENTARY SHAPES IN {seriesTag} FAMILY
              </h2>
            </div>
            <div className="flex items-center gap-4 font-label-mono text-[11px] text-[#666D71]">
              <span className="hidden sm:inline">MATCHING INCLINATION: 25°–55°</span>
              <Link to="/shop" className="text-white hover:underline flex items-center gap-1">
                VIEW FULL CATALOG →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => {
              const relSpecs = resolveProductSpecs(rel);
              return (
                <div key={rel.id} className="border border-[#262B2E] bg-black flex flex-col group hover:border-white/30 transition-colors">
                  {/* Card Header Spec */}
                  <div className="border-b border-[#262B2E] p-3 flex justify-between font-label-mono text-[10px] uppercase tracking-wider text-[#666D71]">
                    <span>SPEC: {rel.material || 'FIBERGLASS'}</span>
                    <span>{relSpecs.dimensions?.split('(')[0] || '520 × 440 MM'}</span>
                  </div>

                  {/* Card Stage Specimen */}
                  <Link to={`/product/${rel.slug || rel.id}`} className="relative h-64 bg-[#050505] flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={rel.images?.[0] || rel.image || '/images/crimps.jpg'}
                      alt={rel.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Card Footer */}
                  <div className="border-t border-[#262B2E] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-label-mono text-[#666D71] block uppercase">{rel.category}</span>
                      <span className="font-headline-code text-sm font-bold text-white uppercase">{rel.name}</span>
                    </div>
                    <Link
                      to={`/product/${rel.slug || rel.id}`}
                      className="px-3 py-1.5 border border-[#262B2E] group-hover:border-white text-[10px] font-label-mono uppercase text-[#666D71] group-hover:text-white transition-colors"
                    >
                      SPEC →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Lightbox Top Header */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white pointer-events-auto">
              <div className="space-y-0.5">
                <span className="text-[10px] font-label-mono uppercase tracking-widest text-[#666D71] block">
                  HIGH-RESOLUTION SPECIMEN ({activeImage + 1} OF {images.length})
                </span>
                <h4 className="text-base font-bold font-headline-code uppercase tracking-wider">{product.name}</h4>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="w-10 h-10 border border-[#262B2E] hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Zoom (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div
              className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center p-2 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeImage]}
                alt={`${product.name} zoomed`}
                className="max-w-full max-h-[85vh] object-contain select-none"
              />

              {/* Lightbox Arrow Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 border border-[#262B2E] bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 border border-[#262B2E] bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. ADDED TO MANIFEST NOTIFICATION TOAST */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 z-50 bg-white text-black px-5 py-3 border border-black shadow-2xl flex items-center gap-4 font-label-mono text-xs uppercase"
          >
            <span>+ ADDED TO SETTER MANIFEST [{quantity} SET]</span>
            <button
              onClick={toggleManifest}
              className="underline font-bold hover:opacity-75 cursor-pointer"
            >
              VIEW TRAY →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Manifest Modal / Tray */}
      <SetterManifestModal />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import SetterManifestModal from '../components/SetterManifestModal';
import { getProductBySlug, getProducts } from '../services/api';

const ifscColorMap = {
  black: { bg: '#171717', name: 'BLACK / DUAL-TEX MATTE-GLOSS' },
  blue: { bg: '#1b449c', name: 'COBALT BLUE (RAL 5002)' },
  red: { bg: '#c01d24', name: 'SIGNAL RED (RAL 3001)' },
  yellow: { bg: '#f6b700', name: 'BRIGHT YELLOW (RAL 1023)' },
  green: { bg: '#48a23f', name: 'ACID GREEN (RAL 6018)' },
  white: { bg: '#ffffff', border: true, name: 'PURE WHITE (RAL 9010)' },
  orange: { bg: '#f97316', name: 'MANDARIN ORANGE (RAL 2004)' },
  purple: { bg: '#7e22ce', name: 'DEEP PURPLE (RAL 4005)' },
  pink: { bg: '#ec4899', name: 'FLUOR PINK' },
  grey: { bg: '#6b7280', name: 'BASALT GREY' },
  cyan: { bg: '#06b6d4', name: 'IFSC CYAN' },
};

function resolveProductSpecs(product) {
  if (!product) return {};
  const specs = product.specs || {};
  const desc = (product.shortDescription || product.short_description || product.description || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const isMacro = cat === 'macros';

  let quantity = specs.quantity;
  if (!quantity) {
    const qtyMatch = desc.match(/(\d+)\s*(pcs|buah|set)/i);
    quantity = qtyMatch ? `${qtyMatch[1]} Pcs` : (isMacro ? '7 Pcs' : '1 Set');
  }

  const material = product.material || specs.material || (isMacro ? 'Fiberglass (Dual-Tex)' : 'Dannomond PU Pure');

  let type = specs.type;
  if (!type) {
    if (desc.includes('pinch')) type = 'Pinch';
    else if (desc.includes('sloper')) type = 'Sloper & Jug';
    else if (desc.includes('crimp')) type = 'Crimp';
    else if (desc.includes('jug')) type = 'Mini Jug & Crimp';
    else if (desc.includes('pocket')) type = 'Pocket';
    else type = isMacro ? 'Sloper & Jug' : 'Mini Jug & Crimp';
  }

  let difficulty = specs.difficulty;
  if (!difficulty) {
    if (desc.includes('easy - medium') || desc.includes('easy-medium')) difficulty = 'Easy - Medium';
    else if (desc.includes('medium - hard') || desc.includes('medium-hard')) difficulty = 'Medium - Hard';
    else if (desc.includes('medium')) difficulty = 'Medium';
    else if (desc.includes('easy')) difficulty = 'Easy';
    else if (desc.includes('hard')) difficulty = 'Hard';
    else difficulty = isMacro ? 'Medium' : 'Medium - Hard';
  }

  let boltType = specs.boltType || specs.bolt_type;
  if (!boltType) {
    boltType = isMacro ? 'Screw-on' : 'M10 Allen';
  }

  return {
    quantity,
    material,
    type,
    difficulty,
    boltType,
  };
}

export default function ProductDetail() {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allSeriesProducts, setAllSeriesProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('BLACK / DUAL-TEX MATTE-GLOSS');
  const [addedManifest, setAddedManifest] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          setActiveImageIndex(0);
          setAddedManifest(false);
          window.scrollTo(0, 0);

          // Get related products from same category
          if (data.category) {
            getProducts(data.category).then((catProducts) => {
              if (isMounted && catProducts) {
                setAllSeriesProducts(catProducts);
                setRelatedProducts(
                  catProducts.filter((p) => p.id !== data.id).slice(0, 3)
                );
              }
            });
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

  // Compute Next / Prev product in series
  const { prevProduct, nextProduct } = useMemo(() => {
    if (!allSeriesProducts.length || !product) return {};
    const idx = allSeriesProducts.findIndex((p) => p.id === product.id || p.slug === product.slug);
    if (idx === -1) return {};
    const prev = idx > 0 ? allSeriesProducts[idx - 1] : null;
    const next = idx < allSeriesProducts.length - 1 ? allSeriesProducts[idx + 1] : null;
    return { prevProduct: prev, nextProduct: next };
  }, [allSeriesProducts, product]);

  const images = useMemo(() => {
    if (!product) return ['/images/crimps.jpg'];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.image || '/images/crimps.jpg'];
  }, [product]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToManifest = () => {
    if (!product) return;
    addItem(product, { Color: selectedColor }, quantity);
    setAddedManifest(true);
    setTimeout(() => setAddedManifest(false), 2200);
  };

  const isMacro = product && (product.category || '').toLowerCase() === 'macros';
  const unitWeight = isMacro ? 3.48 : 1.85;
  const currentTotalWeight = (unitWeight * quantity).toFixed(2);

  // WhatsApp Direct Order Message
  const whatsappUrl = useMemo(() => {
    if (!product) return 'https://wa.me/628569044778';
    const text = `Halo Anemone, saya ingin memesan spesimen berikut:\n\n• Produk: ${product.name} (${product.category})\n• Material: ${resolvedSpecs.material}\n• Jumlah: ${quantity} Set\n• Warna: ${selectedColor}\n• Bolt: ${resolvedSpecs.boltType}\n• Total Estimasi: ${formatPrice(product.price * quantity)}\n\nMohon info ketersediaan stok & jadwal pengiriman. Terima kasih!`;
    return `https://wa.me/628569044778?text=${encodeURIComponent(text)}`;
  }, [product, resolvedSpecs, quantity, selectedColor]);

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <Loader2 size={36} className="text-primary animate-spin mb-4" />
        <p className="font-label-mono text-xs uppercase tracking-widest text-text-muted">
          Loading Technical Specimen...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-surface text-on-surface min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-4 max-w-md">
          <span className="font-label-mono text-xs uppercase text-text-muted tracking-widest">
            ERROR 404 // SPEC NOT FOUND
          </span>
          <h2 className="font-headline-code text-2xl font-bold uppercase text-primary">
            Produk Tidak Ditemukan
          </h2>
          <p className="font-body-sm text-xs text-text-muted leading-relaxed">
            Spesimen produk atau rute yang Anda cari belum terdaftar di katalog Anemone.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-mono text-xs uppercase tracking-wider hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Katalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      
      {/* ================= SUB-NAVIGATION / BREADCRUMB BAR ================= */}
      <header className="w-full bg-surface-container-lowest border-b border-hairline-border sticky top-16 z-30">
        <div className="w-full px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-label-mono">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-primary hover:text-text-muted transition-colors uppercase font-medium"
            >
              <span>←</span>
              <span>CATALOG INDEX</span>
            </Link>
            <span className="text-hairline-border">/</span>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-text-muted">
              <span className="uppercase">{product.category}</span>
              <span>/</span>
              <span className="uppercase text-on-surface font-semibold">{product.name}</span>
            </nav>
          </div>

          {/* Series Navigation (Prev / Next) */}
          <div className="flex items-center gap-3 font-label-mono text-xs text-text-muted">
            <span className="hidden sm:inline uppercase text-[10px]">SERIES NAVIGATION:</span>
            {prevProduct ? (
              <Link
                to={`/product/${prevProduct.slug}`}
                className="hover:text-primary transition-colors text-primary flex items-center gap-1"
              >
                <span>← PREV [{prevProduct.name}]</span>
              </Link>
            ) : (
              <span className="opacity-40">← PREV</span>
            )}
            <span className="text-hairline-border">|</span>
            {nextProduct ? (
              <Link
                to={`/product/${nextProduct.slug}`}
                className="hover:text-primary transition-colors text-primary flex items-center gap-1"
              >
                <span>NEXT [{nextProduct.name}] →</span>
              </Link>
            ) : (
              <span className="opacity-40">NEXT →</span>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN PRODUCT HERO / SPLIT SPEC ================= */}
      <main className="w-full bg-surface-container-lowest border-b border-hairline-border">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT COLUMN: STUDIO IMAGERY & VIEWPORT (7 COLS) */}
          <section className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-hairline-border p-6 lg:p-12 flex flex-col justify-between bg-surface-container-lowest relative">
            
            {/* Floating Canvas Indicators */}
            <div className="w-full flex items-center justify-between font-label-mono text-text-muted mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span className="tracking-widest uppercase text-[10px] sm:text-[11px] font-semibold text-primary">
                  STUDIO SPECIMEN // SWISS SCAN
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider hidden sm:inline">
                {isMacro ? 'DUAL-TEXTURE: GLOSS ZERO-FRICTION + 320-GRIT MICRO-TEX' : 'HIGH-DENSITY ISOTROPIC POLYMER'}
              </span>
            </div>

            {/* Primary Canvas Showcase with Crosshairs */}
            <div className="relative w-full flex-1 flex items-center justify-center py-8 my-4 min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] bg-surface-concrete/50 border border-hairline-border/60">
              
              {/* Drafting Crosshairs */}
              <div className="absolute inset-6 pointer-events-none opacity-20 border border-dashed border-text-muted/40"></div>
              <div className="absolute top-3 left-3 font-label-mono text-[9px] text-text-muted uppercase">
                AXIS: Z+210mm // ROT: 32°
              </div>
              <div className="absolute bottom-3 right-3 font-label-mono text-[9px] text-text-muted uppercase">
                SCALE: 1:1 METRIC
              </div>

              {/* Product Image */}
              <div className="relative group max-w-xl w-full flex flex-col items-center px-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={images[activeImageIndex]}
                    alt={`${product.name} view ${activeImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setIsFullscreen(true)}
                    className="w-full h-auto max-h-[380px] sm:max-h-[440px] object-contain transition-transform duration-500 group-hover:scale-[1.02] cursor-zoom-in select-none"
                  />
                </AnimatePresence>
              </div>

              {/* Fullscreen Expand Icon */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-primary border border-hairline-border rounded-full transition-colors cursor-pointer"
                title="Zoom High-Res View"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {/* Perspective Selector & Angle Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`font-label-mono text-[10px] uppercase px-3 py-1.5 border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-primary bg-primary text-on-primary font-semibold'
                        : 'border-hairline-border hover:border-primary text-text-muted hover:text-primary bg-surface-container-lowest'
                    }`}
                  >
                    0{idx + 1} / {idx === 0 ? 'APEX PERSPECTIVE' : idx === 1 ? 'PROFILE DUAL-TEX' : `VIEW ANGLE ${idx + 1}`}
                  </button>
                ))}
              </div>

              <div className="font-label-mono text-[10px] text-text-muted uppercase">
                SPEC REF: #{product.slug.toUpperCase().slice(0, 8)}
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: SPECIFICATION MATRIX & B2B DIRECT ORDER (5 COLS) */}
          <section className="lg:col-span-5 p-6 lg:p-12 flex flex-col justify-between bg-surface-container-lowest">
            <div>
              
              {/* Series & Category Meta */}
              <div className="flex items-center justify-between pb-3 border-b border-hairline-border mb-4">
                <span className="font-label-mono text-[11px] text-text-muted uppercase tracking-widest">
                  SERIES: {product.category.toUpperCase()} [BATCH 2026]
                </span>
                <span className="font-label-mono text-[11px] text-primary font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Monumental Identifier */}
              <div className="mb-6">
                <span className="font-headline-lg text-lg text-text-muted tracking-tight block uppercase">
                  {product.category}
                </span>
                <h1 className="font-display-hero text-3xl sm:text-5xl font-bold uppercase tracking-tight text-primary leading-none mt-1">
                  {product.name}
                </h1>
                <p className="font-body-lg text-xs sm:text-sm text-text-muted mt-3 leading-relaxed">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Technical Spec Hairline Grid */}
              <div className="border-t border-hairline-border mb-6">
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">COMPOSITION MATERIAL</span>
                  <span className="text-primary font-semibold text-right">{resolvedSpecs.material}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">QUANTITY / SET</span>
                  <span className="text-primary font-semibold text-right">{resolvedSpecs.quantity}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">HARDWARE FIXATION</span>
                  <span className="text-primary font-semibold text-right">{resolvedSpecs.boltType}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">HOLD TYPE / GEOMETRY</span>
                  <span className="text-primary font-semibold text-right">{resolvedSpecs.type}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">DIFFICULTY PROFILE</span>
                  <span className="text-primary font-semibold text-right">{resolvedSpecs.difficulty}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">MAX FASTENING TORQUE</span>
                  <span className="text-primary font-semibold text-right">45 Nm (Integrated Washer)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-hairline-border font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">PANEL SUITABILITY</span>
                  <span className="text-primary font-semibold text-right">15° to 55° Competition Overhangs</span>
                </div>
              </div>

              {/* Color Swatches (IFSC COLOR PALETTE) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 font-label-mono text-xs">
                  <span className="text-text-muted uppercase tracking-wider text-[11px]">IFSC COLOR PALETTE</span>
                  <span className="text-primary uppercase text-[11px] font-semibold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {Object.entries(ifscColorMap).map(([key, col]) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedColor(col.name)}
                        className={`relative w-7 h-7 rounded-full transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'ring-1 ring-hairline-border hover:opacity-85'
                        }`}
                        style={{ backgroundColor: col.bg }}
                        title={col.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 border border-hairline-border bg-surface-concrete mb-6">
                <div className="flex flex-col">
                  <span className="font-label-mono text-[10px] text-text-muted uppercase tracking-wider">UNIT SELECTION</span>
                  <span className="font-label-mono text-xs text-primary font-semibold">
                    EST. WEIGHT: {currentTotalWeight} KG
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-hairline-border hover:border-primary bg-surface-container-lowest flex items-center justify-center font-label-mono text-primary transition-colors text-sm font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-headline-code text-base font-bold text-primary w-8 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-hairline-border hover:border-primary bg-surface-container-lowest flex items-center justify-center font-label-mono text-primary transition-colors text-sm font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Conversion & B2B Route-Setter Actions */}
            <div className="space-y-3 pt-4 border-t border-hairline-border">
              
              {/* Primary WhatsApp Direct CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between px-6 py-3.5 bg-primary hover:bg-neutral-800 text-on-primary transition-all duration-200 group rounded-full"
              >
                <div className="flex items-center gap-3">
                  <span className="font-headline-code text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    PESAN LANGSUNG VIA WHATSAPP
                  </span>
                  <span className="font-label-mono text-[9px] text-text-muted border border-border-dark px-2 py-0.5 rounded-full group-hover:text-on-primary">
                    DIRECT B2B
                  </span>
                </div>
                <span className="font-headline-code text-base transition-transform group-hover:translate-x-1">→</span>
              </a>

              {/* Secondary Add to Manifest CTA */}
              <button
                type="button"
                onClick={handleAddToManifest}
                className="w-full inline-flex items-center justify-between px-6 py-3 border border-primary text-primary hover:bg-surface-container transition-colors rounded-full font-label-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                <span className="font-medium">
                  {addedManifest ? '✓ BERHASIL DITAMBAHKAN' : '+ TAMBAH KE SETTER MANIFEST TRAY'}
                </span>
                <span className="text-[10px] font-semibold text-text-muted">
                  REF: #{product.slug.toUpperCase().slice(0, 6)}
                </span>
              </button>

              {/* Technical Download Links */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-label-mono text-[11px]">
                <a
                  href="/shop"
                  className="px-3 py-2 border border-hairline-border hover:border-primary text-text-muted hover:text-primary transition-colors flex items-center justify-between uppercase"
                >
                  <span>CAD STEP / OBJ 3D</span>
                  <span>↓ [14MB]</span>
                </a>
                <a
                  href="/shop"
                  className="px-3 py-2 border border-hairline-border hover:border-primary text-text-muted hover:text-primary transition-colors flex items-center justify-between uppercase"
                >
                  <span>PDF SPEC ARCHIVE</span>
                  <span>↓ [1.2MB]</span>
                </a>
              </div>

            </div>

          </section>

        </div>
      </main>

      {/* ================= COMPLEMENTARY SHAPES / FAMILY GRID ================= */}
      {relatedProducts.length > 0 && (
        <section className="w-full bg-surface-container-lowest py-16 border-b border-hairline-border px-6 lg:px-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-hairline-border pb-4">
              <div>
                <span className="font-label-mono text-[11px] text-text-muted uppercase tracking-wider">
                  R-SERIES GEOMETRIC FAMILIES
                </span>
                <h3 className="font-headline-lg text-2xl font-bold uppercase tracking-tight text-primary mt-1">
                  Complementary Shapes in {product.category} Family
                </h3>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="font-label-mono text-xs uppercase text-primary hover:underline"
              >
                VIEW FULL {product.category.toUpperCase()} CATALOG →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-hairline-border">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white pointer-events-auto">
              <div className="space-y-0.5">
                <span className="text-[10px] font-label-mono uppercase tracking-widest text-neutral-400 block">
                  HIGH-RESOLUTION SPECIMEN ({activeImageIndex + 1} OF {images.length})
                </span>
                <h4 className="text-base font-bold uppercase tracking-wider">{product.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/20 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeImageIndex]}
                alt={`${product.name} high res`}
                className="max-w-full max-h-[85vh] object-contain select-none"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center border border-white/20 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center border border-white/20 cursor-pointer shadow-lg"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Setter Specification Manifest Floating Bar and Modal */}
      <SetterManifestModal />

    </div>
  );
}

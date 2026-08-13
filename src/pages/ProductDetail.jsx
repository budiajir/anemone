import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ShoppingCart, ArrowLeft, Loader2, Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import { getProductBySlug, getProducts } from '../services/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [added, setAdded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Fetch product by slug
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

          const defaultVariants = (data.variants || []).reduce(
            (acc, variant) => ({ ...acc, [variant.name]: variant.options?.[0] || '' }),
            {}
          );
          setSelectedVariants(defaultVariants);
          setQuantity(1);
          setActiveImage(0);
          setAdded(false);
          window.scrollTo(0, 0);

          if (data.category) {
            getProducts(data.category).then((catProducts) => {
              if (isMounted) {
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

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <Loader2 size={40} className="text-teal animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">
          Loading Product Details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-6 max-w-md">
          <h2 className="text-3xl font-black uppercase tracking-wider text-neutral-500">
            Product Not Found
          </h2>
          <p className="text-neutral-400 text-sm font-light leading-relaxed">
            Produk atau jalur yang Anda cari tidak dapat ditemukan.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3.5 rounded uppercase tracking-wider text-xs hover:bg-neutral-200 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Catalog
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

  const handleAddToCart = () => {
    addItem(product, selectedVariants, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24" style={{ paddingTop: '180px' }}>
      <div style={{ maxWidth: '1200px' }} className="mx-auto w-full px-6 md:px-12 space-y-12">
        
        {/* BREADCRUMB */}
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* BLOKHOLDS MAIN IMAGE CAROUSEL VIEWER (Screenshot 2 Style) */}
        <div className="space-y-6">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-w-5xl mx-auto rounded-lg overflow-hidden bg-[#121212] border border-white/10 group shadow-2xl flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={`${product.name} preview ${activeImage + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsFullscreen(true)}
                className="w-full h-full object-contain cursor-zoom-in hover:scale-102 transition-transform duration-300"
              />
            </AnimatePresence>

            {/* Left & Right Arrow Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/10 backdrop-blur-md cursor-pointer z-10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/10 backdrop-blur-md cursor-pointer z-10"
                  aria-label="Next Image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Fullscreen Expand Icon */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/70 hover:bg-white text-white hover:text-black border border-white/10 backdrop-blur-md transition-all cursor-pointer z-10 flex items-center gap-2"
              title="Click to Zoom Fullscreen"
            >
              <Maximize2 size={16} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">ZOOM</span>
            </button>
          </div>

          {/* HORIZONTAL THUMBNAIL GALLERY STRIP */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 max-w-4xl mx-auto px-4">
              {images.map((img, index) => {
                const isActive = activeImage === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-16 sm:w-24 sm:h-20 rounded overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-[#121212] p-1 ${
                      isActive
                        ? 'border-white scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FULLSCREEN LIGHTBOX MODAL */}
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
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    HIGH-RESOLUTION VIEW ({activeImage + 1} OF {images.length})
                  </span>
                  <h4 className="text-base font-bold uppercase tracking-wider">{product.name}</h4>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/20 cursor-pointer"
                  title="Close Zoom (Esc)"
                >
                  <X size={20} />
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
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                />

                {/* Lightbox Arrow Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-lg"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT DETAILS & PURCHASE PANEL (Blokholds Bottom Layout) */}
        <div className="max-w-4xl mx-auto space-y-8 border-t border-white/10 pt-10">
          
          {/* Header & Title */}
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-bold tracking-widest uppercase inline-block w-max">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans mt-2">
              {product.name}
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed max-w-2xl">
              {product.description || product.shortDescription}
            </p>
          </div>

          {/* Technical Specs & Pricing Grid */}
          <div className="grid sm:grid-cols-12 gap-8 items-start bg-neutral-950 border border-white/[0.06] rounded-lg p-6 sm:p-8">
            
            {/* Specs Table Column */}
            <div className="sm:col-span-7 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-white/[0.06] pb-2">
                Product Details
              </h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-neutral-500 uppercase font-semibold">Quantity / Set:</span>
                  <span className="text-white font-bold">{product.specs?.quantity || '1 Set'}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-neutral-500 uppercase font-semibold">Material:</span>
                    <span className="text-white font-bold">{product.material}</span>
                  </div>
                )}
                {product.specs?.weight && (
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-neutral-500 uppercase font-semibold">Weight:</span>
                    <span className="text-neutral-300 font-medium">{product.specs.weight}</span>
                  </div>
                )}
                {product.specs?.dimensions && (
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-neutral-500 uppercase font-semibold">Dimensions:</span>
                    <span className="text-neutral-300 font-medium">{product.specs.dimensions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Add to Cart Column */}
            <div className="sm:col-span-5 space-y-6 sm:border-l border-white/10 sm:pl-8">
              <div className="space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest block">Price</span>
                <div className="text-2xl font-black text-white">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">Select Quantity</span>
                <div className="flex items-center justify-between border border-white/10 rounded bg-black h-12 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full h-14 rounded font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  added 
                    ? 'bg-neutral-200 text-black' 
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{added ? "Added To Cart!" : "Add To Cart"}</span>
              </button>
            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-white/10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-8 text-center">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

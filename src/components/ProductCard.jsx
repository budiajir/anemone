import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../data/products";

export default function ProductCard({ product }) {
  if (!product) return null;
  const imageSrc = product.images?.[0] || product.image || "/images/crimps.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block space-y-3">
        {/* Blokholds Style Image Container (Clean Light/Dark Neutral Studio Box) */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#121212] border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-md p-2 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.material && (
            <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-white/10">
              {product.material}
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-3 right-3 bg-white text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        {/* Centered Minimal Title & Price underneath (Blokholds Style) */}
        <div className="text-center space-y-1 px-2">
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wide group-hover:text-white transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-neutral-500 uppercase text-[10px] tracking-widest">
              {product.category}
            </span>
            <span className="text-neutral-600 text-[10px]">•</span>
            <span className="text-white font-bold text-xs">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

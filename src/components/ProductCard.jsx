import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;
  const imageSrc = product.images?.[0] || product.image || "/images/crimps.jpg";

  const cat = (product.category || "").toLowerCase();
  const isMacro = cat === "macros";
  const badgeText = isMacro ? "DUAL-TEX MACRO" : `${product.material || "PU"} PURE`;

  const specs = product.specs || {};
  const qty = specs.quantity || (isMacro ? "7 Pcs" : "1 Set");
  const bolt = specs.boltType || (isMacro ? "Screw-on" : "M10 Allen");
  const holdType = specs.type || (isMacro ? "Pinch" : "Mini Jug & Crimp");
  const weightOrPcs = isMacro ? "WEIGHT: 3.48 KG" : qty;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, {}, 1);
  };

  return (
    <div className="group relative bg-surface-container-lowest p-6 lg:p-8 flex flex-col justify-between min-h-[460px] border-b border-hairline-border md:border-r transition-colors hover:bg-surface-concrete text-on-surface">
      {/* Top Micro Metadata Bar */}
      <div className="w-full flex items-center justify-between text-text-muted font-label-mono text-[11px]">
        <span className="border border-hairline-border px-2 py-0.5 rounded-full text-[10px] uppercase font-medium tracking-wider">
          {badgeText}
        </span>
        <span className="text-secondary text-[10px] font-medium tracking-wide">
          {weightOrPcs}
        </span>
      </div>

      {/* Product Image Stage with Diffuse Contact Shadow */}
      <Link
        to={`/product/${product.slug}`}
        className="relative w-full h-64 my-4 flex items-center justify-center overflow-hidden"
      >
        <img
          src={imageSrc}
          alt={product.name}
          className="max-h-56 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105 select-none"
          loading="lazy"
        />
      </Link>

      {/* Quick Add Action Overlay (+ MANIFEST) */}
      <button
        type="button"
        onClick={handleQuickAdd}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary text-on-primary font-label-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm hover:bg-secondary cursor-pointer z-10"
      >
        <span className="text-xs leading-none font-bold">+</span>
        <span>MANIFEST</span>
      </button>

      {/* Bottom Technical Nomenclature Block (Flathold signature) */}
      <Link
        to={`/product/${product.slug}`}
        className="flex flex-col items-start justify-end pt-3 border-t border-hairline-border/60 group-hover:opacity-95"
      >
        <span className="font-body-sm text-xs text-border-dark tracking-normal uppercase">
          {product.category}
        </span>
        <h3 className="font-headline-code text-xl lg:text-2xl font-bold text-primary tracking-tight leading-none mt-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between w-full mt-2 text-text-muted font-label-mono text-[11px]">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="truncate">{bolt}</span>
            <span>•</span>
            <span className="text-primary font-semibold truncate">{holdType}</span>
          </div>
          <span className="text-primary font-bold text-xs whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </div>
  );
}

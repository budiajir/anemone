import React from "react";

export default function Logo({ className = "h-8", showText = true, textClassName = "text-white text-lg font-bold tracking-wider uppercase font-sans" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 8-Petal Anemone Logo Symbol */}
      <svg
        viewBox="0 0 100 100"
        className="h-full aspect-square text-white fill-current shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(50, 50)">
          {/* 4 Overlapping capsules rotated by 45 degrees increments to create 8 rounded petals */}
          <rect x="-6" y="-42" width="12" height="84" rx="6" />
          <rect x="-6" y="-42" width="12" height="84" rx="6" transform="rotate(45)" />
          <rect x="-6" y="-42" width="12" height="84" rx="6" transform="rotate(90)" />
          <rect x="-6" y="-42" width="12" height="84" rx="6" transform="rotate(135)" />
        </g>
      </svg>

      {/* Brand Text */}
      {showText && (
        <span className={textClassName}>
          Anemone
        </span>
      )}
    </div>
  );
}

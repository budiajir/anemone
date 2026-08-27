export const products = [
  // ═══════════════════════════════════════
  // HOLDS
  // ═══════════════════════════════════════
  {
    id: 1,
    name: "Motela",
    slug: "motela",
    category: "Holds",
    material: "PU",
    price: 660000,
    description: "Jug & Crimp climbing hold set. Easy - Medium difficulty level.",
    shortDescription: "19 Pcs | Easy - Medium | Jug & Crimp",
    images: ["/images/motela.png"],
    variants: [
      { name: "Color", options: ["Green", "Blue", "Pink"] },
    ],
    specs: {
      quantity: "19 Pcs",
      difficulty: "Easy - Medium",
      type: "Jug & Crimp",
      material: "High-density Polyurethane (PU)",
      boltType: "M10 Allen",
    },
    rating: 5.0,
    reviewCount: 42,
    isNew: true,
    isFeatured: true,
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    name: "Baby Argus",
    slug: "baby-argus",
    category: "Holds",
    material: "PU",
    price: 770000,
    description: "Mini Jug & Crimp climbing hold set. Medium - Hard difficulty level.",
    shortDescription: "19 Pcs | Medium - Hard | Mini Jug & Crimp",
    images: ["/images/motela.png"],
    variants: [
      { name: "Color", options: ["Pink", "Green"] },
    ],
    specs: {
      quantity: "19 Pcs",
      difficulty: "Medium - Hard",
      type: "Mini Jug & Crimp",
      material: "High-density Polyurethane (PU)",
      boltType: "M10 Allen",
    },
    rating: 4.9,
    reviewCount: 38,
    isNew: true,
    isFeatured: true,
    createdAt: "2026-02-01",
  },
  {
    id: 3,
    name: "Argus",
    slug: "argus",
    category: "Holds",
    material: "PU",
    price: 550000,
    description: "Mini Jug climbing hold set. Easy - Medium difficulty level.",
    shortDescription: "9 Pcs | Easy - Medium | Mini Jug",
    images: ["/images/argus.png"],
    variants: [
      { name: "Color", options: ["Blue", "Green"] },
    ],
    specs: {
      quantity: "9 Pcs",
      difficulty: "Easy - Medium",
      type: "Mini Jug",
      material: "High-density Polyurethane (PU)",
      boltType: "M10 Allen",
    },
    rating: 4.8,
    reviewCount: 29,
    isNew: false,
    isFeatured: true,
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "Eclipse",
    slug: "eclipse",
    category: "Holds",
    material: "PU",
    price: 650000,
    description: "Mini Jug & Crimp climbing hold set. Medium - Hard difficulty level.",
    shortDescription: "13 Pcs | Medium - Hard | Mini Jug & Crimp",
    images: ["/images/eclipse.png"],
    variants: [
      { name: "Color", options: ["Pink", "Green"] },
    ],
    specs: {
      quantity: "13 Pcs",
      difficulty: "Medium - Hard",
      type: "Mini Jug & Crimp",
      material: "High-density Polyurethane (PU)",
      boltType: "M10 Allen",
    },
    rating: 4.9,
    reviewCount: 34,
    isNew: true,
    isFeatured: true,
    createdAt: "2026-02-01",
  },
  {
    id: 5,
    name: "Cucu Chips",
    slug: "cucu-chips",
    category: "Holds",
    material: "PU",
    price: 200000,
    description: "Crimp climbing hold set. Hard difficulty level.",
    shortDescription: "20 Pcs | Hard | Crimp",
    images: ["/images/cucu_chips.png"],
    variants: [
      { name: "Color", options: ["Blue", "Green"] },
    ],
    specs: {
      quantity: "20 Pcs",
      difficulty: "Hard",
      type: "Crimp",
      material: "High-density Polyurethane (PU)",
      boltType: "M10 Allen",
    },
    rating: 5.0,
    reviewCount: 51,
    isNew: true,
    isFeatured: true,
    createdAt: "2026-02-01",
  }
];

export const categories = [
  "Holds",
  "Macros",
  "Volumes",
  "Accessories",
  "Smart Wall Kit",
];

export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}


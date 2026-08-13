export const mockUser = {
  id: 1,
  name: "Rian Pratama",
  email: "rian@example.com",
  avatar: null,
  memberSince: "2025-03-15",
  climbingGrade: "V6 / 7a",
  totalSessions: 147,
  totalRoutes: 432,
  longestStreak: 21,
  currentStreak: 5,
};

export const mockOrders = [
  {
    id: "ANM-2026-0042",
    date: "2026-07-10",
    status: "Delivered",
    items: [
      { name: "Anemone Hangboard Pro", variant: "Standard (20mm)", quantity: 1, price: 890000 },
      { name: "Anemone Liquid Chalk", variant: "200ml", quantity: 2, price: 85000 },
    ],
    total: 1060000,
  },
  {
    id: "ANM-2026-0038",
    date: "2026-06-22",
    status: "Delivered",
    items: [
      { name: "Anemone Crimp Set Alpha", variant: "Charcoal", quantity: 1, price: 485000 },
      { name: "Tentacle Pinch Collection", variant: "Midnight Black", quantity: 1, price: 540000 },
    ],
    total: 1025000,
  },
  {
    id: "ANM-2026-0029",
    date: "2026-05-14",
    status: "Delivered",
    items: [
      { name: "Essential LED Kit", variant: "RGB Full Spectrum", quantity: 1, price: 3500000 },
    ],
    total: 3500000,
  },
];

export const mockClimbingStats = {
  weeklyData: [
    { day: "Mon", sessions: 1, routes: 8 },
    { day: "Tue", sessions: 0, routes: 0 },
    { day: "Wed", sessions: 1, routes: 12 },
    { day: "Thu", sessions: 0, routes: 0 },
    { day: "Fri", sessions: 1, routes: 6 },
    { day: "Sat", sessions: 1, routes: 15 },
    { day: "Sun", sessions: 0, routes: 0 },
  ],
  gradeDistribution: [
    { grade: "V3", count: 45 },
    { grade: "V4", count: 87 },
    { grade: "V5", count: 124 },
    { grade: "V6", count: 98 },
    { grade: "V7", count: 52 },
    { grade: "V8", count: 26 },
  ],
  recentSends: [
    { name: "Crimson Traverse", grade: "V6", date: "2026-07-16", attempts: 3 },
    { name: "The Overhang Problem", grade: "V7", date: "2026-07-14", attempts: 8 },
    { name: "Slab Master", grade: "V5", date: "2026-07-12", attempts: 1 },
    { name: "Dyno King", grade: "V6", date: "2026-07-10", attempts: 5 },
  ],
};

import React from 'react';
import { DollarSign, ShoppingCart, Box, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../../data/products';
import { useOrdersStore } from '../../store/ordersStore';
import { useProductsStore } from '../../store/productsStore';

export default function AdminOverview() {
  const orders = useOrdersStore((s) => s.orders);
  const productList = useProductsStore((s) => s.products);

  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed').length;
  const totalRevenueNumber = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'TOTAL PRODUCTS',
      value: `${productList.length} ITEMS`,
      trend: 'ACTIVE CATALOG',
      trendLabel: 'IN STORE',
      icon: Box,
    },
    {
      label: 'ACTIVE ORDERS',
      value: `${orders.length} ORDERS`,
      trend: `${activeOrdersCount} ACTIVE`,
      trendLabel: 'REAL-TIME SYNC',
      icon: ShoppingCart,
    },
    {
      label: 'TOTAL REVENUE',
      value: formatPrice(totalRevenueNumber),
      trend: formatPrice(totalRevenueNumber),
      trendLabel: 'PLACED ORDERS',
      icon: DollarSign,
    },
    {
      label: 'TOTAL CUSTOMERS',
      value: `${orders.length} USERS`,
      trend: 'REAL-TIME',
      trendLabel: 'SYSTEM ACTIVE',
      icon: Users,
    },
  ];

  const getMinimalBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest inline-block">
            COMPLETED
          </span>
        );
      case 'Shipped':
        return (
          <span className="bg-blue-950/60 border border-blue-500/40 text-blue-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest inline-block">
            SHIPPED
          </span>
        );
      case 'Processing':
        return (
          <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest inline-block">
            PROCESSING
          </span>
        );
      default:
        return (
          <span className="bg-white/10 border border-white/20 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest inline-block">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Subtitle */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white">
          DASHBOARD OVERVIEW
        </h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-2">
          REAL-TIME STORE ANALYTICS &amp; ORDER MANAGEMENT // SYSTEM OK ({orders.length} ORDERS RECORDED)
        </p>
      </div>

      {/* METRIC CARDS GRID (SUPR MONOCHROME SHARP RECTANGULAR BLOCKS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-sm p-6 space-y-4 hover:border-white/25 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-mono text-[10px] font-bold uppercase tracking-widest">
                  {stat.label}
                </span>
                <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Icon size={18} />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {stat.value}
              </div>

              <div className="font-mono text-[10px] flex items-center gap-2 tracking-wider">
                <span className="text-white font-bold">{stat.trend}</span>
                <span className="text-neutral-600">//</span>
                <span className="text-neutral-500">{stat.trendLabel}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RECENT ORDERS TABLE SECTION */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden space-y-0">
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">RECENT ORDERS</h2>
            <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">LATEST CUSTOMER TRANSACTIONS</p>
          </div>
          <Link 
            to="/admin/orders" 
            className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-sm hover:bg-neutral-200 transition-colors"
          >
            VIEW ORDERS &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black border-b border-white/10">
              <tr>
                {['ORDER ID', 'CUSTOMER', 'ITEMS', 'TOTAL', 'STATUS', 'DATE'].map((head) => (
                  <th key={head} className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-6 py-4">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-white tracking-wider">{order.id}</td>
                    <td className="px-6 py-4 text-neutral-300 font-bold uppercase tracking-wider">{order.customer}</td>
                    <td className="px-6 py-4 text-neutral-400 max-w-[220px] truncate uppercase font-light">{order.items}</td>
                    <td className="px-6 py-4 text-white font-black">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      {getMinimalBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-500 text-[11px] tracking-wider">{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    NO RECENT TRANSACTIONS RECORDED.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

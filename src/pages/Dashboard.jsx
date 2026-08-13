import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Package, Trophy, Clock, Zap, MapPin, Calendar, ExternalLink, ChevronRight, User } from 'lucide-react';
import { formatPrice } from '../data/products';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats');

  // Mock User Data
  const user = {
    name: "Alex Rivera",
    email: "alex.rivera@climbmail.com",
    joinedDate: "Maret 2025",
    currentGrade: "V5 / 6C+",
    homeWallConnected: "Anemone Home Wall (Tilted 35°)",
  };

  // Mock Climbing Stats Data
  const stats = {
    totalSends: 142,
    weeklyActivity: "12 jam panjat / minggu",
    activeProjects: [
      { id: 1, name: "Crimson Loop", grade: "V6", status: "Projecting", completions: "75% progress" },
      { id: 2, name: "Dyno Heaven", grade: "V5", status: "Completed", completions: "3 sends logged" },
      { id: 3, name: "Silent Crimp", grade: "V7", status: "Projecting", completions: "42% progress" },
    ],
    weeklyGradeDistribution: [
      { grade: "V3", count: 18 },
      { grade: "V4", count: 24 },
      { grade: "V5", count: 12 },
      { grade: "V6", count: 4 },
    ]
  };

  // Mock Order History Data
  const orders = [
    {
      id: "ANM-2026-0048",
      date: "Jul 18, 2026",
      items: "Anemone Hangboard Pro, Anemone Liquid Chalk",
      total: 975000,
      status: "Delivered",
    },
    {
      id: "ANM-2026-0042",
      date: "Jul 10, 2026",
      items: "Anemone Hangboard Pro, Anemone Liquid Chalk ×2",
      total: 1060000,
      status: "Delivered",
    },
    {
      id: "ANM-2026-0035",
      date: "Jun 28, 2026",
      items: "Full Ecosystem Set (Smart Wall Kit)",
      total: 8900000,
      status: "Processing",
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div style={{ maxWidth: '1280px' }} className="mx-auto w-full px-6 md:px-12">
        
        {/* 1. HEADER PROFILE BANNER */}
        <header className="bg-neutral-950 border border-white/5 rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: Avatar and Info */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal">
                <User size={36} className="md:w-11 md:h-11" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                  <Zap size={10} className="text-teal" /> Verified Climber
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  Welcome back, {user.name}!
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 font-light">
                  <span className="flex items-center gap-1"><Calendar size={12} /> Member since {user.joinedDate}</span>
                  <span className="hidden sm:inline text-white/10">•</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {user.homeWallConnected}</span>
                </div>
              </div>
            </div>

            {/* Right: Grade Summary Badge */}
            <div className="bg-teal/5 border border-teal/20 rounded-2xl p-4 md:text-right flex md:flex-col justify-between items-center md:items-end gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Current Average Grade
              </span>
              <span className="text-2xl font-black text-teal tracking-wide leading-none">
                {user.currentGrade}
              </span>
            </div>

          </div>
        </header>

        {/* 2. TAB SYSTEM NAVIGATION */}
        <div className="flex border-b border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'stats' 
                ? 'border-teal text-teal bg-teal/[0.02]' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            Climbing Stats
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders' 
                ? 'border-teal text-teal bg-teal/[0.02]' 
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            <Package size={14} />
            Order History
          </button>
        </div>

        {/* 3. TAB CONTENT */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CLIMBING STATS */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Stats Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Total Sends</span>
                      <span className="text-2xl font-black text-white">{stats.totalSends} Routes</span>
                    </div>
                  </div>

                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Weekly Volume</span>
                      <span className="text-lg font-bold text-white leading-tight block">{stats.weeklyActivity}</span>
                    </div>
                  </div>

                  <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                      <Zap size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Smart Wall Project</span>
                      <span className="text-2xl font-black text-white">2 Routes Active</span>
                    </div>
                  </div>

                </div>

                {/* Sub-grid: Active Projects & Grade Distribution */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Active Projects */}
                  <div className="lg:col-span-7 bg-neutral-950/20 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-4">
                      Smart Wall Projects & Creation
                    </h3>

                    <div className="divide-y divide-white/5">
                      {stats.activeProjects.map((proj) => (
                        <div key={proj.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm">{proj.name}</span>
                              <span className="text-[9px] uppercase font-bold text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/20">
                                {proj.grade}
                              </span>
                            </div>
                            <p className="text-neutral-500 text-xs font-light">{proj.completions}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                              proj.status === 'Completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {proj.status}
                            </span>
                            <ChevronRight size={16} className="text-neutral-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Grade Distribution chart mock */}
                  <div className="lg:col-span-5 bg-neutral-950/20 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-4">
                      Send Distribution By Grade
                    </h3>

                    <div className="space-y-4">
                      {stats.weeklyGradeDistribution.map((item, idx) => {
                        const percentages = [30, 40, 20, 10]; // mock distribution sizes
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-white">{item.grade}</span>
                              <span className="text-neutral-500">{item.count} Sends</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal rounded-full" 
                                style={{ width: `${percentages[idx]}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-neutral-950/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                    
                    {/* Order Meta Details */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-white font-bold text-base uppercase tracking-wider">{ord.id}</span>
                        <span className="text-neutral-500 text-xs">{ord.date}</span>
                      </div>
                      
                      <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
                        {ord.items}
                      </p>
                    </div>

                    {/* Order Financials & Status */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t border-white/5 pt-4 md:border-t-0 md:pt-0 shrink-0">
                      <div>
                        <span className="text-xs text-neutral-500 block uppercase font-bold tracking-wider mb-0.5">Total Paid</span>
                        <span className="text-lg font-black text-white">{formatPrice(ord.total)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
                          ord.status === 'Delivered'
                            ? 'bg-teal/10 text-teal border-teal/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ord.status}
                        </span>
                        <button className="p-2 hover:bg-white/5 text-neutral-500 hover:text-white rounded-lg transition-colors cursor-pointer">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

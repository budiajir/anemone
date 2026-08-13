import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, FileText, MessageSquare } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { useOrdersStore } from '../../store/ordersStore';
import { generateOrderFormPdfHtml } from '../../utils/pdfGenerator';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to persistent Zustand ordersStore
  const orders = useOrdersStore((s) => s.orders) || [];
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const clearAllOrders = useOrdersStore((s) => s.clearAllOrders);

  // Real-time status update handler
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  // Helper to generate clean WhatsApp URL pre-filled with customer details
  const getWhatsAppLink = (order) => {
    const rawPhone = order.phone || order.details?.customer?.phone || '081322663825';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const messageText = `Halo Kak ${order.customer}, kami dari Admin Anemone terkait pesanan No: ${order.id} (Total: ${formatPrice(order.total)}). Ada yang bisa kami bantu mengenai pesanan/pengirimannya? Terima kasih!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  };

  // Generate & Print/Download PDF Order Form for Admin
  const handleDownloadPdf = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const htmlContent = generateOrderFormPdfHtml(order);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === 'all' || (order.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.phone && (order.phone || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.items || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  }, [filteredOrders]);

  // High-contrast minimal rectangular status badge (SUPR style)
  const getMinimalStatusBadge = (status) => {
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

  const statusOptions = ['All', 'Processing', 'Shipped', 'Completed'];

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Description */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white">
            ORDERS MANAGEMENT
          </h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-2">
            TRACK, MANAGE, AND EXPORT CUSTOMER TRANSACTIONS ({orders.length} TOTAL)
          </p>
        </div>

        {/* Clear/Reset Action Button */}
        {orders.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Reset all order data to initial state?')) {
                clearAllOrders();
              }
            }}
            className="border border-white/15 text-neutral-400 hover:text-white hover:border-white/30 font-mono text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-sm transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <RefreshCw size={12} />
            <span>RESET ORDERS</span>
          </button>
        )}
      </div>

      {/* FILTER TABS & SEARCH BAR (SUPR RECTANGULAR BLOCKS) */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mr-2 hidden sm:inline">
            FILTER:
          </span>
          {statusOptions.map((status) => {
            const isActive = statusFilter.toLowerCase() === status.toLowerCase();
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status.toLowerCase())}
                className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-black border border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="SEARCH ORDER ID / NAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-sm pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-600 uppercase tracking-wider focus:border-white/40 outline-none"
          />
        </div>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            SHOWING {filteredOrders.length} OF {orders.length} TRANSACTIONS
          </span>
          <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
            FILTERED REVENUE: {formatPrice(totalRevenue)}
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black border-b border-white/10">
              <tr>
                {['ORDER ID', 'CUSTOMER INFO', 'ORDERED ITEMS', 'TOTAL', 'STATUS UPDATE', 'ACTIONS'].map((head) => (
                  <th key={head} className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-6 py-4">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                    {/* Order ID & Date */}
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-white text-xs tracking-wider">{order.id}</div>
                      <div className="font-mono text-[10px] text-neutral-500 tracking-wider mt-0.5">{order.date}</div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="text-white font-bold uppercase tracking-wider">{order.customer}</div>
                      <div className="font-mono text-[10px] text-neutral-400 mt-0.5">{order.phone || 'NO PHONE'}</div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-neutral-400 max-w-[220px] truncate uppercase font-light">
                      {order.items}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-white font-black">
                      {formatPrice(order.total)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div>{getMinimalStatusBadge(order.status)}</div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-black border border-white/10 text-neutral-300 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm appearance-none cursor-pointer focus:border-white/40 outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions: WA, PDF Print */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Button */}
                        <a
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-black border border-white/15 hover:border-emerald-400/50 hover:bg-emerald-950/40 text-neutral-300 hover:text-emerald-400 rounded-sm transition-all"
                          title="Contact Customer via WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </a>

                        {/* PDF Print Button */}
                        <button
                          onClick={() => handleDownloadPdf(order)}
                          className="p-2 bg-black border border-white/15 hover:border-white/40 hover:bg-white/5 text-neutral-300 hover:text-white rounded-sm transition-all"
                          title="Print / Export Order PDF Form"
                        >
                          <FileText size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    NO MATCHING ORDERS FOUND.
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

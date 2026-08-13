import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Add a new order from Checkout / Order Form
      addOrder: (newOrder) => {
        set((state) => {
          const itemsText = Array.isArray(newOrder.items)
            ? newOrder.items
                .map((i) => {
                  const name = i.name || i.product?.name || 'Climbing Hold';
                  const qty = i.quantity || 1;
                  return `${name} ×${qty}`;
                })
                .join(', ')
            : 'Climbing Gear';

          const customerName =
            newOrder.customer?.fullName ||
            newOrder.customerName ||
            (typeof newOrder.customer === 'string' ? newOrder.customer : 'Customer');
          const customerPhone =
            newOrder.customer?.phone || newOrder.phone || '+62 813-2266-3825';
          const customerAddress =
            newOrder.customer?.address || newOrder.address || '';

          const formattedOrder = {
            id: newOrder.orderNo || `ANM-${Math.floor(100000 + Math.random() * 900000)}`,
            customer: customerName,
            phone: customerPhone,
            address: customerAddress,
            items: itemsText,
            total: newOrder.total || 0,
            status: newOrder.status || 'Processing',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            createdAt: new Date().toISOString(),
            details: newOrder,
          };

          return {
            orders: [formattedOrder, ...state.orders],
          };
        });
      },

      // Update real-time status (Processing -> Shipped -> Completed)
      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        }));
      },

      // Reset orders list back to 0
      clearAllOrders: () => set({ orders: [] }),
    }),
    {
      name: 'anemone-orders-storage',
    }
  )
);

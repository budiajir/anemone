import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Add a new order from Checkout / Cart / Order Form
      addOrder: (newOrder) => {
        if (!newOrder) return;
        set((state) => {
          const orderId = newOrder.orderNo || newOrder.id || `ANM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

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
            newOrder.customer?.phone || newOrder.phone || '+62 856 9044 778';
          const customerAddress =
            newOrder.customer?.address || newOrder.address || '';

          const rawItems = Array.isArray(newOrder.items)
            ? newOrder.items.map((i) => ({
                name: i.name || i.product?.name || 'Climbing Product',
                quantity: i.quantity || 1,
                price: i.price || i.product?.price || 0,
                selectedVariants: i.selectedVariants || {},
                image: i.image || i.product?.images?.[0] || i.product?.image || '/images/crimps.jpg',
              }))
            : [];

          const formattedOrder = {
            id: orderId,
            orderNo: orderId,
            customer: customerName,
            phone: customerPhone,
            address: customerAddress,
            items: itemsText,
            rawItems: rawItems,
            total: newOrder.total || 0,
            status: newOrder.status || 'Processing',
            date: newOrder.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            createdAt: new Date().toISOString(),
            details: newOrder,
          };

          // Filter out existing order with same ID if any, and prepend
          const remainingOrders = (state.orders || []).filter((o) => o.id !== orderId && o.orderNo !== orderId);
          return {
            orders: [formattedOrder, ...remainingOrders],
          };
        });
      },

      // Get order by Order ID or orderNo
      getOrderById: (orderId) => {
        if (!orderId) return null;
        const cleanId = String(orderId).trim().toLowerCase();
        return get().orders.find((o) => 
          String(o.id).toLowerCase() === cleanId || 
          String(o.orderNo).toLowerCase() === cleanId ||
          String(o.details?.orderNo).toLowerCase() === cleanId
        );
      },

      // Update real-time status (Processing -> Shipped -> Completed)
      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: (state.orders || []).map((o) =>
            o.id === orderId || o.orderNo === orderId ? { ...o, status: newStatus } : o
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

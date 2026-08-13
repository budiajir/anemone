import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product, selectedVariants = {}, quantity = 1) => {
    set((state) => {
      const variantKey = JSON.stringify(selectedVariants);
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && JSON.stringify(item.selectedVariants) === variantKey
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { items: newItems };
      }

      return {
        items: [
          ...state.items,
          {
            id: `${product.id}-${variantKey}-${Date.now()}`,
            product,
            selectedVariants,
            quantity,
          },
        ],
      };
    });
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

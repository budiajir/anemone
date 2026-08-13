import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products as initialProducts } from '../data/products';

// Custom safe storage handler for Zustand persist to prevent QuotaExceededError crashes
const safeLocalStorage = {
  getItem: (name) => {
    try {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    } catch (e) {
      console.error('Error reading products from localStorage:', e);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage quota limit reached when persisting products:', e);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.error('Error removing products from localStorage:', e);
    }
  },
};

export const useProductsStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,

      // Add new product
      addProduct: (newProd) => {
        set((state) => ({
          products: [newProd, ...state.products],
        }));
      },

      // Update product by ID
      updateProduct: (id, updatedData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p
          ),
        }));
      },

      // Delete product by ID
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Reset catalog to initial static products
      resetProducts: () => {
        set({ products: initialProducts });
      },
    }),
    {
      name: 'anemone-products-storage',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2 || !persistedState || !persistedState.products) {
          return { products: initialProducts };
        }
        // Automatically filter out old demo placeholder IDs 6-10
        const cleanProducts = persistedState.products.filter(
          (p) => !(p.id >= 6 && p.id <= 10)
        );
        return { products: cleanProducts.length > 0 ? cleanProducts : initialProducts };
      },
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

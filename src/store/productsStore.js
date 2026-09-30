import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products as initialProducts, defaultHoldColors } from '../data/products';

// Custom safe storage handler for Zustand persist to prevent QuotaExceededError crashes
const safeLocalStorage = {
  getItem: (name) => {
    try {
      const str = localStorage.getItem(name);
      return str || null;
    } catch (e) {
      console.error('Error reading products from localStorage:', e);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
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
      version: 6,
      migrate: (persistedState, version) => {
        // Version 6: Force reset - sync Screw-on bolt insert for macros
        if (version < 6) {
          return { products: initialProducts };
        }

        if (!persistedState || !persistedState.products) {
          return { products: initialProducts };
        }

        // Ensure all official products from initialProducts exist in persisted state
        const persistedSlugs = new Set((persistedState.products || []).map(p => p.slug));
        const missingProducts = initialProducts.filter(p => !persistedSlugs.has(p.slug));

        let mergedProducts = [...persistedState.products, ...missingProducts];

        // Normalize all products
        const cleanProducts = mergedProducts.map((p) => {
          const cat = (p.category || '').toLowerCase();
          const isHoldLike = ['holds', 'macros', 'volumes'].includes(cat);
          let updated = { ...p };

          // Sync official product images from initialProducts source
          const officialProduct = initialProducts.find(op => op.slug === p.slug);
          if (officialProduct) {
            updated.images = officialProduct.images;
            updated.image = officialProduct.images[0];
          }

          // Automatically enable color variants for holds, macros, and volumes if not defined
          if (isHoldLike && (!updated.variants || updated.variants.length === 0)) {
            updated.variants = [{ name: 'Color', options: defaultHoldColors }];
          }

          // Automatically resolve specs if missing
          if (isHoldLike) {
            const desc = (p.shortDescription || p.description || '').toLowerCase();
            let qty = updated.specs?.quantity;
            if (!qty) {
              const m = desc.match(/(\d+)\s*(pcs|buah|set)/i);
              qty = m ? `${m[1]} Pcs` : '1 Set';
            }
            let type = updated.specs?.type;
            if (!type) {
              if (desc.includes('pinch')) type = 'Pinch';
              else if (desc.includes('crimp')) type = 'Crimp';
              else if (desc.includes('jug')) type = 'Mini Jug & Crimp';
              else if (desc.includes('sloper')) type = 'Sloper';
              else if (desc.includes('pocket')) type = 'Pocket';
              else type = cat === 'macros' ? 'Pinch' : 'Mini Jug & Crimp';
            }
            let diff = updated.specs?.difficulty;
            if (!diff) {
              if (desc.includes('easy - medium') || desc.includes('easy-medium')) diff = 'Easy - Medium';
              else if (desc.includes('medium - hard') || desc.includes('medium-hard')) diff = 'Medium - Hard';
              else if (desc.includes('easy')) diff = 'Easy';
              else if (desc.includes('hard')) diff = 'Hard';
              else diff = 'Medium - Hard';
            }
            let bolt = updated.specs?.boltType || 'M10 Allen';

            updated.specs = {
              quantity: qty,
              material: updated.material || (cat === 'macros' ? 'Fiberglass' : 'PU'),
              type: type,
              difficulty: diff,
              boltType: bolt,
              ...updated.specs,
            };
          }

          return updated;
        });

        return { products: cleanProducts.length > 0 ? cleanProducts : initialProducts };
      },
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

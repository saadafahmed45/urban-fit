import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (product) => {
        const { items } = get();
        const id = (product.productId || product._id || product.id)?.toString();
        if (!id) return;

        if (!items.some((item) => (item.productId || item._id)?.toString() === id)) {
          const newItem = {
            productId: id,
            slug: product.slug,
            name: product.name,
            price: Number(product.price) || 0,
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            image: product.image || product.images?.[0]?.url || '',
            category: product.category || 'streetwear',
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        const id = productId?.toString();
        set((state) => ({
          items: state.items.filter((item) => (item.productId || item._id)?.toString() !== id),
        }));
      },

      toggleItem: (product) => {
        const id = (product.productId || product._id || product.id)?.toString();
        if (!id) return false;

        const exists = get().items.some((item) => (item.productId || item._id)?.toString() === id);
        if (exists) {
          get().removeItem(id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      isInWishlist: (productId) => {
        const id = productId?.toString();
        if (!id) return false;
        return get().items.some((item) => (item.productId || item._id)?.toString() === id);
      },

      hasItem: (productId) => {
        const id = productId?.toString();
        if (!id) return false;
        return get().items.some((item) => (item.productId || item._id)?.toString() === id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'urban_fit_wishlist_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null)),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

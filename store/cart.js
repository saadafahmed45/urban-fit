import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingThreshold: 100,
      standardShippingFee: 15,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Generate compound key: productId + size + color
      generateKey: (productId, size, color) => `${productId}_${size || 'ONE'}_${color || 'STD'}`.toLowerCase(),

      addItem: (product) => {
        const { items, generateKey } = get();
        const key = product.key || generateKey(product.productId || product._id, product.size, product.color);
        const existingIndex = items.findIndex((item) => item.key === key);

        const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
        const maxStock = product.stock !== undefined ? product.stock : 999;

        if (existingIndex > -1) {
          const currentItem = items[existingIndex];
          const newQuantity = Math.min(currentItem.quantity + quantityToAdd, maxStock);
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: newQuantity,
          };
          set({ items: updatedItems });
          return { key, quantity: newQuantity, isNew: false };
        } else {
          const newItem = {
            key,
            productId: product.productId || product._id,
            slug: product.slug,
            name: product.name,
            price: Number(product.price) || 0,
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            image: product.image || product.images?.[0]?.url || '',
            size: product.size || 'M',
            color: product.color || 'Standard',
            quantity: Math.min(quantityToAdd, maxStock),
            stock: maxStock,
          };
          set({ items: [...items, newItem] });
          return { key, quantity: newItem.quantity, isNew: true };
        }
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
      },

      updateQuantity: (key, quantity) => {
        const targetQty = Number(quantity);
        if (targetQty <= 0) {
          get().removeItem(key);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.key === key) {
              const maxStock = item.stock !== undefined ? item.stock : 999;
              return {
                ...item,
                quantity: Math.min(targetQty, maxStock),
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (couponData) => {
        set({ coupon: couponData });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      setShippingRules: (threshold, fee) => {
        set({
          shippingThreshold: threshold ?? 100,
          standardShippingFee: fee ?? 15,
        });
      },

      // Computed selectors
      getSubtotal: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return Number(total.toFixed(2));
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();

        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }

        return Number(Math.min(discount, subtotal).toFixed(2));
      },

      getShippingFee: () => {
        const { items, shippingThreshold, standardShippingFee } = get();
        if (items.length === 0) return 0;
        const subtotal = get().getSubtotal();
        return subtotal >= shippingThreshold ? 0 : standardShippingFee;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Number(Math.max(0, subtotal - discount + shipping).toFixed(2));
      },
    }),
    {
      name: 'urban_fit_cart_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null)),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

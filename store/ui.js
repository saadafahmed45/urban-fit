import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  quickViewProduct: null,

  // Cart Drawer
  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMobileMenuOpen: false })),

  // Search Dialog
  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMobileMenuOpen: false })),

  // Mobile Menu Drawer
  openMobileMenu: () => set({ isMobileMenuOpen: true, isCartOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen, isCartOpen: false })),

  // Quick View Modal
  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  // Close all overlay panels
  closeAllModals: () =>
    set({
      isCartOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      quickViewProduct: null,
    }),
}));

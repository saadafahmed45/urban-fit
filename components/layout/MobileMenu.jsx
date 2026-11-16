'use client';

import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, User, Heart, Package, ShieldCheck, Instagram } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useWishlistStore } from '@/store/wishlist';
import { useStore } from '@/store/use-store';

const NAV_LINKS = [
  { label: 'NEW IN', href: '/shop?isNew=true' },
  { label: 'HOODIES', href: '/category/hoodies' },
  { label: 'TEES', href: '/category/tees' },
  { label: 'BOTTOMS', href: '/category/bottoms' },
  { label: 'OUTERWEAR', href: '/category/outerwear' },
  { label: 'ACCESSORIES', href: '/category/accessories' },
  { label: 'SALE', href: '/shop?sale=true', isSale: true },
];

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const wishlistCount = useStore(useWishlistStore, (s) => s.items.length, 0);

  return (
    <Dialog.Root open={isMobileMenuOpen} onOpenChange={(open) => !open && closeMobileMenu()}>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#111111]/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-xs bg-[#F5F1EC] border-r border-[#E3DBD2] shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#E3DBD2] bg-[#EFE8E0] flex items-center justify-between">
                  <span className="font-display text-2xl tracking-wider text-[#111111]">
                    URBAN <span className="text-[#B38B66]">FIT</span>
                  </span>
                  <Dialog.Close asChild>
                    <button
                      className="text-[#736E67] hover:text-[#111111] p-1"
                      aria-label="Close navigation"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                  <div className="space-y-3">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`block font-heading text-xl uppercase tracking-wider transition-colors py-1 flex items-center justify-between ${
                          link.isSale
                            ? 'text-[#B38B66] font-semibold'
                            : 'text-[#111111] hover:text-[#B38B66]'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.isSale && (
                          <span className="tag-sale text-[9px]">UP TO 50%</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Customer Quick Links */}
                  <div className="pt-6 border-t border-[#E3DBD2] space-y-3">
                    <span className="text-[10px] uppercase tracking-streetwear font-heading text-[#736E67] block">
                      MY ACCOUNT
                    </span>
                    <Link
                      href="/account"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 font-heading text-sm text-[#111111] hover:text-[#B38B66] uppercase"
                    >
                      <User className="w-4 h-4 text-[#736E67]" /> PROFILE & ORDERS
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between font-heading text-sm text-[#111111] hover:text-[#B38B66] uppercase"
                    >
                      <span className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-[#736E67]" /> WISHLIST
                      </span>
                      {wishlistCount > 0 && (
                        <span className="bg-[#111111] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 font-heading text-sm text-[#111111] hover:text-[#B38B66] uppercase"
                    >
                      <Package className="w-4 h-4 text-[#736E67]" /> TRACK ORDERS
                    </Link>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-5 border-t border-[#E3DBD2] bg-[#EFE8E0] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-heading uppercase text-[#736E67]">
                    <span>WORLDWIDE SHIPPING</span>
                    <span className="text-[#111111]">USD ($)</span>
                  </div>
                  <p className="font-sans text-[11px] text-[#736E67]">
                    Streetwear essentials crafted from heavyweight 480 GSM French Terry.
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

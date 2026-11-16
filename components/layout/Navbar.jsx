'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useStore } from '@/store/use-store';
import { useSession } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'NEW IN', href: '/shop?isNew=true' },
  { label: 'HOODIES', href: '/category/hoodies' },
  { label: 'TEES', href: '/category/tees' },
  { label: 'BOTTOMS', href: '/category/bottoms' },
  { label: 'ACCESSORIES', href: '/category/accessories' },
  { label: 'SALE', href: '/shop?sale=true', isSale: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, openSearch, openMobileMenu } = useUIStore();
  const cartItemCount = useStore(useCartStore, (s) => s.items.reduce((acc, i) => acc + i.quantity, 0), 0);
  const wishlistCount = useStore(useWishlistStore, (s) => s.items.length, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const currentUser = session?.user;

  // Monitor scroll for shadow/backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F5F1EC]/95 backdrop-blur-md shadow-sm border-b border-[#E3DBD2]'
          : 'bg-[#F5F1EC] border-b border-[#E3DBD2]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openMobileMenu}
              className="lg:hidden p-1.5 text-[#111111] hover:text-[#B38B66] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-1 group">
              <span className="font-display text-2xl md:text-3xl tracking-wider text-[#111111] group-hover:text-[#B38B66] transition-colors">
                URBAN <span className="text-[#B38B66]">FIT</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-heading text-sm tracking-wider uppercase transition-colors relative py-1 ${
                    item.isSale
                      ? 'text-[#B38B66] font-semibold hover:text-[#916D4C]'
                      : isActive
                      ? 'text-[#111111] font-semibold'
                      : 'text-[#111111]/80 hover:text-[#111111]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Wishlist, User, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-[#111111] hover:text-[#B38B66] transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-2 text-[#111111] hover:text-[#B38B66] transition-colors relative"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#111111] text-white text-[9px] font-heading font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href={currentUser ? '/account' : '/login'}
              className="p-2 text-[#111111] hover:text-[#B38B66] transition-colors relative"
              aria-label={currentUser ? 'My Account' : 'Sign in'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#B38B66]" />
              )}
            </Link>

            {/* Cart Drawer Toggle */}
            <button
              type="button"
              onClick={openCart}
              className="p-2 text-[#111111] hover:text-[#B38B66] transition-colors relative"
              aria-label="Open cart bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#B38B66] text-white text-[9px] font-heading font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

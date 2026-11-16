'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Sliders,
  Sparkles,
  Settings,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Shirt },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/banners', label: 'Hero Banners', icon: Sliders },
  { href: '/admin/lookbook', label: 'Shop The Look', icon: Sparkles },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-ink text-primary-bg flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-widest text-primary-bg uppercase">
              URBAN FIT
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-tan text-ink px-1.5 py-0.5 rounded-none">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">
            Store Management
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin/dashboard'
                ? pathname === '/admin' || pathname === '/admin/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border-l-2 border-tan'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-tan' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Storefront Link */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}

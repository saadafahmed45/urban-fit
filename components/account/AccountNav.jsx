'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Heart, MapPin, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders & Tracking', icon: Package },
  { href: '/account/wishlist', label: 'Saved Items', icon: Heart },
  { href: '/account/addresses', label: 'Delivery Address', icon: MapPin },
];

export default function AccountNav({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Profile Card */}
      <div className="bg-card border border-border p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xl text-ink">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink truncate">
              {user?.displayName || 'Streetwear Member'}
            </h4>
            <p className="text-[11px] font-mono text-ink/60 truncate">
              {user?.email || 'customer@urbanfit.local'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="bg-card border border-border divide-y divide-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-ink text-primary-bg'
                  : 'text-ink/80 hover:bg-surface hover:text-ink'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-tan' : 'text-ink/60'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, User, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader({ onMenuClick }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/admin/auth/me');
        const data = await res.json();
        if (data.success && data.data?.admin) {
          setAdmin(data.data.admin);
        }
      } catch (e) {
        console.warn('Could not fetch admin info:', e);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    }
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-ink hover:bg-surface transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-widest text-ink/50">
          Control Center
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Store Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tan hover:text-ink transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Admin profile snippet */}
        <div className="flex items-center gap-2.5 border-l border-border pl-4">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-display text-sm text-ink font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-ink block leading-none">
              {admin?.name || 'Administrator'}
            </span>
            <span className="text-[10px] font-mono text-ink/50 uppercase">
              {admin?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-ink/60 hover:text-red-600 hover:bg-surface transition-colors cursor-pointer"
          aria-label="Sign out of admin"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

export default function AnnouncementBar({ initialSettings = null }) {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState(
    initialSettings?.announcementText || 'LIMITED TIME OFFER – UP TO 50% OFF | FREE SHIPPING ON ORDERS OVER $100'
  );

  useEffect(() => {
    // If not provided in SSR props, fetch public settings
    if (!initialSettings) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.data) {
            if (data.data.announcementActive === false) {
              setIsVisible(false);
            } else if (data.data.announcementText) {
              setAnnouncement(data.data.announcementText);
            }
          }
        })
        .catch(() => {});
    }
  }, [initialSettings]);

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#111111] text-[#F5F1EC] text-xs font-medium py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B38B66] animate-pulse" />
        <p className="font-heading tracking-streetwear uppercase text-[11px] md:text-xs">
          {announcement}
        </p>
        <Link
          href="/shop?sale=true"
          className="hidden sm:inline-flex items-center gap-1 text-[#B38B66] hover:text-white transition-colors uppercase font-heading text-[11px] underline underline-offset-2"
        >
          SHOP DROP <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736E67] hover:text-white p-1 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

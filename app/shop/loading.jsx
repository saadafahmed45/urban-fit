import React from 'react';
import ShopLayout from '@/components/layout/ShopLayout';

export default function ShopLoading() {
  return (
    <ShopLayout>
      <div className="bg-[#F5F1EC] min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-[#EFE8E0] border-b border-[#E3DBD2] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="w-32 h-3 bg-[#E3DBD2] animate-pulse" />
            <div className="w-72 h-10 bg-[#E3DBD2] animate-pulse" />
            <div className="w-96 max-w-full h-4 bg-[#E3DBD2] animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E3DBD2]">
            <div className="w-36 h-4 bg-[#EFE8E0] animate-pulse" />
            <div className="w-40 h-8 bg-[#EFE8E0] animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
              <div className="w-full h-8 bg-[#EFE8E0] animate-pulse" />
              <div className="w-full h-24 bg-[#EFE8E0] animate-pulse" />
              <div className="w-full h-24 bg-[#EFE8E0] animate-pulse" />
              <div className="w-full h-20 bg-[#EFE8E0] animate-pulse" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#F7F4F0] border border-[#E3DBD2] p-3 space-y-3">
                  <div className="aspect-3/4 bg-[#EFE8E0] animate-pulse" />
                  <div className="w-3/4 h-4 bg-[#EFE8E0] animate-pulse" />
                  <div className="w-1/3 h-4 bg-[#EFE8E0] animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

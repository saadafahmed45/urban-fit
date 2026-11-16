import React from 'react';
import ShopLayout from '@/components/layout/ShopLayout';

export default function ProductLoading() {
  return (
    <ShopLayout>
      <div className="bg-[#F5F1EC] min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs skeleton */}
          <div className="w-56 h-3 bg-[#EFE8E0] animate-pulse mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
              <div className="flex lg:flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-20 h-24 bg-[#EFE8E0] border border-[#E3DBD2] animate-pulse" />
                ))}
              </div>
              <div className="flex-1 aspect-3/4 bg-[#EFE8E0] border border-[#E3DBD2] animate-pulse" />
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-28 h-3 bg-[#EFE8E0] animate-pulse" />
              <div className="w-full h-10 bg-[#EFE8E0] animate-pulse" />
              <div className="w-36 h-4 bg-[#EFE8E0] animate-pulse" />
              <div className="w-32 h-8 bg-[#EFE8E0] animate-pulse" />

              {/* Size pills */}
              <div className="space-y-2 pt-4">
                <div className="w-20 h-3 bg-[#EFE8E0] animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-[#EFE8E0] border border-[#E3DBD2] animate-pulse" />
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-4">
                <div className="w-32 h-12 bg-[#EFE8E0] border border-[#E3DBD2] animate-pulse" />
                <div className="flex-1 h-12 bg-[#EFE8E0] animate-pulse" />
                <div className="w-12 h-12 bg-[#EFE8E0] border border-[#E3DBD2] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

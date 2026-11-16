'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import ActiveFilters from './ActiveFilters';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function ShopClient({
  initialProducts = [],
  categories = [],
  pagination = { page: 1, limit: 12, total: 0, totalPages: 1 },
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract current filters from URL search params
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const isNew = searchParams.get('isNew') === 'true';
  const isBestSeller = searchParams.get('isBestSeller') === 'true';
  const isTrending = searchParams.get('isTrending') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Helper to update query params
  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always reset page to 1 unless page itself is updated
    if (!('page' in updates)) {
      params.delete('page');
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val === '' || val === null || val === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleFilterChange = (key, value) => {
    updateQuery({ [key]: value });
  };

  const handleRemoveFilter = (key) => {
    if (key === 'price') {
      updateQuery({ minPrice: '', maxPrice: '' });
    } else {
      updateQuery({ [key]: '' });
    }
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    updateQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Top Bar: Results Count & Mobile Filter Trigger & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-ink text-primary-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          <p className="text-xs font-mono uppercase tracking-widest text-ink/70">
            Showing <span className="text-ink font-bold">{initialProducts.length}</span> of{' '}
            <span className="text-ink font-bold">{pagination.total}</span> products
          </p>

          {isPending && (
            <Loader2 className="w-4 h-4 text-tan animate-spin inline-block ml-2" />
          )}
        </div>

        <div className="flex items-center justify-end">
          <SortDropdown
            value={currentSort}
            onChange={(val) => handleFilterChange('sort', val)}
          />
        </div>
      </div>

      {/* Active Filters bar */}
      <ActiveFilters
        selectedCategory={currentCategory}
        selectedSize={currentSize}
        selectedColor={currentColor}
        minPrice={currentMinPrice}
        maxPrice={currentMaxPrice}
        isNew={isNew}
        isBestSeller={isBestSeller}
        isTrending={isTrending}
        search={currentSearch}
        onRemoveFilter={handleRemoveFilter}
        onResetFilters={handleResetFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-card/60 p-6 border border-border">
            <FilterSidebar
              categories={categories}
              selectedCategory={currentCategory}
              selectedSize={currentSize}
              selectedColor={currentColor}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              isNew={isNew}
              isBestSeller={isBestSeller}
              isTrending={isTrending}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={pagination.total}
            />
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {initialProducts.length === 0 ? (
            <div className="text-center py-24 bg-card border border-border p-8">
              <p className="font-display text-2xl uppercase tracking-wider text-ink mb-2">
                No Products Found
              </p>
              <p className="text-xs text-ink/60 uppercase tracking-widest mb-6">
                Try adjusting or clearing your filters to see more results.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-ink text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 transition-opacity duration-200 ${
                  isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}
              >
                {initialProducts.map((product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-surface border border-border text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === currentPage;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-9 h-9 text-xs font-mono font-bold transition-colors ${
                            isActive
                              ? 'bg-ink text-primary-bg'
                              : 'bg-surface border border-border text-ink hover:border-ink'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-surface border border-border text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      <Dialog.Root open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-card p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
              <Dialog.Title className="font-display text-xl uppercase tracking-wider text-ink">
                Filters
              </Dialog.Title>
              <Dialog.Close className="p-2 text-ink/70 hover:text-ink">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <FilterSidebar
              categories={categories}
              selectedCategory={currentCategory}
              selectedSize={currentSize}
              selectedColor={currentColor}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              isNew={isNew}
              isBestSeller={isBestSeller}
              isTrending={isTrending}
              onFilterChange={(k, v) => {
                handleFilterChange(k, v);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              totalResults={pagination.total}
            />

            <div className="mt-8 pt-4 border-t border-border sticky bottom-0 bg-card">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-ink text-primary-bg py-3 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 transition-colors"
              >
                Apply Filters ({pagination.total})
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

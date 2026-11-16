'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function ActiveFilters({
  selectedCategory,
  selectedSize,
  selectedColor,
  minPrice,
  maxPrice,
  isNew,
  isBestSeller,
  isTrending,
  search,
  onRemoveFilter,
  onResetFilters,
}) {
  const activeItems = [];

  if (search) {
    activeItems.push({ key: 'search', label: `Search: "${search}"` });
  }
  if (selectedCategory) {
    activeItems.push({ key: 'category', label: `Category: ${selectedCategory}` });
  }
  if (selectedSize) {
    activeItems.push({ key: 'size', label: `Size: ${selectedSize.toUpperCase()}` });
  }
  if (selectedColor) {
    activeItems.push({ key: 'color', label: `Color: ${selectedColor}` });
  }
  if (minPrice || maxPrice) {
    let priceLabel = 'Price: ';
    if (minPrice && maxPrice) priceLabel += `$${minPrice} - $${maxPrice}`;
    else if (minPrice) priceLabel += `Over $${minPrice}`;
    else if (maxPrice) priceLabel += `Under $${maxPrice}`;
    activeItems.push({ key: 'price', label: priceLabel });
  }
  if (isNew) {
    activeItems.push({ key: 'isNew', label: 'New Arrivals' });
  }
  if (isBestSeller) {
    activeItems.push({ key: 'isBestSeller', label: 'Best Seller' });
  }
  if (isTrending) {
    activeItems.push({ key: 'isTrending', label: 'Trending' });
  }

  if (activeItems.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-mono uppercase tracking-widest text-ink/50 mr-1">
        Active Filters:
      </span>
      {activeItems.map((item) => (
        <span
          key={item.key}
          className="inline-flex items-center gap-1.5 bg-surface border border-border px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-ink"
        >
          {item.label}
          <button
            onClick={() => onRemoveFilter(item.key)}
            className="text-ink/50 hover:text-ink cursor-pointer transition-colors"
            aria-label={`Remove filter ${item.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onResetFilters}
        className="text-xs font-mono uppercase tracking-widest text-tan hover:text-ink underline underline-offset-4 ml-2 transition-colors cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
}

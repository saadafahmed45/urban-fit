'use client';

import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, X, RotateCcw } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Cream', hex: '#F5F1EC' },
  { name: 'Tan', hex: '#B38B66' },
  { name: 'Taupe', hex: '#8B857A' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Grey', hex: '#777777' },
  { name: 'White', hex: '#FFFFFF' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $50', min: '0', max: '50' },
  { label: '$50 to $100', min: '50', max: '100' },
  { label: '$100 to $150', min: '100', max: '150' },
  { label: '$150 & Above', min: '150', max: '' },
];

export default function FilterSidebar({
  categories = [],
  selectedCategory = '',
  selectedSize = '',
  selectedColor = '',
  minPrice = '',
  maxPrice = '',
  isNew = false,
  isBestSeller = false,
  isTrending = false,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) {
  const hasActiveFilters = Boolean(
    selectedCategory ||
    selectedSize ||
    selectedColor ||
    minPrice ||
    maxPrice ||
    isNew ||
    isBestSeller ||
    isTrending
  );

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <h2 className="font-display text-lg tracking-wider text-ink uppercase">
          Filters ({totalResults})
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-tan hover:text-ink font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      <Accordion.Root
        type="multiple"
        defaultValue={['categories', 'price', 'size', 'color', 'flags']}
        className="space-y-4"
      >
        {/* Categories */}
        <Accordion.Item value="categories" className="border-b border-border/60 pb-4">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors group">
              <span>Categories</span>
              <ChevronDown className="w-4 h-4 text-ink/50 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-3 space-y-2">
            <button
              onClick={() => onFilterChange('category', '')}
              className={`block w-full text-left text-xs uppercase tracking-wider py-1 transition-colors cursor-pointer ${
                !selectedCategory
                  ? 'font-bold text-ink'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const slug = cat.slug || cat.name?.toLowerCase();
              const isSelected = selectedCategory === slug;
              return (
                <button
                  key={slug}
                  onClick={() => onFilterChange('category', isSelected ? '' : slug)}
                  className={`flex items-center justify-between w-full text-left text-xs uppercase tracking-wider py-1 transition-colors cursor-pointer ${
                    isSelected ? 'font-bold text-ink' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <span className="w-1.5 h-1.5 bg-tan rounded-full" />}
                </button>
              );
            })}
          </Accordion.Content>
        </Accordion.Item>

        {/* Price Range */}
        <Accordion.Item value="price" className="border-b border-border/60 pb-4">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors group">
              <span>Price Range</span>
              <ChevronDown className="w-4 h-4 text-ink/50 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-3 space-y-3">
            <div className="space-y-1.5">
              {PRICE_RANGES.map((range) => {
                const isSelected = minPrice === range.min && maxPrice === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => {
                      onFilterChange('minPrice', range.min);
                      onFilterChange('maxPrice', range.max);
                    }}
                    className={`block w-full text-left text-xs uppercase tracking-wider py-1 transition-colors cursor-pointer ${
                      isSelected ? 'font-bold text-ink' : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Price Inputs */}
            <div className="pt-2 flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-ink/50 uppercase tracking-wider block mb-1">Min ($)</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => onFilterChange('minPrice', e.target.value)}
                  className="w-full bg-surface border border-border px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>
              <span className="text-ink/40 mt-4">-</span>
              <div className="flex-1">
                <span className="text-[10px] text-ink/50 uppercase tracking-wider block mb-1">Max ($)</span>
                <input
                  type="number"
                  min="0"
                  placeholder="500"
                  value={maxPrice}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                  className="w-full bg-surface border border-border px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Sizes */}
        <Accordion.Item value="size" className="border-b border-border/60 pb-4">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors group">
              <span>Size</span>
              <ChevronDown className="w-4 h-4 text-ink/50 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-3">
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => {
                const isSelected = selectedSize.toUpperCase() === size;
                return (
                  <button
                    key={size}
                    onClick={() => onFilterChange('size', isSelected ? '' : size)}
                    className={`py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-ink text-primary-bg border-ink'
                        : 'bg-surface border-border text-ink hover:border-ink/50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Colors */}
        <Accordion.Item value="color" className="border-b border-border/60 pb-4">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors group">
              <span>Color</span>
              <ChevronDown className="w-4 h-4 text-ink/50 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-3">
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((c) => {
                const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    onClick={() => onFilterChange('color', isSelected ? '' : c.name.toLowerCase())}
                    title={c.name}
                    className={`relative w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-ink ring-offset-2 ring-offset-primary-bg scale-110 border-ink'
                        : 'border-border/80 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          c.name === 'White' || c.name === 'Cream' ? 'bg-ink' : 'bg-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Collections / Flags */}
        <Accordion.Item value="flags" className="pb-2">
          <Accordion.Header>
            <Accordion.Trigger className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors group">
              <span>Collection</span>
              <ChevronDown className="w-4 h-4 text-ink/50 group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pt-3 space-y-2.5">
            <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => onFilterChange('isNew', e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>New Arrivals</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => onFilterChange('isBestSeller', e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>Best Sellers</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => onFilterChange('isTrending', e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>Trending Now</span>
            </label>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </aside>
  );
}

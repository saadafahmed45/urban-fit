'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SortDropdown({ value = 'newest', onChange }) {
  const selectedLabel = sortOptions.find((opt) => opt.value === value)?.label || 'Newest Arrivals';

  return (
    <div className="relative inline-block text-left">
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          className="inline-flex items-center justify-between gap-3 bg-surface border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink/50 focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
          aria-label="Sort products"
        >
          <span className="text-ink/60 mr-1">Sort:</span>
          <Select.Value>{selectedLabel}</Select.Value>
          <Select.Icon>
            <ChevronDown className="w-3.5 h-3.5 text-ink/70" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 min-w-[190px] bg-card border border-border shadow-xl p-1 animate-in fade-in-50 zoom-in-95"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport>
              {sortOptions.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-ink hover:bg-surface focus:bg-surface focus:outline-none cursor-pointer transition-colors"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="w-3.5 h-3.5 text-tan" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

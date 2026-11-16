'use client';

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import ProductReviews from './ProductReviews';
import { Sparkles, Layers, Truck, MessageSquare } from 'lucide-react';

export default function ProductTabs({ product, reviews = [] }) {
  const { description, details = {}, _id, rating = 5.0 } = product;

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <Tabs.Root defaultValue="description" className="w-full">
        {/* Tabs Bar */}
        <Tabs.List className="flex items-center gap-2 sm:gap-6 border-b border-border overflow-x-auto no-scrollbar mb-8">
          <Tabs.Trigger
            value="description"
            className="flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink/60 data-[state=active]:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Description
          </Tabs.Trigger>

          <Tabs.Trigger
            value="specs"
            className="flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink/60 data-[state=active]:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink transition-colors cursor-pointer whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5" />
            Specs & Details
          </Tabs.Trigger>

          <Tabs.Trigger
            value="shipping"
            className="flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink/60 data-[state=active]:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink transition-colors cursor-pointer whitespace-nowrap"
          >
            <Truck className="w-3.5 h-3.5" />
            Shipping & Returns
          </Tabs.Trigger>

          <Tabs.Trigger
            value="reviews"
            className="flex items-center gap-2 pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink/60 data-[state=active]:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reviews ({reviews.length})
          </Tabs.Trigger>
        </Tabs.List>

        {/* 1. Description Tab */}
        <Tabs.Content value="description" className="focus:outline-none max-w-3xl">
          <div className="space-y-4 text-sm font-sans text-ink/80 leading-relaxed">
            <p className="text-base font-medium text-ink">
              {description}
            </p>
            <p>
              Engineered with meticulous attention to street proportions, silhouette balance, and premium tactile comfort. Each garment is garment-dyed and enzyme washed for an authentic vintage hand-feel that only improves with each wash and wear.
            </p>
            <p>
              Designed in our studio and assembled with heavy reinforced flatlock stitching at all stress points, ensuring lasting durability through relentless daily wear.
            </p>
          </div>
        </Tabs.Content>

        {/* 2. Specs Tab */}
        <Tabs.Content value="specs" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="bg-card border border-border p-6 space-y-4">
              <h4 className="font-display text-lg uppercase tracking-wider text-ink mb-2">
                Garment Specifications
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/60 pb-2">
                <span className="font-mono text-ink/50 uppercase">Fabric</span>
                <span className="col-span-2 font-medium text-ink">{details.fabric || '100% Combed Heavy Cotton'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/60 pb-2">
                <span className="font-mono text-ink/50 uppercase">Weight</span>
                <span className="col-span-2 font-medium text-ink">{details.weight || '480 GSM Heavyweight'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs border-b border-border/60 pb-2">
                <span className="font-mono text-ink/50 uppercase">Fit</span>
                <span className="col-span-2 font-medium text-ink">{details.fit || 'Oversized boxy cut with dropped shoulders'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="font-mono text-ink/50 uppercase">Care</span>
                <span className="col-span-2 font-medium text-ink">{details.care || 'Machine wash cold inside out, hang dry'}</span>
              </div>
            </div>

            <div className="bg-card border border-border p-6 space-y-4">
              <h4 className="font-display text-lg uppercase tracking-wider text-ink mb-2">
                Design & Construction
              </h4>
              <ul className="space-y-2 text-xs text-ink/80 list-disc list-inside">
                <li>Double needle flatlock seam construction</li>
                <li>Custom dyed heavyweight rib knit collars and cuffs</li>
                <li>Pre-shrunk organic yarn to minimize shrinkage</li>
                <li>Blind hem finishing with tonal branding accents</li>
              </ul>
            </div>
          </div>
        </Tabs.Content>

        {/* 3. Shipping Tab */}
        <Tabs.Content value="shipping" className="focus:outline-none max-w-3xl">
          <div className="space-y-4 text-xs sm:text-sm text-ink/80 leading-relaxed">
            <div className="border border-border bg-card p-4 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-ink">
                Domestic Delivery (2 - 4 Business Days)
              </h5>
              <p>
                Standard delivery is complimentary on all orders over $150. Orders placed before 2 PM EST ship the same business day from our main fulfillment warehouse.
              </p>
            </div>
            <div className="border border-border bg-card p-4 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-ink">
                14-Day Hassle-Free Returns
              </h5>
              <p>
                We accept returns and size exchanges within 14 days of delivery. Items must be unworn, unwashed, and returned in their original packaging with all security tags attached.
              </p>
            </div>
          </div>
        </Tabs.Content>

        {/* 4. Reviews Tab */}
        <Tabs.Content value="reviews" className="focus:outline-none">
          <ProductReviews
            productId={_id}
            reviews={reviews}
            averageRating={rating}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

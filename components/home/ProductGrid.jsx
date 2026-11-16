'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

export default function ProductGrid({ products = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === activeCategory);

  const categories = [
    { label: 'ALL DROPS', value: 'all' },
    { label: 'HOODIES', value: 'hoodies' },
    { label: 'TEES', value: 'tees' },
    { label: 'BOTTOMS', value: 'bottoms' },
    { label: 'ACCESSORIES', value: 'accessories' },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#F5F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <span className="font-heading text-xs uppercase tracking-streetwear text-[#B38B66] block mb-1">
              LIMITED TIME ROTATION
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-[#111111]">
              FEATURED <span className="text-[#B38B66]">DROPS</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={`font-heading text-xs uppercase px-3.5 py-1.5 tracking-wider transition-all rounded-none whitespace-nowrap border ${
                  activeCategory === cat.value
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-transparent text-[#736E67] border-[#E3DBD2] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-col desktop, 2-col mobile product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#F7F4F0] border border-[#E3DBD2]">
            <p className="font-heading text-base uppercase text-[#736E67]">
              NO PRODUCTS FOUND IN THIS CATEGORY DROP.
            </p>
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="btn-primary px-8 py-3.5 text-xs md:text-sm tracking-widest inline-flex items-center gap-2 group"
          >
            <span>VIEW COMPLETE CATALOG ({products.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

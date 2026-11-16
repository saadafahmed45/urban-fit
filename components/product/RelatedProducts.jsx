import React from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function RelatedProducts({ products = [], title = 'You May Also Like' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-1">
            Complete The Rotation
          </span>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ink">
            {title}
          </h3>
        </div>

        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink hover:text-tan transition-colors"
        >
          <span>View All Drops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

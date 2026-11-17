import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FALLBACK_CATEGORIES } from '@/lib/fallback-data';

export default function CategoryGrid({ categories = [] }) {
  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 5)
      : FALLBACK_CATEGORIES.slice(0, 5);

  return (
    <section className="bg-[#F5F1EC] py-14 md:py-20 border-b border-[#E3DBD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#B38B66] uppercase block mb-1">
            CURATED DEPARTMENTS
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-[#111111]">
            SHOP BY CATEGORY
          </h2>
          <div className="w-12 h-0.5 bg-[#111111] mx-auto mt-3" />
        </div>

        {/* 5-Column Portrait Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {displayCategories.map((cat, idx) => (
            <Link
              key={cat._id || cat.slug || idx}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] bg-[#0D0D0D] overflow-hidden border border-[#E3DBD2] hover:border-[#111111] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-end p-4 text-center select-none"
            >
              {/* Category Background Image */}
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A1A1A]" />
              )}

              {/* Gradient Dark Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:from-black/90" />

              {/* Category Info Overlay */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#B38B66] uppercase font-semibold mb-1">
                  {cat.itemCount || 'ESSENTIALS'}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white group-hover:text-[#EFE8E0] transition-colors leading-none mb-2">
                  {cat.name}
                </h3>

                {/* Shop Now CTA Box */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 group-hover:bg-white text-white group-hover:text-black border border-white/20 group-hover:border-white text-[10px] font-heading font-bold uppercase tracking-widest transition-all duration-300">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

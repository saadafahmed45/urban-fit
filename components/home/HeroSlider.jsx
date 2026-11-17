'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const DEFAULT_HERO_SLIDES = [
  {
    _id: 'hero-slide-1',
    label: 'NEW ARRIVALS • DROP 04',
    titleLine1: 'HEAVYWEIGHT.',
    titleLine2: 'CURATED.',
    description: 'Premium oversized streetwear pieces. Crafted from 480+ GSM French terry cotton. Engineered for the definitive boxy silhouette.',
    buttonText: 'SHOP NOW',
    buttonLink: '/shop',
    secondaryText: 'EXPLORE HOODIES',
    secondaryLink: '/category/hoodies',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=85&w=1400',
    badge: 'DROP LIVE',
    specs: ['480 GSM COTTON', 'BOXY OVERSIZED FIT', 'LIMITED RELEASE'],
  },
  {
    _id: 'hero-slide-2',
    label: 'SUMMER ESSENTIALS 2026',
    titleLine1: 'STREETWEAR.',
    titleLine2: 'ARCHIVE.',
    description: 'Vintage mineral washed boxy tees and tactical cargo pants. Cut with dropped shoulders and raw streetwear edge.',
    buttonText: 'SHOP TEES',
    buttonLink: '/category/tees',
    secondaryText: 'VIEW LOOKBOOK',
    secondaryLink: '/shop?isTrending=true',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=85&w=1400',
    badge: 'NEW SEASON',
    specs: ['280 GSM JERSEY', 'MINERAL WASHED', 'DROPPED SHOULDERS'],
  },
  {
    _id: 'hero-slide-3',
    label: 'LIMITED TIME ARCHIVE DROP',
    titleLine1: 'THRIFTED.',
    titleLine2: 'ELEVATED.',
    description: 'Rare cuts, heavy fleece hoodies, and tactical joggers. Clean minimalist palettes designed for modern urban aesthetic.',
    buttonText: 'EXPLORE ALL',
    buttonLink: '/shop?isNew=true',
    secondaryText: 'CARGO PANTS',
    secondaryLink: '/category/bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=85&w=1400',
    badge: 'CORE DROP',
    specs: ['CUSTOM HARDWARE', 'HEAVY RIB KNIT', 'MADE FOR ROTATION'],
  },
];

export default function HeroSlider({ banners = [] }) {
  // Map dynamic banners from admin panel or fallback to high-end slides
  const slides =
    banners && banners.length > 0
      ? banners.map((b, idx) => ({
          _id: b._id || `banner-${idx}`,
          label: b.smallLabel || 'NEW ARRIVALS',
          titleLine1: b.titleLine1 || 'URBAN FIT.',
          titleLine2: b.titleLine2 || 'CURATED.',
          description:
            b.subtitle ||
            'Premium heavyweight streetwear pieces. Handpicked for quality. Engineered for the oversized aesthetic.',
          buttonText: b.buttonText?.replace(' →', '') || 'SHOP NOW',
          buttonLink: b.buttonLink || '/shop',
          secondaryText: 'EXPLORE DROPS',
          secondaryLink: '/shop?isTrending=true',
          image: b.image || DEFAULT_HERO_SLIDES[0].image,
          badge: b.badgeText || 'LIVE NOW',
          specs: ['480 GSM FLEECE', 'OVERSIZED CUT', 'STREETWEAR CORE'],
        }))
      : DEFAULT_HERO_SLIDES;

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative bg-[#0D0D0D] text-white overflow-hidden border-b border-[#222222]">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#B38B66]/10 via-[#B38B66]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-[#222222]/40 rounded-full blur-3xl pointer-events-none" />

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: '.hero-pagination-dots',
          bulletClass: 'hero-dot',
          bulletActiveClass: 'hero-dot-active',
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id || index}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[520px] md:min-h-[580px]">
                {/* Left Content Column */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-6 z-10 text-left">
                  {/* Category / Drop Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-[0.25em] text-[#EFE8E0] uppercase font-semibold">
                      <Sparkles className="w-3 h-3 text-[#B38B66]" />
                      <span>{slide.label}</span>
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono text-[#B38B66] tracking-widest uppercase">
                      // {slide.badge}
                    </span>
                  </div>

                  {/* High-Impact Headline */}
                  <div>
                    <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-wider uppercase text-white font-extrabold">
                      <span className="block text-white">{slide.titleLine1}</span>
                      <span className="block text-white/90 drop-shadow-sm">
                        {slide.titleLine2}
                      </span>
                    </h1>
                  </div>

                  {/* Minimalist Subtitle Paragraph */}
                  <p className="font-sans text-xs sm:text-sm md:text-base text-white/70 max-w-lg leading-relaxed font-light">
                    {slide.description}
                  </p>

                  {/* Spec Chips / Features */}
                  {slide.specs && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {slide.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-black/60 border border-white/10 text-white/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-3.5">
                    <Link
                      href={slide.buttonLink || '/shop'}
                      className="px-8 py-3.5 bg-white hover:bg-[#EFE8E0] text-[#111111] font-heading font-bold text-xs uppercase tracking-[0.2em] transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-white/10 hover:translate-y-[-1px] cursor-pointer"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
                    </Link>

                    <Link
                      href={slide.secondaryLink || '/category/hoodies'}
                      className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-heading text-xs uppercase tracking-[0.2em] border border-white/30 hover:border-white transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.secondaryText}</span>
                    </Link>
                  </div>
                </div>

                {/* Right Hero Image Column with Moody Streetwear Silhouette */}
                <div className="lg:col-span-6 relative flex items-center justify-center">
                  <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 border border-white/10 shadow-2xl group">
                    <Image
                      src={slide.image}
                      alt={slide.titleLine1}
                      fill
                      priority={index === 0}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 contrast-105"
                    />

                    {/* Gradient overlay blending seamlessly with hero background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 via-transparent to-transparent" />

                    {/* Floating Brand Stamp (Streetwear Aesthetic) */}
                    <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                      <div className="bg-black/75 backdrop-blur-md border border-white/15 px-3.5 py-2">
                        <span className="font-display text-sm tracking-widest uppercase text-white block">
                          URBAN FIT
                        </span>
                        <span className="text-[9px] font-mono tracking-[0.25em] text-[#B38B66] uppercase block">
                          HEAVYWEIGHT ARCHIVE
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block">
                          EDITION
                        </span>
                        <span className="font-mono text-xs text-white font-bold tracking-widest">
                          0{index + 1} / 0{slides.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide Navigation & Indicator Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between border-t border-white/10 pt-4">
        {/* Pagination Dots */}
        <div className="hero-pagination-dots flex items-center gap-2.5" />

        {/* Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            className="w-9 h-9 border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            className="w-9 h-9 border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hero-dot {
          width: 24px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          display: inline-block;
          transition: all 0.3s ease;
        }
        .hero-dot-active {
          background-color: #ffffff;
          width: 48px;
        }
      `}</style>
    </section>
  );
}

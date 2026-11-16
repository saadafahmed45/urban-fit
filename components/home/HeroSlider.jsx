'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const DEFAULT_BANNERS = [
  {
    _id: 'default-hero-1',
    tag: 'NEW COLLECTION',
    title: 'SUMMER',
    highlightText: 'ESSENTIALS',
    subtitle: '— DROP NOW LIVE —',
    badge: 'UP TO 50% OFF',
    buttonText: 'SHOP NOW →',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    _id: 'default-hero-2',
    tag: 'LIMITED DROP',
    title: 'HEAVYWEIGHT',
    highlightText: 'ARCHIVE',
    subtitle: '— 480 GSM FRENCH TERRY —',
    badge: 'LIMITED EDITION',
    buttonText: 'EXPLORE DROP →',
    buttonLink: '/category/hoodies',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1200',
  },
];

export default function HeroSlider({ banners = [] }) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative bg-[#F5F1EC] border-b border-[#E3DBD2] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: '.hero-custom-pagination',
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id || index}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Content Column */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-4 md:space-y-6 z-10 text-center lg:text-left">
                  {/* Small Tan Label */}
                  <div>
                    <span className="inline-block bg-[#EFE8E0] border border-[#B38B66]/40 text-[#B38B66] text-[11px] md:text-xs font-heading font-semibold uppercase tracking-streetwear px-3 py-1">
                      {slide.tag || 'NEW COLLECTION'}
                    </span>
                  </div>

                  {/* Huge Heading */}
                  <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[90px] leading-[0.9] tracking-tight uppercase text-[#111111]">
                    {slide.title}{' '}
                    <span className="text-[#B38B66] block md:inline lg:block">
                      {slide.highlightText || 'ESSENTIALS'}
                    </span>
                  </h1>

                  {/* Drop Status Subtitle */}
                  <p className="font-heading text-sm md:text-base tracking-[0.25em] text-[#736E67] uppercase">
                    {slide.subtitle || '— DROP NOW LIVE —'}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Link
                      href={slide.buttonLink || '/shop'}
                      className="btn-primary w-full sm:w-auto px-8 py-4 text-sm md:text-base tracking-widest shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <span>{slide.buttonText || 'SHOP NOW →'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/category/hoodies"
                      className="btn-secondary w-full sm:w-auto px-6 py-4 text-sm tracking-wider"
                    >
                      VIEW ARCHIVE
                    </Link>
                  </div>
                </div>

                {/* Right Image Column with Circular Badge */}
                <div className="lg:col-span-6 relative flex items-center justify-center">
                  <div className="relative w-full max-w-lg aspect-[4/5] bg-[#EFE8E0] rounded-[16px] overflow-hidden border border-[#E3DBD2] shadow-2xl">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    />

                    {/* Circular Tan Badge */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#B38B66] text-white p-2 flex flex-col items-center justify-center text-center shadow-xl border-2 border-white/30 rotate-[-12deg] hover:rotate-0 transition-transform">
                        <span className="font-heading text-[10px] md:text-xs font-bold uppercase leading-tight">
                          {slide.badge || 'UP TO 50% OFF'}
                        </span>
                        <span className="text-[8px] font-sans tracking-widest uppercase text-white/80 mt-0.5">
                          LIMITED
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

      {/* Navigation Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between">
        <div className="hero-custom-pagination flex items-center gap-2" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            className="w-9 h-9 border border-[#111111] bg-transparent hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            className="w-9 h-9 border border-[#111111] bg-transparent hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hero-bullet {
          width: 28px;
          height: 3px;
          background-color: #E3DBD2;
          cursor: pointer;
          display: inline-block;
          transition: all 0.3s ease;
        }
        .hero-bullet-active {
          background-color: #111111;
          width: 44px;
        }
      `}</style>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TRIAD_BANNERS = [
  {
    title: 'NEW DROPS',
    subtitle: 'Every Friday at 12:00 PM EST',
    buttonText: 'EXPLORE',
    href: '/shop?isNew=true',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    tag: 'FRESH ROTATION',
  },
  {
    title: '480 GSM FLEECE',
    subtitle: 'Ultra-Dense French Terry Cotton',
    buttonText: 'EXPLORE',
    href: '/category/hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    tag: 'CORE ARCHIVE',
  },
  {
    title: 'UP TO 50% OFF',
    subtitle: 'Limited Season Clearance',
    buttonText: 'SHOP SALE',
    href: '/shop?sale=true',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    tag: 'LIMITED TIME',
  },
];

export default function PromoTriad() {
  return (
    <section className="bg-[#0D0D0D] py-12 md:py-16 border-b border-[#222222] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {TRIAD_BANNERS.map((banner, idx) => (
            <div
              key={idx}
              className="group relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/10] bg-[#1A1A1A] border border-white/10 hover:border-white/30 overflow-hidden flex flex-col justify-between p-6 sm:p-7 transition-all duration-300"
            >
              {/* Background Image with Streetwear Model */}
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-106 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

              {/* Tag Pill */}
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-0.5 bg-black/60 border border-white/20 text-[9px] font-mono tracking-[0.2em] uppercase text-[#B38B66] font-semibold">
                  {banner.tag}
                </span>
              </div>

              {/* Banner Text & Button */}
              <div className="relative z-10 space-y-3">
                <div>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white leading-none">
                    {banner.title}
                  </h3>
                  <p className="font-sans text-xs text-white/70 mt-1 font-light tracking-wide">
                    {banner.subtitle}
                  </p>
                </div>

                <div>
                  <Link
                    href={banner.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111111] hover:bg-[#EFE8E0] text-[11px] font-heading font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md"
                  >
                    <span>{banner.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

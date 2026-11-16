import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const DEFAULT_LOOKS = [
  {
    _id: 'look-1',
    title: 'THE STREET OVERSIZED FIT',
    tag: 'LOOK 01',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    link: '/category/hoodies',
  },
  {
    _id: 'look-2',
    title: 'MINIMAL MONOCHROME EDIT',
    tag: 'LOOK 02',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    link: '/category/tees',
  },
  {
    _id: 'look-3',
    title: 'TACTICAL LAYERING STYLE',
    tag: 'LOOK 03',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800',
    link: '/category/outerwear',
  },
  {
    _id: 'look-4',
    title: 'EARTH TONES & TAUPE',
    tag: 'LOOK 04',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    link: '/category/accessories',
  },
];

export default function ShopTheLook({ lookbooks = [] }) {
  const looks = lookbooks && lookbooks.length > 0 ? lookbooks : DEFAULT_LOOKS;

  return (
    <section className="py-16 md:py-24 bg-[#F5F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="font-heading text-xs uppercase tracking-streetwear text-[#B38B66] block mb-1">
              EDITORIAL CURATION
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-[#111111]">
              SHOP THE <span className="text-[#B38B66]">LOOK</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="group font-heading text-xs uppercase tracking-wider text-[#111111] hover:text-[#B38B66] transition-colors flex items-center gap-1.5"
          >
            <span>VIEW MORE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Row of 4 Lookbook Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {looks.slice(0, 4).map((look, index) => (
            <Link
              key={look._id || index}
              href={look.link || '/shop'}
              className="group relative flex flex-col bg-[#F7F4F0] border border-[#E3DBD2] rounded-[14px] overflow-hidden hover:border-[#111111] transition-all duration-300"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE8E0]">
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                  <span className="self-start tag-new bg-white text-[#111111] text-[10px]">
                    {look.tag || `LOOK 0${index + 1}`}
                  </span>

                  <div>
                    <h3 className="font-heading text-base uppercase font-semibold text-white group-hover:text-[#B38B66] transition-colors leading-snug">
                      {look.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-heading uppercase text-white/80 mt-2">
                      <span>SHOP PIECES</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

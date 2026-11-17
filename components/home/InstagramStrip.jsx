'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, ArrowRight, Heart } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
    likes: '1.4k',
    handle: '@marcus.fits',
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=600',
    likes: '2.8k',
    handle: '@elena.street',
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=600',
    likes: '940',
    handle: '@urban.daily',
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    likes: '3.1k',
    handle: '@tokyo.archive',
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    likes: '1.9k',
    handle: '@oversized.cult',
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600',
    likes: '860',
    handle: '@kyle.urban',
  },
  {
    id: 'ig-7',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    likes: '2.2k',
    handle: '@streetwear.era',
  },
  {
    id: 'ig-8',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    likes: '1.7k',
    handle: '@archive.fits',
  },
];

export default function InstagramStrip() {
  return (
    <section className="bg-black py-12 md:py-16 text-white overflow-hidden border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#B38B66] uppercase font-bold block mb-1">
            COMMUNITY & LOOKS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white">
            FOLLOW US ON INSTAGRAM
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-white/60 hover:text-white transition-colors inline-block mt-1 tracking-wider"
          >
            @urbanfit.style
          </a>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-heading font-bold uppercase tracking-widest text-white hover:text-[#B38B66] inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>TAG #URBANFIT</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Grid / Strip of 8 Square Fit Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-[#1A1A1A] overflow-hidden block border border-white/10 hover:border-white/40 transition-colors"
          >
            <Image
              src={post.image}
              alt={post.handle}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
              className="object-cover object-center group-hover:scale-108 transition-transform duration-500 brightness-90 group-hover:brightness-100"
            />

            {/* Hover Instagram Overlay */}
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center z-10">
              <Instagram className="w-5 h-5 text-white mb-1.5" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#B38B66] font-bold">
                <Heart className="w-3 h-3 fill-[#B38B66]" />
                <span>{post.likes}</span>
              </div>
              <span className="text-[9px] font-mono text-white/70 truncate max-w-[90px] mt-0.5">
                {post.handle}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

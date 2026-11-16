'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images = [], name = 'Product Image', isNew, discountPercent }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const galleryImages = images && images.length > 0
    ? images
    : [{ url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000', publicId: 'default' }];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Bar */}
      {galleryImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar max-h-[580px]">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.url || idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden bg-card border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-ink scale-102' : 'border-border/60 hover:border-ink/40 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-3/4 bg-card border border-border overflow-hidden select-none group">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {isNew && (
            <span className="bg-ink text-primary-bg text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
              NEW DROP
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-tan text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Zoomable Image Container */}
        <div
          className="relative w-full h-full overflow-hidden cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.url}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-150 ease-out"
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows for mobile/tablet */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-card/80 backdrop-blur-xs border border-border flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer sm:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-card/80 backdrop-blur-xs border border-border flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer sm:hidden"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 pointer-events-none hidden lg:flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3 h-3" />
          Hover to Zoom
        </div>
      </div>
    </div>
  );
}

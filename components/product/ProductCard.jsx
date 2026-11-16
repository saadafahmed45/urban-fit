'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useUIStore } from '@/store/ui';
import { useStore } from '@/store/use-store';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || 'M');

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useStore(useWishlistStore, (s) => s.isInWishlist(product?._id || product?.productId), false);

  if (!product) return null;

  const primaryImage = product.images?.[0]?.url || '/placeholder.jpg';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    const defaultVariant = product.variants?.find((v) => v.size === selectedSize) || product.variants?.[0];
    const color = defaultVariant?.color || 'Standard';

    addItem({
      productId: product._id || product.productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: primaryImage,
      size: selectedSize,
      color,
      quantity: 1,
      stock: defaultVariant?.stock ?? product.stock ?? 99,
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 300);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div
      className="group relative flex flex-col bg-[#F7F4F0] border border-[#E3DBD2] rounded-[14px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#111111]/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full bg-[#EFE8E0] overflow-hidden block">
        {/* Primary & Hover Secondary Image */}
        <Image
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && <span className="tag-new">NEW</span>}
          {discountPercent && <span className="tag-sale">-{discountPercent}%</span>}
          {product.isBestSeller && (
            <span className="bg-[#111111] text-white text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-0.5">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Top-Right */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isInWishlist
              ? 'bg-[#111111] text-[#B38B66]'
              : 'bg-white/80 backdrop-blur-sm text-[#111111] hover:bg-white hover:text-[#B38B66]'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-[#B38B66]' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          {product.variants && product.variants.length > 0 ? (
            <div className="bg-[#111111]/95 backdrop-blur-sm p-2 flex flex-col gap-1.5 shadow-xl">
              {/* Size Selectors */}
              <div className="flex items-center justify-center gap-1 flex-wrap">
                {product.variants.slice(0, 4).map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(v.size);
                    }}
                    className={`text-[10px] font-heading uppercase px-2 py-0.5 border ${
                      selectedSize === v.size
                        ? 'border-[#B38B66] text-[#B38B66] font-bold'
                        : 'border-[#444444] text-white/80 hover:text-white'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="w-full bg-[#B38B66] hover:bg-[#916D4C] text-white py-1.5 font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                {isAdding ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> ADDED
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD ({selectedSize})
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full bg-[#111111] hover:bg-[#B38B66] text-white py-2.5 font-heading text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD +
            </button>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <span className="font-heading text-[10px] tracking-streetwear uppercase text-[#B38B66] block truncate">
            {product.categoryName || product.category}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-heading text-xs md:text-sm uppercase text-[#111111] hover:text-[#B38B66] transition-colors line-clamp-1 mt-0.5"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E3DBD2]/60">
          <span className="font-heading text-sm md:text-base font-bold text-[#111111]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="font-heading text-xs text-[#736E67] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

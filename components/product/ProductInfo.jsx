'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Star, Heart, ArrowRight, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useUIStore } from '@/store/ui';
import { useStore } from '@/store/use-store';

export default function ProductInfo({ product }) {
  const {
    _id,
    name,
    category,
    categoryName,
    price,
    compareAtPrice,
    variants = [],
    stock: totalStock = 0,
    rating = 5.0,
    numReviews = 0,
    details = {},
  } = product;

  // Extract unique sizes and colors from variants
  const uniqueSizes = useMemo(() => {
    if (!variants || variants.length === 0) return ['S', 'M', 'L', 'XL'];
    return Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
  }, [variants]);

  const uniqueColors = useMemo(() => {
    if (!variants || variants.length === 0) return ['Standard'];
    return Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  }, [variants]);

  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useStore(useWishlistStore, (s) => s.isInWishlist?.(_id) ?? false, false);

  // Determine current variant stock
  const currentVariant = useMemo(() => {
    if (!variants || variants.length === 0) return null;
    return (
      variants.find(
        (v) =>
          v.size?.toLowerCase() === selectedSize?.toLowerCase() &&
          v.color?.toLowerCase() === selectedColor?.toLowerCase()
      ) || variants[0]
    );
  }, [variants, selectedSize, selectedColor]);

  const currentStock = currentVariant ? currentVariant.stock : totalStock;
  const isOutOfStock = currentStock <= 0;

  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);

    addItem({
      productId: _id,
      slug: product.slug,
      name,
      price,
      compareAtPrice,
      image: product.images?.[0]?.url || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
      stock: currentStock,
    });

    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);

    // Open slide-over drawer
    openCartDrawer();
  };

  return (
    <div className="flex flex-col">
      {/* Category & SKU */}
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-ink/60 mb-2">
        <Link
          href={`/category/${category}`}
          className="hover:text-tan transition-colors underline-offset-4 hover:underline"
        >
          {categoryName || category}
        </Link>
        {currentVariant?.sku && <span>SKU: {currentVariant.sku}</span>}
      </div>

      {/* Product Title */}
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-ink mb-3 leading-none">
        {name}
      </h1>

      {/* Rating & Review Counter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center text-tan">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(rating)
                  ? 'fill-tan text-tan'
                  : 'text-border fill-transparent'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-ink/70">
          {rating.toFixed(1)} ({numReviews} reviews)
        </span>
      </div>

      {/* Price Block */}
      <div className="flex items-baseline gap-3 pb-6 mb-6 border-b border-border">
        <span className="font-display text-3xl text-ink tracking-wider">
          {formatPrice(price)}
        </span>
        {compareAtPrice && compareAtPrice > price && (
          <span className="text-base text-ink/40 line-through font-mono">
            {formatPrice(compareAtPrice)}
          </span>
        )}
        {discountPercent && (
          <span className="bg-tan/15 text-tan border border-tan/30 text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Color Selector */}
      {uniqueColors.length > 0 && uniqueColors[0] !== 'Standard' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-ink">
              Color: <span className="font-normal text-ink/70">{selectedColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-ink bg-ink text-primary-bg font-bold'
                      : 'border-border bg-card text-ink hover:border-ink/50'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-ink">
            Size: <span className="font-normal text-ink/70">{selectedSize}</span>
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-ink/50 underline cursor-pointer hover:text-ink">
            Fit Guide
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {uniqueSizes.map((size) => {
            const isSelected = selectedSize === size;
            const sizeVariant = variants.find(
              (v) =>
                v.size?.toLowerCase() === size.toLowerCase() &&
                (uniqueColors[0] === 'Standard' || v.color === selectedColor)
            );
            const isSizeOOS = sizeVariant && sizeVariant.stock <= 0;

            return (
              <button
                key={size}
                disabled={isSizeOOS}
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-ink bg-ink text-primary-bg'
                    : isSizeOOS
                    ? 'border-border/40 text-ink/30 line-through bg-surface cursor-not-allowed'
                    : 'border-border bg-card text-ink hover:border-ink/60'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status Indicator */}
      <div className="mb-6 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOutOfStock ? 'bg-red-500' : currentStock < 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
          }`}
        />
        <span className="text-xs font-mono uppercase tracking-wider text-ink/80">
          {isOutOfStock
            ? 'Out of Stock'
            : currentStock < 5
            ? `Low Stock — Only ${currentStock} left in this size`
            : 'In Stock — Ready to ship'}
        </span>
      </div>

      {/* Quantity & Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-border bg-card w-full sm:w-36 h-12">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-12 h-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="flex-1 text-center font-mono text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
            disabled={quantity >= currentStock || isOutOfStock}
            className="w-12 h-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Bag CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="flex-1 h-12 bg-ink hover:bg-ink/85 text-primary-bg font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Bag</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <span>Add to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Wishlist Toggle Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-12 h-12 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isWishlisted
              ? 'border-ink bg-ink text-primary-bg'
              : 'border-border bg-card text-ink hover:border-ink'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-tan text-tan' : 'text-ink'}`} />
        </button>
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="border-t border-border pt-6 space-y-3">
        <div className="flex items-center gap-3 text-xs text-ink/80">
          <Truck className="w-4 h-4 text-tan shrink-0" />
          <span>Complimentary standard shipping on orders over $150</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink/80">
          <RefreshCw className="w-4 h-4 text-tan shrink-0" />
          <span>14-day hassle-free exchange & return policy</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink/80">
          <ShieldCheck className="w-4 h-4 text-tan shrink-0" />
          <span>Guaranteed authentic heavy French terry & ring-spun cotton</span>
        </div>
      </div>
    </div>
  );
}

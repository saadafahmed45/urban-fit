'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/layout/ShopLayout';
import { useCartStore } from '@/store/cart';
import { useStore } from '@/store/use-store';
import { formatPrice } from '@/lib/utils';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function CartPage() {
  const cart = useStore(useCartStore, (s) => s);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!cart) {
    return (
      <ShopLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-tan border-t-transparent rounded-full animate-spin" />
        </div>
      </ShopLayout>
    );
  }

  const {
    items,
    removeItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    shippingThreshold = 100,
  } = cart;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const discountAmount = getDiscountAmount();
  const total = getTotal();

  const progressPercent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, shippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          cartTotal: subtotal,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.coupon) {
        applyCoupon(data.data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid or expired promo code.');
      }
    } catch (err) {
      setCouponError('Error validating promo code. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-6 mb-8 border-b border-border">
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-2">
              Shopping Bag
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
              {items.length} {items.length === 1 ? 'Item' : 'Items'} in your bag
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="bg-card border border-border p-12 md:p-20 text-center max-w-xl mx-auto">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-ink/20 stroke-1" />
              <h2 className="font-display text-2xl uppercase tracking-wider text-ink mb-2">
                Your Bag is Empty
              </h2>
              <p className="text-xs text-ink/60 uppercase tracking-widest mb-8 leading-relaxed">
                Looks like you haven't added any oversized drops to your rotation yet.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-ink text-primary-bg px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-ink/85 transition-colors"
              >
                <span>Explore Drops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Items List */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Bar */}
                <div className="bg-surface border border-border p-4">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-2 text-ink">
                      <Truck className="w-4 h-4 text-tan" />
                      {amountToFreeShipping > 0 ? (
                        <span>
                          Add <span className="font-bold text-ink">{formatPrice(amountToFreeShipping)}</span> more for Free Standard Shipping
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold">
                          You've unlocked FREE Standard Shipping!
                        </span>
                      )}
                    </span>
                    <span className="text-ink/60">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tan transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items Table / Cards */}
                <div className="border border-border bg-card divide-y divide-border">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.slug}`}
                        className="relative w-20 h-24 sm:w-24 sm:h-28 bg-surface shrink-0 border border-border overflow-hidden"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-ink/40">
                            NO IMG
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-display text-lg uppercase tracking-wider text-ink hover:text-tan transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-ink/60 mt-1">
                          <span>Size: <strong className="text-ink">{item.size}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-ink">{item.color}</strong></span>
                        </div>
                        <div className="text-xs font-mono text-ink/80 mt-2">
                          Unit: {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border bg-surface h-9">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-ink/70 hover:text-ink cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-mono text-xs font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-ink/70 hover:text-ink cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="font-display text-lg text-ink tracking-wider">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-ink/40 hover:text-red-600 transition-colors cursor-pointer p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to Shop Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink hover:text-tan transition-colors"
                  >
                    <span>← Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-card border border-border p-6 sticky top-28 space-y-6">
                  <h3 className="font-display text-2xl uppercase tracking-wider text-ink border-b border-border pb-4">
                    Order Summary
                  </h3>

                  {/* Promo Code Input */}
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-surface border border-border px-3 py-2 text-xs font-mono uppercase tracking-wider text-ink focus:outline-none focus:border-ink"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="bg-ink text-primary-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponError && (
                      <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-mono mt-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponError}</span>
                      </div>
                    )}

                    {coupon && (
                      <div className="flex items-center justify-between bg-tan/15 border border-tan/30 p-2.5 mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tan font-bold">
                          <Tag className="w-3.5 h-3.5" />
                          <span>
                            {coupon.code} ({coupon.discountPercent || 10}% OFF)
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-ink/60 hover:text-ink uppercase tracking-wider font-mono cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-xs font-mono border-t border-b border-border py-4">
                    <div className="flex justify-between text-ink/80">
                      <span>Subtotal</span>
                      <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-tan font-bold">
                        <span>Discount ({coupon?.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-ink/80">
                      <span>Estimated Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-700 uppercase">FREE</strong>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-ink/80">
                      <span>Estimated Sales Tax</span>
                      <span className="text-ink/60 font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg uppercase tracking-wider text-ink">
                      Estimated Total
                    </span>
                    <span className="font-display text-3xl tracking-wider text-ink">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full bg-ink hover:bg-ink/85 text-primary-bg py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Trust guarantees */}
                  <div className="space-y-2 pt-2 text-[11px] font-mono text-ink/60 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-tan" />
                      <span>256-bit Encrypted Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-tan" />
                      <span>14-day return & exchange window</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}

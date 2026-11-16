'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useStore } from '@/store/use-store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const items = useStore(useCartStore, (state) => state.items, []);
  const coupon = useStore(useCartStore, (state) => state.coupon, null);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThreshold = 100;
  const standardShippingFee = 15;
  const freeShippingMet = subtotal >= shippingThreshold;
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const shippingFee = items.length === 0 ? 0 : freeShippingMet ? 0 : standardShippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError('');
    setIsApplyingCoupon(true);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();

      if (data?.success) {
        applyCoupon(data.data);
        setCouponInput('');
      } else {
        setCouponError(data?.error || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <AnimatePresence>
        {isCartOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-[#111111]/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Slide-over Drawer */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F5F1EC] border-l border-[#E3DBD2] shadow-2xl flex flex-col justify-between"
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-[#E3DBD2] bg-[#EFE8E0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#111111]" />
                    <h3 className="font-heading text-lg tracking-wide uppercase text-[#111111]">
                      YOUR BAG ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="text-[#736E67] hover:text-[#111111] p-1 transition-colors"
                      aria-label="Close cart"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Free Shipping Progress Indicator */}
                <div className="bg-[#F7F4F0] px-5 py-3 border-b border-[#E3DBD2]">
                  <div className="flex items-center justify-between text-xs font-heading mb-1.5 uppercase">
                    {freeShippingMet ? (
                      <span className="text-[#2E8B57] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> YOU UNLOCKED FREE SHIPPING!
                      </span>
                    ) : (
                      <span className="text-[#111111]">
                        ADD <span className="text-[#B38B66] font-bold">{formatPrice(remainingForFreeShipping)}</span> FOR FREE SHIPPING
                      </span>
                    )}
                    <span className="text-[#736E67]">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E3DBD2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B38B66] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <ShoppingBag className="w-16 h-16 text-[#E3DBD2] mb-3 stroke-[1.2]" />
                      <p className="font-heading text-lg uppercase text-[#111111] mb-1">
                        YOUR BAG IS EMPTY
                      </p>
                      <p className="font-sans text-xs text-[#736E67] max-w-xs mb-6">
                        Explore our new heavyweight hoodies, drop essentials, and accessories.
                      </p>
                      <Dialog.Close asChild>
                        <Link href="/shop" className="btn-primary text-xs py-3 px-6">
                          EXPLORE THE DROP →
                        </Link>
                      </Dialog.Close>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.key}
                        className="flex gap-4 p-3 bg-[#F7F4F0] border border-[#E3DBD2] relative group"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 bg-[#EFE8E0] shrink-0 overflow-hidden">
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="font-heading text-sm uppercase text-[#111111] hover:text-[#B38B66] transition-colors truncate"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-[#736E67] hover:text-[#E04848] p-1 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="font-sans text-[11px] text-[#736E67] uppercase tracking-wider mt-0.5">
                              SIZE: <span className="text-[#111111] font-medium">{item.size}</span> | COLOR: <span className="text-[#111111] font-medium">{item.color}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#E3DBD2] bg-[#FFFFFF]">
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="p-1 hover:bg-[#EFE8E0] text-[#111111] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-heading text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="p-1 hover:bg-[#EFE8E0] text-[#111111] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-heading text-sm font-semibold text-[#111111]">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Section */}
                {items.length > 0 && (
                  <div className="border-t border-[#E3DBD2] bg-[#EFE8E0] p-5 space-y-3">
                    {/* Coupon Input */}
                    {coupon ? (
                      <div className="flex items-center justify-between bg-[#F5F1EC] p-2 border border-[#B38B66]/50 text-xs">
                        <div className="flex items-center gap-1.5 text-[#111111] font-heading">
                          <Tag className="w-3.5 h-3.5 text-[#B38B66]" />
                          <span>COUPON: <strong>{coupon.code}</strong> (-{formatPrice(discountAmount)})</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[#736E67] hover:text-[#E04848] text-xs font-heading underline uppercase"
                        >
                          REMOVE
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="PROMO CODE (e.g. URBAN10)"
                          className="flex-1 bg-[#F5F1EC] border border-[#E3DBD2] px-3 py-1.5 text-xs font-heading uppercase text-[#111111] placeholder:text-[#736E67] focus:outline-none focus:border-[#111111]"
                        />
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponInput.trim()}
                          className="bg-[#111111] text-white px-3 py-1.5 text-xs font-heading uppercase hover:bg-[#B38B66] transition-colors disabled:opacity-50"
                        >
                          {isApplyingCoupon ? '...' : 'APPLY'}
                        </button>
                      </form>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-[#E04848] font-heading uppercase">{couponError}</p>
                    )}

                    {/* Breakdown */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E3DBD2]/60 text-xs font-heading uppercase">
                      <div className="flex justify-between text-[#736E67]">
                        <span>SUBTOTAL</span>
                        <span className="text-[#111111]">{formatPrice(subtotal)}</span>
                      </div>
                      {coupon && (
                        <div className="flex justify-between text-[#B38B66]">
                          <span>DISCOUNT ({coupon.code})</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#736E67]">
                        <span>SHIPPING</span>
                        <span className="text-[#111111]">
                          {freeShippingMet ? 'FREE' : formatPrice(shippingFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-[#111111] pt-1 border-t border-[#E3DBD2]">
                        <span>ESTIMATED TOTAL</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Checkout CTAs */}
                    <div className="space-y-2 pt-2">
                      <Dialog.Close asChild>
                        <Link
                          href="/checkout"
                          className="w-full btn-primary text-center py-3 flex items-center justify-center gap-2"
                        >
                          PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Dialog.Close>

                      <Dialog.Close asChild>
                        <Link
                          href="/cart"
                          className="w-full btn-secondary text-center py-2.5 text-xs"
                        >
                          VIEW FULL BAG
                        </Link>
                      </Dialog.Close>
                    </div>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

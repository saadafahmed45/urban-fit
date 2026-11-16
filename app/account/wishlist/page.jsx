'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/layout/ShopLayout';
import AuthGuard from '@/components/account/AuthGuard';
import AccountNav from '@/components/account/AccountNav';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useStore } from '@/store/use-store';
import { formatPrice } from '@/lib/utils';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function AccountWishlistPage() {
  const wishlist = useStore(useWishlistStore, (s) => s);
  const addItemToCart = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);

  const items = wishlist?.items || [];
  const removeItem = wishlist?.removeItem;

  const handleMoveToBag = (product) => {
    addItemToCart({
      productId: product.productId || product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      size: 'M',
      color: 'Standard',
      quantity: 1,
      stock: 50,
    });
    if (removeItem) {
      removeItem(product.productId || product._id);
    }
    openCartDrawer();
  };

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGuard>
            {({ user }) => (
              <div>
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-border">
                  <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink mb-1">
                    Saved Drops & Wishlist
                  </h1>
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
                    {items.length} {items.length === 1 ? 'Garment' : 'Garments'} saved to your wishlist.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <AccountNav user={user} />

                  <div className="flex-1">
                    {items.length === 0 ? (
                      <div className="bg-card border border-border p-12 text-center">
                        <Heart className="w-12 h-12 text-ink/20 mx-auto mb-4 stroke-1" />
                        <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-2">
                          Your Wishlist is Empty
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-ink/60 mb-6">
                          Save your favorite streetwear pieces to track availability and price changes.
                        </p>
                        <Link
                          href="/shop"
                          className="bg-ink text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-ink/85 transition-colors"
                        >
                          <span>Explore Drops</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {items.map((item) => (
                          <div
                            key={item.productId || item._id}
                            className="bg-card border border-border overflow-hidden flex flex-col group"
                          >
                            {/* Product Image */}
                            <Link
                              href={`/product/${item.slug}`}
                              className="relative aspect-3/4 bg-surface block overflow-hidden"
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : null}

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeItem(item.productId || item._id);
                                }}
                                className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-xs border border-border flex items-center justify-center text-ink/70 hover:text-red-600 transition-colors cursor-pointer"
                                aria-label="Remove from wishlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </Link>

                            {/* Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-ink/50 block mb-1">
                                  {item.category || 'Streetwear'}
                                </span>
                                <Link
                                  href={`/product/${item.slug}`}
                                  className="font-display text-base uppercase tracking-wider text-ink hover:text-tan transition-colors line-clamp-1 block"
                                >
                                  {item.name}
                                </Link>
                                <div className="font-display text-lg text-ink mt-1">
                                  {formatPrice(item.price)}
                                </div>
                              </div>

                              <button
                                onClick={() => handleMoveToBag(item)}
                                className="mt-4 w-full bg-ink hover:bg-ink/85 text-primary-bg py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-tan" />
                                <span>Move to Bag</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AuthGuard>
        </div>
      </div>
    </ShopLayout>
  );
}

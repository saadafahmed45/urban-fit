'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Heart, ShoppingBag, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useUIStore } from '@/store/ui';
import { formatPrice } from '@/lib/utils';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TrendingCarousel({ products = [] }) {
  const displayProducts =
    products && products.length > 0 ? products : FALLBACK_PRODUCTS.slice(0, 6);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const [addedMap, setAddedMap] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const primaryImg =
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      product.image ||
      '';

    const defaultVariant = product.variants?.[0] || { size: 'M', color: 'Standard' };

    addItem({
      productId: product._id || product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: primaryImg,
      size: defaultVariant.size || 'M',
      color: defaultVariant.color || 'Standard',
      quantity: 1,
      stock: product.stock,
    });

    setAddedMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);

    openCart();
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <section className="bg-white py-14 md:py-20 border-b border-[#E3DBD2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#B38B66] uppercase block mb-1">
              CURRENT HEAT
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-[#111111]">
              TRENDING NOW
            </h2>
            <div className="w-12 h-0.5 bg-[#111111] mt-3" />
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/shop?isTrending=true"
              className="text-xs font-mono uppercase tracking-widest text-[#B38B66] hover:text-[#111111] font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiperInstance?.slidePrev()}
                className="w-9 h-9 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous trending slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => swiperInstance?.slideNext()}
                className="w-9 h-9 border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next trending slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          onSwiper={setSwiperInstance}
          pagination={{
            clickable: true,
            el: '.trending-pagination-dots',
            bulletClass: 'trending-bullet',
            bulletActiveClass: 'trending-bullet-active',
          }}
          breakpoints={{
            640: { slidesPerView: 2.5, spaceBetween: 20 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
          className="pb-4"
        >
          {displayProducts.map((product) => {
            const primaryImg =
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              product.image ||
              '';

            const isWishlisted = wishlistItems.some(
              (item) => (item.productId || item._id) === product._id
            );
            const isAdded = addedMap[product._id];

            return (
              <SwiperSlide key={product._id || product.slug}>
                <div className="group flex flex-col h-full bg-[#F5F1EC] border border-[#E3DBD2] hover:border-[#111111] transition-all duration-300">
                  {/* Image Container with Badges & Wishlist */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-square w-full bg-[#EFE8E0] overflow-hidden block"
                  >
                    {primaryImg ? (
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#736E67]">
                        NO IMAGE
                      </div>
                    )}

                    {/* Badge */}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#111111] text-white text-[9px] font-mono uppercase tracking-wider font-bold">
                        SALE
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-white/85 hover:bg-white text-[#111111] border border-[#E3DBD2]'
                      }`}
                      aria-label="Wishlist toggle"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? 'fill-red-600 text-red-600' : 'text-[#111111]'
                        }`}
                      />
                    </button>
                  </Link>

                  {/* Info & Add to Cart */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#B38B66] font-semibold truncate mb-1">
                        {product.categoryName || product.category || 'STREETWEAR'}
                      </p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111] hover:text-[#B38B66] transition-colors line-clamp-1 block mb-1.5"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-[#111111]">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="font-mono text-xs text-[#736E67] line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button (Matching Reference Image) */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`w-full py-2.5 px-3 text-[11px] font-heading font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#111111] hover:bg-[#B38B66] text-white active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ADD TO CART</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Carousel Pagination Dots */}
        <div className="trending-pagination-dots flex items-center justify-center gap-2 pt-6" />
      </div>

      <style jsx global>{`
        .trending-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #E3DBD2;
          cursor: pointer;
          display: inline-block;
          transition: all 0.3s ease;
        }
        .trending-bullet-active {
          background-color: #111111;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}

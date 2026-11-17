import ShopLayout from '@/components/layout/ShopLayout';
import HeroSlider from '@/components/home/HeroSlider';
import FeatureStrip from '@/components/home/FeatureStrip';
import TickerBand from '@/components/home/TickerBand';
import CategoryGrid from '@/components/home/CategoryGrid';
import TrendingCarousel from '@/components/home/TrendingCarousel';
import PromoTriad from '@/components/home/PromoTriad';
import ProductGrid from '@/components/home/ProductGrid';
import ShopTheLook from '@/components/home/ShopTheLook';
import InstagramStrip from '@/components/home/InstagramStrip';
import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';

export const revalidate = 60; // ISR cache for 60 seconds

async function getHomeData() {
  try {
    const db = await getDb();

    // 1. Hero Banners
    const rawBanners = await db
      .collection('banners')
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    // 2. Categories for "Shop By Category"
    const rawCategories = await db
      .collection('categories')
      .find({})
      .sort({ order: 1 })
      .toArray();

    // 3. Trending / Best Seller Products for Carousel
    const rawTrending = await db
      .collection('products')
      .find({ $or: [{ isTrending: true }, { isBestSeller: true }] })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .toArray();

    // 4. Curated Catalog Grid Products
    const rawProducts = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    // 5. Lookbook Items (Hotspots)
    const rawLookbook = await db
      .collection('lookbook')
      .find({ isActive: true })
      .sort({ order: 1 })
      .limit(4)
      .toArray();

    // 6. Site Settings
    const rawSettings = await db.collection('settings').findOne({});

    return {
      banners: serializeDocs(rawBanners),
      categories: rawCategories.length > 0 ? serializeDocs(rawCategories) : FALLBACK_CATEGORIES,
      trendingProducts: rawTrending.length > 0 ? serializeDocs(rawTrending) : FALLBACK_PRODUCTS.slice(0, 6),
      products: rawProducts.length > 0 ? serializeDocs(rawProducts) : FALLBACK_PRODUCTS,
      lookbooks: serializeDocs(rawLookbook),
      settings: serializeDoc(rawSettings),
    };
  } catch (error) {
    console.warn('Home page MongoDB fallback notice:', error.message);
    return {
      banners: [],
      categories: FALLBACK_CATEGORIES,
      trendingProducts: FALLBACK_PRODUCTS.slice(0, 6),
      products: FALLBACK_PRODUCTS,
      lookbooks: [],
      settings: {
        freeShippingThreshold: 100,
        announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF',
      },
    };
  }
}

export default async function HomePage() {
  const { banners, categories, trendingProducts, products, lookbooks, settings } = await getHomeData();

  return (
    <ShopLayout showTrustStrip={false}>
      {/* 1. Cinematic Luxury Streetwear Hero (Matching & Elevating Reference) */}
      <HeroSlider banners={banners} />

      {/* 2. 4-Pillar Trust & Quality Strip (Free Shipping, Premium Quality, Easy Returns, 24/7 Support) */}
      <FeatureStrip />

      {/* 3. Streetwear Continuous Marquee Ticker */}
      <TickerBand />

      {/* 4. "SHOP BY CATEGORY" 5-Card Portrait Grid */}
      <CategoryGrid categories={categories} />

      {/* 5. "TRENDING NOW" Swiper Carousel with Direct "ADD TO CART" */}
      <TrendingCarousel products={trendingProducts} />

      {/* 6. Promotional Triad Banners (New Drops, 480 GSM Fleece, Up to 50% Off) */}
      <PromoTriad />

      {/* 7. Curated Full Drop Grid */}
      <ProductGrid products={products} />

      {/* 8. Interactive Hotspot Lookbook */}
      <ShopTheLook lookbooks={lookbooks} />

      {/* 9. "FOLLOW US ON INSTAGRAM" @urbanfit.style Fit Feed */}
      <InstagramStrip />
    </ShopLayout>
  );
}

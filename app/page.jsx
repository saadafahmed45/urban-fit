import ShopLayout from '@/components/layout/ShopLayout';
import HeroSlider from '@/components/home/HeroSlider';
import FeatureStrip from '@/components/home/FeatureStrip';
import ProductGrid from '@/components/home/ProductGrid';
import PromoBand from '@/components/home/PromoBand';
import ShopTheLook from '@/components/home/ShopTheLook';
import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';

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

    // 2. Featured / Curated Products (up to 8)
    const rawProducts = await db
      .collection('products')
      .find({})
      .sort({ isBestSeller: -1, isNew: -1, createdAt: -1 })
      .limit(8)
      .toArray();

    // 3. Lookbook Items (4)
    const rawLookbook = await db
      .collection('lookbook')
      .find({ isActive: true })
      .sort({ order: 1 })
      .limit(4)
      .toArray();

    // 4. Site Settings
    const rawSettings = await db.collection('settings').findOne({});

    return {
      banners: serializeDocs(rawBanners),
      products: serializeDocs(rawProducts),
      lookbooks: serializeDocs(rawLookbook),
      settings: serializeDoc(rawSettings),
    };
  } catch (error) {
    console.warn('Home page MongoDB fallback notice:', error.message);
    return {
      banners: [],
      products: [
        {
          _id: 'prod-fallback-1',
          name: 'Heavyweight Boxy Hoodie',
          slug: 'heavyweight-boxy-hoodie',
          category: 'hoodies',
          categoryName: 'Hoodies',
          price: 125,
          compareAtPrice: 160,
          stock: 45,
          images: [
            {
              url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
              isPrimary: true,
            },
            {
              url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
              isPrimary: false,
            },
          ],
          variants: [
            { size: 'S', color: 'Vintage Cream', stock: 10 },
            { size: 'M', color: 'Vintage Cream', stock: 15 },
            { size: 'L', color: 'Vintage Cream', stock: 12 },
          ],
          isNew: true,
          isBestSeller: true,
        },
        {
          _id: 'prod-fallback-2',
          name: 'Washed Taupe Zip-Up Hoodie',
          slug: 'washed-taupe-zip-up-hoodie',
          category: 'hoodies',
          categoryName: 'Hoodies',
          price: 135,
          compareAtPrice: 175,
          stock: 30,
          images: [
            {
              url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000',
              isPrimary: true,
            },
          ],
          variants: [
            { size: 'M', color: 'Tan Taupe', stock: 15 },
            { size: 'L', color: 'Tan Taupe', stock: 10 },
          ],
          isNew: true,
          isBestSeller: false,
        },
        {
          _id: 'prod-fallback-3',
          name: 'Archive Heavy Boxy Tee',
          slug: 'archive-heavy-boxy-tee',
          category: 'tees',
          categoryName: 'Tees',
          price: 58,
          compareAtPrice: 70,
          stock: 60,
          images: [
            {
              url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
              isPrimary: true,
            },
          ],
          variants: [
            { size: 'M', color: 'Off-White', stock: 20 },
            { size: 'L', color: 'Off-White', stock: 15 },
          ],
          isNew: false,
          isBestSeller: true,
        },
        {
          _id: 'prod-fallback-4',
          name: 'Tactical Cargo Sweatpants',
          slug: 'tactical-cargo-sweatpants',
          category: 'bottoms',
          categoryName: 'Bottoms',
          price: 110,
          compareAtPrice: 145,
          stock: 35,
          images: [
            {
              url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1000',
              isPrimary: true,
            },
          ],
          variants: [
            { size: 'M', color: 'Charcoal Black', stock: 15 },
            { size: 'L', color: 'Charcoal Black', stock: 12 },
          ],
          isNew: true,
          isBestSeller: true,
        },
      ],
      lookbooks: [],
      settings: {
        freeShippingThreshold: 100,
        announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF',
      },
    };
  }
}

export default async function HomePage() {
  const { banners, products, lookbooks, settings } = await getHomeData();

  return (
    <ShopLayout showTrustStrip={true}>
      {/* 1. Hero Split Slider */}
      <HeroSlider banners={banners} />

      {/* 2. Feature Strip */}
      <FeatureStrip />

      {/* 3. Curated Product Grid */}
      <ProductGrid products={products} />

      {/* 4. Split Promo Band */}
      <PromoBand settings={settings} />

      {/* 5. Shop The Look Editorial Row */}
      <ShopTheLook lookbooks={lookbooks} />
    </ShopLayout>
  );
}

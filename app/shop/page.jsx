import ShopLayout from '@/components/layout/ShopLayout';
import ShopClient from '@/components/shop/ShopClient';
import { getDb, serializeDocs } from '@/lib/mongodb';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const category = sp?.category ? `${sp.category.toUpperCase()} - ` : '';
  return {
    title: `${category}Shop All Drops | URBAN FIT`,
    description: 'Explore the latest collection of heavyweight hoodies, boxy tees, and streetwear essentials.',
  };
}

async function getShopData(searchParams) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.limit || '12', 10)));
  const skip = (page - 1) * limit;

  const category = searchParams.category;
  const search = searchParams.search;
  const sort = searchParams.sort || 'newest';
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const size = searchParams.size;
  const color = searchParams.color;
  const tag = searchParams.tag;
  const isNew = searchParams.isNew === 'true';
  const isBestSeller = searchParams.isBestSeller === 'true';
  const isTrending = searchParams.isTrending === 'true';

  try {
    const db = await getDb();

    // 1. Fetch categories
    const rawCategories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
    const categories = rawCategories.length > 0 ? serializeDocs(rawCategories) : FALLBACK_CATEGORIES;

    // 2. Build filter
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category.toLowerCase().trim();
    }
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (size) {
      filter['variants.size'] = { $regex: new RegExp(`^${size}$`, 'i') };
    }
    if (color) {
      filter['variants.color'] = { $regex: new RegExp(color, 'i') };
    }
    if (tag) {
      filter.tags = tag.toLowerCase();
    }
    if (isNew) filter.isNew = true;
    if (isBestSeller) filter.isBestSeller = true;
    if (isTrending) filter.isTrending = true;

    // 3. Build sort
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { isBestSeller: -1, rating: -1, createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, numReviews: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const total = await db.collection('products').countDocuments(filter);
    const rawProducts = await db
      .collection('products')
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      categories,
      products: serializeDocs(rawProducts),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error) {
    console.warn('Shop page DB query fallback:', error.message);

    // In-memory filter on FALLBACK_PRODUCTS
    let filtered = [...FALLBACK_PRODUCTS];

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }
    if (size) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.size.toLowerCase() === size.toLowerCase())
      );
    }
    if (color) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.color.toLowerCase().includes(color.toLowerCase()))
      );
    }
    if (isNew) filtered = filtered.filter((p) => p.isNew);
    if (isBestSeller) filtered = filtered.filter((p) => p.isBestSeller);
    if (isTrending) filtered = filtered.filter((p) => p.isTrending);

    // Sorting
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const total = filtered.length;
    const paginatedProducts = filtered.slice(skip, skip + limit);

    return {
      categories: FALLBACK_CATEGORIES,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const { categories, products, pagination } = await getShopData(sp || {});

  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen">
        {/* Shop Header Banner */}
        <div className="bg-surface border-b border-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink/50 mb-3">
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">Shop Collection</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-ink mb-2">
              All Streetwear Drops
            </h1>
            <p className="text-sm font-sans text-ink/70 max-w-xl">
              Heavyweight cottons, custom dye treatments, and modern boxy cuts engineered for elevated daily wear.
            </p>
          </div>
        </div>

        {/* Products & Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ShopClient
            initialProducts={products}
            categories={categories}
            pagination={pagination}
          />
        </div>
      </div>
    </ShopLayout>
  );
}

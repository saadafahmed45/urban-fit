import ShopLayout from '@/components/layout/ShopLayout';
import ShopClient from '@/components/shop/ShopClient';
import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category';
  return {
    title: `${name} | URBAN FIT Streetwear`,
    description: `Shop the curated collection of ${slug} by URBAN FIT. Designed for the modern oversized streetwear silhouette.`,
  };
}

async function getCategoryData(slug, searchParams) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.limit || '12', 10)));
  const skip = (page - 1) * limit;

  try {
    const db = await getDb();

    // 1. Fetch current category details
    const rawCategory = await db.collection('categories').findOne({ slug: slug.toLowerCase() });
    
    // 2. Fetch all categories for sidebar
    const rawCategories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
    const categories = rawCategories.length > 0 ? serializeDocs(rawCategories) : FALLBACK_CATEGORIES;

    // 3. Build filter for this category
    const filter = { category: slug.toLowerCase() };
    if (searchParams.search) filter.$text = { $search: searchParams.search.trim() };
    if (searchParams.minPrice || searchParams.maxPrice) {
      filter.price = {};
      if (searchParams.minPrice) filter.price.$gte = parseFloat(searchParams.minPrice);
      if (searchParams.maxPrice) filter.price.$lte = parseFloat(searchParams.maxPrice);
    }
    if (searchParams.size) filter['variants.size'] = { $regex: new RegExp(`^${searchParams.size}$`, 'i') };
    if (searchParams.color) filter['variants.color'] = { $regex: new RegExp(searchParams.color, 'i') };
    if (searchParams.isNew === 'true') filter.isNew = true;
    if (searchParams.isBestSeller === 'true') filter.isBestSeller = true;
    if (searchParams.isTrending === 'true') filter.isTrending = true;

    // Sort
    let sortOptions = { createdAt: -1 };
    if (searchParams.sort === 'price-low') sortOptions = { price: 1 };
    else if (searchParams.sort === 'price-high') sortOptions = { price: -1 };
    else if (searchParams.sort === 'popular') sortOptions = { isBestSeller: -1, rating: -1 };

    const total = await db.collection('products').countDocuments(filter);
    const rawProducts = await db
      .collection('products')
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      category: rawCategory ? serializeDoc(rawCategory) : { name: slug, slug, description: `Premium ${slug} collection` },
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
    console.warn('Category page DB query fallback:', error.message);
    const currentCat = FALLBACK_CATEGORIES.find((c) => c.slug === slug.toLowerCase()) || {
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      description: `Premium ${slug} collection.`,
    };

    let filtered = FALLBACK_PRODUCTS.filter((p) => p.category === slug.toLowerCase());
    const total = filtered.length;
    const paginatedProducts = filtered.slice(skip, skip + limit);

    return {
      category: currentCat,
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

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const { category, categories, products, pagination } = await getCategoryData(slug, sp || {});

  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen">
        {/* Category Header */}
        <div className="bg-surface border-b border-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink/50 mb-3">
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-ink transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">{category?.name || slug}</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-ink mb-2">
              {category?.name || slug}
            </h1>
            <p className="text-sm font-sans text-ink/70 max-w-xl">
              {category?.description || `Explore our high quality ${category?.name} collection.`}
            </p>
          </div>
        </div>

        {/* Products Section */}
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

import { getDb, serializeDocs } from '@/lib/mongodb';
import { successResponse } from '@/lib/api-response';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
  const skip = (page - 1) * limit;

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const size = searchParams.get('size');
  const color = searchParams.get('color');
  const tag = searchParams.get('tag');
  const isNew = searchParams.get('isNew');
  const isBestSeller = searchParams.get('isBestSeller');
  const isTrending = searchParams.get('isTrending');

  try {
    const db = await getDb();

    // Build filter query
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

    if (isNew === 'true') {
      filter.isNew = true;
    }

    if (isBestSeller === 'true') {
      filter.isBestSeller = true;
    }

    if (isTrending === 'true') {
      filter.isTrending = true;
    }

    // Build sort
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { isBestSeller: -1, isTrending: -1, createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, numReviews: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Count and find
    const total = await db.collection('products').countDocuments(filter);
    const rawProducts = await db
      .collection('products')
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    const products = serializeDocs(rawProducts);

    return successResponse(products, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.warn('API /api/products fallback query notice:', error.message);

    let filtered = [...FALLBACK_PRODUCTS];

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
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
        p.variants?.some((v) => v.size?.toLowerCase() === size.toLowerCase())
      );
    }

    if (color) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.color?.toLowerCase().includes(color.toLowerCase()))
      );
    }

    if (isNew === 'true') filtered = filtered.filter((p) => p.isNew);
    if (isBestSeller === 'true') filtered = filtered.filter((p) => p.isBestSeller);
    if (isTrending === 'true') filtered = filtered.filter((p) => p.isTrending);

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return successResponse(paginated, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: page * limit < total,
    });
  }
}

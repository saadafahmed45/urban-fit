import { getDb, toObjectId, serializeDoc, serializeDocs } from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/lib/api-response';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';

export async function GET(request, context) {
  const { slug } = await context.params;
  if (!slug) {
    return errorResponse('Product slug is required', 400);
  }

  try {
    const db = await getDb();

    // Query by slug or ObjectId fallback
    let product = await db.collection('products').findOne({ slug: slug.toLowerCase() });
    
    if (!product && toObjectId(slug)) {
      product = await db.collection('products').findOne({ _id: toObjectId(slug) });
    }

    if (!product) {
      const fb = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase());
      if (fb) {
        return successResponse({
          product: fb,
          relatedProducts: FALLBACK_PRODUCTS.filter((p) => p.slug !== fb.slug).slice(0, 4),
          reviews: [],
        });
      }
      return errorResponse('Product not found', 404);
    }

    // Fetch related products from same category
    const rawRelated = await db
      .collection('products')
      .find({
        category: product.category,
        _id: { $ne: product._id },
      })
      .limit(4)
      .toArray();

    // Fetch product reviews
    const rawReviews = await db
      .collection('reviews')
      .find({ productId: product._id.toString() })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return successResponse({
      product: serializeDoc(product),
      relatedProducts: serializeDocs(rawRelated),
      reviews: serializeDocs(rawReviews),
    });
  } catch (error) {
    console.warn('API /api/products/[slug] fallback notice:', error.message);
    const fb = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase()) || FALLBACK_PRODUCTS[0];
    return successResponse({
      product: fb,
      relatedProducts: FALLBACK_PRODUCTS.filter((p) => p.slug !== fb.slug).slice(0, 4),
      reviews: [],
    });
  }
}

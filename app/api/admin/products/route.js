import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, productSchema } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const filter = {};
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
        { tags: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    const db = await getDb();
    const total = await db.collection('products').countDocuments(filter);
    const rawProducts = await db
      .collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const products = serializeDocs(rawProducts);
    return successResponse({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.warn('Admin products fallback query notice:', error.message);
    const { FALLBACK_PRODUCTS } = await import('@/lib/fallback-data');
    return successResponse({
      products: FALLBACK_PRODUCTS,
      total: FALLBACK_PRODUCTS.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const body = await request.json();
    if (!body.slug && body.name) {
      body.slug = slugify(body.name);
    }

    const validation = validateInput(productSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const productData = validation.data;
    const db = await getDb();

    // Ensure unique slug
    const existing = await db.collection('products').findOne({ slug: productData.slug });
    if (existing) {
      return errorResponse('A product with this slug already exists. Please choose a unique slug.', 409);
    }

    // Associate category name if not provided
    if (!productData.categoryName) {
      const cat = await db.collection('categories').findOne({ slug: productData.category });
      productData.categoryName = cat?.name || productData.category;
    }

    const docToInsert = {
      ...productData,
      rating: 0,
      numReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(docToInsert);
    docToInsert._id = result.insertedId;

    return successResponse(serializeDoc(docToInsert), { message: 'Product created successfully' }, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse(error.message, 500);
  }
}

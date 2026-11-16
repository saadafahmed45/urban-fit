import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, categorySchema } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const db = await getDb();
    const categories = await db
      .collection('categories')
      .find({})
      .sort({ order: 1, name: 1 })
      .toArray();

    return successResponse({ categories: serializeDocs(categories) });
  } catch (error) {
    console.warn('Admin categories fallback notice:', error.message);
    const { FALLBACK_CATEGORIES } = await import('@/lib/fallback-data');
    return successResponse({ categories: FALLBACK_CATEGORIES });
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

    const validation = validateInput(categorySchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const existing = await db.collection('categories').findOne({ slug: validation.data.slug });
    if (existing) {
      return errorResponse('A category with this slug already exists', 409);
    }

    const newCategory = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('categories').insertOne(newCategory);
    newCategory._id = result.insertedId;

    return successResponse(serializeDoc(newCategory), { message: 'Category created successfully' }, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse(error.message, 500);
  }
}

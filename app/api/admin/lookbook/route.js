import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, lookbookSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const db = await getDb();
    const lookbooks = await db.collection('lookbook').find({}).sort({ order: 1 }).toArray();
    return successResponse({ lookbook: serializeDocs(lookbooks) });
  } catch (error) {
    console.warn('Admin lookbook fallback notice:', error.message);
    return successResponse({
      lookbook: [
        {
          _id: 'look_1',
          title: 'Minimalist Boxy Cut',
          subtitle: 'Shibuya Look 01',
          tag: 'Oversized',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
          productSlug: 'heavyweight-boxy-hoodie',
          order: 1,
          isActive: true,
        },
      ],
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
    const validation = validateInput(lookbookSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const newLookbook = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('lookbook').insertOne(newLookbook);
    newLookbook._id = result.insertedId;

    return successResponse(serializeDoc(newLookbook), { message: 'Lookbook item created successfully' }, 201);
  } catch (error) {
    console.error('Error creating lookbook:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, bannerSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const db = await getDb();
    const banners = await db.collection('banners').find({}).sort({ order: 1, createdAt: -1 }).toArray();
    return successResponse({ banners: serializeDocs(banners) });
  } catch (error) {
    console.warn('Admin banners fallback notice:', error.message);
    return successResponse({
      banners: [
        {
          _id: 'banner_1',
          smallLabel: 'NEW COLLECTION',
          titleLine1: 'SUMMER',
          titleLine2: 'ESSENTIALS',
          subtitle: '— DROP NOW LIVE —',
          buttonText: 'SHOP NOW →',
          buttonLink: '/shop',
          badgeText: 'UP TO 50% OFF',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200',
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
    const validation = validateInput(bannerSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const newBanner = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('banners').insertOne(newBanner);
    newBanner._id = result.insertedId;

    return successResponse(serializeDoc(newBanner), { message: 'Banner created successfully' }, 201);
  } catch (error) {
    console.error('Error creating banner:', error);
    return errorResponse(error.message, 500);
  }
}

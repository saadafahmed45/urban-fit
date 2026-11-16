import { getDb, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, settingsSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const db = await getDb();
    let settings = await db.collection('settings').findOne({});
    if (!settings) {
      settings = {
        freeShippingThreshold: 100,
        shippingFee: 15,
        announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF',
        announcementActive: true,
        contactEmail: 'support@urbanfit.co',
        contactPhone: '+1 (800) 872-2634',
        instagramUrl: 'https://instagram.com/urbanfit',
      };
    }

    const serialized = serializeDoc(settings);
    return successResponse({ settings: serialized });
  } catch (error) {
    console.warn('Admin settings fallback notice:', error.message);
    return successResponse({
      settings: {
        freeShippingThreshold: 100,
        shippingFee: 15,
        announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF ARCHIVE DROPS',
        announcementActive: true,
        contactEmail: 'concierge@urbanfit.style',
        contactPhone: '+1 (800) 872-2634',
        address: '452 Broadway, SoHo, NY 10013',
      },
    });
  }
}

export async function PUT(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const body = await request.json();
    const validation = validateInput(settingsSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const updated = await db.collection('settings').findOneAndUpdate(
      {},
      {
        $set: {
          ...validation.data,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    return successResponse(serializeDoc(updated), { message: 'Site settings updated successfully' });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, bannerSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PUT(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) {
      return errorResponse('Invalid banner ID', 400);
    }

    const body = await request.json();
    const validation = validateInput(bannerSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const updated = await db.collection('banners').findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...validation.data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return errorResponse('Banner not found', 404);
    }

    return successResponse(serializeDoc(updated), { message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) {
      return errorResponse('Invalid banner ID', 400);
    }

    const db = await getDb();
    await db.collection('banners').deleteOne({ _id: objectId });
    return successResponse({ id }, { message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, couponSchema } from '@/lib/validators';
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
      return errorResponse('Invalid coupon ID', 400);
    }

    const body = await request.json();
    const validation = validateInput(couponSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const updated = await db.collection('coupons').findOneAndUpdate(
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
      return errorResponse('Coupon not found', 404);
    }

    return successResponse(serializeDoc(updated), { message: 'Coupon updated successfully' });
  } catch (error) {
    console.error('Error updating coupon:', error);
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
      return errorResponse('Invalid coupon ID', 400);
    }

    const db = await getDb();
    await db.collection('coupons').deleteOne({ _id: objectId });
    return successResponse({ id }, { message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return errorResponse(error.message, 500);
  }
}

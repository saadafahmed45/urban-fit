import { getAdminFromRequest } from '@/lib/auth';
import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const adminPayload = await getAdminFromRequest(request);
    if (!adminPayload) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    try {
      const db = await getDb();
      const admin = await db.collection('admins').findOne(
        { _id: toObjectId(adminPayload.sub) },
        { projection: { password: 0 } }
      );

      if (admin) {
        return successResponse(serializeDoc(admin));
      }
    } catch (dbError) {
      console.warn('Admin /me DB query notice:', dbError.message);
    }

    // Fallback using JWT payload
    return successResponse({
      _id: adminPayload.sub,
      email: adminPayload.email,
      name: adminPayload.name || 'Super Admin',
      role: adminPayload.role || 'super_admin',
    });
  } catch (error) {
    console.error('Error verifying admin session:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, serializeDocs } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
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

    const filter = {};
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const db = await getDb();
    const total = await db.collection('users').countDocuments(filter);
    const rawUsers = await db
      .collection('users')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Enrich with order count and total spent
    const enrichedUsers = await Promise.all(
      rawUsers.map(async (u) => {
        const uidStr = u._id?.toString() || u.id;
        const matchConditions = [];
        if (uidStr) matchConditions.push({ userId: uidStr });
        if (u.firebaseUid) matchConditions.push({ userId: u.firebaseUid });
        if (u.email) matchConditions.push({ customerEmail: u.email });

        const stats = await db.collection('orders').aggregate([
          { $match: matchConditions.length > 1 ? { $or: matchConditions } : matchConditions[0] || { userId: uidStr } },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$total' },
              orderCount: { $sum: 1 },
            },
          },
        ]).toArray();

        return {
          ...u,
          orderCount: stats[0]?.orderCount || 0,
          totalSpent: stats[0]?.totalSpent ? Number(stats[0].totalSpent.toFixed(2)) : 0,
        };
      })
    );

    const customers = serializeDocs(enrichedUsers);
    return successResponse({
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.warn('Admin customers fallback notice:', error.message);
    return successResponse({
      customers: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  }
}

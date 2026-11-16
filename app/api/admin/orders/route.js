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

    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter = {};
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }
    if (search && search.trim()) {
      filter.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { userEmail: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const db = await getDb();
    const total = await db.collection('orders').countDocuments(filter);
    const rawOrders = await db
      .collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const orders = serializeDocs(rawOrders);
    return successResponse({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.warn('Admin orders fallback notice:', error.message);
    return successResponse({
      orders: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  }
}

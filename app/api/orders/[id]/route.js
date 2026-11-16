import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getCustomerFromRequest, getAdminFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    if (!id) {
      return errorResponse('Order identifier is required', 400);
    }

    const customer = await getCustomerFromRequest(request);
    const admin = await getAdminFromRequest(request);

    if (!customer && !admin) {
      return errorResponse('Authentication required to view order details.', 401);
    }

    try {
      const db = await getDb();
      const query = {
        $or: [
          { orderNumber: id },
          ...(toObjectId(id) ? [{ _id: toObjectId(id) }] : []),
        ],
      };

      const order = await db.collection('orders').findOne(query);

      if (!order) {
        return errorResponse('Order not found', 404);
      }

      // Customer can only view their own order; admin can view any order
      const isOwner =
        customer &&
        (order.userId === customer.uid ||
          order.userId === customer.id ||
          (customer.email && order.customerEmail === customer.email));

      if (!admin && !isOwner) {
        return errorResponse('Access denied. You are not authorized to view this order.', 403);
      }

      return successResponse(serializeDoc(order));
    } catch (dbErr) {
      console.warn('MongoDB offline in /api/orders/[id]:', dbErr.message);
      return errorResponse('Database temporarily offline', 503);
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return errorResponse(error.message, 500);
  }
}

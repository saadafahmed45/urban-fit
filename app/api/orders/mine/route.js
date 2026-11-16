import { getDb, serializeDocs } from '@/lib/mongodb';
import { getCustomerFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const customer = await getCustomerFromRequest(request);
    if (!customer) {
      return errorResponse('Authentication required.', 401);
    }

    try {
      const db = await getDb();
      const rawOrders = await db
        .collection('orders')
        .find({
          $or: [
            { userId: customer.uid },
            { userId: customer.id },
            ...(customer.email ? [{ customerEmail: customer.email }, { 'shippingAddress.email': customer.email }] : []),
          ],
        })
        .sort({ createdAt: -1 })
        .toArray();

      const orders = serializeDocs(rawOrders);
      return successResponse({ orders, total: orders.length });
    } catch (dbErr) {
      console.warn('MongoDB offline in /api/orders/mine:', dbErr.message);
      return successResponse({ orders: [], total: 0 });
    }
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return errorResponse(error.message, 500);
  }
}

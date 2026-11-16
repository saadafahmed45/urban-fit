import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
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

    return successResponse(serializeDoc(order));
  } catch (error) {
    console.error('Error fetching admin order:', error);
    return errorResponse(error.message, 500);
  }
}

export async function PUT(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber, note } = body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return errorResponse('Invalid order status', 400);
    }

    const db = await getDb();
    const query = {
      $or: [
        { orderNumber: id },
        ...(toObjectId(id) ? [{ _id: toObjectId(id) }] : []),
      ],
    };

    const existingOrder = await db.collection('orders').findOne(query);
    if (!existingOrder) {
      return errorResponse('Order not found', 404);
    }

    const updateFields = {
      updatedAt: new Date(),
    };

    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
    if (note !== undefined) updateFields.adminNote = note;

    // If status transitions to 'cancelled' and was not previously cancelled, restore stock
    if (orderStatus === 'cancelled' && existingOrder.orderStatus !== 'cancelled') {
      for (const item of existingOrder.items || []) {
        if (item.productId && item.quantity) {
          await db.collection('products').updateOne(
            { _id: toObjectId(item.productId) },
            { $inc: { stock: item.quantity } }
          );

          if (item.size && item.color) {
            await db.collection('products').updateOne(
              {
                _id: toObjectId(item.productId),
                variants: {
                  $elemMatch: {
                    size: item.size,
                    color: item.color,
                  },
                },
              },
              { $inc: { 'variants.$.stock': item.quantity } }
            );
          }
        }
      }
    }

    const updated = await db.collection('orders').findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    return successResponse(serializeDoc(updated), { message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return errorResponse(error.message, 500);
  }
}

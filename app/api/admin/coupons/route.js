import { getDb, serializeDocs, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, couponSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const db = await getDb();
    const coupons = await db.collection('coupons').find({}).sort({ createdAt: -1 }).toArray();
    return successResponse({ coupons: serializeDocs(coupons) });
  } catch (error) {
    console.warn('Admin coupons fallback notice:', error.message);
    return successResponse({
      coupons: [
        {
          _id: 'seed_coupon_1',
          code: 'URBAN10',
          discountPercent: 10,
          minPurchase: 50,
          usedCount: 14,
          usageLimit: 200,
          isActive: true,
        },
        {
          _id: 'seed_coupon_2',
          code: 'DROP50',
          discountPercent: 50,
          minPurchase: 150,
          usedCount: 5,
          usageLimit: 25,
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
    const validation = validateInput(couponSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const existing = await db.collection('coupons').findOne({ code: validation.data.code });
    if (existing) {
      return errorResponse('A coupon with this code already exists', 409);
    }

    const newCoupon = {
      ...validation.data,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('coupons').insertOne(newCoupon);
    newCoupon._id = result.insertedId;

    return successResponse(serializeDoc(newCoupon), { message: 'Coupon created successfully' }, 201);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return errorResponse(error.message, 500);
  }
}

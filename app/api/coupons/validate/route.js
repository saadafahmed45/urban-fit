import { getDb } from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, subtotal = 0 } = body;

    if (!code || typeof code !== 'string') {
      return errorResponse('Coupon code is required', 400);
    }

    const cleanCode = code.trim().toUpperCase();
    const db = await getDb();

    const coupon = await db.collection('coupons').findOne({
      code: cleanCode,
      isActive: true,
    });

    if (!coupon) {
      return errorResponse('Invalid or expired coupon code', 404);
    }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return errorResponse('This coupon has expired', 400);
    }

    // Check minimum order value
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return errorResponse(
        `This coupon requires a minimum subtotal of $${coupon.minOrderValue}`,
        400
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount does not exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    discountAmount = Number(discountAmount.toFixed(2));

    return successResponse({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      newSubtotal: Math.max(0, subtotal - discountAmount),
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return errorResponse(error.message, 500);
  }
}

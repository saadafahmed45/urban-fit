import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getCustomerFromRequest } from '@/lib/auth';
import { validateInput, createOrderSchema } from '@/lib/validators';
import { generateOrderNumber } from '@/lib/utils';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request) {
  try {
    const customer = await getCustomerFromRequest(request);
    if (!customer) {
      return errorResponse('Authentication required. Please sign in to place an order.', 401);
    }

    const body = await request.json();
    const validation = validateInput(createOrderSchema, body);

    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const { shippingAddress, paymentMethod, items, couponCode, customerNote } = validation.data;
    const db = await getDb();

    // 1. Fetch site settings for shipping logic
    let settings = await db.collection('settings').findOne({});
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 100;
    const standardShippingFee = settings?.shippingFee ?? 15;

    // 2. Fetch products and recalculate prices securely (never trust client)
    const productIds = items.map((item) => toObjectId(item.productId)).filter(Boolean);
    const productsInDb = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    const productMap = new Map();
    productsInDb.forEach((p) => productMap.set(p._id.toString(), p));

    // 3. Verify stock and calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return errorResponse(`Product not found or unavailable (ID: ${item.productId})`, 404);
      }

      // Check product overall stock
      if (product.stock < item.quantity) {
        return errorResponse(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          400
        );
      }

      // Check variant stock if variants exist
      let variantMatched = null;
      if (product.variants && product.variants.length > 0) {
        variantMatched = product.variants.find(
          (v) =>
            v.size.toLowerCase() === item.size.toLowerCase() &&
            v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (variantMatched && variantMatched.stock < item.quantity) {
          return errorResponse(
            `Insufficient stock for "${product.name} (${item.size} / ${item.color})". Available: ${variantMatched.stock}`,
            400
          );
        }
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      const primaryImage =
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        '';

      // Snapshot product info at time of order
      orderItems.push({
        productId: product._id.toString(),
        slug: product.slug,
        name: product.name,
        price: itemPrice,
        image: primaryImage,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 4. Calculate coupon discount if provided
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await db.collection('coupons').findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) >= new Date();
        const meetsMin = !coupon.minOrderValue || subtotal >= coupon.minOrderValue;

        if (notExpired && meetsMin) {
          if (coupon.discountType === 'percentage') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);
          discountAmount = Number(discountAmount.toFixed(2));
          appliedCoupon = coupon.code;
        }
      }
    }

    // 5. Calculate shipping fee
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
    const finalTotal = Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(2)));

    // 6. Atomically decrement inventory with condition
    for (const item of items) {
      const decrementResult = await db.collection('products').updateOne(
        {
          _id: toObjectId(item.productId),
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        }
      );

      if (decrementResult.modifiedCount === 0) {
        return errorResponse('Stock changed during checkout. Please try again.', 409);
      }

      // Also decrement variant stock if available
      await db.collection('products').updateOne(
        {
          _id: toObjectId(item.productId),
          variants: {
            $elemMatch: {
              size: item.size,
              color: item.color,
              stock: { $gte: item.quantity },
            },
          },
        },
        {
          $inc: { 'variants.$.stock': -item.quantity },
        }
      );
    }

    // 7. Create Order document
    const orderNumber = generateOrderNumber();
    const newOrder = {
      orderNumber,
      userId: customer.uid,
      userEmail: customer.email,
      customerName: shippingAddress.fullName,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount,
      appliedCoupon,
      shippingFee,
      total: finalTotal,
      customerNote: customerNote || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await db.collection('orders').insertOne(newOrder);
    newOrder._id = insertResult.insertedId;

    // 8. Update or upsert user record in `users` collection
    const userQuery = customer.email
      ? { email: customer.email.toLowerCase() }
      : { _id: toObjectId(customer.id || customer.uid) || customer.uid };

    await db.collection('users').updateOne(
      userQuery,
      {
        $set: {
          email: customer.email,
          name: shippingAddress.fullName,
          phone: shippingAddress.phone,
          shippingAddress,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          role: 'customer',
          createdAt: new Date(),
        },
        $push: {
          orders: orderNumber,
        },
      },
      { upsert: true }
    );

    return successResponse(serializeDoc(newOrder), { message: 'Order placed successfully!' }, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, toObjectId, serializeDocs } from '@/lib/mongodb';
import { getCustomerFromRequest } from '@/lib/auth';
import { validateInput, reviewSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }

    const db = await getDb();
    const rawReviews = await db
      .collection('reviews')
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    return successResponse(serializeDocs(rawReviews));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse(error.message, 500);
  }
}

export async function POST(request) {
  try {
    const customer = await getCustomerFromRequest(request);
    if (!customer) {
      return errorResponse('Authentication required. Please sign in to write a review.', 401);
    }

    const body = await request.json();
    const validation = validateInput(reviewSchema, {
      ...body,
      authorName: body.authorName || customer.name || 'Verified Buyer',
    });

    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    const { productId, rating, title, comment, authorName } = validation.data;
    const db = await getDb();

    // Check product exists
    const product = await db.collection('products').findOne({
      $or: [{ _id: toObjectId(productId) }, { slug: productId }],
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    const newReview = {
      productId: product._id.toString(),
      userId: customer.uid,
      userEmail: customer.email,
      authorName,
      rating,
      title,
      comment,
      verifiedPurchase: true,
      createdAt: new Date(),
    };

    await db.collection('reviews').insertOne(newReview);

    // Recalculate product rating
    const allProductReviews = await db
      .collection('reviews')
      .find({ productId: product._id.toString() })
      .toArray();

    const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / allProductReviews.length).toFixed(1));

    await db.collection('products').updateOne(
      { _id: product._id },
      {
        $set: {
          rating: avgRating,
          numReviews: allProductReviews.length,
        },
      }
    );

    return successResponse(newReview, { message: 'Review submitted successfully' }, 201);
  } catch (error) {
    console.error('Error submitting review:', error);
    return errorResponse(error.message, 500);
  }
}

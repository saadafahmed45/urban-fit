import { getDb } from '@/lib/mongodb';
import { validateInput, newsletterSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateInput(newsletterSchema, body);
    
    if (!validation.success) {
      return errorResponse(validation.error, 400);
    }

    const { email } = validation.data;
    const db = await getDb();

    await db.collection('newsletter').updateOne(
      { email },
      {
        $set: {
          email,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          subscribedAt: new Date(),
          active: true,
        },
      },
      { upsert: true }
    );

    return successResponse(
      { email },
      { message: 'Thank you for subscribing to the URBAN FIT newsletter.' },
      201
    );
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    return errorResponse(error.message, 500);
  }
}

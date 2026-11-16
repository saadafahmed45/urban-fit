import { getDb } from '@/lib/mongodb';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return errorResponse('A valid email address is required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const db = await getDb();
      const user = await db.collection('users').findOne({ email: normalizedEmail });

      if (user) {
        // Record recovery request in db
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              passwordResetRequestedAt: new Date(),
            },
          }
        );
      }
    } catch (e) {
      console.warn('MongoDB offline during password recovery:', e.message);
    }

    // Always return success for security (prevents user enumeration attacks)
    return successResponse(
      { email: normalizedEmail },
      { message: 'If an account exists with this email, recovery instructions have been dispatched.' }
    );
  } catch (error) {
    console.error('Password recovery error:', error);
    return errorResponse(error.message, 500);
  }
}

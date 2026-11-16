import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getCustomerFromRequest } from '@/lib/auth';
import { validateInput, profileSchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

function getUserQuery(customer) {
  const clauses = [];
  if (customer.email) {
    clauses.push({ email: customer.email.toLowerCase() });
  }
  if (customer.id && toObjectId(customer.id)) {
    clauses.push({ _id: toObjectId(customer.id) });
  }
  if (customer.uid) {
    clauses.push({ firebaseUid: customer.uid });
  }
  return clauses.length === 1 ? clauses[0] : { $or: clauses };
}

export async function GET(request) {
  try {
    const customer = await getCustomerFromRequest(request);
    if (!customer) {
      return errorResponse('Authentication required.', 401);
    }

    try {
      const db = await getDb();
      const query = getUserQuery(customer);
      let user = await db.collection('users').findOne(query);

      if (!user) {
        // First-time customer record creation
        const newUser = {
          email: customer.email?.toLowerCase() || '',
          name: customer.name || 'Streetwear Member',
          phone: '',
          shippingAddress: null,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const insertRes = await db.collection('users').insertOne(newUser);
        user = { ...newUser, _id: insertRes.insertedId };
      }

      // Also get order statistics
      const orderCount = await db.collection('orders').countDocuments({
        $or: [
          { userId: customer.uid },
          { userId: customer.id },
          ...(customer.email ? [{ customerEmail: customer.email }] : []),
        ],
      });

      return successResponse({
        ...serializeDoc(user),
        orderCount,
      });
    } catch (dbErr) {
      console.warn('MongoDB offline in /api/users/me GET:', dbErr.message);
      return successResponse({
        _id: customer.id || 'demo_customer_id',
        email: customer.email || 'customer@urbanfit.style',
        name: customer.name || 'Streetwear Member',
        role: 'customer',
        orderCount: 0,
      });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorResponse(error.message, 500);
  }
}

export async function PUT(request) {
  try {
    const customer = await getCustomerFromRequest(request);
    if (!customer) {
      return errorResponse('Authentication required.', 401);
    }

    const body = await request.json();
    const validation = validateInput(profileSchema, body);

    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const { name, phone, shippingAddress } = validation.data;

    try {
      const db = await getDb();
      const query = getUserQuery(customer);

      const updateFields = {
        name,
        phone: phone || '',
        updatedAt: new Date(),
      };

      if (shippingAddress) {
        updateFields.shippingAddress = shippingAddress;
      }

      const result = await db.collection('users').findOneAndUpdate(
        query,
        { $set: updateFields },
        { returnDocument: 'after', upsert: true }
      );

      return successResponse(serializeDoc(result), { message: 'Profile updated successfully' });
    } catch (dbErr) {
      console.warn('MongoDB offline in /api/users/me PUT:', dbErr.message);
      return successResponse(
        {
          email: customer.email,
          name,
          phone: phone || '',
          shippingAddress: shippingAddress || null,
        },
        { message: 'Profile updated (local fallback mode)' }
      );
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return errorResponse(error.message, 500);
  }
}

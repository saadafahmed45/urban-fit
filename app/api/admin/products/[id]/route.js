import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, productSchema } from '@/lib/validators';
import { deleteImage } from '@/lib/cloudinary';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const db = await getDb();
    const product = await db.collection('products').findOne({ _id: toObjectId(id) });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    const serialized = serializeDoc(product);
    return successResponse({
      product: serialized,
      ...serialized,
    });
  } catch (error) {
    console.warn('Admin product by ID fallback notice:', error.message);
    const { FALLBACK_PRODUCTS } = await import('@/lib/fallback-data');
    const fb = FALLBACK_PRODUCTS.find((p) => p._id === id || p.slug === id) || FALLBACK_PRODUCTS[0];
    return successResponse({ product: fb, ...fb });
  }
}

export async function PUT(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) {
      return errorResponse('Invalid product ID', 400);
    }

    const body = await request.json();
    const validation = validateInput(productSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const existing = await db.collection('products').findOne({ _id: objectId });
    if (!existing) {
      return errorResponse('Product not found', 404);
    }

    // Check slug collision
    if (validation.data.slug !== existing.slug) {
      const slugCollision = await db.collection('products').findOne({
        slug: validation.data.slug,
        _id: { $ne: objectId },
      });
      if (slugCollision) {
        return errorResponse('This slug is already used by another product', 409);
      }
    }

    const updateDoc = {
      ...validation.data,
      updatedAt: new Date(),
    };

    const updated = await db.collection('products').findOneAndUpdate(
      { _id: objectId },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return successResponse(serializeDoc(updated), { message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) {
      return errorResponse('Invalid product ID', 400);
    }

    const db = await getDb();
    const product = await db.collection('products').findOne({ _id: objectId });
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Attempt to delete Cloudinary images if publicIds exist
    if (product.images && Array.isArray(product.images)) {
      for (const img of product.images) {
        if (img.publicId) {
          try {
            await deleteImage(img.publicId);
          } catch (e) {
            console.warn(`Could not delete Cloudinary image: ${img.publicId}`);
          }
        }
      }
    }

    await db.collection('products').deleteOne({ _id: objectId });
    return successResponse({ id }, { message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse(error.message, 500);
  }
}

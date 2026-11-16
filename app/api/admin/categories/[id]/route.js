import { getDb, toObjectId, serializeDoc } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import { validateInput, categorySchema } from '@/lib/validators';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PUT(request, context) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) {
      return errorResponse('Invalid category ID', 400);
    }

    const body = await request.json();
    const validation = validateInput(categorySchema, body);
    if (!validation.success) {
      return errorResponse(validation.error, 400, validation.errors);
    }

    const db = await getDb();
    const updated = await db.collection('categories').findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...validation.data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(serializeDoc(updated), { message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
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
      return errorResponse('Invalid category ID', 400);
    }

    const db = await getDb();
    const category = await db.collection('categories').findOne({ _id: objectId });
    if (!category) {
      return errorResponse('Category not found', 404);
    }

    // Check if products still use this category
    const associatedProducts = await db.collection('products').countDocuments({ category: category.slug });
    if (associatedProducts > 0) {
      return errorResponse(
        `Cannot delete category. ${associatedProducts} products are currently assigned to it.`,
        400
      );
    }

    await db.collection('categories').deleteOne({ _id: objectId });
    return successResponse({ id }, { message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse(error.message, 500);
  }
}

import { getDb, serializeDocs } from '@/lib/mongodb';
import { successResponse } from '@/lib/api-response';
import { FALLBACK_CATEGORIES } from '@/lib/fallback-data';

export async function GET() {
  try {
    const db = await getDb();
    const rawCategories = await db
      .collection('categories')
      .find({})
      .sort({ order: 1, name: 1 })
      .toArray();

    // Include product count for each category
    const categoriesWithCount = await Promise.all(
      rawCategories.map(async (cat) => {
        const count = await db.collection('products').countDocuments({ category: cat.slug });
        return {
          ...cat,
          productCount: count,
        };
      })
    );

    return successResponse(serializeDocs(categoriesWithCount));
  } catch (error) {
    console.warn('API /api/categories fallback notice:', error.message);
    return successResponse(
      FALLBACK_CATEGORIES.map((c, i) => ({ ...c, _id: `cat_${i + 1}`, productCount: 4 }))
    );
  }
}

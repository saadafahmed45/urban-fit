import { getDb, serializeDocs } from '@/lib/mongodb';
import { successResponse } from '@/lib/api-response';

const DEFAULT_LOOKBOOK = [
  {
    _id: 'look_1',
    title: 'Minimalist Boxy Cut',
    subtitle: 'Shibuya Look 01',
    tag: 'Oversized',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    productSlug: 'heavyweight-boxy-hoodie',
    order: 1,
    isActive: true,
  },
  {
    _id: 'look_2',
    title: 'Tactical Utility Layers',
    subtitle: 'NYC District 04',
    tag: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800',
    productSlug: 'tactical-relaxed-cargo-pant',
    order: 2,
    isActive: true,
  },
  {
    _id: 'look_3',
    title: 'Washed Taupe Zip-Up',
    subtitle: 'Tokyo Autumn Drop',
    tag: 'French Terry',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800',
    productSlug: 'washed-taupe-zip-up-hoodie',
    order: 3,
    isActive: true,
  },
  {
    _id: 'look_4',
    title: 'Monochrome Core Tee',
    subtitle: 'Minimalist Essentials',
    tag: 'Heavy Cotton',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    productSlug: 'core-minimal-oversized-tee',
    order: 4,
    isActive: true,
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const rawLookbook = await db
      .collection('lookbook')
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    return successResponse(serializeDocs(rawLookbook.length ? rawLookbook : DEFAULT_LOOKBOOK));
  } catch (error) {
    console.warn('API /api/lookbook fallback notice:', error.message);
    return successResponse(DEFAULT_LOOKBOOK);
  }
}

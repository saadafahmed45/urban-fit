import { getDb, serializeDocs } from '@/lib/mongodb';
import { successResponse } from '@/lib/api-response';

const DEFAULT_BANNERS = [
  {
    _id: 'banner_1',
    smallLabel: 'NEW COLLECTION',
    titleLine1: 'SUMMER',
    titleLine2: 'ESSENTIALS',
    subtitle: '— DROP NOW LIVE —',
    buttonText: 'SHOP NOW →',
    buttonLink: '/shop',
    badgeText: 'UP TO 50% OFF',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200',
    order: 1,
    isActive: true,
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const rawBanners = await db
      .collection('banners')
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return successResponse(serializeDocs(rawBanners.length ? rawBanners : DEFAULT_BANNERS));
  } catch (error) {
    console.warn('API /api/banners fallback notice:', error.message);
    return successResponse(DEFAULT_BANNERS);
  }
}

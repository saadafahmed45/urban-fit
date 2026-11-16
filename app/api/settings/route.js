import { getDb, serializeDoc } from '@/lib/mongodb';
import { successResponse } from '@/lib/api-response';

const DEFAULT_SETTINGS = {
  freeShippingThreshold: 100,
  shippingFee: 15,
  announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF ARCHIVE DROPS',
  announcementLink: '/shop',
  announcementActive: true,
  promoLeftText: 'LIMITED TIME OFFER – UP TO 50% OFF',
  promoRightText: 'COMPLIMENTARY SHIPPING ON ORDERS OVER $100',
  contactEmail: 'concierge@urbanfit.style',
  contactPhone: '+1 (800) 872-2634',
  address: '452 Broadway, SoHo, NY 10013',
};

export async function GET() {
  try {
    const db = await getDb();
    let settings = await db.collection('settings').findOne({});
    return successResponse(serializeDoc(settings || DEFAULT_SETTINGS));
  } catch (error) {
    console.warn('API /api/settings using fallback:', error.message);
    return successResponse(DEFAULT_SETTINGS);
  }
}

import { getDb } from '@/lib/mongodb';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urbanfit.style';

  // 1. Static Routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let categories = [];
  let products = [];

  try {
    const db = await getDb();
    categories = await db.collection('categories').find({}).project({ slug: 1, updatedAt: 1 }).toArray();
    products = await db.collection('products').find({}).project({ slug: 1, updatedAt: 1 }).toArray();
  } catch (err) {
    categories = FALLBACK_CATEGORIES;
    products = FALLBACK_PRODUCTS;
  }

  if (!categories || categories.length === 0) categories = FALLBACK_CATEGORIES;
  if (!products || products.length === 0) products = FALLBACK_PRODUCTS;

  // 2. Category Routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Product Routes
  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: prod.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

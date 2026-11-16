import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Read .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban_fit';
const dbName = process.env.MONGODB_DB || 'urban_fit';

async function createIndexes() {
  console.log(`[URBAN FIT] Connecting to MongoDB: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`[URBAN FIT] Connected to database: ${dbName}`);

    // Products Indexes
    console.log('[URBAN FIT] Creating indexes for `products`...');
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ isNew: 1 });
    await db.collection('products').createIndex({ isBestSeller: 1 });
    await db.collection('products').createIndex({ isTrending: 1 });
    await db.collection('products').createIndex(
      { name: 'text', tags: 'text', description: 'text' },
      { weights: { name: 10, tags: 5, description: 1 }, name: 'ProductTextSearch' }
    );

    // Categories Indexes
    console.log('[URBAN FIT] Creating indexes for `categories`...');
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });

    // Orders Indexes
    console.log('[URBAN FIT] Creating indexes for `orders`...');
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });

    // Users Indexes
    console.log('[URBAN FIT] Creating indexes for `users`...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Admins Indexes
    console.log('[URBAN FIT] Creating indexes for `admins`...');
    await db.collection('admins').createIndex({ email: 1 }, { unique: true });

    // Coupons Indexes
    console.log('[URBAN FIT] Creating indexes for `coupons`...');
    await db.collection('coupons').createIndex({ code: 1 }, { unique: true });
    await db.collection('coupons').createIndex({ isActive: 1 });

    // Reviews Indexes
    console.log('[URBAN FIT] Creating indexes for `reviews`...');
    await db.collection('reviews').createIndex({ productId: 1 });
    await db.collection('reviews').createIndex({ createdAt: -1 });

    // Banners & Lookbook Indexes
    console.log('[URBAN FIT] Creating indexes for `banners` and `lookbook`...');
    await db.collection('banners').createIndex({ order: 1, isActive: 1 });
    await db.collection('lookbook').createIndex({ order: 1, isActive: 1 });

    console.log('✓ All database indexes created successfully!');
  } catch (error) {
    console.error('Index creation error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createIndexes();

import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
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

const categoriesData = [
  {
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Heavyweight oversized streetwear hoodies crafted from 480+ GSM French terry cotton.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    order: 1,
    createdAt: new Date(),
  },
  {
    name: 'Tees',
    slug: 'tees',
    description: 'Boxy cut heavy cotton t-shirts with dropped shoulders and minimal branding.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    order: 2,
    createdAt: new Date(),
  },
  {
    name: 'Bottoms',
    slug: 'bottoms',
    description: 'Cargo pants, relaxed joggers, and tactical streetwear trousers.',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800',
    order: 3,
    createdAt: new Date(),
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Bomber jackets, chore coats, and minimalist technical layers.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    order: 4,
    createdAt: new Date(),
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Caps, beanies, utility pouches, and everyday streetwear accents.',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800',
    order: 5,
    createdAt: new Date(),
  },
];

const productsData = [
  {
    name: 'Heavyweight Boxy Hoodie',
    slug: 'heavyweight-boxy-hoodie',
    description: 'Engineered from ultra-dense 480 GSM French Terry cotton. Features an oversized silhouette with dropped shoulders, double-layered hood without drawstrings, and ribbed cuffs. The definitive streetwear hoodie.',
    category: 'hoodies',
    categoryName: 'Hoodies',
    price: 125,
    compareAtPrice: 160,
    stock: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_hoodie_1',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_hoodie_2',
        isPrimary: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_hoodie_3',
        isPrimary: false,
      },
    ],
    variants: [
      { size: 'S', color: 'Vintage Cream', stock: 10, sku: 'HBH-CRM-S' },
      { size: 'M', color: 'Vintage Cream', stock: 15, sku: 'HBH-CRM-M' },
      { size: 'L', color: 'Vintage Cream', stock: 12, sku: 'HBH-CRM-L' },
      { size: 'XL', color: 'Vintage Cream', stock: 8, sku: 'HBH-CRM-XL' },
      { size: 'M', color: 'Washed Black', stock: 15, sku: 'HBH-BLK-M' },
      { size: 'L', color: 'Washed Black', stock: 10, sku: 'HBH-BLK-L' },
    ],
    tags: ['hoodie', 'oversized', 'heavyweight', 'cream', 'bestseller'],
    isNew: true,
    isBestSeller: true,
    isTrending: true,
    details: {
      fabric: '100% Organic French Terry Cotton (480 GSM)',
      weight: 'Heavyweight',
      fit: 'Oversized boxy streetwear cut',
      care: 'Machine wash cold inside out, hang to dry',
    },
    rating: 4.9,
    numReviews: 28,
    createdAt: new Date(),
  },
  {
    name: 'Washed Taupe Zip-Up Hoodie',
    slug: 'washed-taupe-zip-up-hoodie',
    description: 'Vintage mineral washed zip-through hoodie with custom matte black hardware. Ribbed side panels and kangaroo split pocket designed for daily rotation.',
    category: 'hoodies',
    categoryName: 'Hoodies',
    price: 135,
    compareAtPrice: 175,
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_zip_1',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_zip_2',
        isPrimary: false,
      },
    ],
    variants: [
      { size: 'S', color: 'Tan Taupe', stock: 8, sku: 'WTZ-TPE-S' },
      { size: 'M', color: 'Tan Taupe', stock: 12, sku: 'WTZ-TPE-M' },
      { size: 'L', color: 'Tan Taupe', stock: 10, sku: 'WTZ-TPE-L' },
    ],
    tags: ['zip hoodie', 'washed', 'tan', 'taupe'],
    isNew: true,
    isBestSeller: false,
    isTrending: true,
    details: {
      fabric: '100% Combed Cotton (450 GSM)',
      weight: 'Heavyweight',
      fit: 'Relaxed fit with dropped shoulders',
      care: 'Gentle cycle, cold water',
    },
    rating: 4.8,
    numReviews: 14,
    createdAt: new Date(),
  },
  {
    name: 'Archive Heavy Boxy Tee',
    slug: 'archive-heavy-boxy-tee',
    description: 'A structural staple. Constructed from custom knit 280 GSM dry cotton jersey that holds its shape. Seamless collar construction with reinforced stitching.',
    category: 'tees',
    categoryName: 'Tees',
    price: 58,
    compareAtPrice: 70,
    stock: 60,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_tee_1',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_tee_2',
        isPrimary: false,
      },
    ],
    variants: [
      { size: 'S', color: 'Off-White', stock: 15, sku: 'AHB-OFW-S' },
      { size: 'M', color: 'Off-White', stock: 20, sku: 'AHB-OFW-M' },
      { size: 'L', color: 'Off-White', stock: 15, sku: 'AHB-OFW-L' },
      { size: 'XL', color: 'Off-White', stock: 10, sku: 'AHB-OFW-XL' },
    ],
    tags: ['tee', 'boxy', 'heavyweight', 'essential'],
    isNew: false,
    isBestSeller: true,
    isTrending: true,
    details: {
      fabric: '100% Combed Cotton (280 GSM)',
      weight: 'Mid-to-Heavyweight',
      fit: 'Wide boxy body, elongated short sleeves',
      care: 'Cold wash, tumble dry low',
    },
    rating: 4.9,
    numReviews: 42,
    createdAt: new Date(),
  },
  {
    name: 'Tactical Cargo Sweatpants',
    slug: 'tactical-cargo-sweatpants',
    description: 'Merging lounge comfort with military utility. Dual side cargo pockets with hidden tan snaps, tonal drawstrings, and elasticated ankle cuffs.',
    category: 'bottoms',
    categoryName: 'Bottoms',
    price: 110,
    compareAtPrice: 145,
    stock: 35,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_cargo_1',
        isPrimary: true,
      },
    ],
    variants: [
      { size: 'S', color: 'Charcoal Black', stock: 8, sku: 'TCS-BLK-S' },
      { size: 'M', color: 'Charcoal Black', stock: 15, sku: 'TCS-BLK-M' },
      { size: 'L', color: 'Charcoal Black', stock: 12, sku: 'TCS-BLK-L' },
    ],
    tags: ['cargo', 'sweatpants', 'tactical', 'bottoms'],
    isNew: true,
    isBestSeller: true,
    isTrending: false,
    details: {
      fabric: '80% Cotton, 20% Polyester Fleece (420 GSM)',
      weight: 'Heavyweight',
      fit: 'Tapered streetwear fit',
      care: 'Wash cold with like colors',
    },
    rating: 4.7,
    numReviews: 19,
    createdAt: new Date(),
  },
  {
    name: 'Minimalist Corduroy Overshirt',
    slug: 'minimalist-corduroy-overshirt',
    description: 'Crafted from premium wide-wale cotton corduroy in a neutral sand colorway. Minimal chest patch pocket and tonal horn buttons.',
    category: 'outerwear',
    categoryName: 'Outerwear',
    price: 140,
    compareAtPrice: 180,
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_cord_1',
        isPrimary: true,
      },
    ],
    variants: [
      { size: 'M', color: 'Warm Sand', stock: 12, sku: 'MCO-SND-M' },
      { size: 'L', color: 'Warm Sand', stock: 13, sku: 'MCO-SND-L' },
    ],
    tags: ['overshirt', 'corduroy', 'jacket', 'outerwear'],
    isNew: false,
    isBestSeller: false,
    isTrending: true,
    details: {
      fabric: '100% Wide-Wale Cotton Corduroy',
      weight: 'Medium Outerwear',
      fit: 'Relaxed layering piece',
      care: 'Dry clean recommended',
    },
    rating: 4.6,
    numReviews: 8,
    createdAt: new Date(),
  },
  {
    name: 'Ribbed Merino Streetwear Beanie',
    slug: 'ribbed-merino-streetwear-beanie',
    description: 'Chunky 7-gauge knit from extrafine merino wool. Finished with a clean minimal woven tag and fold-over brim.',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 42,
    compareAtPrice: 55,
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_beanie_1',
        isPrimary: true,
      },
    ],
    variants: [
      { size: 'ONE SIZE', color: 'Tan Taupe', stock: 25, sku: 'RMS-TPE-OS' },
      { size: 'ONE SIZE', color: 'Onyx Black', stock: 25, sku: 'RMS-BLK-OS' },
    ],
    tags: ['beanie', 'wool', 'merino', 'accessory'],
    isNew: false,
    isBestSeller: true,
    isTrending: false,
    details: {
      fabric: '100% Extrafine Merino Wool',
      weight: '7-gauge Chunky Knit',
      fit: 'Snug skull fit or cuff turned',
      care: 'Hand wash cold, dry flat',
    },
    rating: 4.9,
    numReviews: 33,
    createdAt: new Date(),
  },
  {
    name: 'Urban Canvas Tote Bag',
    slug: 'urban-canvas-tote-bag',
    description: 'Heavyweight 16oz duck canvas tote featuring reinforced handles, interior zip compartment, and minimalist tonal logo print.',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 48,
    compareAtPrice: 60,
    stock: 40,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_tote_1',
        isPrimary: true,
      },
    ],
    variants: [
      { size: 'ONE SIZE', color: 'Natural Canvas', stock: 40, sku: 'UCT-NAT-OS' },
    ],
    tags: ['tote', 'bag', 'canvas', 'minimal'],
    isNew: true,
    isBestSeller: false,
    isTrending: false,
    details: {
      fabric: '16oz Cotton Duck Canvas',
      weight: 'Heavy Canvas',
      fit: '40cm x 38cm x 12cm',
      care: 'Spot clean only',
    },
    rating: 4.8,
    numReviews: 11,
    createdAt: new Date(),
  },
  {
    name: 'Vintage Wash Oversized Hoodie',
    slug: 'vintage-wash-oversized-hoodie',
    description: 'Hand-dyed and stone-washed for an authentic worn-in drape. Features raw cut hem detailing and thermal waffle lined hood.',
    category: 'hoodies',
    categoryName: 'Hoodies',
    price: 130,
    compareAtPrice: 165,
    stock: 28,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
        publicId: 'seed_prod_hoodie_wash_1',
        isPrimary: true,
      },
    ],
    variants: [
      { size: 'M', color: 'Stone Grey', stock: 14, sku: 'VWO-GRY-M' },
      { size: 'L', color: 'Stone Grey', stock: 14, sku: 'VWO-GRY-L' },
    ],
    tags: ['hoodie', 'stonewash', 'vintage', 'oversized'],
    isNew: true,
    isBestSeller: false,
    isTrending: true,
    details: {
      fabric: '100% French Terry (460 GSM)',
      weight: 'Heavyweight',
      fit: 'Dropped shoulder boxy silhouette',
      care: 'Cold water wash inside out',
    },
    rating: 5.0,
    numReviews: 7,
    createdAt: new Date(),
  },
];

const bannersData = [
  {
    tag: 'NEW COLLECTION',
    title: 'SUMMER',
    highlightText: 'ESSENTIALS',
    subtitle: '— DROP NOW LIVE —',
    badge: 'UP TO 50% OFF',
    buttonText: 'SHOP NOW →',
    buttonLink: '/shop',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200',
    order: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    tag: 'LIMITED DROP',
    title: 'HEAVYWEIGHT',
    highlightText: 'ARCHIVE',
    subtitle: '— 480 GSM FRENCH TERRY —',
    badge: 'LIMITED EDITION',
    buttonText: 'DISCOVER DROP →',
    buttonLink: '/category/hoodies',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1200',
    order: 2,
    isActive: true,
    createdAt: new Date(),
  },
];

const lookbookData = [
  {
    title: 'THE STREET OVERSIZED FIT',
    tag: 'LOOK 01',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    link: '/category/hoodies',
    products: ['heavyweight-boxy-hoodie', 'tactical-cargo-sweatpants'],
    order: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    title: 'MINIMAL MONOCHROME EDIT',
    tag: 'LOOK 02',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
    link: '/category/tees',
    products: ['archive-heavy-boxy-tee'],
    order: 2,
    isActive: true,
    createdAt: new Date(),
  },
  {
    title: 'TACTICAL LAYERING STYLE',
    tag: 'LOOK 03',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800',
    link: '/category/outerwear',
    products: ['minimalist-corduroy-overshirt', 'tactical-cargo-sweatpants'],
    order: 3,
    isActive: true,
    createdAt: new Date(),
  },
  {
    title: 'EARTH TONES & TAUPE',
    tag: 'LOOK 04',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    link: '/category/accessories',
    products: ['washed-taupe-zip-up-hoodie', 'ribbed-merino-streetwear-beanie'],
    order: 4,
    isActive: true,
    createdAt: new Date(),
  },
];

const couponsData = [
  {
    code: 'URBAN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 50,
    maxDiscount: 30,
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
  },
  {
    code: 'DROP50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    maxDiscount: null,
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
  },
];

const siteSettingsData = {
  freeShippingThreshold: 100,
  shippingFee: 15,
  announcementText: 'LIMITED TIME OFFER – UP TO 50% OFF',
  announcementActive: true,
  contactEmail: 'support@urbanfit.co',
  contactPhone: '+1 (800) 872-2634',
  instagramUrl: 'https://instagram.com/urbanfit',
  updatedAt: new Date(),
};

async function seedDatabase() {
  console.log(`[URBAN FIT] Seeding MongoDB at: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // 1. Categories
    console.log('[URBAN FIT] Seeding categories...');
    await db.collection('categories').deleteMany({});
    await db.collection('categories').insertMany(categoriesData);

    // 2. Products
    console.log('[URBAN FIT] Seeding products...');
    await db.collection('products').deleteMany({});
    const productResult = await db.collection('products').insertMany(productsData);

    // 3. Banners
    console.log('[URBAN FIT] Seeding hero banners...');
    await db.collection('banners').deleteMany({});
    await db.collection('banners').insertMany(bannersData);

    // 4. Lookbook
    console.log('[URBAN FIT] Seeding lookbook items...');
    await db.collection('lookbook').deleteMany({});
    await db.collection('lookbook').insertMany(lookbookData);

    // 5. Coupons
    console.log('[URBAN FIT] Seeding coupons...');
    await db.collection('coupons').deleteMany({});
    await db.collection('coupons').insertMany(couponsData);

    // 6. Settings
    console.log('[URBAN FIT] Seeding site settings...');
    await db.collection('settings').deleteMany({});
    await db.collection('settings').insertOne(siteSettingsData);

    // 7. Admin accounts
    console.log('[URBAN FIT] Seeding default admin accounts...');
    const salt = await bcrypt.genSalt(10);
    const hashedPass1 = await bcrypt.hash('admin123456', salt);
    await db.collection('admins').updateOne(
      { email: 'admin@urbanfit.style' },
      {
        $set: {
          email: 'admin@urbanfit.style',
          name: 'Urban Fit Superadmin',
          password: hashedPass1,
          role: 'super_admin',
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    // 7b. Default customer account
    console.log('[URBAN FIT] Seeding default customer account...');
    const customerPasswordHash = await bcrypt.hash('customer123', salt);
    await db.collection('users').updateOne(
      { email: 'customer@urbanfit.style' },
      {
        $set: {
          email: 'customer@urbanfit.style',
          name: 'Urban Fit Member',
          password: customerPasswordHash,
          role: 'customer',
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date(), orders: [], addresses: [] },
      },
      { upsert: true }
    );

    // 8. Sample Reviews
    console.log('[URBAN FIT] Seeding sample customer reviews...');
    await db.collection('reviews').deleteMany({});
    const firstProduct = await db.collection('products').findOne({ slug: 'heavyweight-boxy-hoodie' });
    if (firstProduct) {
      await db.collection('reviews').insertMany([
        {
          productId: firstProduct._id.toString(),
          rating: 5,
          title: 'The best hoodie I have ever owned',
          comment: 'The 480 GSM fabric weight is insane. Perfect boxy silhouette without feeling floppy. Instant staple in my rotation.',
          authorName: 'Marcus K.',
          createdAt: new Date(),
        },
        {
          productId: firstProduct._id.toString(),
          rating: 5,
          title: 'Unbelievable drape and quality',
          comment: 'Minimalist streetwear done right. No tacky branding, just heavyweight premium cotton and a sharp hood shape.',
          authorName: 'Elena V.',
          createdAt: new Date(),
        },
      ]);
    }

    console.log('\n======================================================');
    console.log('✓ URBAN FIT Database successfully seeded!');
    console.log(`- Categories: ${categoriesData.length}`);
    console.log(`- Products:   ${productsData.length}`);
    console.log(`- Banners:    ${bannersData.length}`);
    console.log(`- Lookbook:   ${lookbookData.length}`);
    console.log(`- Coupons:    ${couponsData.length}`);
    console.log('- Default Admin:    admin@urbanfit.style / admin123456');
    console.log('- Default Customer: customer@urbanfit.style / customer123');
    console.log('======================================================\n');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();

import ShopLayout from '@/components/layout/ShopLayout';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import { getDb, toObjectId, serializeDoc, serializeDocs } from '@/lib/mongodb';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    const db = await getDb();
    product = await db.collection('products').findOne({ slug: slug.toLowerCase() });
  } catch (e) {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase());
  }

  if (!product) {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase()) || FALLBACK_PRODUCTS[0];
  }

  const primaryImage = product.images?.[0]?.url || '';

  return {
    title: `${product.name} | URBAN FIT`,
    description: product.description?.slice(0, 160) || 'Minimalist premium streetwear essentials.',
    openGraph: {
      title: `${product.name} | URBAN FIT`,
      description: product.description?.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage, width: 800, height: 1000, alt: product.name }] : [],
    },
  };
}

async function getProductData(slug) {
  try {
    const db = await getDb();

    // Query product by slug or ObjectId
    let product = await db.collection('products').findOne({ slug: slug.toLowerCase() });
    if (!product && toObjectId(slug)) {
      product = await db.collection('products').findOne({ _id: toObjectId(slug) });
    }

    if (!product) {
      // Check fallback
      const fb = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase());
      if (fb) {
        return {
          product: fb,
          relatedProducts: FALLBACK_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4),
          reviews: [],
        };
      }
      return null;
    }

    const sProduct = serializeDoc(product);

    // Fetch related products in same category
    const rawRelated = await db
      .collection('products')
      .find({
        category: product.category,
        _id: { $ne: product._id },
      })
      .limit(4)
      .toArray();

    // Fetch reviews
    const rawReviews = await db
      .collection('reviews')
      .find({ productId: product._id.toString() })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return {
      product: sProduct,
      relatedProducts: serializeDocs(rawRelated),
      reviews: serializeDocs(rawReviews),
    };
  } catch (error) {
    console.warn('Product page DB query fallback:', error.message);
    const fb = FALLBACK_PRODUCTS.find((p) => p.slug === slug.toLowerCase()) || FALLBACK_PRODUCTS[0];
    return {
      product: fb,
      relatedProducts: FALLBACK_PRODUCTS.filter((p) => p.slug !== fb.slug).slice(0, 4),
      reviews: [],
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, relatedProducts, reviews } = data;
  const primaryImage = product.images?.[0]?.url || '';

  // JSON-LD structured data for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.url) || [],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'URBAN FIT',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews || 1,
      },
    }),
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <ShopLayout>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-primary-bg min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink/50 mb-8 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-ink transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-ink transition-colors"
            >
              {product.categoryName || product.category}
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={product.images}
                name={product.name}
                isNew={product.isNew}
                discountPercent={discountPercent}
              />
            </div>

            {/* Right Column: Info & Buy Box */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>

          {/* Tabs: Description, Specs, Shipping, Reviews */}
          <ProductTabs product={product} reviews={reviews} />

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </ShopLayout>
  );
}

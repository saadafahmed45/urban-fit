export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://urbanfit.style';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/shop',
          '/product/',
          '/category/',
          '/about',
          '/contact',
          '/shipping-returns',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin/',
          '/api/orders',
          '/checkout',
          '/checkout/',
          '/account',
          '/account/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

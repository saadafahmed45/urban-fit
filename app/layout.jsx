import { Bebas_Neue, Oswald, Inter } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const oswald = Oswald({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'URBAN FIT | Minimalist Premium Streetwear',
    template: '%s | URBAN FIT',
  },
  description: 'Curated premium oversized hoodies, heavyweight tees, and streetwear essentials. Designed for the modern urban aesthetic.',
  keywords: ['streetwear', 'hoodies', 'oversized clothing', 'minimal fashion', 'urban fit', 'premium apparel'],
  openGraph: {
    title: 'URBAN FIT | Minimalist Premium Streetwear',
    description: 'Curated premium oversized hoodies, heavyweight tees, and streetwear essentials.',
    siteName: 'URBAN FIT',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${oswald.variable} ${inter.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F5F1EC] text-[#111111] antialiased selection:bg-[#B38B66] selection:text-white"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

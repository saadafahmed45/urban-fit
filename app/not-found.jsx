import Link from 'next/link';
import ShopLayout from '@/components/layout/ShopLayout';
import { ArrowRight, Compass } from 'lucide-react';

export const metadata = {
  title: '404 - Drop Not Found | URBAN FIT',
};

export default function NotFound() {
  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-card border border-border p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-surface border border-border flex items-center justify-center mx-auto text-tan">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <div>
            <span className="font-display text-6xl text-ink tracking-wider block mb-1">
              404
            </span>
            <h1 className="font-display text-2xl uppercase tracking-wider text-ink mb-2">
              Page or Drop Not Found
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
              The archive you are attempting to reach does not exist or has been retired.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-ink text-primary-bg px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-ink/85 transition-colors"
            >
              <span>Return to Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

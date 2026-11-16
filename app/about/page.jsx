import ShopLayout from '@/components/layout/ShopLayout';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

export const metadata = {
  title: 'About The Brand | URBAN FIT',
  description: 'Learn about the philosophy, craftsmanship, and heavyweight cotton heritage behind URBAN FIT streetwear.',
};

export default function AboutPage() {
  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen">
        {/* Hero Section */}
        <div className="bg-surface border-b border-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-3">
              Established 2024 • Tokyo / NYC
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-wider text-ink mb-6">
              Engineering The Modern Street Silhouette
            </h1>
            <p className="text-sm sm:text-base font-sans text-ink/75 leading-relaxed">
              URBAN FIT was founded on a singular obsession: to create the ultimate heavyweight streetwear uniform through uncompromising fabric densities, architectural cuts, and obsessive attention to drape.
            </p>
          </div>
        </div>

        {/* Story Section with Editorial Images */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/5 bg-card border border-border overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000"
                alt="URBAN FIT Studio Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan">
                Chapter 01 // The Density Obsession
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink">
                480 GSM French Terry Without Compromise
              </h2>
              <p className="text-sm text-ink/80 leading-relaxed">
                Most commercial hoodies cap out at 300 to 350 GSM. We spent eighteen months formulating custom French Terry cotton with a tight 3-end loop construction that clocks in at an astonishing 480+ GSM.
              </p>
              <p className="text-sm text-ink/80 leading-relaxed">
                The result is a structured drape that holds its shape through relentless wear, heavy double-layered hoods that stand upright without drawstrings, and a rich, weighty feel that elevates everyday garments into architectural statements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <div className="space-y-6 lg:order-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan">
                Chapter 02 // The Boxy Cut
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink">
                Dropped Shoulders, Elongated Proportions
              </h2>
              <p className="text-sm text-ink/80 leading-relaxed">
                Influenced by Japanese minimalism and metropolitan utilitarian aesthetics, every URBAN FIT garment is graded with widened chest dimensions and precise cropped body lengths to create effortless street layering.
              </p>
              <p className="text-sm text-ink/80 leading-relaxed">
                Each piece is garment-dyed and mineral washed to produce gentle patina across seam lines, giving every drop a vintage, lived-in depth from day one.
              </p>
            </div>
            <div className="relative aspect-4/5 bg-card border border-border overflow-hidden lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000"
                alt="Streetwear proportions"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border">
            <div className="bg-card border border-border p-8 space-y-3">
              <Sparkles className="w-6 h-6 text-tan" />
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                100% Organic Fibers
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Sustainably sourced, long-staple combed cotton spun into resilient yarns with zero polyester microfibers.
              </p>
            </div>

            <div className="bg-card border border-border p-8 space-y-3">
              <Compass className="w-6 h-6 text-tan" />
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Limited Batch Drops
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Manufactured in limited numbers per seasonal colorway to eliminate inventory waste and preserve rarity.
              </p>
            </div>

            <div className="bg-card border border-border p-8 space-y-3">
              <Shield className="w-6 h-6 text-tan" />
              <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                Lifetime Construction
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Double-needle flatlock seams and reinforced bar-tacks engineered for longevity, wash after wash.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-surface border border-border p-10 md:p-16 text-center space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink">
              Ready to Upgrade Your Rotation?
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60 max-w-md mx-auto">
              Explore the latest drop of hoodies, tees, and tactical streetwear essentials.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-ink text-primary-bg px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-ink/85 transition-colors"
            >
              <span>Shop All Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

import ShopLayout from '@/components/layout/ShopLayout';

export const metadata = {
  title: 'Terms of Service | URBAN FIT',
  description: 'Terms and conditions governing use of URBAN FIT streetwear ecommerce platform and drop releases.',
};

export default function TermsPage() {
  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border p-8 sm:p-12 space-y-8">
            <div className="border-b border-border pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-1">
                Agreement
              </span>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-2">
                Terms of Service
              </h1>
              <p className="text-xs font-mono text-ink/60">
                Effective Date: January 2025
              </p>
            </div>

            <div className="text-xs font-sans text-ink/80 space-y-6 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing or purchasing from URBAN FIT, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please refrain from using our services.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  2. Product Availability & Drops
                </h3>
                <p>
                  All drops are produced in limited edition quantities. We reserve the right to limit order quantities per household or IP address to prevent automated bot purchasing. In the rare event of inventory discrepancy, your order will be refunded immediately.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  3. Pricing & Currency
                </h3>
                <p>
                  All listed prices are displayed in USD unless otherwise specified. We reserve the right to modify prices at any time prior to order confirmation without prior notice.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  4. Intellectual Property
                </h3>
                <p>
                  All designs, graphics, photographic assets, typography, and brand marks associated with "URBAN FIT" are exclusive intellectual property protected by international copyright laws. Reproduction without prior written authorization is strictly prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  5. Governing Law
                </h3>
                <p>
                  These terms are governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

import ShopLayout from '@/components/layout/ShopLayout';

export const metadata = {
  title: 'Privacy Policy | URBAN FIT',
  description: 'Learn how URBAN FIT handles, stores, and protects your personal customer data.',
};

export default function PrivacyPage() {
  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border p-8 sm:p-12 space-y-8">
            <div className="border-b border-border pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-1">
                Legal & Compliance
              </span>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-2">
                Privacy Policy
              </h1>
              <p className="text-xs font-mono text-ink/60">
                Last Updated: January 2025
              </p>
            </div>

            <div className="text-xs font-sans text-ink/80 space-y-6 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  1. Information We Collect
                </h3>
                <p>
                  At URBAN FIT, we collect information you provide directly to us when you create an account, complete a streetwear purchase, subscribe to our drop newsletter, or reach out to our client concierge team. This includes your name, email address, shipping and billing address, phone number, and transaction history.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  2. Use of Information
                </h3>
                <p>
                  We utilize your data to fulfill orders, process secure payments, transmit shipment tracking updates, personalize your shopping experience, and protect our store against fraudulent activities.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  3. Cookies & Local Storage
                </h3>
                <p>
                  Our website uses browser cookies and local storage to preserve your active shopping bag contents and wishlist selections across browsing sessions. You can configure your browser to decline cookies, though certain checkout features may require them.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  4. Third-Party Services
                </h3>
                <p>
                  We share information with trusted third parties strictly necessary to deliver our services, including Cloudinary for optimized media delivery, NextAuth.js for verified authentication, and verified courier partners (DHL, UPS, FedEx). We do not sell or rent customer data to external advertisers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-xl uppercase tracking-wider text-ink">
                  5. Contact Us
                </h3>
                <p>
                  If you have inquiries regarding your personal data or wish to exercise data deletion rights under GDPR / CCPA, contact our privacy officer at <strong>privacy@urbanfit.style</strong>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

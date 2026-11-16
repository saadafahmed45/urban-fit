import ShopLayout from '@/components/layout/ShopLayout';
import { Truck, RotateCcw, ShieldCheck, Globe } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Returns | URBAN FIT',
  description: 'Learn about our domestic and international delivery times, shipping rates, and 14-day return policy.',
};

export default function ShippingReturnsPage() {
  return (
    <ShopLayout>
      <div className="bg-primary-bg min-h-screen">
        <div className="bg-surface border-b border-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-2">
              Logistics & Policies
            </span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-ink mb-3">
              Shipping & Returns
            </h1>
            <p className="text-sm font-sans text-ink/70">
              Clear delivery guidelines, worldwide courier tracking, and simple 14-day exchange steps.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Shipping Rates Table */}
          <div className="bg-card border border-border p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-2xl uppercase tracking-wider text-ink flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-tan" />
              Delivery Rates & Timelines
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface border-b border-border font-mono uppercase text-ink/60">
                  <tr>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Transit Time</th>
                    <th className="py-3 px-4">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  <tr>
                    <td className="py-3 px-4 font-bold text-ink uppercase">Domestic Standard Ground</td>
                    <td className="py-3 px-4 text-ink/80 font-mono">2 – 4 Business Days</td>
                    <td className="py-3 px-4 font-mono font-bold text-ink">FREE over $100 / $15 flat</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-ink uppercase">Priority Air Express</td>
                    <td className="py-3 px-4 text-ink/80 font-mono">1 – 2 Business Days</td>
                    <td className="py-3 px-4 font-mono font-bold text-ink">$25.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-ink uppercase">Worldwide DHL Express</td>
                    <td className="py-3 px-4 text-ink/80 font-mono">3 – 6 Business Days</td>
                    <td className="py-3 px-4 font-mono font-bold text-ink">$35.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-ink/60 leading-relaxed font-mono">
              * Orders placed before 2:00 PM EST Monday through Friday ship same day from our distribution facility in New Jersey. Orders placed over the weekend are processed the next business day.
            </p>
          </div>

          {/* 14-Day Returns Policy */}
          <div className="bg-card border border-border p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-2xl uppercase tracking-wider text-ink flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-tan" />
              14-Day Return & Size Exchange
            </h2>

            <div className="text-xs font-sans text-ink/80 space-y-3 leading-relaxed">
              <p>
                We want you to feel confident in your streetwear selection. If a garment’s cut or fit doesn’t match your expectations, we gladly accept returns and size exchanges within <strong>14 days of delivery</strong>.
              </p>
              <h4 className="font-bold text-xs uppercase tracking-wider text-ink pt-2">
                Return Eligibility Criteria:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-ink/75">
                <li>Garment must be unworn, unwashed, and free from scent, cologne, or deodorant markings.</li>
                <li>Original woven tags, barcode hangtags, and security ribbon must remain attached.</li>
                <li>Item must be returned in its original matte black biodegradable polybag.</li>
                <li>Archive sale or "Final Drop" items marked as clearance cannot be returned.</li>
              </ul>
            </div>
          </div>

          {/* Sustainable Packaging */}
          <div className="bg-surface border border-border p-6 sm:p-8 space-y-3">
            <h3 className="font-display text-xl uppercase tracking-wider text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tan" />
              Sustainable Protective Packaging
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              All URBAN FIT orders ship in 100% plant-based compostable mailers and recycled kraft cardboard boxes. We minimize single-use plastics across our entire fulfillment chain.
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

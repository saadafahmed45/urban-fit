import Link from 'next/link';
import { ArrowRight, Sparkles, Truck } from 'lucide-react';

export default function PromoBand({ settings = null }) {
  const threshold = settings?.freeShippingThreshold ?? 100;
  const promoText = settings?.announcementText || 'LIMITED TIME OFFER – UP TO 50% OFF';

  return (
    <section className="border-y border-[#E3DBD2] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Block - Black Streetwear Sale */}
        <div className="bg-[#111111] text-[#F5F1EC] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B38B66]" />
              <span className="font-heading text-xs uppercase tracking-streetwear text-[#B38B66]">
                EXCLUSIVE DROP
              </span>
            </div>
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
              {promoText}
            </h3>
            <p className="font-sans text-xs text-[#A09A92] max-w-md">
              Selected 480 GSM hoodies, heavyweight tees, and cargo bottoms marked down for limited rotation.
            </p>
          </div>

          <div className="pt-8 z-10">
            <Link
              href="/shop?sale=true"
              className="inline-flex items-center gap-2 bg-[#B38B66] hover:bg-[#916D4C] text-white px-6 py-3 font-heading text-xs uppercase tracking-widest transition-colors"
            >
              <span>SHOP ARCHIVE SALE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background decorative faint text */}
          <span className="absolute -bottom-6 -right-6 font-display text-9xl text-white/[0.03] select-none pointer-events-none uppercase">
            DROP
          </span>
        </div>

        {/* Right Block - Tan / Surface Free Shipping Banner */}
        <div className="bg-[#EFE8E0] text-[#111111] p-8 md:p-12 lg:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E3DBD2] relative overflow-hidden">
          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B38B66]" />
              <span className="font-heading text-xs uppercase tracking-streetwear text-[#B38B66]">
                WORLDWIDE LOGISTICS
              </span>
            </div>
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#111111] leading-none">
              FREE SHIPPING ON ORDERS OVER ${threshold}
            </h3>
            <p className="font-sans text-xs text-[#736E67] max-w-md">
              Tracked express courier delivery directly to your door with carbon-neutral transit packaging.
            </p>
          </div>

          <div className="pt-8 z-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#B38B66] text-white px-6 py-3 font-heading text-xs uppercase tracking-widest transition-colors"
            >
              <span>EXPLORE ALL ESSENTIALS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background decorative faint text */}
          <span className="absolute -bottom-6 -right-6 font-display text-9xl text-[#111111]/[0.03] select-none pointer-events-none uppercase">
            URBAN
          </span>
        </div>
      </div>
    </section>
  );
}

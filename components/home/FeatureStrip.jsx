import Link from 'next/link';
import { Flame, Trophy, Sparkles, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Flame,
    title: 'TRENDING NOW',
    subtitle: 'Street silhouettes taking over',
    href: '/shop?isTrending=true',
  },
  {
    icon: Trophy,
    title: 'BEST SELLERS',
    subtitle: 'Consistently sold out drops',
    href: '/shop?isBestSeller=true',
  },
  {
    icon: Sparkles,
    title: 'NEW ARRIVALS',
    subtitle: 'Fresh cuts from the latest batch',
    href: '/shop?isNew=true',
  },
  {
    icon: Truck,
    title: 'FAST DELIVERY',
    subtitle: 'Free on all orders over $100',
    href: '/shop',
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-[#EFE8E0] py-6 border-b border-[#E3DBD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-3.5 bg-[#F5F1EC] border border-[#E3DBD2] rounded-[12px] hover:border-[#111111] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#EFE8E0] border border-[#E3DBD2] flex items-center justify-center shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5 text-[#B38B66] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-[#111111] group-hover:text-[#B38B66] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[11px] text-[#736E67] mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

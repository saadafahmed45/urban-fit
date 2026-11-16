import { ShieldCheck, Headphones, RotateCcw, Award } from 'lucide-react';

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'SECURE PAYMENT',
    subtitle: 'Encrypted checkout & Cash on Delivery',
  },
  {
    icon: Headphones,
    title: '24/7 SUPPORT',
    subtitle: 'Dedicated streetwear customer care',
  },
  {
    icon: RotateCcw,
    title: 'EASY RETURNS',
    subtitle: '30-day hassle-free return policy',
  },
  {
    icon: Award,
    title: 'PREMIUM QUALITY',
    subtitle: '480 GSM French Terry heavyweight build',
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-[#E3DBD2] bg-[#EFE8E0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRUST_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F1EC] border border-[#E3DBD2] flex items-center justify-center shrink-0 text-[#111111]">
                  <Icon className="w-5 h-5 text-[#B38B66]" />
                </div>
                <div>
                  <h4 className="font-heading text-xs uppercase tracking-wider font-semibold text-[#111111]">
                    {feature.title}
                  </h4>
                  <p className="font-sans text-[11px] text-[#736E67] mt-0.5 leading-snug">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

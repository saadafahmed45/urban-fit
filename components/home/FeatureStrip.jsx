import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const PILLARS = [
  {
    icon: Truck,
    title: "FREE SHIPPING",
    description: "On all orders above $100",
  },
  {
    icon: ShieldCheck,
    title: "PREMIUM QUALITY",
    description: "480+ GSM heavyweight fleece",
  },
  {
    icon: RefreshCw,
    title: "EASY RETURNS",
    description: "14-day hassle-free returns",
  },
  {
    icon: Headphones,
    title: "24/7 SUPPORT",
    description: "We're here to assist you",
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white border-b border-[#E3DBD2] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4 first:pt-0 first:pl-0"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5F1EC] border border-[#E3DBD2] flex items-center justify-center shrink-0 text-[#111111]">
                  <Icon className="w-4 h-4 text-[#B38B66]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111]">
                    {pillar.title}
                  </h4>
                  <p className="font-sans text-[11px] text-[#736E67] mt-0.5 leading-tight">
                    {pillar.description}
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

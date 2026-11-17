'use client';

export default function TickerBand() {
  const items = [
    'URBAN FIT ARCHIVE',
    '480+ GSM FRENCH TERRY',
    'FREE SHIPPING ON ORDERS OVER $100',
    'BOXY OVERSIZED SILHOUETTE',
    'WORLDWIDE PRIORITY DELIVERY',
    'LIMITED QUANTITIES PER DROP',
    'CRAFTED FOR DAILY ROTATION',
  ];

  return (
    <div className="bg-[#111111] text-white py-3 overflow-hidden border-y border-[#222222] select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-8 shrink-0">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span className="font-heading text-xs uppercase tracking-[0.25em] font-bold text-white/90">
                {item}
              </span>
              <span className="text-[#B38B66] text-xs">◆</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="flex items-center gap-8">
              <span className="font-heading text-xs uppercase tracking-[0.25em] font-bold text-white/90">
                {item}
              </span>
              <span className="text-[#B38B66] text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

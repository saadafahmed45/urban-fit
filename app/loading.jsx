import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F1EC] flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#111111]/15 border-t-[#B38B66] rounded-full animate-spin" />
        <span className="absolute font-display text-xs tracking-widest text-[#111111]">
          UF
        </span>
      </div>
      <p className="text-xs font-mono uppercase tracking-widest text-[#111111]/60 animate-pulse">
        Loading Drop...
      </p>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowRight, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Captured application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#F5F1EC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#F7F4F0] border border-[#E3DBD2] p-8 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 bg-tan/15 text-tan rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-[#B38B66]" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B38B66] block mb-1">
            System Alert
          </span>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#111111]">
            Something Went Wrong
          </h2>
          <p className="text-xs font-mono text-[#111111]/70 mt-2 leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this streetwear view.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#111111]/85 text-[#F5F1EC] px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#EFE8E0] border border-[#E3DBD2] hover:border-[#111111] text-[#111111] px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>Back to Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

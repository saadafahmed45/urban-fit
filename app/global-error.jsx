'use client';

import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F1EC] text-[#111111] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#F7F4F0] border border-[#E3DBD2] p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#111111]">
            Application Error
          </h2>
          <p className="text-xs text-[#111111]/70">
            A critical system error occurred. Please refresh the page or try again.
          </p>
          <button
            onClick={() => reset()}
            className="bg-[#111111] text-[#F5F1EC] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

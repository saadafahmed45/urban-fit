'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Loader2, Shield } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('admin@urbanfit.style');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(redirect);
      } else {
        setError(data.error || 'Invalid administrator credentials');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#181818] border border-white/10 p-8 sm:p-10 text-white shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-tan/20 text-tan rounded-full flex items-center justify-center mx-auto mb-4 border border-tan/30">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-tan block mb-1">
            Restricted Access
          </span>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            URBAN FIT Admin
          </h1>
          <p className="text-xs font-mono text-white/50 mt-1">
            Store management and inventory control center
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tan font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111111] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tan font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tan hover:bg-tan/90 text-ink font-bold py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-ink" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Protected with JOSE JWT • httpOnly Cookie Authentication
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-tan" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ShopLayout from '@/components/layout/ShopLayout';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Password reset request failed.');
      } else {
        setSentSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-card border border-border p-8 md:p-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-ink/60 hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          <div className="text-center mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-tan block mb-1">
              Account Recovery
            </span>
            <h1 className="font-display text-3xl uppercase tracking-wider text-ink">
              Reset Password
            </h1>
            <p className="text-xs font-sans text-ink/60 mt-1">
              Enter your registered email and we'll dispatch a secure recovery link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sentSuccess ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-2">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs font-mono text-ink/70 leading-relaxed mb-6">
                Instructions have been sent to <strong>{email}</strong>. Check your spam folder if it doesn't arrive within a few minutes.
              </p>
              <Link
                href="/login"
                className="inline-block bg-ink text-primary-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/85 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink hover:bg-ink/85 text-primary-bg py-3.5 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-tan" />
                ) : (
                  <span>Send Recovery Email</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}

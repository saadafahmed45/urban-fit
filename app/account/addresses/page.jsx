'use client';

import React, { useEffect, useState } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import AuthGuard from '@/components/account/AuthGuard';
import AccountNav from '@/components/account/AccountNav';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AccountAddressesPage() {
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        if (data.success && data.data?.user?.shippingAddress) {
          setAddressData((prev) => ({
            ...prev,
            ...data.data.user.shippingAddress,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: addressData,
          name: addressData.fullName,
          phone: addressData.phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Shipping address updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update address.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShopLayout showTrustStrip={false}>
      <div className="bg-primary-bg min-h-screen py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthGuard>
            {({ user }) => (
              <div>
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-border">
                  <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-ink mb-1">
                    Delivery Address
                  </h1>
                  <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
                    Manage your primary streetwear shipping address for expedited checkout.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <AccountNav user={user} />

                  <div className="flex-1 max-w-2xl">
                    <div className="bg-card border border-border p-6 sm:p-8">
                      <h3 className="font-display text-xl uppercase tracking-wider text-ink mb-6 pb-3 border-b border-border flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-tan" />
                        Default Shipping Information
                      </h3>

                      {message.text && (
                        <div
                          className={`mb-6 p-3 text-xs font-mono flex items-center gap-2 ${
                            message.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {message.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                          )}
                          <span>{message.text}</span>
                        </div>
                      )}

                      {loading ? (
                        <div className="py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-tan mx-auto" />
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={addressData.fullName}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, fullName: e.target.value })
                                }
                                placeholder="e.g. Jordan Hayes"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                required
                                value={addressData.phone}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, phone: e.target.value })
                                }
                                placeholder="+1 (555) 019-2834"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                Street Address *
                              </label>
                              <input
                                type="text"
                                required
                                value={addressData.address}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, address: e.target.value })
                                }
                                placeholder="124 Shibuya District, Apt 4B"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                required
                                value={addressData.city}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, city: e.target.value })
                                }
                                placeholder="Tokyo"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                State / Province
                              </label>
                              <input
                                type="text"
                                value={addressData.state}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, state: e.target.value })
                                }
                                placeholder="Kanto"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                Postal / ZIP Code *
                              </label>
                              <input
                                type="text"
                                required
                                value={addressData.postalCode}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, postalCode: e.target.value })
                                }
                                placeholder="150-0002"
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                                Country *
                              </label>
                              <select
                                value={addressData.country}
                                onChange={(e) =>
                                  setAddressData({ ...addressData, country: e.target.value })
                                }
                                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink cursor-pointer"
                              >
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="Japan">Japan</option>
                                <option value="Germany">Germany</option>
                                <option value="Australia">Australia</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border">
                            <button
                              type="submit"
                              disabled={saving}
                              className="bg-ink hover:bg-ink/85 text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              {saving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
                              ) : null}
                              Save Changes
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AuthGuard>
        </div>
      </div>
    </ShopLayout>
  );
}

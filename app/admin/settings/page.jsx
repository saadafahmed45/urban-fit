'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'URBAN FIT',
    tagline: 'Minimalist Premium Streetwear',
    announcementText: 'COMPLIMENTARY WORLDWIDE DELIVERY ON ALL ORDERS OVER $100',
    announcementLink: '/shop',
    announcementActive: true,
    promoLeftText: 'LIMITED TIME OFFER – UP TO 50% OFF ARCHIVE DROPS',
    promoRightText: 'COMPLIMENTARY SHIPPING ON ORDERS OVER $100',
    freeShippingThreshold: 100,
    shippingFee: 15,
    contactEmail: 'concierge@urbanfit.style',
    contactPhone: '+1 (800) 872-2634',
    address: '452 Broadway, SoHo, NY 10013',
    socials: {
      instagram: 'https://instagram.com/urbanfit',
      twitter: 'https://twitter.com/urbanfit',
      tiktok: 'https://tiktok.com/@urbanfit',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.data?.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.data.settings,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const payload = {
        ...settings,
        freeShippingThreshold: Number(settings.freeShippingThreshold) || 100,
        shippingFee: Number(settings.shippingFee) || 15,
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Store settings updated successfully!' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Storefront Settings
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            Configure global shipping thresholds, announcement banners, and brand info
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 bg-ink hover:bg-ink/85 text-primary-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-tan" />
          ) : (
            <Save className="w-4 h-4 text-tan" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {statusMessage.text && (
        <div
          className={`p-3 text-xs font-mono flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
          <p className="text-xs font-mono uppercase text-ink/60">
            Loading settings configuration...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping & Thresholds */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Shipping & Delivery Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Free Shipping Minimum Threshold ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, freeShippingThreshold: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs font-mono font-bold text-ink"
                />
                <span className="text-[10px] font-mono text-ink/50 mt-1 block">
                  Orders equal or above this amount receive free standard shipping.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Standard Flat Shipping Fee ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })}
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs font-mono font-bold text-ink"
                />
                <span className="text-[10px] font-mono text-ink/50 mt-1 block">
                  Applied when order subtotal is below the free shipping threshold.
                </span>
              </div>
            </div>
          </div>

          {/* Announcement Bar & Promo Bands */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Top Announcement Bar & Promo Bands
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Announcement Bar Message
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) =>
                  setSettings({ ...settings, announcementText: e.target.value })
                }
                className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Announcement Link
                </label>
                <input
                  type="text"
                  value={settings.announcementLink}
                  onChange={(e) =>
                    setSettings({ ...settings, announcementLink: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink font-mono"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.announcementActive}
                    onChange={(e) =>
                      setSettings({ ...settings, announcementActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-ink cursor-pointer"
                  />
                  <span>Show Announcement Bar</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Home Promo Band (Left Headline)
                </label>
                <input
                  type="text"
                  value={settings.promoLeftText}
                  onChange={(e) =>
                    setSettings({ ...settings, promoLeftText: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Home Promo Band (Right Headline)
                </label>
                <input
                  type="text"
                  value={settings.promoRightText}
                  onChange={(e) =>
                    setSettings({ ...settings, promoRightText: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink uppercase"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Contact & Studio Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Hotline Phone
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, contactPhone: e.target.value })
                  }
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Flagship Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-surface border border-border px-3.5 py-2 text-xs text-ink"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

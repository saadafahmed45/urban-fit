'use client';

import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Plus, Tag, Edit, Trash2, X, Loader2, Save } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minPurchase, setMinPurchase] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.success && data.data?.coupons) {
        setCoupons(data.data.coupons);
      }
    } catch (err) {
      console.warn('Coupons fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountPercent(15);
    setMinPurchase(50);
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit(100);
    setIsActive(true);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCoupon(c);
    setCode(c.code || '');
    setDiscountPercent(c.discountPercent || 10);
    setMinPurchase(c.minPurchase || 0);
    setMaxDiscount(c.maxDiscount || '');
    setExpiryDate(c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '');
    setUsageLimit(c.usageLimit || '');
    setIsActive(c.isActive ?? true);
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        minPurchase: Number(minPurchase) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        isActive,
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon._id}`
        : '/api/admin/coupons';

      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCoupons();
      } else {
        setError(data.error || 'Failed to save coupon.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.error || 'Could not delete coupon.');
      }
    } catch (err) {
      alert('Error deleting coupon.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Promotional Coupons
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            Create discount codes and promotional flash sale tokens
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-ink hover:bg-ink/85 text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-tan" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading promo codes...
            </p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-12 h-12 text-ink/20 mx-auto mb-3 stroke-1" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-4">
              No promotional coupons configured yet.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-ink text-primary-bg px-5 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Spend</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Expiration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono font-bold text-ink text-sm">
                      {c.code}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-tan">
                      {c.discountPercent}% OFF
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/80">
                      {c.minPurchase ? formatPrice(c.minPurchase) : 'No Minimum'}
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/70">
                      {c.usedCount || 0} / {c.usageLimit || '∞'}
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/70">
                      {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold border ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-surface text-ink/40 border-border'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          title="Edit"
                          className="p-1.5 text-ink/70 hover:text-tan hover:bg-surface transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.code)}
                          title="Delete"
                          className="p-1.5 text-ink/50 hover:text-red-600 hover:bg-surface transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card p-6 border border-border shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <Dialog.Title className="font-display text-xl uppercase tracking-wider text-ink">
                {editingCoupon ? `Edit: ${editingCoupon.code}` : 'New Promotional Coupon'}
              </Dialog.Title>
              <Dialog.Close className="p-1.5 text-ink/50 hover:text-ink cursor-pointer">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. URBAN20"
                  className="w-full bg-surface border border-border px-3 py-2 text-xs font-mono uppercase font-bold text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Discount (%) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Min. Spend ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Max Discount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional cap"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <span>Coupon Is Active</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-ink/70 hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ink hover:bg-ink/85 text-primary-bg px-6 py-2 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-tan" />
                  )}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Sliders, Edit, Trash2, X, Loader2, Save, UploadCloud, RefreshCw, CheckCircle2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form states
  const [smallLabel, setSmallLabel] = useState('NEW COLLECTION');
  const [titleLine1, setTitleLine1] = useState('SUMMER');
  const [titleLine2, setTitleLine2] = useState('ESSENTIALS');
  const [subtitle, setSubtitle] = useState('— DROP NOW LIVE —');
  const [buttonText, setButtonText] = useState('SHOP NOW →');
  const [buttonLink, setButtonLink] = useState('/shop');
  const [badgeText, setBadgeText] = useState('UP TO 50% OFF');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Device image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success && data.data?.banners) {
        setBanners(data.data.banners);
      }
    } catch (err) {
      console.warn('Could not fetch banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setSmallLabel('NEW COLLECTION');
    setTitleLine1('SUMMER');
    setTitleLine2('ESSENTIALS');
    setSubtitle('— DROP NOW LIVE —');
    setButtonText('SHOP NOW →');
    setButtonLink('/shop');
    setBadgeText('UP TO 50% OFF');
    setImage('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000');
    setOrder(banners.length + 1);
    setIsActive(true);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setSmallLabel(b.smallLabel || '');
    setTitleLine1(b.titleLine1 || '');
    setTitleLine2(b.titleLine2 || '');
    setSubtitle(b.subtitle || '');
    setButtonText(b.buttonText || 'SHOP NOW →');
    setButtonLink(b.buttonLink || '/shop');
    setBadgeText(b.badgeText || '');
    setImage(b.image || '');
    setOrder(b.order || 1);
    setIsActive(b.isActive ?? true);
    setError('');
    setImageUploadError('');
    setUploadingImage(false);
    setModalOpen(true);
  };

  const handleDeviceImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (JPG, PNG, WebP, AVIF).');
      return;
    }

    setImageUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'urban-fit/banners');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
      } else {
        setImageUploadError(data.error || 'Failed to upload banner image.');
      }
    } catch (err) {
      setImageUploadError('An error occurred during banner image upload.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        smallLabel: smallLabel.trim(),
        titleLine1: titleLine1.trim(),
        titleLine2: titleLine2.trim(),
        subtitle: subtitle.trim(),
        buttonText: buttonText.trim(),
        buttonLink: buttonLink.trim(),
        badgeText: badgeText.trim(),
        image: image.trim(),
        order: Number(order) || 1,
        isActive,
      };

      const url = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners';

      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchBanners();
      } else {
        setError(data.error || 'Failed to save banner.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert(data.error || 'Could not delete banner.');
      }
    } catch (err) {
      alert('Error deleting banner.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Hero Banners & Carousel
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            Control the editorial homepage hero carousel slides
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-ink hover:bg-ink/85 text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-tan" />
          <span>New Slide</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading hero slides...
            </p>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center">
            <Sliders className="w-12 h-12 text-ink/20 mx-auto mb-3 stroke-1" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-4">
              No hero slides found.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-ink text-primary-bg px-5 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Slide</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Slide Preview</th>
                  <th className="py-3 px-4">Hero Typography</th>
                  <th className="py-3 px-4">CTA Button</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {banners.map((b) => (
                  <tr key={b._id} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      #{b.order || 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="relative w-20 h-14 bg-surface border border-border overflow-hidden">
                        {b.image ? (
                          <Image
                            src={b.image}
                            alt={b.titleLine1}
                            fill
                            sizes="80px"
                            unoptimized
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono uppercase text-tan font-bold block">
                        {b.smallLabel}
                      </span>
                      <p className="font-display text-base text-ink uppercase">
                        {b.titleLine1}{' '}
                        <span className="text-tan">{b.titleLine2}</span>
                      </p>
                      <span className="text-[10px] font-mono text-ink/50 block">
                        {b.subtitle}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-ink/70">
                      <span className="font-bold text-ink block">{b.buttonText}</span>
                      <span className="text-[10px] text-ink/50">{b.buttonLink}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-tan">
                      {b.badgeText || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold border ${
                          b.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-surface text-ink/40 border-border'
                        }`}
                      >
                        {b.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          title="Edit"
                          className="p-1.5 text-ink/70 hover:text-tan hover:bg-surface transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
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

      {/* Modal Dialog */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-card p-6 border border-border shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <Dialog.Title className="font-display text-xl uppercase tracking-wider text-ink">
                {editingBanner ? 'Edit Hero Slide' : 'New Hero Slide'}
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
                  Small Eyebrow Label *
                </label>
                <input
                  type="text"
                  required
                  value={smallLabel}
                  onChange={(e) => setSmallLabel(e.target.value)}
                  placeholder="NEW COLLECTION"
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Headline 1 (Dark) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleLine1}
                    onChange={(e) => setTitleLine1(e.target.value)}
                    placeholder="SUMMER"
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink uppercase font-display text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Headline 2 (Tan Accent) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleLine2}
                    onChange={(e) => setTitleLine2(e.target.value)}
                    placeholder="ESSENTIALS"
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-tan uppercase font-display text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="— DROP NOW LIVE —"
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="SHOP NOW →"
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="/shop"
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="UP TO 50% OFF"
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono"
                  />
                </div>
              </div>

              {/* Device Image Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Hero Image (Select from Device) *
                </label>

                {imageUploadError && (
                  <div className="mb-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono">
                    {imageUploadError}
                  </div>
                )}

                {image ? (
                  <div className="border border-border bg-surface p-3 space-y-2.5">
                    <div className="relative aspect-21/9 w-full bg-card border border-border overflow-hidden">
                      <Image
                        src={image}
                        alt="Banner preview"
                        fill
                        unoptimized
                        sizes="500px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        title="Remove image"
                        className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold truncate flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Banner attached from device</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:border-ink text-ink text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-3 h-3 animate-spin text-tan" />
                        ) : (
                          <RefreshCw className="w-3 h-3 text-tan" />
                        )}
                        <span>Change Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleDeviceImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
                      isDragging
                        ? 'border-tan bg-tan/10'
                        : 'border-border hover:border-ink/70 bg-surface/50 hover:bg-surface'
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center py-2">
                        <Loader2 className="w-8 h-8 animate-spin text-tan mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider text-ink">
                          Uploading image from device...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-2 text-tan">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-ink block">
                          Choose Banner Image from Device
                        </span>
                        <span className="text-[11px] font-mono text-ink/60 mt-1 block">
                          Click to browse device or drag & drop here
                        </span>
                        <span className="text-[10px] font-mono text-ink/40 mt-1 uppercase">
                          JPG, PNG, WEBP, AVIF (Max 10MB)
                        </span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleDeviceImageUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-ink cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
                <span>Slide Is Active</span>
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
                  <span>Save Slide</span>
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Save,
  Layers,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Device image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success && data.data?.categories) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      console.warn('Could not fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setImageUploadError('');
    setUploadingImage(false);
    setOrder(categories.length + 1);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setImageUploadError('');
    setUploadingImage(false);
    setOrder(cat.order || 0);
    setError('');
    setModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  // Upload image selected directly from device
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
      formData.append('folder', 'urban-fit/categories');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data?.url) {
        setImage(data.data.url);
      } else {
        setImageUploadError(data.error || 'Failed to upload image from device.');
      }
    } catch (err) {
      setImageUploadError('An error occurred while uploading the file from your device.');
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
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        image: image.trim(),
        order: Number(order) || 0,
      };

      const url = editingCategory
        ? `/api/admin/categories/${editingCategory._id}`
        : '/api/admin/categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        setError(data.error || 'Failed to save category.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.error || 'Could not delete category.');
      }
    } catch (err) {
      alert('Error deleting category.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Category Taxonomy
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            Organize products into curated streetwear departments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-ink hover:bg-ink/85 text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-tan" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <Layers className="w-12 h-12 text-ink/20 mx-auto mb-3 stroke-1" />
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-4">
              No categories configured yet.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-ink text-primary-bg px-5 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Category</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Banner Image</th>
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {categories.map((c) => (
                  <tr key={c._id || c.slug} className="hover:bg-surface/50">
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      #{c.order || 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative w-16 h-10 bg-surface border border-border overflow-hidden">
                        {c.image ? (
                          <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            sizes="64px"
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-ink/30">
                            NO IMG
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold uppercase text-ink tracking-wider">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-ink/60">
                      /{c.slug}
                    </td>
                    <td className="py-3 px-4 text-ink/70 max-w-xs truncate">
                      {c.description || '—'}
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
                          onClick={() => handleDelete(c._id, c.name)}
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

      {/* Add / Edit Category Dialog */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-card p-6 border border-border shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <Dialog.Title className="font-display text-xl uppercase tracking-wider text-ink">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Hoodies"
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="hoodies"
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heavyweight French terry hoodies with dropped shoulders..."
                  className="w-full bg-surface border border-border p-3 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              {/* Device Image Selector (No Link Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Category Image (Select from Device)
                </label>

                {imageUploadError && (
                  <div className="mb-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono">
                    {imageUploadError}
                  </div>
                )}

                {image ? (
                  /* Preview Card */
                  <div className="border border-border bg-surface p-3 space-y-2.5">
                    <div className="relative aspect-video w-full bg-card border border-border overflow-hidden">
                      <Image
                        src={image}
                        alt="Category preview"
                        fill
                        unoptimized
                        sizes="400px"
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
                        <span>Image selected from device</span>
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
                  /* Device Dropzone */
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
                        <span className="text-[10px] font-mono text-ink/50 mt-1">
                          Processing file
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center mb-2 text-tan">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-ink block">
                          Choose Image from Device
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

                {/* Hidden Device File Input */}
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink font-mono focus:outline-none focus:border-ink"
                />
              </div>

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
                  disabled={saving || uploadingImage}
                  className="bg-ink hover:bg-ink/85 text-primary-bg px-6 py-2 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-tan" />
                  )}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

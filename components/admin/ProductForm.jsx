'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import { slugify } from '@/lib/utils';
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'hoodies');
  const [price, setPrice] = useState(initialData?.price || '');
  const [compareAtPrice, setCompareAtPrice] = useState(initialData?.compareAtPrice || '');
  const [stock, setStock] = useState(initialData?.stock ?? 30);
  const [images, setImages] = useState(initialData?.images || []);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isNew, setIsNew] = useState(initialData?.isNew ?? true);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller ?? false);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending ?? false);

  // Garment Details
  const [fabric, setFabric] = useState(initialData?.details?.fabric || '100% Organic French Terry Cotton (480 GSM)');
  const [weight, setWeight] = useState(initialData?.details?.weight || 'Heavyweight (480 GSM)');
  const [fit, setFit] = useState(initialData?.details?.fit || 'Oversized boxy streetwear cut');
  const [care, setCare] = useState(initialData?.details?.care || 'Machine wash cold inside out, hang to dry');

  // Variants list
  const [variants, setVariants] = useState(
    initialData?.variants?.length
      ? initialData.variants
      : [
          { size: 'S', color: 'Black', stock: 10, sku: '' },
          { size: 'M', color: 'Black', stock: 15, sku: '' },
          { size: 'L', color: 'Black', stock: 15, sku: '' },
          { size: 'XL', color: 'Black', stock: 10, sku: '' },
        ]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (data.success && data.data?.categories) {
          setCategories(data.data.categories);
        }
      } catch (err) {
        console.warn('Could not fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'M', color: 'Vintage Cream', stock: 10, sku: '' },
    ]);
  };

  const handleUpdateVariant = (index, field, val) => {
    const updated = [...variants];
    updated[index][field] = field === 'stock' ? Number(val) || 0 : val;
    setVariants(updated);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('At least one product image is required.');
      return;
    }

    setLoading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        category: category.toLowerCase(),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock, 10) || 0,
        images,
        variants,
        tags,
        isNew,
        isBestSeller,
        isTrending,
        details: {
          fabric,
          weight,
          fit,
          care,
        },
      };

      const url = isEdit
        ? `/api/admin/products/${initialData._id}`
        : '/api/admin/products';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(resData.error || 'Failed to save product.');
      }
    } catch (err) {
      setError('An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-card border border-border text-ink hover:border-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-ink">
              {isEdit ? `Edit: ${initialData.name}` : 'New Streetwear Drop'}
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
              Configure product details, variants, inventory, and media
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-ink hover:bg-ink/85 text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-tan" />
          ) : (
            <Save className="w-4 h-4 text-tan" />
          )}
          <span>{isEdit ? 'Update Product' : 'Publish Drop'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Grid: Left Main Details / Right Side Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Product Overview
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Heavyweight Boxy Hoodie"
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-ink"
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
                placeholder="heavyweight-boxy-hoodie"
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink font-mono focus:outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the silhouette, fabric hand-feel, and streetwear detailing..."
                className="w-full bg-surface border border-border p-3.5 text-xs text-ink focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          {/* Media / Cloudinary Upload */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Media Gallery (Cloudinary)
            </h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Variants Configuration */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-display text-lg uppercase tracking-wider text-ink">
                Variants (Sizes & Colors)
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tan hover:text-ink cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Variant
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                  <tr>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Color</th>
                    <th className="py-2 px-3">Stock</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {variants.map((v, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                          className="w-20 bg-surface border border-border px-2 py-1 text-xs text-ink uppercase font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                          className="w-28 bg-surface border border-border px-2 py-1 text-xs text-ink font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', e.target.value)}
                          className="w-20 bg-surface border border-border px-2 py-1 text-xs text-ink font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          placeholder="SKU-..."
                          value={v.sku || ''}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                          className="w-28 bg-surface border border-border px-2 py-1 text-xs text-ink font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-ink/40 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Garment Details & Specs */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Fabric & Construction Specs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Weight (GSM)
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Fit Profile
                </label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  Care Instructions
                </label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  className="w-full bg-surface border border-border px-3 py-2 text-xs text-ink"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Pricing & Inventory
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Retail Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="125.00"
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Compare At Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="160.00"
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink font-mono"
              />
              <span className="text-[10px] font-mono text-ink/50 mt-1 block">
                Original price to display crossed-out discount.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Total Stock Units *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink font-mono"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-card border border-border p-6 space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Classification
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink uppercase tracking-wider font-semibold cursor-pointer"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.slug || c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Tees</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="hoodie, oversized, cream, bestseller"
                className="w-full bg-surface border border-border px-3.5 py-2.5 text-xs text-ink font-mono"
              />
            </div>
          </div>

          {/* Drop Badges & Flags */}
          <div className="bg-card border border-border p-6 space-y-3">
            <h3 className="font-display text-lg uppercase tracking-wider text-ink pb-2 border-b border-border">
              Visibility & Badges
            </h3>

            <label className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>Mark as New Drop</span>
            </label>

            <label className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>Best Seller Badge</span>
            </label>

            <label className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 accent-ink rounded-none cursor-pointer"
              />
              <span>Trending Now Badge</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

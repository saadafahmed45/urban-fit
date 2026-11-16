'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products?limit=100');
      const data = await res.json();
      if (data.success && data.data?.products) {
        setProducts(data.data.products);
      }
    } catch (err) {
      console.warn('Could not fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === 'all' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-ink mb-1">
            Product Inventory
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            {products.length} Drops in catalog
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-ink hover:bg-ink/85 text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-tan" />
          <span>Add New Drop</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search by title, SKU, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-9 pr-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-card border border-border px-3 py-2 text-xs text-ink font-mono uppercase cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="hoodies">Hoodies</option>
          <option value="tees">Tees</option>
          <option value="bottoms">Bottoms</option>
          <option value="outerwear">Outerwear</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-2" />
            <p className="text-xs font-mono uppercase text-ink/60">
              Loading inventory catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/50 mb-4">
              No products found matching your filter.
            </p>
            <Link
              href="/admin/products/new"
              className="bg-ink text-primary-bg px-5 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface font-mono uppercase text-ink/60 border-b border-border">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const primaryImage = p.images?.[0]?.url || '';
                  const isLow = p.stock <= 10;
                  const isOOS = p.stock <= 0;

                  return (
                    <tr key={p._id} className="hover:bg-surface/50">
                      {/* Product image + name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-surface border border-border shrink-0 overflow-hidden">
                            {primaryImage ? (
                              <Image
                                src={primaryImage}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-ink uppercase tracking-wider block truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-ink/50 truncate block">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-mono uppercase text-ink/70">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-ink">
                        {formatPrice(p.price)}
                        {p.compareAtPrice && (
                          <span className="text-[10px] text-ink/40 line-through ml-1 block font-normal">
                            {formatPrice(p.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold border ${
                            isOOS
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {p.stock} Units
                        </span>
                      </td>

                      {/* Flags */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isNew && (
                            <span className="bg-ink text-primary-bg px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold">
                              NEW
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="bg-tan text-white px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold">
                              BEST
                            </span>
                          )}
                          {p.isTrending && (
                            <span className="bg-surface border border-border text-ink px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold">
                              TREND
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            title="View on site"
                            className="p-1.5 text-ink/50 hover:text-ink hover:bg-surface transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p._id}`}
                            title="Edit product"
                            className="p-1.5 text-ink/70 hover:text-tan hover:bg-surface transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deletingId === p._id}
                            title="Delete product"
                            className="p-1.5 text-ink/50 hover:text-red-600 hover:bg-surface transition-colors cursor-pointer"
                          >
                            {deletingId === p._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

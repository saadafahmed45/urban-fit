'use client';

import React, { useEffect, useState, use } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        const data = await res.json();
        if (data.success && (data.data?.product || data.data)) {
          setProduct(data.data.product || data.data);
        } else {
          setError(data.error || 'Product not found.');
        }
      } catch (err) {
        setError('Error loading product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-tan mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
          Loading product drop...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-card border border-border p-8">
        <p className="text-sm font-mono text-red-600 mb-4">{error || 'Product not found.'}</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 bg-ink text-primary-bg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return <ProductForm initialData={product} isEdit={true} />;
}

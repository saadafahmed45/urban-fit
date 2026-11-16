'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  Link as LinkIcon,
} from 'lucide-react';

export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 8,
  folder = 'urban-fit/products',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    try {
      const newImages = [...images];

      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= maxImages) break;
        const file = files[i];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data?.url) {
          newImages.push({
            url: data.data.url,
            publicId: data.data.publicId || '',
            isPrimary: newImages.length === 0,
          });
        } else {
          setError(data.error || 'Failed to upload one or more images.');
        }
      }

      onChange(newImages);
    } catch (err) {
      setError('An error occurred during file upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddFromUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newImages = [
      ...images,
      {
        url: urlInput.trim(),
        publicId: `ext_${Date.now()}`,
        isPrimary: images.length === 0,
      },
    ];
    onChange(newImages);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = async (index) => {
    const target = images[index];
    const updated = images.filter((_, idx) => idx !== index);

    // If removed was primary, designate first image as primary
    if (target.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);

    // Delete from Cloudinary if valid publicId exists
    if (target.publicId && !target.publicId.startsWith('ext_') && !target.publicId.startsWith('seed_')) {
      try {
        await fetch(`/api/admin/upload?publicId=${encodeURIComponent(target.publicId)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Error deleting Cloudinary asset:', err);
      }
    }
  };

  const handleSetPrimary = (index) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    onChange(updated);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Grid of existing images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={img.url || index}
            className={`relative aspect-3/4 bg-card border-2 overflow-hidden group select-none ${
              img.isPrimary ? 'border-tan' : 'border-border'
            }`}
          >
            <Image
              src={img.url}
              alt={`Product preview ${index + 1}`}
              fill
              sizes="200px"
              className="object-cover"
            />

            {/* Primary Pill */}
            {img.isPrimary && (
              <span className="absolute top-2 left-2 z-10 bg-tan text-white text-[10px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider">
                PRIMARY
              </span>
            )}

            {/* Hover actions overlay */}
            <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
              <div className="flex justify-between items-center">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    title="Set as primary"
                    className="p-1.5 bg-white/20 hover:bg-tan text-white transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="Remove image"
                  className="p-1.5 bg-white/20 hover:bg-red-600 text-white transition-colors ml-auto cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reorder Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-white/70">
                  {index + 1} of {images.length}
                </span>
                <button
                  type="button"
                  disabled={index === images.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Slot */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-3/4 border-2 border-dashed border-border hover:border-ink/60 bg-surface/50 hover:bg-surface flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-tan mb-2" />
            ) : (
              <UploadCloud className="w-6 h-6 text-ink/40 mb-2" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-ink block">
              {uploading ? 'Uploading...' : 'Upload Image'}
            </span>
            <span className="text-[10px] font-mono text-ink/50 mt-1">
              JPG, PNG, WebP (Cloudinary)
            </span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* URL Fallback Bar */}
      <div className="pt-2">
        {showUrlInput ? (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-surface border border-border px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={handleAddFromUrl}
              className="bg-ink text-primary-bg px-4 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 transition-colors"
            >
              Add URL
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="border border-border px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-tan hover:text-ink transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Or paste external image URL</span>
          </button>
        )}
      </div>
    </div>
  );
}

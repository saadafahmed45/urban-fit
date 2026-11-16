'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ProductReviews({ productId, reviews = [], averageRating = 5.0 }) {
  const [reviewList, setReviewList] = useState(reviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !authorName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || 'Verified Purchase Review',
          comment: comment.trim(),
          userName: authorName.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
        setReviewList((prev) => [
          {
            _id: data.data?._id || String(Date.now()),
            productId,
            rating,
            title: title.trim() || 'Verified Purchase',
            comment: comment.trim(),
            userName: authorName.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setComment('');
        setTitle('');
        setAuthorName('');
        setIsFormOpen(false);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to submit review.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-display text-4xl text-ink tracking-wider">
              {Number(averageRating).toFixed(1)}
            </span>
            <div className="flex items-center text-tan">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating) ? 'fill-tan text-tan' : 'text-border fill-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-ink/60">
            Based on {reviewList.length} verified customer reviews
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="bg-ink text-primary-bg px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 transition-colors self-start sm:self-auto cursor-pointer"
        >
          {isFormOpen ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-surface p-6 mb-8 border border-border space-y-4">
          <h4 className="font-display text-lg uppercase tracking-wider text-ink">
            Write Your Review
          </h4>

          {statusMessage.text && (
            <div
              className={`p-3 text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-tan hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || rating)
                        ? 'fill-tan text-tan'
                        : 'text-border fill-transparent'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-ink/70 ml-2">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex M."
                className="w-full bg-card border border-border px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Perfect heavyweight hoodie"
                className="w-full bg-card border border-border px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
              Your Review *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other streetwear enthusiasts about the fit, fabric quality, and drape..."
              className="w-full bg-card border border-border p-3 text-xs text-ink focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-ink text-primary-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/80 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewList.length === 0 ? (
          <p className="text-xs font-mono uppercase tracking-widest text-ink/50 py-6 text-center">
            No reviews yet for this drop. Be the first to review!
          </p>
        ) : (
          reviewList.map((rev) => (
            <div key={rev._id || rev.id} className="border-b border-border pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-tan">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (rev.rating || 5)
                            ? 'fill-tan text-tan'
                            : 'text-border fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    {rev.userName || rev.user?.name || 'Verified Customer'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-ink/50">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              {rev.title && (
                <h5 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
                  {rev.title}
                </h5>
              )}
              <p className="text-xs font-sans text-ink/80 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

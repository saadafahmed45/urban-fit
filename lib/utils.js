import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS class resolution
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with USD standard
 */
export function formatPrice(price = 0, currency = '$') {
  const numericPrice = typeof price === 'number' ? price : Number(price) || 0;
  return `${currency}${numericPrice.toFixed(2)}`;
}

/**
 * Generate clean URL slug from string
 */
export function slugify(text = '') {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Truncate long strings safely
 */
export function truncate(str, length = 60) {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Generate order number (e.g. UF-2026-94812)
 */
export function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `UF-${year}-${random}`;
}

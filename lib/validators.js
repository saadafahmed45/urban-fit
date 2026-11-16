import { z } from 'zod';

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  categoryName: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  images: z.array(
    z.object({
      url: z.string().url('Invalid image URL'),
      publicId: z.string().optional(),
      isPrimary: z.boolean().optional(),
    })
  ).min(1, 'At least one image is required'),
  variants: z.array(
    z.object({
      size: z.string().min(1, 'Size is required'),
      color: z.string().min(1, 'Color is required'),
      stock: z.coerce.number().int().min(0).default(0),
      sku: z.string().optional(),
    })
  ).default([]),
  tags: z.array(z.string()).default([]),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  details: z.object({
    fabric: z.string().optional(),
    weight: z.string().optional(),
    fit: z.string().optional(),
    care: z.string().optional(),
  }).optional(),
});

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  description: z.string().optional().default(''),
  image: z.string().url('Invalid category image URL').optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
});

// Shipping Address Schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(6, 'Valid contact number is required'),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional().default(''),
  postalCode: z.string().min(3, 'Postal/Zip code is required'),
  country: z.string().min(2, 'Country is required').default('United States'),
});

// Order Creation Schema
export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['cod', 'card', 'online']).default('cod'),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      size: z.string().min(1, 'Size is required'),
      color: z.string().min(1, 'Color is required'),
      quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least 1 item'),
  couponCode: z.string().optional().nullable(),
  customerNote: z.string().max(300).optional(),
});

// Review Schema
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.coerce.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().max(100).optional().default(''),
  comment: z.string().min(5, 'Review comment must be at least 5 characters').max(1000),
  authorName: z.string().min(2, 'Name is required'),
});

// Coupon Schema
export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase().trim(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().positive('Discount value must be positive'),
  minOrderValue: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
});

// Banner Schema
export const bannerSchema = z.object({
  tag: z.string().optional().default('NEW COLLECTION'),
  title: z.string().min(1, 'Title is required'),
  highlightText: z.string().optional().default('ESSENTIALS'),
  subtitle: z.string().optional().default('— DROP NOW LIVE —'),
  badge: z.string().optional().default('UP TO 50% OFF'),
  buttonText: z.string().default('SHOP NOW →'),
  buttonLink: z.string().default('/shop'),
  image: z.string().url('Invalid banner image URL'),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Lookbook Schema
export const lookbookSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  tag: z.string().optional().default('STREET EDIT'),
  image: z.string().url('Invalid lookbook image URL'),
  link: z.string().default('/shop'),
  products: z.array(z.string()).default([]),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Site Settings Schema
export const settingsSchema = z.object({
  freeShippingThreshold: z.coerce.number().min(0).default(100),
  shippingFee: z.coerce.number().min(0).default(15),
  announcementText: z.string().default('LIMITED TIME OFFER – UP TO 50% OFF'),
  announcementActive: z.boolean().default(true),
  contactEmail: z.string().email().default('contact@urbanfit.com'),
  contactPhone: z.string().default('+1 (800) 872-2634'),
  instagramUrl: z.string().url().optional().default('https://instagram.com/urbanfit'),
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
});

// Admin Auth Schema
export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid admin email').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Profile Update Schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().default(''),
  shippingAddress: addressSchema.optional(),
});

/**
 * Validate input with Zod schema and format errors
 */
export function validateInput(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return {
      success: false,
      data: null,
      error: formattedErrors[0]?.message || 'Validation failed',
      errors: formattedErrors,
    };
  }
  return {
    success: true,
    data: result.data,
    error: null,
    errors: [],
  };
}

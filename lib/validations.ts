import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Please enter a valid email'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Address validation
export const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other']),
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid phone number'),
  village: z.string().min(1, 'Village is required'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  landmark: z.string().max(200).optional(),
  isDefault: z.boolean().default(false),
});

// Checkout validation
export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid phone number'),
  village: z.string().min(1, 'Please select a delivery area'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  landmark: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(['cod', 'upi']),
});

// Product validation (admin)
export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(1, 'Price must be at least ₹1'),
  originalPrice: z.number().min(0).optional(),
  isVeg: z.boolean(),
  isBestSeller: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute').max(120),
});

// Category validation
export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  icon: z.string().optional(),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Coupon validation
export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20).toUpperCase(),
  type: z.enum(['percentage', 'flat']),
  value: z.number().min(1, 'Value must be at least 1'),
  minOrder: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
});

// Delivery area validation
export const deliveryAreaSchema = z.object({
  village: z.string().min(2, 'Village name is required').max(200),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
  deliveryCharge: z.number().min(0, 'Delivery charge cannot be negative'),
  estimatedTime: z.number().min(5, 'Estimated time must be at least 5 minutes'),
  isActive: z.boolean().default(true),
});

// Review validation
export const reviewSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type DeliveryAreaFormData = z.infer<typeof deliveryAreaSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;

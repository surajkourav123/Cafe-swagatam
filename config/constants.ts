export const ORDER_STATUSES = {
  pending: { label: 'Order Placed', color: 'warning', step: 0 },
  payment_verification: { label: 'Payment Verification', color: 'warning', step: 1 },
  confirmed: { label: 'Confirmed', color: 'info', step: 2 },
  preparing: { label: 'Preparing', color: 'info', step: 3 },
  ready: { label: 'Ready', color: 'success', step: 4 },
  out_for_delivery: { label: 'Out for Delivery', color: 'info', step: 5 },
  delivered: { label: 'Delivered', color: 'success', step: 6 },
  cancelled: { label: 'Cancelled', color: 'error', step: -1 },
} as const;

export const MENU_CATEGORIES = [
  'Pizza',
  'Burger',
  'Sandwich',
  'Pasta',
  'Coffee',
  'Cold Coffee',
  'Milkshake',
  'Roll',
  'Pav Bhaji',
  'Dosa',
  'Snacks',
  'Drinks',
  'Dessert',
] as const;

export const PAYMENT_METHODS = {
  cod: { label: 'Cash on Delivery', icon: 'Banknote', description: 'Pay when your order arrives' },
  upi: { label: 'UPI Payment', icon: 'Smartphone', description: 'Scan QR code and pay via UPI' },
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 50,
} as const;

export const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    reveal: 0.8,
  },
  ease: {
    smooth: [0.25, 0.1, 0.25, 1.0] as const,
    bounce: [0.34, 1.56, 0.64, 1.0] as const,
    enter: [0.0, 0.0, 0.2, 1.0] as const,
    exit: [0.4, 0.0, 1.0, 1.0] as const,
  },
  spring: { type: 'spring' as const, stiffness: 300, damping: 24 },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ORDER_TRACKING_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: 'ClipboardCheck' },
  { key: 'payment_verification', label: 'Payment Verification', icon: 'CreditCard' },
  { key: 'confirmed', label: 'Confirmed', icon: 'CheckCircle' },
  { key: 'preparing', label: 'Preparing', icon: 'ChefHat' },
  { key: 'ready', label: 'Ready', icon: 'Package' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'Truck' },
  { key: 'delivered', label: 'Delivered', icon: 'PartyPopper' },
] as const;

import type { CartItem, CartSummary } from '@/types/cart.types';

const TAX_RATE = 5; // 5% GST

export function calculateCartSummary(
  items: CartItem[],
  deliveryCharge: number = 0,
  discount: number = 0
): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxableAmount = subtotal - discount;
  const tax = Math.round((taxableAmount * TAX_RATE) / 100);
  const total = Math.max(0, subtotal + deliveryCharge - discount + tax);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    deliveryCharge,
    discount,
    tax,
    total,
    itemCount,
  };
}

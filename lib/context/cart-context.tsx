'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, CartSummary } from '@/types/cart.types';
import { calculateCartSummary } from '@/utils/calculate-cart';
import { getDeliveryAreasAction, validateCouponAction } from '@/lib/actions/checkout';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { _id: string; name: string; price: number; image: string; isVeg: boolean }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  deliveryArea: string | null;
  setDeliveryAreaName: (areaName: string | null) => void;
  deliveryCharge: number;
  couponCode: string | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCouponCode: () => void;
  summary: CartSummary;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Lazy state initializers to avoid double-renders and ESLint hook errors
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryArea, setDeliveryArea] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [deliveryAreas, setDeliveryAreas] = useState<any[]>([]);

  // Load initial state from localStorage only on client-side mount
  useEffect(() => {
    getDeliveryAreasAction().then(res => {
      if (res.success && res.deliveryAreas) {
        setDeliveryAreas(res.deliveryAreas);
      }
    });

    // Verify cart ownership on load to prevent items leakage between different logged-in users
    import('@/lib/actions/auth').then(({ getCurrentUserAction }) => {
      getCurrentUserAction().then(user => {
        const currentOwner = user && user.role === 'customer' ? user.phone : 'guest';
        const savedOwner = localStorage.getItem('swagatam-cart-owner') || 'guest';

        if (user && savedOwner !== 'guest' && savedOwner !== currentOwner) {
          localStorage.removeItem('swagatam-cart');
          localStorage.removeItem('swagatam-area');
          localStorage.removeItem('swagatam-coupon');
          localStorage.removeItem('swagatam-coupon-discount');
          setItems([]);
          setDeliveryArea(null);
          setCouponCode(null);
          setCouponDiscount(0);
        } else {
          const savedCart = localStorage.getItem('swagatam-cart');
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              setItems(Array.isArray(parsed) ? parsed : []);
            } catch {
              localStorage.removeItem('swagatam-cart');
            }
          }

          const savedArea = localStorage.getItem('swagatam-area');
          if (savedArea) {
            setDeliveryArea(savedArea);
          }

          const savedCoupon = localStorage.getItem('swagatam-coupon');
          const savedDiscount = localStorage.getItem('swagatam-coupon-discount');
          if (savedCoupon && savedDiscount) {
            setCouponCode(savedCoupon);
            setCouponDiscount(Number(savedDiscount));
          }
        }

        localStorage.setItem('swagatam-cart-owner', currentOwner);
      });
    });
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('swagatam-cart', JSON.stringify(items));
    }
  }, [items]);

  // Sync delivery area to localStorage
  useEffect(() => {
    if (deliveryArea) {
      localStorage.setItem('swagatam-area', deliveryArea);
    } else {
      localStorage.removeItem('swagatam-area');
    }
  }, [deliveryArea]);

  // Compute delivery charge dynamically rather than maintaining in state
  const deliveryCharge = useMemo(() => {
    if (!deliveryArea) return 0;
    const area = deliveryAreas.find(da => da.village === deliveryArea);
    return area ? area.deliveryCharge : 0;
  }, [deliveryArea, deliveryAreas]);

  const addToCart = (product: { _id: string; name: string; price: number; image: string; isVeg: boolean }, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product === product._id);
      let updated;
      if (existingItem) {
        toast.success(`Increased ${product.name} quantity to ${existingItem.quantity + quantity}`);
        updated = prevItems.map(item =>
          item.product === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        toast.success(`Added ${product.name} to cart`);
        updated = [...prevItems, {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          isVeg: product.isVeg
        }];
      }
      localStorage.setItem('swagatam-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.product === productId);
      if (item) {
        toast.info(`Removed ${item.name} from cart`);
      }
      const updated = prevItems.filter(item => item.product !== productId);
      localStorage.setItem('swagatam-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems => {
      const updated = prevItems.map(item =>
        item.product === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('swagatam-cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setDeliveryArea(null);
    setCouponCode(null);
    setCouponDiscount(0);
    localStorage.removeItem('swagatam-cart');
    localStorage.removeItem('swagatam-area');
    localStorage.removeItem('swagatam-coupon');
    localStorage.removeItem('swagatam-coupon-discount');
  };

  const setDeliveryAreaName = (areaName: string | null) => {
    setDeliveryArea(areaName);
  };

  const applyCouponCode = async (code: string) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const res = await validateCouponAction(code, subtotal);
    if (res.success && res.coupon) {
      setCouponCode(res.coupon.code);
      setCouponDiscount(res.coupon.discount);
      localStorage.setItem('swagatam-coupon', res.coupon.code);
      localStorage.setItem('swagatam-coupon-discount', String(res.coupon.discount));
      toast.success(`Coupon "${res.coupon.code}" applied! You saved ₹${res.coupon.discount}`);
      return true;
    } else {
      toast.error(res.error || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCouponCode = () => {
    setCouponCode(null);
    setCouponDiscount(0);
    localStorage.removeItem('swagatam-coupon');
    localStorage.removeItem('swagatam-coupon-discount');
    toast.info('Coupon removed');
  };

  // Recalculate summary
  const summary = calculateCartSummary(items, deliveryCharge, couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        deliveryArea,
        setDeliveryAreaName,
        deliveryCharge,
        couponCode,
        couponDiscount,
        applyCouponCode,
        removeCouponCode,
        summary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

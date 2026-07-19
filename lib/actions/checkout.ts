'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { 
  getCouponByCode, 
  getDeliveryAreas, 
  dbAddAddress,
  dbGetAllDeliveryAreas,
  dbCreateDeliveryArea,
  dbUpdateDeliveryArea,
  dbDeleteDeliveryArea,
  dbGetAllCoupons,
  dbCreateCoupon,
  dbUpdateCoupon,
  dbDeleteCoupon
} from '@/lib/db-helper';
import { getCurrentUserAction } from './auth';
import type { AddressFormData } from '@/lib/validations';

export async function getDeliveryAreasAction() {
  try {
    const deliveryAreas = await getDeliveryAreas();
    return { success: true, deliveryAreas };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch delivery areas' };
  }
}

export async function validateCouponAction(code: string, subtotal: number) {
  try {
    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return { success: false, error: 'Invalid coupon code' };
    }

    if (subtotal < coupon.minOrder) {
      return { success: false, error: `Minimum order amount for this coupon is ₹${coupon.minOrder}` };
    }

    const now = new Date();
    if (new Date(coupon.validFrom) > now || new Date(coupon.validUntil) < now) {
      return { success: false, error: 'Coupon has expired or is not active yet' };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return { 
      success: true, 
      coupon: {
        code: coupon.code,
        discount,
        type: coupon.type,
        value: coupon.value
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to validate coupon' };
  }
}

export async function addAddressAction(data: AddressFormData) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'customer') {
      return { success: false, error: 'You must be logged in as a customer to add an address' };
    }

    const updatedUser = await dbAddAddress(user.id, data);
    return { success: true, user: updatedUser };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add address' };
  }
}

// Admin Delivery Areas Actions
export async function getAllDeliveryAreasAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const deliveryAreas = await dbGetAllDeliveryAreas();
    return { success: true, deliveryAreas };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch delivery areas' };
  }
}

export async function createDeliveryAreaAction(areaData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const newArea = await dbCreateDeliveryArea(areaData);
    return { success: true, deliveryArea: newArea };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create delivery area' };
  }
}

export async function updateDeliveryAreaAction(id: string, areaData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const updatedArea = await dbUpdateDeliveryArea(id, areaData);
    return { success: true, deliveryArea: updatedArea };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update delivery area' };
  }
}

export async function deleteDeliveryAreaAction(id: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    await dbDeleteDeliveryArea(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete delivery area' };
  }
}

// Admin Coupons Actions
export async function getAllCouponsAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const coupons = await dbGetAllCoupons();
    return { success: true, coupons };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch coupons' };
  }
}

export async function createCouponAction(couponData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const newCoupon = await dbCreateCoupon(couponData);
    return { success: true, coupon: newCoupon };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create coupon' };
  }
}

export async function updateCouponAction(id: string, couponData: any) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const updatedCoupon = await dbUpdateCoupon(id, couponData);
    return { success: true, coupon: updatedCoupon };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update coupon' };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    await dbDeleteCoupon(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete coupon' };
  }
}

'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { 
  dbCreateOrder, 
  dbGetOrders, 
  dbGetOrderById, 
  dbGetAllOrders, 
  dbUpdateOrderStatus, 
  getProducts,
  getDeliveryAreas,
  getCouponByCode
} from '@/lib/db-helper';
import { getCurrentUserAction } from './auth';
import type { CheckoutFormData } from '@/lib/validations';
import { calculateCartSummary } from '@/utils/calculate-cart';
import { sendEmail } from '@/lib/email';

export async function createOrderAction(data: CheckoutFormData, cartItems: any[], couponCode?: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'customer') {
      return { success: false, error: 'You must be logged in as a customer to place an order' };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    // Recalculate totals on server to prevent tampering
    const allProducts = await getProducts();
    const verifiedItems = cartItems.map(item => {
      const dbProduct = allProducts.find((p: any) => p._id === item.product);
      if (!dbProduct) {
        throw new Error(`Product ${item.name} is no longer available`);
      }
      return {
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        image: dbProduct.image,
        quantity: item.quantity,
        isVeg: dbProduct.isVeg,
      };
    });

    // Validate delivery area
    const deliveryAreas = await getDeliveryAreas();
    const area = deliveryAreas.find((da: any) => da.village === data.village);
    if (!area) {
      return { success: false, error: 'Delivery service is not available in your location' };
    }

    // Validate discount
    let discount = 0;
    let couponDoc: any = null;
    if (couponCode) {
      const coupon = await getCouponByCode(couponCode);
      const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (coupon && subtotal >= coupon.minOrder) {
        couponDoc = coupon;
        if (coupon.type === 'percentage') {
          discount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.value;
        }
      }
    }

    const summary = calculateCartSummary(verifiedItems, area.deliveryCharge, discount);

    const orderData = {
      user: user.id,
      items: verifiedItems,
      address: {
        name: data.name,
        phone: data.phone,
        village: data.village,
        address: data.address,
        landmark: data.landmark,
      },
      deliveryArea: area._id,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      subtotal: summary.subtotal,
      deliveryCharge: summary.deliveryCharge,
      discount: summary.discount,
      tax: summary.tax,
      total: summary.total,
      coupon: couponDoc ? couponDoc._id : undefined,
      notes: data.notes,
      estimatedDelivery: new Date(Date.now() + area.estimatedTime * 60 * 1000).toISOString(),
    };

    const order = await dbCreateOrder(orderData);

    // Send email notification to Admin asynchronously (so order placement doesn't wait/block)
    try {
      const adminEmail = process.env.SMTP_USER;
      if (adminEmail) {
        const itemsListHtml = verifiedItems.map(item => `
          <li>
            <strong>${item.name}</strong> x ${item.quantity} - ₹${item.price * item.quantity}
          </li>
        `).join('');

        sendEmail({
          to: adminEmail,
          subject: `🚨 New Order Received! Order #${order.orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #d97706; border-bottom: 2px solid #fef3c7; padding-bottom: 12px;">New Order Alert!</h2>
              <p>A new order has been placed on Swagatam Cafe website.</p>
              
              <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #b45309;">Order Details</h3>
                <p><strong>Order ID:</strong> #${order.orderId}</p>
                <p><strong>Customer Name:</strong> ${data.name}</p>
                <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod.toUpperCase()}</p>
                <p><strong>Delivery Location:</strong> ${data.village}</p>
                <p><strong>Address:</strong> ${data.address} ${data.landmark ? `(Landmark: ${data.landmark})` : ''}</p>
                ${data.notes ? `<p><strong>Order Notes:</strong> ${data.notes}</p>` : ''}
              </div>

              <h3 style="color: #d97706;">Items Ordered</h3>
              <ul style="padding-left: 20px;">
                ${itemsListHtml}
              </ul>

              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 16px; font-weight: bold; text-align: right;">Total Amount: ₹${summary.total}</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://swagatamcafe-1amu.vercel.app'}/admin/orders" 
                   style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View in Admin Panel
                </a>
              </div>
            </div>
          `
        }).catch(err => console.error('Admin order notification email failed:', err));
      }
    } catch (err) {
      console.error('Failed to prepare admin order notification email:', err);
    }

    return { success: true, orderId: order.orderId, id: order._id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to place order' };
  }
}

export async function getMyOrdersAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'customer') {
      return { success: false, error: 'Unauthorized' };
    }

    const orders = await dbGetOrders(user.id);
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch orders' };
  }
}

export async function getOrderByIdAction(id: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const order = await dbGetOrderById(id);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Access control: admins can view any, customers can only view their own
    if (user.role === 'customer' && order.user !== user.id) {
      return { success: false, error: 'Unauthorized access to this order' };
    }

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch order details' };
  }
}

// Admin-only actions
export async function getAllOrdersAction() {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized access' };
    }

    const orders = await dbGetAllOrders();
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch all orders' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string, note?: string) {
  try {
    const user = await getCurrentUserAction();
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Unauthorized action' };
    }

    const order = await dbUpdateOrderStatus(orderId, status, note);
    if (!order) {
      return { success: false, error: 'Order not found or update failed' };
    }

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}

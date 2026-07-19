export type OrderStatus =
  | 'pending'
  | 'payment_verification'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi';

export type PaymentStatus = 'pending' | 'verification_pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  isVeg?: boolean;
}

export interface IOrderAddress {
  name: string;
  phone: string;
  village: string;
  address: string;
  landmark?: string;
}

export interface IStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface IUpiPaymentInfo {
  transactionId?: string;
  screenshotUrl?: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  user: string;
  items: IOrderItem[];
  address: IOrderAddress;
  deliveryArea: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  upiPaymentInfo?: IUpiPaymentInfo;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: string;
  notes?: string;
  estimatedDelivery?: string;
  statusHistory: IStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: { product: string; quantity: number }[];
  address: IOrderAddress;
  deliveryArea: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  upiTransactionId?: string;
  upiScreenshot?: string;
}

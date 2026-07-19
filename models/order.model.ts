import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderDocument extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    isVeg?: boolean;
  }[];
  address: {
    name: string;
    phone: string;
    village: string;
    address: string;
    landmark?: string;
  };
  deliveryArea: mongoose.Types.ObjectId;
  status: 'pending' | 'payment_verification' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi';
  paymentStatus: 'pending' | 'verification_pending' | 'paid' | 'failed' | 'refunded';
  upiPaymentInfo?: {
    transactionId?: string;
    screenshotUrl?: string;
  };
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: mongoose.Types.ObjectId;
  notes?: string;
  estimatedDelivery?: Date;
  statusHistory: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    isVeg: { type: Boolean },
  }],
  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    village: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String },
  },
  deliveryArea: { type: Schema.Types.ObjectId, ref: 'DeliveryArea', required: true },
  status: {
    type: String,
    enum: ['pending', 'payment_verification', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentMethod: { type: String, enum: ['cod', 'upi'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'verification_pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  upiPaymentInfo: {
    transactionId: { type: String },
    screenshotUrl: { type: String },
  },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryCharge: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
  notes: { type: String, maxlength: 500 },
  estimatedDelivery: { type: Date },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  }],
}, { timestamps: true });

OrderSchema.index({ orderId: 1 }, { unique: true });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'address.village': 1 });

const Order: Model<IOrderDocument> = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
export default Order;

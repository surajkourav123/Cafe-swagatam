import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICouponDocument extends Document {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDocument>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true, index: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ isActive: 1, validUntil: 1 });

const Coupon: Model<ICouponDocument> = mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema);
export default Coupon;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDeliveryAreaDocument extends Document {
  village: string;
  pincode?: string;
  deliveryCharge: number;
  estimatedTime: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryAreaSchema = new Schema<IDeliveryAreaDocument>({
  village: { type: String, required: true, unique: true, trim: true },
  pincode: { type: String, match: /^\d{6}$/ },
  deliveryCharge: { type: Number, required: true, min: 0 },
  estimatedTime: { type: Number, required: true, min: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

DeliveryAreaSchema.index({ village: 1 }, { unique: true });
DeliveryAreaSchema.index({ isActive: 1 });

const DeliveryArea: Model<IDeliveryAreaDocument> = mongoose.models.DeliveryArea || mongoose.model<IDeliveryAreaDocument>('DeliveryArea', DeliveryAreaSchema);
export default DeliveryArea;
